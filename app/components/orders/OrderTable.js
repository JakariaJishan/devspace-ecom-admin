import React, { useState } from "react";
import Link from "next/link";
import hasPermission from "@/app/lib/roles";
import {getCookie} from "@/app/utils/cookies";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EyeIcon from "@/app/components/icons/EyeIcon";
import TrashIcon from "@/app/components/icons/TrashIcon";


const OrderTable = ({ orders, onUpdateStatus, onDeleteOrder }) => {
  const rolesFromCookie = JSON.parse(getCookie("roles"));
  // Function to determine status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "delivered":
        return "bg-green-500 text-white";
      case "processed":
        return "bg-blue-500 text-white";
      case "shipped":
        return "bg-indigo-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-200 text-black";
      case "pending":
        return "bg-red-200 text-black";
      case "n/a":
        return "bg-gray-200 text-black";
      default:
        return "bg-gray-200 text-black";
    }
  };

  return (
      <div className="p-4 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">ID</TableHead>
              <TableHead className="font-bold">User Name</TableHead>
              <TableHead className="font-bold">Shipping Address</TableHead>
              <TableHead className="font-bold">Items Quantity</TableHead>
              <TableHead className="font-bold">Total Price</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Payment Status</TableHead>
              <TableHead className="font-bold">Change Status</TableHead>
              <TableHead className="font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>{order.shipping_address.delivery_address}</TableCell>
                  <TableCell>{order.order_items.length}</TableCell>
                  <TableCell>{order.total_price}</TableCell>
                  <TableCell>
                    <span
                        className={`inline-block rounded text-sm text-center ${getStatusColor(
                            order.status
                        )} w-20`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                        className={`px-1 py-1 rounded text-xs ${getPaymentStatusColor(
                            order.payment_status
                        )}`}
                    >
                      {order.payment_status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {hasPermission({roles: rolesFromCookie}, "update:order") && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                                className="w-32 px-2 py-2 flex items-center justify-between border border-gray-300 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                              {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4 ml-2"
                              >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                />
                              </svg>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuSeparator/>
                            <DropdownMenuRadioGroup
                                value={order.status}
                                onValueChange={(newValue) =>
                                    onUpdateStatus(order.id, newValue)
                                }
                            >
                              <DropdownMenuRadioItem value="pending">
                                Pending
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="processing">
                                Processing
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="shipped">
                                Shipped
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="delivered">
                                Delivered
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="cancelled">
                                Cancelled
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {hasPermission({ roles: rolesFromCookie }, "view:order") && (
                          <Link
                              href={`/all_orders/${order.id}`}
                              className="p-2 rounded text-blue-600 hover:bg-blue-100"
                              title="View Order"
                          >
                            <EyeIcon size={16} />
                          </Link>
                      )}
                      {hasPermission({ roles: rolesFromCookie }, "delete:order") && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                  className="p-2 rounded text-red-600 hover:bg-red-100"
                                  title="Delete Order"
                              >
                                <TrashIcon size={16} />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. It will permanently delete the order.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteOrder(order.id)}>
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

export default OrderTable;
