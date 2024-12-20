'use client'

import Image from 'next/image'

import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";
import {useParams} from "next/navigation";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function page() {
  const {id} = useParams();

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${id}/order-items`
  const {data, loading, error} = useGetFetch(apiUrl)

  if (loading) {
    return <Loader/>
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Order ID: {data?.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-gray-100 text-sm">
            {/* Order Status */}
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Status</dt>
              <dd className="text-gray-700 sm:col-span-2">{data?.status}</dd>
            </div>

            {/* Total Price */}
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Total Price</dt>
              <dd className="text-gray-700 sm:col-span-2">${data?.total_price}</dd>
            </div>

            {/* Order Items */}
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">Order Items</dt>
              <dd className="text-gray-700 sm:col-span-2">
                <div className="space-y-4">
                  {data?.order_items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={`${item.image}'s avatar`}
                                className="w-16 h-16 object-cover rounded"
                            />
                        ) : (
                            <div className="flex justify-center items-center rounded h-16 w-16 bg-gray-100">
                              <span className="text-sm text-gray-600">No photo</span>
                            </div>
                        )}
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p>Price: ${item.price}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                  ))}
                </div>
              </dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <p>Shipping Address: {data?.shipping_address?.delivery_address}</p>
        </CardFooter>
      </Card>
  );
}