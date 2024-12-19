"use client";

import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {getCookie} from "@/app/utils/cookies";
import hasPermission from "@/app/lib/roles";
import useUpdateData from "@/app/hooks/useUpdateData";
import ToggleSwitch from "@/app/components/products/ToggleSwitch";

const ProductList = ({products}) => {
  const [userRoles, setUserRoles] = useState([]);
  const router = useRouter()

  const {updateData} = useUpdateData()

  useEffect(() => {
    // Fetch roles from cookies and parse them
    const rolesFromCookie = getCookie("roles");
    if (rolesFromCookie) {
      try {
        const parsedRoles = JSON.parse(rolesFromCookie);
        setUserRoles(parsedRoles);
      } catch (error) {
        console.error("Failed to parse roles from cookie:", error);
      }
    }
  }, []);

  const handleEdit = (productId) => {
    router.push(`/products/${productId}/edit`)
  };

  const handleDelete = (productId) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
    fetch(apiUrl, {
      method: "DELETE",
    }).then(res => res.json()).then(data => {
      toast.success(data.message)
    }).catch((res) => {
      toast.error(res.message)
    })
  };

  const handleUpdate = (productId, status) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
    const payload = {
      product: {
        publish: status,
      }
    }
    updateData(apiUrl, payload).then(res => {
      toast.success(res.message)
    }).catch((err => {
      toast.error(err.message)
    }))
  }

  return (
    <div className="container mx-auto p-4 text-gray-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Product List</h1>

        {hasPermission({roles: userRoles}, "update:products") && (
          <Link
            className="btn"
            href="/products/create"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>

            <span>Add new product</span>
          </Link>
        )}
      </div>
      <table className="min-w-full border-collapse border border-gray-300 mt-4">
        <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 p-2">Image</th>
          <th className="border border-gray-300 p-2">Title</th>
          <th className="border border-gray-300 p-2">Description</th>
          <th className="border border-gray-300 p-2">Added By</th>
          <th className="border border-gray-300 p-2">Price</th>
          <th className="border border-gray-300 p-2">Stock</th>
          <th className="border border-gray-300 p-2">Trending</th>
          <th className="border border-gray-300 p-2">Colors</th>
          <th className="border border-gray-300 p-2">Sizes</th>
          <th className="border border-gray-300 p-2">Published</th>
          <th className="border border-gray-300 p-2">Actions</th>
        </tr>
        </thead>
        <tbody>
        {products?.map((product) => {
          const {
            id,
            image_urls,
            title,
            stock_quantity,
            price,
            currency,
            trending,
            colors,
            sizes,
            publish,
            description,
            admin_user
          } = product
          return (
            <tr key={id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">
                <div className="flex gap-2 flex-wrap">
                  {image_urls && image_urls.length > 0 ? image_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${title} ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )) : <div className="  flex justify-center items-center rounded">
                    <span className="text-sm text-gray-600">No Images</span>
                  </div>}
                </div>
              </td>
              <td className="border border-gray-300 p-2">{title}</td>
              <td className="border border-gray-300 p-2">
                {description}
              </td>
              <td className="border border-gray-300 p-2">
                {admin_user.name}
              </td>
              <td className="border border-gray-300 p-2">
                {price} {currency}
              </td>
              <td className="border border-gray-300 p-2">
                {stock_quantity}
              </td>
              <td className="border border-gray-300 p-2">
                {trending ? "Yes" : "No"}
              </td>
              <td className="border border-gray-300 p-2">
                {
                  colors?.map((color, index) => (
                    <span key={index}>{color} </span>
                  ))
                }
              </td>
              <td className="border border-gray-300 p-2">
                {
                  sizes?.map((size, index) => (
                    <span key={index}>{size} </span>
                  ))
                }
              </td>
              <ToggleSwitch id={id} handleUpdate={handleUpdate} initialStatus={publish}/>
              <td className="border border-gray-300 p-2">
                <div className="flex gap-2">
                  {hasPermission({roles: userRoles}, "update:products") && (
                    <button
                      onClick={() => handleEdit(id)}
                      className="btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                           stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                      </svg>

                      <span>Edit</span>
                    </button>
                  )}
                  {hasPermission({roles: userRoles}, "delete:products") && (
                    <button
                      onClick={() => handleDelete(id)}
                      className="btn bg-red-50 text-red-500 hover:bg-red-500 hover:white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                           stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                      </svg>
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
