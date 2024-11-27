import { useEffect, useState, useRef, memo } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import UsersList from "../components/UsersList";

const Users = () => {
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const fetchTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + "/users"
        );
        setLoadedUsers(responseData.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchTimeoutRef.current = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => {
      clearTimeout(fetchTimeoutRef.current);
    };
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default memo(Users);
