import { useEffect, useRef } from 'react';
import { useLeafletContext } from '@react-leaflet/core';
import { useMap } from 'react-leaflet';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import chroma from 'chroma-js';

export function TifLayer({ url }) {
  console.log({url});
  
  const geoTiffLayerRef = useRef();
  const context = useLeafletContext();
  const map = useMap();

  useEffect(() => {
    const container = context.layerContainer || context.map;
    fetch(url)
    .then((response) => {
        console.log('Response Status:', response.status); // Check the response status
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => {
        console.log({ arrayBuffer });
        if (arrayBuffer.byteLength === 0) {
          console.error('Received an empty response, check the URL or server configuration.');
          return;
        }
  
      parseGeoraster(arrayBuffer).then((georaster) => {
        console.log("GeoTIFF bounds:", georaster.bounds);
        const min = georaster.mins[0];
        const range = georaster.ranges[0];
        const scale = chroma.scale('Spectral').domain([min, min + range]);
  
        // Ensure bounds are correct
        const bounds = georaster.bounds || [1, 1, 1, 1];
        console.log("GeoTIFF bounds:", bounds);
  
        const options = {
          pixelValuesToColorFn: function (pixelValues) {
            const pixelValue = pixelValues[0];
            if (pixelValue === 0) return null;
            const scaledPixelValue = (pixelValue - min) / range;
            const color = scale(scaledPixelValue).hex();
            return color;
          },
          resolution: 256,
          opacity: 0.7,
          georaster: georaster,

        };
  
        if (geoTiffLayerRef.current) return; // Prevent duplicate loading of layers
        geoTiffLayerRef.current = new GeoRasterLayer(options);
        container.addLayer(geoTiffLayerRef.current);
      });
    })
    .catch((error) => console.error("Error fetching GeoTIFF:", error));
  
    return () => {
      if (geoTiffLayerRef.current && map) {
        map.removeLayer(geoTiffLayerRef.current);
      }
    };
  }, [url, context, map]); // Re-run effect when URL changes

  return null;
}
