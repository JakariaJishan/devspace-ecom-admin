"use client";

import useGetFetch from "@/app/hooks/useGetFetch";
import Loader from "@/app/lib/Loader";
import ProductList from "@/app/components/products/ProductList";
import { useState, useEffect } from "react";

const Page = () => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products`;
  const { data, loading } = useGetFetch(apiUrl);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (data) {
      setProducts(data); // Set the products only when data is fetched
    }
  }, [data]);

  if (loading) {
    return <Loader />;
  }

  if (!products.length) {
    return (
        <div className="px-4 py-6">
          <p className="text-gray-500">No products available.</p>
        </div>
    );
  }

  return (
      <div className="px-4 py-6">
        <ProductList products={products} updateProducts={setProducts} />
      </div>
  );
};

export default Page;
