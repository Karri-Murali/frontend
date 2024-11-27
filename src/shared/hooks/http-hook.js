import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);
  const isMounted = useRef(false);

  const handleResponse = async (response) => {
    const contentType = response.headers.get("Content-Type");
    let responseData;

    if (contentType?.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        responseData?.message || responseData || "Request failed";
      throw new Error(errorMessage);
    }
    return responseData;
  };

  const cleanupHttpRequests = (abortCtrl) => {
    activeHttpRequests.current = activeHttpRequests.current.filter(
      (reqCtrl) => reqCtrl !== abortCtrl
    );
  };

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const fetchOptions = {
          method,
          body: body ? body : null,
          headers: {
            ...headers,
            ...(body &&
              !(body instanceof FormData) && {
                "Content-Type": "application/json",
              }),
          },
          signal: httpAbortCtrl.signal,
        };

        const response = await fetch(url, fetchOptions);
        const responseData = await handleResponse(response);
        return responseData;
      } catch (err) {
        if (err.name === "AbortError") {
          console.warn("Request was aborted:", err);
          return;
        }
        if (isMounted.current) {
          setError(err.message || "Something went wrong");
          throw err;
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
        cleanupHttpRequests(httpAbortCtrl);
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
