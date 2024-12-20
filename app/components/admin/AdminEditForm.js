"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams and useRouter
import usePostData from "@/app/hooks/usePostData";
import useGetFetch from "@/app/hooks/useGetFetch";
import toast from "react-hot-toast";
import useUpdateData from "@/app/hooks/useUpdateData";

const AdminEditForm = () => {
    const router = useRouter();
    const { id } = useParams(); // Assume `id` will always be present

    const { updateData, loading: updating } = useUpdateData();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin_users/${id}`;
    const [file, setFile] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        name: "",
        mobile_no: "",
        gender: "",
        bio: "",
        roles: "",
    });

    const [errors, setErrors] = useState({});

    // Fetch data for the admin
    const { data: adminData, loading } = useGetFetch(apiUrl);

    useEffect(() => {
        if (adminData) {
            setFormData({
                email: adminData.email,
                name: adminData.name,
                mobile_no: adminData.mobile_no,
                gender: adminData.gender,
                bio: adminData.bio,
                roles: adminData.roles[0], // Assuming single role for simplicity
            });
        }
    }, [adminData]);

    const handleFileChange = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            setFile(newFile);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.includes("@")) newErrors.email = "Invalid email address.";
        if (!formData.name) newErrors.name = "Name is required.";
        if (formData.mobile_no && !/^\d{10}$/.test(formData.mobile_no))
            newErrors.mobile_no = "Invalid mobile number.";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Prepare the payload
        const payload = {
            admin_user: {
                email: formData.email,
                name: formData.name,
                mobile_no: formData.mobile_no,
                gender: formData.gender,
                bio: formData.bio,
                roles: [formData.roles], // Ensure roles is an array
            },
        };

        if (file) {
            // If there's a file, handle it separately using FormData
            const form = new FormData();
            Object.keys(payload.admin_user).forEach((key) => {
                if (key === "roles") {
                    payload.admin_user.roles.forEach((role) =>
                        form.append(`admin_user[roles][]`, role)
                    );
                } else {
                    form.append(`admin_user[${key}]`, payload.admin_user[key]);
                }
            });
            form.append("admin_user[avatar]", file);

            updateData(apiUrl, form)
                .then((response) => {
                    toast.success(response.message || "Admin updated successfully!");
                    router.push("/admin/view");
                })
                .catch((err) => {
                    toast.error(err.message || "Failed to update admin.");
                });

            return;
        }

        // If no file, send JSON payload
        updateData(apiUrl, payload)
            .then((response) => {
                toast.success(response.message || "Admin updated successfully!");
                router.push("/admin/view");
            })
            .catch((err) => {
                toast.error(err.message || "Failed to update admin.");
            });
    };


    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
        >
            <h2 className="text-2xl font-bold text-center mb-6">Edit Admin</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded cursor-not-allowed"
                    disabled
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded cursor-not-allowed"
                    disabled
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
            </div>


            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Mobile No:</label>
                <input
                    type="text"
                    name="mobile_no"
                    value={formData.mobile_no}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded cursor-not-allowed"
                    disabled
                />
                {errors.mobile_no && <span className="text-red-500 text-sm">{errors.mobile_no}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Gender:</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded cursor-not-allowed"
                    disabled
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Bio:</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded cursor-not-allowed"
                    disabled
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Roles:</label>
                <select
                    name="roles"
                    value={formData.roles}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="">Select Role</option>
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                    <option value="moderator">moderator</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Avatar:</label>
                <input type="file" onChange={handleFileChange} className="w-full p-2"/>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Update Admin
            </button>
        </form>
    );
};

export default AdminEditForm;
