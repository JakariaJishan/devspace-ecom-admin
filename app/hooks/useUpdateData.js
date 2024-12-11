"use client";

import {useState} from "react";

const useUpdateData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async (url, payload) => {
    setLoading(true);
    setError(null);

    return fetch(url, {
      method: "PATCH",
      body: payload,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Failed to post data");
          });
        }
        return response.json();
      })
      .catch((err) => {
        setError(err.message);
        throw err; // Re-throw the error to allow the component to handle it
      })
      .finally(() => {
        setLoading(false);
      });

  };

  return { updateData, loading, error };
};

export default useUpdateData;
