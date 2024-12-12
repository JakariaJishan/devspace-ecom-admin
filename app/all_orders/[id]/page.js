'use client'

import Image from 'next/image'

import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";
import {useParams} from "next/navigation";

export default function page() {
  const {id} = useParams();

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${id}/order-items`
  const {data, loading, error} = useGetFetch(apiUrl)

  if (loading) {
    return <Loader/>
  }

  return (
    <>

        <div className="px-4 py-6">
          <div className="flex justify-center">
            <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm w-full max-w-3xl">
              <dl className="-my-3 divide-y divide-gray-100 text-sm">
                <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Status</dt>
                  <dd className="text-gray-700 sm:col-span-2">{data?.status}</dd>
                </div>
                <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Total Price</dt>
                  <dd className="text-gray-700 sm:col-span-2">${data?.total_price}</dd>
                </div>

                <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Order Items</dt>
                  <dd className="text-gray-700 sm:col-span-2">
                    <div className="space-y-4">
                      {data?.order_items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={50}
                            height={50}
                            className="object-cover rounded-md"
                          />
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
            </div>
          </div>
        </div>
    </>
  );
}