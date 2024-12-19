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
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const OrderTable = ({ orders, onUpdateStatus, onDeleteOrder }) => {
  const rolesFromCookie = JSON.parse(getCookie("roles"));
  // Function to determine status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-black";
      case "delivered":
        return "bg-blue-200 text-black";
      case "processed":
        return "bg-green-200 text-black";
      case "shipped":
        return "bg-purple-200 text-black";
      case "cancelled":
        return "bg-red-200 text-black";
      default:
        return "bg-gray-200 text-black";
    }
  };

  const handleUpdate = (orderId) => {
    onUpdateStatus(orderId, newStatus);
    setSelectedOrder(null);
    setNewStatus("");
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
      <table className="table-auto border-collapse border border-gray-300 w-full text-left">
        <thead>
        <tr>
          <th className="border border-gray-300 px-2 py-1 text-sm">ID</th>
          <th className="border border-gray-300 px-2 py-1 text-sm">User Name</th>
          <th className="border border-gray-300 px-2 py-1 text-sm">Shipping Address</th>
          <th className="border border-gray-300 px-2 py-1 text-sm">Items Quantity</th>
          <th className="border border-gray-300 px-2 py-1 text-sm">Total Price</th>
          <th className="border border-gray-300 px-2 py-1 text-sm">Status</th>
          <th className="border border-gray-300 px-2 py-1 text-sm">Payment Status</th>
          <th className="border border-gray-300 px-2 py-1 text-sm">Change Status</th>
          <th className="border border-gray-300 px-2 py-1 text-sm">Action</th>
        </tr>
        </thead>
        <tbody>
        {orders?.map((order) => (
            <tr key={order.id}>
              <td className="border border-gray-300 px-2 py-1">{order.id}</td>
              <td className="border border-gray-300 px-2 py-1">{order.user.name}</td>
              <td className="border border-gray-300 px-2 py-1">
                {order.shipping_address.delivery_address}
              </td>
              <td className="border border-gray-300 px-2 py-1">{order.order_items.length}</td>
              <td className="border border-gray-300 px-2 py-1">{order.total_price}</td>
              <td className="border border-gray-300 px-2 py-1">
          <span
              className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}
          >
            {order.status}
          </span>
              </td>
              <td className="border border-gray-300 px-2 py-1">
          <span
              className={`px-2 py-1 rounded text-sm ${getPaymentStatusColor(order.payment_status)}`}
          >
            {order.payment_status}
          </span>
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center align-middle">
                {hasPermission({roles: rolesFromCookie}, "update:order") && (
                    <div className="flex items-center justify-center mt-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                              className="w-32 px-2 py-2 flex items-center justify-between border border-gray-300 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)} {/* Current status */}
                            {/* Dropdown Arrow Icon */}
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
                              value={order.status} // Set the current value
                              onValueChange={(newValue) => onUpdateStatus(order.id, newValue)} // Update on selection
                          >
                            <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="processing">Processing</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="shipped">Shipped</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="delivered">Delivered</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="cancelled">Cancelled</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                )}
              </td>
              <td className="border border-gray-300 px-2 py-1">
                {hasPermission({roles: rolesFromCookie}, "view:order") && (
                    <Link
                        href={`/all_orders/${order.id}`}
                        className="px-2 py-1 rounded text-sm bg-blue-100 mr-2"
                    >
                      View
                    </Link>
                )}
                {hasPermission({roles: rolesFromCookie}, "delete:order") && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                            className="px-2 py-1 rounded text-sm bg-red-100 hover:bg-red-200"
                        >
                          Delete
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
                          <AlertDialogAction
                              onClick={() => onDeleteOrder(order.id)}
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                )}
              </td>
            </tr>
        ))}
        </tbody>
      </table>
  );
};

export default OrderTable;
