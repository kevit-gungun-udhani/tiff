import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { TifLayer } from './TminLayer'; // Import the TifLayer component

const tifs = [
  { url: '/Aalter_Countrate.tif', name: 'Rainfall' },
];

const MyMap = () => {
  return (
    <MapContainer center={[38.7383333, -9.1622222]} zoom={10} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
      />
      <LayersControl>
        {tifs.map((tif) => (
          <LayersControl.Overlay key={tif.name} name={tif.name}>
            <TifLayer url={tif.url} />  
          </LayersControl.Overlay>
        ))}
      </LayersControl>
    </MapContainer>
  );
};

export default MyMap;
