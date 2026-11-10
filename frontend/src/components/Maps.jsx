import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useState, useEffect, useContext } from "react";
import PollContext from "./PollContext";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;

const VotingMap = ({ votingLocations, addrPosition }) => {
  console.log(votingLocations == 0);
  return (
    <APIProvider apiKey={API_KEY} onLoad={() => console.log("API loaded")}>
      <div style={{ width: "100%", height: "500px" }}>
        <Map
          mapId={MAP_ID}
          defaultZoom={13}
          defaultCenter={
            votingLocations.length
              ? {
                  lat: votingLocations[0].lat,
                  lng: votingLocations[0].lng,
                }
              : addrPosition
          }
          disableDefaultUI={true}
        >
          {/* Handle mulitple polling palaces */}
          <Markers
            votingLocations={votingLocations}
            addrPosition={addrPosition}
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
  const { setSelectedPoll } = useContext(PollContext);

  return (
    <>
      {votingLocations.map((location) => (
        <AdvancedMarker
          key={location.name}
          position={{ lat: location.lat, lng: location.lng }}
          onClick={() => setSelectedPoll(location)}
        >
          <Pin />
        </AdvancedMarker>
      ))}
      <AdvancedMarker position={addrPosition}>
        <Pin
          background={"#595fdc"}
          borderColor={"#1a23c7"}
          glyphColor={"#7b8ad7"}
        />
      </AdvancedMarker>
    </>
  );
}

//Gets routes and displays on the map
function Directions({ pollPosition, addrPosition }) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const [drivePolylines, setDrivePolylines] = useState([]);
  const [transitPolylines, setTransitPolylines] = useState([]);

  useEffect(() => {
    if (!map || !routesLib) return;

    const fetchRoute = async () => {
      drivePolylines.forEach((p) => p.setMap(null));
      transitPolylines.forEach((p) => p.setMap(null));

      //outlining the routes requestDriving
      const requestDriving = {
        origin: addrPosition,
        destination: pollPosition,
        travelMode: "DRIVING",
        fields: ["path", "localizedValues"], // Request fields required to construct the visual path
      };

      try {
        //computing the routes(s)
        const { routes } = await routesLib.Route.computeRoutes(requestDriving);

        if (!routes || routes.length === 0) return;

        // if existing polylines, remove

        // create polylines and link them to the active map instance
        const polylines = routes[0].createPolylines();
        polylines.forEach((polyline) => polyline.setMap(map));

        setDrivePolylines(polylines);
      } catch (error) {
        console.error("Error computing routes:", error);
      }

      const requestTransit = {
        origin: addrPosition,
        destination: pollPosition,
        travelMode: "TRANSIT",
        fields: ["path", "localizedValues", "legs", "travelAdvisory"],
      };

      try {
        const { routes } = await routesLib.Route.computeRoutes(requestTransit);
        console.log(routes);

        if (!routes || routes.length === 0) return;

        console.log(routes);

        // create polylines and link them to the active map instance
        const polylines = routes[0].createPolylines();
        polylines.forEach((polyline) => polyline.setMap(map));

        setTransitPolylines(polylines);
      } catch (error) {
        console.error("Error computing routes:", error);
      }
    };

    fetchRoute();
  }, [map, routesLib, pollPosition]);

  return null; // This component handles side effects on the map directly
}

function Routes({ votingLocations, addrPosition }) {
  const { selectedPoll } = useContext(PollContext);

  // return selectedPoll.map((location) => (
  //   <Directions
  //     pollPosition={{ lat: location.lat, lng: location.lng }}
  //     addrPosition={addrPosition}
  //     key={location.name}
  //   />
  // ));

  if (!selectedPoll) {
    return null;
  }

  return (
    <Directions
      pollPosition={{ lat: selectedPoll.lat, lng: selectedPoll.lng }}
      addrPosition={addrPosition}
      key={selectedPoll.name}
    />
  );
}

export default VotingMap;
