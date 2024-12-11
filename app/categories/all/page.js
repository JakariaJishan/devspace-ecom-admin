"use client"
import useGetFetch from "@/app/hooks/useGetFetch";
import SideMenu from "@/app/components/SideMenu";
import Loader from "@/app/lib/Loader";
import CategoryList from "@/app/components/categories/CategoryList";

const page = () => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`
  const {data, loading, error} = useGetFetch(apiUrl)

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="flex">
      <SideMenu/>
      <div className="w-[80%] px-4 py-6">
        <CategoryList categories={data}/>
      </div>
    </div>
  )
}

export default page