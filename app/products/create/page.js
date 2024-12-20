"use client"
import ProductCreateForm from "@/app/components/products/ProductCreateForm";
import usePostData from "@/app/hooks/usePostData";
import toast from "react-hot-toast";
import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";

const page = () => {
  const { postData } = usePostData();
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products`;
  const categoryApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`;
  const colorsApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/colors`;

  const { data: categories, loading: categoriesLoading } = useGetFetch(categoryApiUrl);
  const { data: colors, loading: colorsLoading } = useGetFetch(colorsApiUrl);

  const handleCreateProduct = (formData) => {
    postData(apiUrl, formData)
        .then((response) => {
          toast.success(response.message);
        })
        .catch((err) => {
          toast.error(err.message);
        });
  };

  if (categoriesLoading || colorsLoading) {
    return <Loader />;
  }

  return (
      <div className="px-4 py-6">
        <ProductCreateForm onCreate={handleCreateProduct} categories={categories} colors={colors} />
      </div>
  );
};

export default page;
