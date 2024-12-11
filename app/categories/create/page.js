"use client"
import SideMenu from "@/app/components/SideMenu";
import usePostData from "@/app/hooks/usePostData";
import toast from "react-hot-toast";
import CategoryCreateForm from "@/app/components/categories/CategoryCreateForm";

const page = () => {
  const {postData} = usePostData()
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`

  const handleCreateProduct = (formData) => {
    postData(apiUrl, formData)
      .then((response) => {
        toast.success(response.message);
      })
      .catch((err) => {
        toast.error(err.message);
      });

  };

  return <div className="flex">
    <SideMenu/>
    <div className="w-[80%] px-4 py-6">
      <CategoryCreateForm onCreate={handleCreateProduct}/>
    </div>
  </div>
}
export default page;