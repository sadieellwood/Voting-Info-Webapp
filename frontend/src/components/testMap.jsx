import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;

const TestMap = ({}) => (
  <APIProvider apiKey={API_KEY} onLoad={() => console.log("API loaded")}>
    <div style={{ width: "100%", height: "500px" }}>
      <Map
        mapId={MAP_ID}
        defaultZoom={13}
        defaultCenter={{ lat: 37.447646, lng: -122.113878 }}
        disableDefaultUI={true}
      >
        {/* <AdvancedMarker position={pollPosition}>
          <Pin />
        </AdvancedMarker>
        <AdvancedMarker position={addrPosition}>
          <Pin />
        </AdvancedMarker> */}
        <Directions />
      </Map>
    </div>
  </APIProvider>
);

export default TestMap;
