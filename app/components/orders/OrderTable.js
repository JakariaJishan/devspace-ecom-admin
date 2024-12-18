import React, { useState } from "react";
import Link from "next/link";
import hasPermission from "@/app/lib/roles";
import {getCookie} from "@/app/utils/cookies";

const OrderTable = ({ orders, onUpdateStatus, onDeleteOrder }) => {
  const rolesFromCookie = JSON.parse(getCookie("roles"));
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
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
        <th className="border border-gray-300 px-4 py-2">ID</th>
        <th className="border border-gray-300 px-4 py-2">User Name</th>
        <th className="border border-gray-300 px-4 py-2">Shipping Address</th>
        <th className="border border-gray-300 px-4 py-2">Items Quantity</th>
        <th className="border border-gray-300 px-4 py-2">Total Price</th>
        <th className="border border-gray-300 px-4 py-2">Status</th>
        <th className="border border-gray-300 px-4 py-2">Payment Status</th>
        <th className="border border-gray-300 px-4 py-2">Action</th>
      </tr>
      </thead>
      <tbody>
      {orders?.map((order) => (
        <tr key={order.id}>
          <td className="border border-gray-300 px-4 py-2">{order.id}</td>
          <td className="border border-gray-300 px-4 py-2">{order.user.name}</td>
          <td className="border border-gray-300 px-4 py-2">
            {order.shipping_address.delivery_address}
          </td>
          <td className="border border-gray-300 px-4 py-2">{order.order_items.length}</td>
          <td className="border border-gray-300 px-4 py-2">{order.total_price}</td>
          <td className="border border-gray-300 px-4 py-2">
            <span
                className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}
              >
              {order.status}
              </span>
          </td>
          <td className="border border-gray-300 px-4 py-2">
            <span
                className={`px-2 py-1 rounded text-sm ${getPaymentStatusColor(order.payment_status)}`}
              >
              {order.payment_status}
              </span>
          </td>
          <td className="border border-gray-300 px-4 py-2">
            {hasPermission({roles: rolesFromCookie}, "view:order") && (
                <Link
                    href={`/all_orders/${order.id}`}
                    className="px-2 py-1 rounded text-sm bg-blue-100 mr-2"
                >
                  View
                </Link>
            )}
            {hasPermission({roles: rolesFromCookie}, "update:order") && (
                <>
                  <button
                      onClick={() => setSelectedOrder(order.id)}
                      className="px-2 py-1 rounded text-sm bg-green-100 mr-2"
                  >
                    Update Status
                  </button>
                  {selectedOrder === order.id && (
                      <div className="mt-2">
                        <select
                            className="border border-gray-300 rounded px-2 py-1"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                            onClick={() => handleUpdate(order.id)}
                            className="ml-2 px-2 py-1 rounded bg-blue-100"
                        >
                          Confirm
                        </button>
                      </div>
                  )}
                </>
            )}
            {hasPermission({roles: rolesFromCookie}, "delete:order") && (
                <button
                    onClick={() => onDeleteOrder(order.id)}
                    className="px-2 py-1 rounded text-sm bg-red-100 hover:bg-red-200"
                >
                  Delete
                </button>
            )}
          </td>

        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
