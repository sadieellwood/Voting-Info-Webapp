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

function Directions() {
  const map = useMap(); // Access the raw map instance
  const routesLib = useMapsLibrary("routes"); // Load the modern 'routes' library
  const [routePolylines, setRoutePolylines] = useState([]);

  useEffect(() => {
    if (!map || !routesLib) return;

    const fetchRoute = async () => {
      // 1. Define the routes request
      const request = {
        origin: "Mountain View, CA",
        destination: "San Francisco, CA",
        travelMode: "DRIVING",
        fields: ["path"], // Request fields required to construct the visual path
      };

      try {
        // 2. Compute the route using the Route class
        const { routes } = await routesLib.Route.computeRoutes(request);

        if (!routes || routes.length === 0) return;

        // Clean up any existing polylines on the map
        routePolylines.forEach((p) => p.setMap(null));

        // 3. Create polylines and link them to the active map instance
        const polylines = routes[0].createPolylines();
        polylines.forEach((polyline) => polyline.setMap(map));

        setRoutePolylines(polylines);
      } catch (error) {
        console.error("Error computing route:", error);
      }
    };

    fetchRoute();
  }, [map, routesLib]);

  return null; // This component handles side effects on the map directly
}

export default TestMap;
