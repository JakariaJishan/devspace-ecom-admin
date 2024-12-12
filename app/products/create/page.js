"use client"
import ProductCreateForm from "@/app/components/products/ProductCreateForm";
import usePostData from "@/app/hooks/usePostData";
import toast from "react-hot-toast";
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";

const page = () => {
  const {postData} = usePostData()
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products`
  const categoryApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`
  const {data, loading, error} = useGetFetch(categoryApiUrl)
  const handleCreateProduct = (formData) => {
    postData(apiUrl, formData)
      .then((response) => {
        toast.success(response.message);
      })
      .catch((err) => {
        toast.error(err.message);
      });

  };

  if (loading) {
    return <Loader/>;
  }

  return <div className="px-4 py-6">
    <ProductCreateForm onCreate={handleCreateProduct} categories={data}/>
  </div>
}
export default page;