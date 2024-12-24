"use client";
import React, { useState } from "react";
import usePostData from "@/app/hooks/usePostData";
import toast from "react-hot-toast";
import {getCookie} from "@/app/utils/cookies";
import { useRouter } from "next/navigation";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const CreateAdminForm = () => {

  const {postData} = usePostData()
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin_users`
  const [file, setFile] = useState("")
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    mobile_no: "",
    gender: "",
    bio: "",
    roles: "",
    password: "",
    confirm_password: ""
  });

  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFile(newFile);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.includes("@")) newErrors.email = "Invalid email address.";
    if (!formData.name) newErrors.name = "Name is required.";

    // Mobile number validation
    let normalizedNumber = formData.mobile_no.trim(); // Trim whitespace
    if (!normalizedNumber.startsWith("+")) {
      normalizedNumber = `+${normalizedNumber}`; // Add '+' if not present
    }

    const phoneNumber = parsePhoneNumberFromString(normalizedNumber);

    if (!phoneNumber || !phoneNumber.isValid()) {
      newErrors.mobile_no = "Invalid mobile number.";
    }

    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const form = new FormData();
    form.append("admin_user[email]", formData.email);
    form.append("admin_user[name]", formData.name);
    form.append("admin_user[mobile_no]", formData.mobile_no);
    form.append("admin_user[gender]", formData.gender);
    form.append("admin_user[bio]", formData.bio);
    form.append("admin_user[roles][]", formData.roles);
    form.append("admin_user[password]", formData.password);
    if (file) {
      form.append("admin_user[avatar]", file);
    }
    form.append("confirm_password", formData.confirm_password);

    const token = getCookie("token");

    postData(apiUrl, form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
        .then((response) => {
          toast.success(response.message || "Admin created successfully!");
          router.push("/admin/view")
        })
        .catch((err) => {
          toast.error(err.message || "Failed to create admin.");
        });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Create Admin</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email: <span className="text-red-500">*</span> </label>
        <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name: <span className="text-red-500">*</span></label>
        <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Avatar</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className=" cursor-pointer"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Mobile No: <span className="text-red-500">*</span></label>
        <PhoneInput
            country={'bd'}
            value={formData.mobile_no}
            onChange={(value) =>
                setFormData((prevFormData) => ({...prevFormData, mobile_no: value}))
            }
            inputClass="w-full p-2 border border-gray-300 rounded" // Apply styling to the input field
            containerStyle={{width: '100%'}} // Adjust container width
            enableSearch={true} // Enable search for country codes
        />
        {errors.mobile_no && (
            <span className="text-red-500 text-sm">{errors.mobile_no}</span>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Gender:</label>
        <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select</option>
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
          className="w-full p-2 border border-gray-300 rounded"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Roles: <span className="text-red-500">*</span></label>
        <select
            name="roles"
            value={formData.roles}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="editor">Editor</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Password: <span className="text-red-500">*</span></label>
        <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Confirm Password: <span
            className="text-red-500">*</span></label>
        <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
        />
        {(formData.password.length > 0 && formData.confirm_password.length> 0) && (formData.password !== formData.confirm_password) && <span className="text-red-500 text-sm">Password and confirm password do not match</span>}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateAdminForm;
