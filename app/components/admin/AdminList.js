"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getCookie } from "@/app/utils/cookies";
import hasPermission from "@/app/lib/roles";
import Link from "next/link";

const AdminList = () => {
    const router = useRouter();
    const rolesFromCookie = JSON.parse(getCookie("roles"));
    const token = getCookie("token"); // Retrieve token from the cookie
    const [adminUsers, setAdminUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch admin users
        const fetchAdminUsers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch admin users");
                }

                const data = await response.json();
                setAdminUsers(data.data); // Use the correct response structure
                setLoading(false);
            } catch (error) {
                toast.error(error.message || "Failed to fetch admin users");
                setLoading(false);
            }
        };

        fetchAdminUsers();
    }, [token]);

    const handleDelete = async (id) => {
        const confirmed = confirm("Are you sure you want to delete this admin user?");
        if (!confirmed) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/admin_users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete admin user");
            }

            setAdminUsers((prev) => prev.filter((admin) => admin.id !== id)); // Remove admin from state
            toast.success("Admin user deleted successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to delete admin user");
        }
    };

    if (loading) {
        return <div className="text-center p-4">Loading admin users...</div>;
    }

    return (
        <div className="container mx-auto p-4 text-gray-500">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold mb-4">Admin Users</h1>
                {hasPermission({ roles: rolesFromCookie }, "create:admin") && (
                    <Link
                        className="inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                        href="/admin/create"
                    >
                        Add New Admin
                    </Link>
                )}
            </div>
            <table className="min-w-full border-collapse border border-gray-300 mt-4">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Email</th>
                    <th className="border border-gray-300 p-2">Roles</th>
                    <th className="border border-gray-300 p-2">Avatar</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {adminUsers?.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2">{admin.name}</td>
                        <td className="border border-gray-300 p-2">{admin.email}</td>
                        <td className="border border-gray-300 p-2">{admin.roles.join(", ")}</td>
                        <td className="border border-gray-300 p-2">
                            {admin.avatar_url ? (
                                <img
                                    src={admin.avatar_url}
                                    alt={`${admin.name}'s avatar`}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            ) : (
                                <div className="flex justify-center items-center rounded h-16 w-16">
                                    <span className="text-sm text-gray-600">No Avatar</span>
                                </div>
                            )}
                        </td>
                        <td className="border border-gray-300 p-2">
                            <div className="flex gap-2">
                                {hasPermission({roles: rolesFromCookie}, "update:admin") && (
                                    <button
                                        onClick={() => router.push(`/admin_users/edit/${admin.id}`)}
                                        className="flex items-center gap-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                )}
                                {hasPermission({roles: rolesFromCookie}, "delete:admin") && (
                                    <button
                                        onClick={() => handleDelete(admin.id)}
                                        className="flex items-center gap-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminList;
