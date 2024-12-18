"use client";
import { useEffect, useState } from "react";
import { getCookie } from "@/app/utils/cookies";

const useGetFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getCookie("token"); // Retrieve token from cookies
    setLoading(true);

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the Authorization header
      },
    })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((data) => {
              throw new Error(data.message.errors || "Something went wrong");
            });
          }
          return res.json();
        })
        .then((data) => {
          setLoading(false);
          setData(data.data); // Update state with the fetched data
        })
        .catch((e) => {
          setError(e.message);
          setData(null);
          setLoading(false);
        });
  }, [url]);

  return { data, loading, error };
};

export default useGetFetch;
