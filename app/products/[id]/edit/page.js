"use client"
import {useParams, useRouter} from "next/navigation";
import toast from "react-hot-toast";
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";
import useUpdateData from "@/app/hooks/useUpdateData";
import ProductEditForm from "@/app/components/products/ProductEditForm";

const page = () => {
  const router = useRouter();
  const {id} = useParams();
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
  const {data, loading, error} = useGetFetch(apiUrl)
  const {updateData} = useUpdateData()
  const handleSave = async (updatedProduct) => {
    updateData(apiUrl, updatedProduct).then(res => {
      toast.success(res.message)
      router.push("/products/all")
    }).catch(err => {
      toast.error(err.message)
    })

  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="px-4 py-6">

      <ProductEditForm product={data} onSave={handleSave}/>
    </div>
  )
}

export default page;