import { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import PlaceList from "../components/PlaceList";

const UserPlaces = () => {
  const [loadingPlaces, setLoadingPlaces] = useState([]);
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/places/user/${userId}`
        );
        setLoadingPlaces(responseData?.places || []);
      } catch (err) {
        console.error("Error fetching places:", err);
        setLoadingPlaces([]);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletedPlaceId) => {
    setLoadingPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadingPlaces && (
        <PlaceList items={loadingPlaces} onDeletePlace={placeDeleteHandler} />
      )}
    </>
  );
};

export default UserPlaces;
