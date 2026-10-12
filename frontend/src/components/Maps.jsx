import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const VotingMap = ({ pollPosition, addrPosition }) => (
  <APIProvider apiKey={API_KEY} onLoad={() => console.log("API loaded")}>
    <div style={{ width: "100%", height: "500px" }}>
      <Map
        mapId="lalala"
        defaultZoom={13}
        defaultCenter={pollPosition}
        onLoad={console.log(addrPosition, pollPosition)}
      >
        <AdvancedMarker position={pollPosition}>
          <Pin />
        </AdvancedMarker>
        <AdvancedMarker position={addrPosition}>
          <Pin />
        </AdvancedMarker>
      </Map>
    </div>
  </APIProvider>
);

export default VotingMap;
