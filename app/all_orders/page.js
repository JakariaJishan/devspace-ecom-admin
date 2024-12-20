"use client";

import { useState, useEffect } from "react";
import OrderTable from "@/app/components/orders/OrderTable";
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";
import ExportButton from "@/app/components/orders/ExportButton";
import useUpdateData from "@/app/hooks/useUpdateData";
import useDeleteData from "@/app/hooks/useDeleteData";
import toast from "react-hot-toast";

const page = () => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`;
  const orderReportUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/reports/order-report`;
  const orderUpdateUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders/admin_update_order`;
  const orderDeleteUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders/admin_delete_order`;

  const { data: initialData, loading, error } = useGetFetch(apiUrl);
  const { updateData, loading: updating, error: updateError } = useUpdateData();
  const { deleteData, loading: deleting, error: deleteError } = useDeleteData();
  const [orders, setOrders] = useState([]);

  // Update orders state when initialData is loaded
  useEffect(() => {
    if (initialData) {
      setOrders(initialData);
    }
  }, [initialData]);

  const handleDeleteOrder = async (orderId) => {

    try {
      // Send DELETE request with order_id in the body
      await deleteData(orderDeleteUrl, { order_id: orderId }); // Pass order_id in the body

      // Remove the deleted order from the state
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));

      toast.success("Order deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete order");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    console.log("Payload being sent:", { order_id: orderId, order_status: newStatus });
    try {
      const payload = { order_id: orderId, order_status: newStatus };
      const response = await updateData(orderUpdateUrl, payload);

      // Update the order status in the local state
      setOrders((prevOrders) =>
          prevOrders.map((order) =>
              order.id === orderId ? { ...order, status: newStatus } : order
          )
      );

      toast.success(response.message || "Order status updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update order status");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
      <>
        <div className="px-4 py-6">
          <ExportButton url={orderReportUrl} title="order-report" />
          <OrderTable orders={orders} onUpdateStatus={handleUpdateStatus} onDeleteOrder={handleDeleteOrder} />
        </div>
      </>
  );
};

export default page;
