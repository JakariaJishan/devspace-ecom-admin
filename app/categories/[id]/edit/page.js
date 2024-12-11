"use client"
import {useParams} from "next/navigation";
import SideMenu from "@/app/components/SideMenu";
import toast from "react-hot-toast";
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";
import useUpdateData from "@/app/hooks/useUpdateData";
import CategoryEditForm from "@/app/components/categories/CategoryEditForm";

const page =()=> {
  const {id} = useParams();
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`
  const {data, loading, error} = useGetFetch(apiUrl)
  const {updateData} = useUpdateData()
  const handleSave = async (updatedCategory) => {

    updateData(apiUrl, updatedCategory).then(res => {
      toast.success(res.message)
    }).catch(err => {
      toast.error(err.message)
    })

  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="flex">
      <SideMenu/>
      <div className="w-[80%] px-4 py-6">
        <CategoryEditForm category={data} onSave={handleSave}/>
      </div>
    </div>
  )
}

export default page;