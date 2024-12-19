"use client"
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";
import CategoryList from "@/app/components/categories/CategoryList";
import {useEffect, useState} from "react";

const page = () => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`
  const {data, loading, error} = useGetFetch(apiUrl)
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (data) {
      setCategories(data); // Set the products only when data is fetched
    }
  }, [data]);

  if (loading) {
    return <Loader />;
  }

  if (!categories.length) {
    return (
        <div className="px-4 py-6">
          <p className="text-gray-500">No categories available.</p>
        </div>
    );
  }

  return (

    <div className="px-4 py-6">
      <CategoryList categories={categories} updateCategories={setCategories}/>
    </div>
  )
}

export default page