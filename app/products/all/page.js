"use client"
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";
import ProductList from "@/app/components/products/ProductList";

const page = () => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products`
  const {data, loading, error} = useGetFetch(apiUrl)

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="px-4 py-6">

      <ProductList products={data}/>
    </div>
  )
}

export default page