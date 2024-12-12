"use client"
import OrderTable from "@/app/components/orders/OrderTable";
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";
import ExportButton from "@/app/components/orders/ExportButton";

const page = () => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`
  const orderReportUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/reports/order-report`

  const {data, loading, error} = useGetFetch(apiUrl)

  if (loading) {
    return <Loader/>
  }

  return (
    <>
      <div className="px-4 py-6">
        <ExportButton url={orderReportUrl} title="order-report"/>
        <OrderTable orders={data}/>
      </div>
    </>
  )
}

export default page