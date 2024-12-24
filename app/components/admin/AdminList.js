"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getCookie } from "@/app/utils/cookies";
import hasPermission from "@/app/lib/roles";
import useGetFetch from "@/app/hooks/useGetFetch";
import useDeleteData from "@/app/hooks/useDeleteData";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import EditIcon from "@/app/components/icons/EditIcon";
import TrashIcon from "@/app/components/icons/TrashIcon";
import PlusIcon from "@/app/components/icons/PlusIcon";

const AdminList = () => {
    const router = useRouter();
    const rolesFromCookie = JSON.parse(getCookie("roles"));
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin_users`; // Define the API URL
    const { data: adminUsers, loading, error } = useGetFetch(apiUrl);
    const [admins, setAdminUsers] = React.useState(adminUsers || []);
    const { deleteData, loading: deleting, error: deleteError } = useDeleteData();

    React.useEffect(() => {
        if (adminUsers) {
            setAdminUsers(adminUsers);
        }
    }, [adminUsers]);

    const handleDelete = async (id) => {
        try {
            await deleteData(`${apiUrl}/${id}`); // Use deleteData hook

            // Update the state to remove the deleted admin user
            setAdminUsers((prevAdminUsers) => prevAdminUsers.filter((admin) => admin.id !== id));

            toast.success("Admin user deleted successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to delete admin user");
        }
    };

    if (loading) {
        return <div className="text-center p-4">Loading admin users...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Admin Users</h1>
                {hasPermission({roles: rolesFromCookie}, "create:admin") && (
                    <Link
                        className="inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                        href="/admin/create"
                    >
                        <PlusIcon size={16}
                                  color="currentColor"
                                  strokeWidth={2}/>
                        Add New Admin
                    </Link>
                )}
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Name</TableHead>
                        <TableHead className="font-bold">Email</TableHead>
                        <TableHead className="font-bold">Roles</TableHead>
                        <TableHead className="font-bold">Avatar</TableHead>
                        <TableHead className="font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {admins?.map((admin) => (
                        <TableRow key={admin.id}>
                            <TableCell>{admin.name}</TableCell>
                            <TableCell>{admin.email}</TableCell>
                            <TableCell>{admin.roles.join(", ")}</TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {hasPermission({roles: rolesFromCookie}, "update:admin") && (
                                        <Link
                                            href={`/admin/edit/${admin.id}`}
                                            className="p-2 rounded text-blue-600 hover:bg-blue-100"
                                            title="Edit Admin"
                                        >
                                            <EditIcon size={16} />
                                        </Link>
                                    )}
                                    {hasPermission({roles: rolesFromCookie}, "delete:admin") && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    className="p-2 rounded text-red-600 hover:bg-red-100"
                                                    title="Delete Product"
                                                >
                                                    <TrashIcon size={16}/>
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. It will permanently delete the
                                                        admin.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(admin.id)}>
                                                        Confirm
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminList;
