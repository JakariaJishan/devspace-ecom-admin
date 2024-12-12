"use client";

import React from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import Link from "next/link";

const CategoryList = ({categories}) => {
  const router = useRouter()
  const handleEdit = (categoryId) => {
    router.push(`/categories/${categoryId}/edit`)
  };

  const handleDelete = (categoryId) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`
    fetch(apiUrl, {
      method: "DELETE",
    }).then(res => res.json()).then(data => {
      toast.success(data.message)
    }).catch((res) => {
      toast.error(res.message)
    })
  };

  return (
    <div className="container mx-auto p-4 text-gray-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Category List</h1>
        <Link
          className="inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
          href="/categories/create"
        >
          Add new category
        </Link>
      </div>
      <table className="min-w-full border-collapse border border-gray-300 mt-4">
        <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 p-2">Image</th>
          <th className="border border-gray-300 p-2">Title</th>
          <th className="border border-gray-300 p-2">Added By</th>
          <th className="border border-gray-300 p-2">Actions</th>
        </tr>
        </thead>
        <tbody>
        {categories?.map((category) => (
          <tr key={category.id} className="hover:bg-gray-50">
            <td className="border border-gray-300 p-2">
              <div className="flex gap-2 flex-wrap">
                {category.image_url ?
                  <img
                    key={category.id}
                    src={category.image_url}
                    alt={`${category.title}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  : <div className="  flex justify-center items-center rounded">
                    <span className="text-sm text-gray-600">No Images</span>
                  </div>}
              </div>
            </td>
            <td className="border border-gray-300 p-2">{category.title}</td>
            <td className="border border-gray-300 p-2">
              {category.admin_user.name}
            </td>
            <td className="border border-gray-300 p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category.id)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex items-center gap-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
