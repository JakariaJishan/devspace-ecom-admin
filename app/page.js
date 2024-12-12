"use client"
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";
import Card from "@/app/components/dashboard/Card";
import ExportButton from "@/app/components/orders/ExportButton";

const page = () => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/reports/general-reports`
  const earningReportUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/reports/earning-report`

  const {data, loading, error} = useGetFetch(apiUrl)

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="px-4 py-6">
      <ExportButton url={earningReportUrl} title="earning-report"/>

      <div className="grid grid-cols-3 gap-6">
        <Card record={data?.total_customers} title="Total customers"/>
        <Card record={data?.total_products} title="Total products"/>
        <Card record={data?.total_sales} title="Total sales"/>
        <Card record={data?.total_category} title="Total category" list={data?.category_based_earning}/>
        <Card record={data?.total_orders} title="Total Orders" color="#f5d0fe"/>
        <Card record={data?.total_pending_orders} title="Pending Orders" color="#fca5a5"/>
        <Card record={data?.total_confirmed_orders} title="Confirmed Orders" color="#ccfbf1"/>
        <Card record={data?.total_processed_orders} title="Processed Orders" color="#fee2e2"/>
        <Card record={data?.total_shipped_orders} title="Shipped Orders" color="#fef3c7"/>
        <Card record={data?.total_cancelled_orders} title="Cancelled Orders" color="#ef4444"/>

      </div>
    </div>
  )
}

export default page;