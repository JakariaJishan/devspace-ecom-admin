"use client";

import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {getCookie} from "@/app/utils/cookies";
import hasPermission from "@/app/lib/roles";
import useUpdateData from "@/app/hooks/useUpdateData";
import ToggleSwitch from "@/app/components/products/ToggleSwitch";
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
import { Switch } from "@/components/ui/switch"
import EditIcon from "@/app/components/icons/EditIcon";
import TrashIcon from "@/app/components/icons/TrashIcon";
import PlusIcon from "@/app/components/icons/PlusIcon";

const ProductList = ({ products, updateProducts }) => {
  const [switchStates, setSwitchStates] = useState(
      products.reduce((acc, product) => {
        acc[product.id] = product.trending;
        return acc;
      }, {})
  );
  const [userRoles, setUserRoles] = useState([]);
  const router = useRouter();

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
    router.push(`/products/${productId}/edit`);
  };

  const handleDelete = (productId) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`;
    fetch(apiUrl, {
      method: "DELETE",
    })
        .then((res) => res.json())
        .then((data) => {
          toast.success(data.message);
          // Notify parent component about the state change
          updateProducts((prevProducts) =>
              prevProducts.filter((product) => product.id !== productId)
          );
        })
        .catch((res) => {
          toast.error(res.message);
        });
  };

  const handleUpdate = (productId, trendingStatus) => {
    // Use the new route for admin trending status update
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/admin_product_trending_status_update`;

    const payload = {
      product_id: productId, // Pass product_id as required by your route
      trending: trendingStatus,
    };

    fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`, // Add Authorization header if required
      },
      body: JSON.stringify(payload),
    })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.message || "Failed to update trending status.");
            });
          }
          return response.json();
        })
        .then((res) => {
          toast.success("Trending status updated successfully!");
          setSwitchStates((prev) => ({
            ...prev,
            [productId]: trendingStatus,
          }));
        })
        .catch((err) => {
          toast.error(err.message || "Failed to update trending status.");
          // Revert the toggle in case of error
          setSwitchStates((prev) => ({
            ...prev,
            [productId]: !trendingStatus,
          }));
        });
  };



  return (
      <div className="container mx-auto p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Product List</h1>
          {hasPermission({roles: userRoles}, "update:products") && (
              <Link
                  className="inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                  href="/products/create"
              >
                <PlusIcon size={16}
                          color="currentColor"
                          strokeWidth={2}/>
                Add new product
              </Link>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Image</TableHead>
              <TableHead className="font-bold">Title</TableHead>
              <TableHead className="font-bold text-sm w-56">Description</TableHead>
              <TableHead className="font-bold">Added By</TableHead>
              <TableHead className="font-bold">Price</TableHead>
              <TableHead className="font-bold">Stock</TableHead>
              <TableHead className="font-bold">Trending</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      {product.image_urls && product.image_urls.length > 0 ? (
                          product.image_urls.map((url, index) => (
                              <img
                                  key={index}
                                  src={url}
                                  alt={`${product.title} ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded"
                              />
                          ))
                      ) : (
                          <div className="flex justify-center items-center rounded">
                            <span className="text-sm text-gray-600">No Images</span>
                          </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.admin_user.name}</TableCell>
                  <TableCell>
                    {product.price} {product.currency}
                  </TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                          id={`trending-${product.id}`}
                          checked={switchStates[product.id] || false}
                          onCheckedChange={(checked) => {
                            setSwitchStates((prev) => ({
                              ...prev,
                              [product.id]: checked,
                            }));
                            handleUpdate(product.id, checked);
                          }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {hasPermission({roles: userRoles}, "update:products") && (
                          <button
                              onClick={() => handleEdit(product.id)}
                              className="p-2 rounded text-blue-600 hover:bg-blue-100"
                              title="Edit Product"
                          >
                            <EditIcon size={16} />
                          </button>
                      )}
                      {hasPermission({roles: userRoles}, "delete:products") && (
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
                                  This action cannot be undone. This will permanently delete the product.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(product.id)}>
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

export default ProductList;
