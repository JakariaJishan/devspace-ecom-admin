"use client";

import React from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {getCookie} from "@/app/utils/cookies";
import hasPermission from "@/app/lib/roles";
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

const CategoryList = ({categories, updateCategories}) => {
  const router = useRouter()
  const rolesFromCookie =  JSON.parse(getCookie("roles"));
  const handleEdit = (categoryId) => {
    router.push(`/categories/${categoryId}/edit`)
  };

  const handleDelete = (categoryId) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`
    fetch(apiUrl, {
      method: "DELETE",
    }).then(res => res.json()).then(data => {
      toast.success(data.message)
      updateCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
      );
    }).catch((res) => {
      toast.error(res.message)
    })
  };

  return (
      <div className="container mx-auto p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Category List</h1>
          {hasPermission({roles: rolesFromCookie}, "create:category") && (
              <Link
                  className="inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                  href="/categories/create"
              >
                <PlusIcon size={16}
                          color="currentColor"
                          strokeWidth={2}/>
                Add new category
              </Link>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Image</TableHead>
              <TableHead className="font-bold">Title</TableHead>
              <TableHead className="font-bold">Added By</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      {category.image_url ? (
                          <img
                              src={category.image_url}
                              alt={category.title}
                              className="w-16 h-16 object-cover rounded"
                          />
                      ) : (
                          <div className="flex justify-center items-center rounded">
                            <span className="text-sm text-gray-600">No Images</span>
                          </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{category.title}</TableCell>
                  <TableCell>{category.admin_user.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {hasPermission({roles: rolesFromCookie}, "update:category") && (
                          <button
                              onClick={() => handleEdit(category.id)}
                              className="p-2 rounded text-blue-600 hover:bg-blue-100"
                              title="Edit Category"
                          >
                            <EditIcon size={16}/>
                          </button>
                      )}
                      {hasPermission({roles: rolesFromCookie}, "delete:category") && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                  className="p-2 rounded text-red-600 hover:bg-red-100"
                                  title="Delete Category"
                              >
                                <TrashIcon size={16}/>
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the category.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(category.id)}>
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

export default CategoryList;
