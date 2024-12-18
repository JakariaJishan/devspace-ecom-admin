"use client";

import {useState} from "react";
import { getCookie } from "@/app/utils/cookies";

const useUpdateData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async (url, payload) => {
    setLoading(true);
    setError(null);
    const token = getCookie("token");


    return fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
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
