"use client"
import { useEffect, useState } from "react";

const useGetFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message.errors || "Something went wrong");
          });
        }
        return res.json()
      })
      .then((data) => {
        setLoading(false);
        setData(data.data);
      })
      .catch((e) => {
        setError(e.message);
        setData(null);
        setLoading(false) ;
      })
  }, [url]);

  return { data, loading, error };
};

export default useGetFetch;
