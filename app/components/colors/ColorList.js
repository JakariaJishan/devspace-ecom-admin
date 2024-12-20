"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";
import {useRouter} from "next/navigation";
import EditIcon from "@/app/components/icons/EditIcon";
import TrashIcon from "@/app/components/icons/TrashIcon";
import React, {useEffect, useState} from "react";
import hasPermission from "@/app/lib/roles";
import {getCookie} from "@/app/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import useDeleteData from "@/app/hooks/useDeleteData";
import toast from "react-hot-toast";

const ColorList = ({colorList, setColorList}) => {
  const [userRoles, setUserRoles] = useState([]);
  const router = useRouter();
  const { deleteData, loading, error } = useDeleteData();

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

  const handleEdit = (id) => {
    router.push(`/products/colors/${id}/edit`);
  }

  const handleDelete = async (id) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/colors/${id}`;
      const response = await deleteData(url);

      toast.success(response.message);

      setColorList((prevList) => prevList.filter((color) => color.id !== id));
    } catch (err) {
      console.error("Error deleting color:", err);
      toast.error(err.message);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Hex Code</TableHead>
          <TableHead>Color</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {colorList?.map((color) => (
          <TableRow key={color.id}>
            <TableCell className="font-medium">#{color.id}</TableCell>
            <TableCell>{color.name}</TableCell>
            <TableCell>{color.hex_code}</TableCell>
            <TableCell>
              <span className="h-8 w-8 block shadow" style={{
                backgroundColor: color.hex_code
              }}></span>
            </TableCell>
            <TableCell className="flex justify-end">

                  <div className="flex gap-4">
                    {hasPermission({roles: userRoles}, "update:colors") && (
                    <button onClick={(e) => handleEdit(color.id)}
                            className="p-2 rounded text-blue-600 hover:bg-blue-100"
                            title="Edit Color">
                      <EditIcon size={16}/>
                    </button>
                    )}
                    {hasPermission({roles: userRoles}, "delete:colors") && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                                className="p-2 rounded text-red-600 hover:bg-red-100"
                                title="Delete Color"
                            >
                              <TrashIcon size={16}/>
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the color.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(color.id)}>
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
  )
}

export default ColorList;
