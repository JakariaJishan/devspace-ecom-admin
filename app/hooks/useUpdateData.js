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
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Failed to update data");
          });
        }
        return response.json();
      })
      .catch((err) => {
        setError(err.message);
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });

  };

  return { updateData, loading, error };
};

export default useUpdateData;
