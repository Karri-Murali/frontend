import { useEffect, useRef } from "react";
import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();
  const { center, zoom } = props;

  useEffect(() => {
    if (window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
      });
      new window.google.maps.Marker({
        position: center,
        map: map,
      });
    } else {
      console.error("Google Maps API is not loaded");
    }
  }, [center, zoom]);
  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};
export default Map;
