import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import AddressForm from "./addressForm";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;

const VotingMap = ({ pollPositions, addrPosition }) => {
  return (
    <APIProvider apiKey={API_KEY} onLoad={() => console.log("API loaded")}>
      <div style={{ width: "100%", height: "500px" }}>
        <Map
          mapId={MAP_ID}
          defaultZoom={13}
          defaultCenter={addrPosition}
          disableDefaultUI={true}
          onLoad={console.log(addrPosition)}
        >
          {/* Handle mulitple polling palaces */}
          <Markers pollPositions={pollPositions} addrPosition={addrPosition} />
          <Routes pollPositions={pollPositions} addrPosition={addrPosition} />
        </Map>
      </div>
    </APIProvider>
  );
};

function Markers({ pollPositions, addrPosition }) {
  console.log(pollPositions);
  return (
    <>
      {pollPositions.map((poll) => (
        <AdvancedMarker
          key={poll.address.locationName}
          position={{ lat: poll.latitude, lng: poll.longitude }}
        >
          <Pin />
        </AdvancedMarker>
      ))}
      <AdvancedMarker position={addrPosition}>
        <Pin />
      </AdvancedMarker>
    </>
  );
}

//Gets routes and displays on the map
function Directions({ pollPosition, addrPosition }) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const [routePolylines, setRoutePolylines] = useState([]);

  useEffect(() => {
    if (!map || !routesLib) return;

    const fetchRoute = async () => {
      //outlining the routes request
      const request = {
        origin: addrPosition,
        destination: pollPosition,
        travelMode: "DRIVING",
        fields: ["path"], // Request fields required to construct the visual path
      };

      try {
        //computing the route(s)
        const { routes } = await routesLib.Route.computeRoutes(request);

        if (!routes || routes.length === 0) return;

        // Clean up any existing polylines on the map
        routePolylines.forEach((p) => p.setMap(null));

        // Create polylines and link them to the active map instance
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

function Routes({ pollPositions, addrPosition }) {
  return pollPositions.map((poll) => (
    <Directions
      pollPosition={{ lat: poll.latitude, lng: poll.longitude }}
      addrPosition={addrPosition}
      key={poll.address.locationName}
    />
  ));
}

export default VotingMap;
