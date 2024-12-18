"use client";

import { useState, useEffect } from "react";
import OrderTable from "@/app/components/orders/OrderTable";
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";
import ExportButton from "@/app/components/orders/ExportButton";
import useUpdateData from "@/app/hooks/useUpdateData";
import toast from "react-hot-toast";

const page = () => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`;
  const orderReportUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/reports/order-report`;
  const orderUpdateUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders/admin_update_order`;

  const { data: initialData, loading, error } = useGetFetch(apiUrl);
  const { updateData, loading: updating, error: updateError } = useUpdateData();
  const [orders, setOrders] = useState([]);

  // Update orders state when initialData is loaded
  useEffect(() => {
    if (initialData) {
      setOrders(initialData);
    }
  }, [initialData]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const payload = { order_id: orderId, order_status: newStatus };
      const response = await updateData(orderUpdateUrl, payload);

      const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      toast.success(response.message || "Order updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update order status");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
      <>
        <div className="px-4 py-6">
          <ExportButton url={orderReportUrl} title="order-report" />
          <OrderTable orders={orders} onUpdateStatus={handleUpdateStatus} />
        </div>
      </>
  );
};

export default page;
