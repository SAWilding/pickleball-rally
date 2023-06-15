import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const MapComponent = () => {
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("");
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log("Error getting current location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleClick = (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    localStorage.setItem("lat", clickedLocation.lat);
    localStorage.setItem("lng", clickedLocation.lng);
    setCurrentLocation(clickedLocation);
    reverseGeocode(clickedLocation);
  };

  const handleLoad = (event) => {
    localStorage.setItem("address", "");
    const center = {
      lat: currentLocation ? currentLocation.lat : 37.7749,
      lng: currentLocation ? currentLocation.lng : -122.4194,
    };
    setCurrentLocation(center);
  };

  const reverseGeocode = (location) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          const address = results[0].formatted_address;
          setCurrentAddress(address);
          localStorage.setItem("address", address);
          console.log("Clicked address:", address);
          // You can use the address as needed
        } else {
          console.log("No results found");
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
  });

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation}
        zoom={13}
        onClick={handleClick}
        onLoad={handleLoad}
      >
        {currentLocation && <Marker position={currentLocation} />}
      </GoogleMap>
      <label htmlFor="address">Address: </label>
      <input
        disabled
        type="text"
        name="address"
        id="address"
        value={currentAddress}
      />
    </>
  ) : (
    <div>Loading Google Maps...</div>
  );
};

export default MapComponent;
