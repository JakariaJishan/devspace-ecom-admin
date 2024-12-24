"use client"
import usePostData from "@/app/hooks/usePostData";
import toast from "react-hot-toast";
import CategoryCreateForm from "@/app/components/categories/CategoryCreateForm";
import {useRouter} from "next/navigation";

const page = () => {
  const {postData} = usePostData()
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`
  const router = useRouter()

  const handleCreateProduct = (formData) => {
    postData(apiUrl, formData)
      .then((response) => {
        toast.success(response.message);
        router.push("/categories/all")
      })
      .catch((err) => {
        toast.error(err.message);
      });

  };

  return <div className="px-4 py-6">
    <CategoryCreateForm onCreate={handleCreateProduct}/>
  </div>
}
export default page;