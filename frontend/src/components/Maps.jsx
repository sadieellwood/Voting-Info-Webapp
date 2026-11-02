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

const VotingMap = ({ votingLocations, addrPosition }) => {
  console.log(votingLocations);
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
          <Markers
            votingLocations={votingLocations}
            addrPosition={addrPosition}
            //setVisiblePoll={setVisiblePoll}
          />
          <Routes
            votingLocations={votingLocations}
            addrPosition={addrPosition}
          />
        </Map>
      </div>
    </APIProvider>
  );
};

function Markers({ votingLocations, addrPosition }) {
  return (
    <>
      {votingLocations.map((location) => (
        <AdvancedMarker
          key={location.name}
          position={{ lat: location.lat, lng: location.lng }}
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

        console.log(routes);

        // if existing polylines, remove
        routePolylines.forEach((p) => p.setMap(null));

        // create polylines and link them to the active map instance
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

function Routes({ votingLocations, addrPosition }) {
  console.log(votingLocations);
  return votingLocations.map((location) => (
    <Directions
      pollPosition={{ lat: location.lat, lng: location.lng }}
      addrPosition={addrPosition}
      key={location.name}
    />
  ));
}

export default VotingMap;
