"use client";

import {useState} from "react";

const usePostData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (url, payload) => {
    setLoading(true);
    setError(null);

    return fetch(url, {
      method: "POST",
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

  return { postData, loading, error };
};

export default usePostData;
