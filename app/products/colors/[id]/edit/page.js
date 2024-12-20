"use client"
import ColorPicker from "@/app/components/colors/ColorPicker";
import {useParams} from "next/navigation";
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";

const page = () => {
  const {id} = useParams();
  const getColorUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/colors/${id}`;
  const {data, loading, error} = useGetFetch(getColorUrl)

  if(loading) return <Loader/>
  return (
    <div>
      <ColorPicker mode="edit" fetchColor={data}/>
    </div>
  )
}

export default page;