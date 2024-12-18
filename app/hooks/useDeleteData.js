"use client";

import { useState } from "react";
import { getCookie } from "@/app/utils/cookies";

const useDeleteData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteData = async (url, payload = null) => {
        setLoading(true);
        setError(null);

        const token = getCookie("token");

        return fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: payload ? JSON.stringify(payload) : null, // Include the body if payload is provided
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message || "Failed to delete data");
                    });
                }
                return response.json(); // Return the JSON response
            })
            .catch((err) => {
                setError(err.message);
                throw err; // Re-throw the error for the calling component
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return { deleteData, loading, error };
};

export default useDeleteData;
