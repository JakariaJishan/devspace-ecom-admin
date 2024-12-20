"use client"
import ColorPicker from "@/app/components/colors/ColorPicker";
import ColorList from "@/app/components/colors/ColorList";
import {useEffect, useState} from "react";
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";

const page = () => {
  const [colorList, setColorList] = useState([]);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/colors`;
  const {data, loading, error} = useGetFetch(apiUrl)

  useEffect(() => {
    setColorList(data)
  }, [data])

  if(loading && colorList?.length > 0) return <Loader/>
  console.log(colorList, data)

  return (
    <div className="flex gap-8">
      <div className="w-8/12"><ColorList colorList={colorList}/></div>
      <div className="w-4/12"><ColorPicker mode="create" colorList={colorList} setColorList={setColorList}/></div>
    </div>
  );
}

export default page;