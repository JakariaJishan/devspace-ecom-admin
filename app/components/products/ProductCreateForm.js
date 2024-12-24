"use client"
import React, { useState } from "react";
import MultiSelect from "@/app/lib/MultiSelect";
import MultiSizeSelect from "@/app/lib/MultiSizeSelect";

const ProductCreateForm = ({ onCreate, categories, colors }) => {

  const [selectedColors, setSelectedColors] = useState([]); // array of { value, label } from MultiSelect
  const [selectedSizes, setSelectedSizes] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock_quantity: "",
    currency: "bd", // Default currency
    trending: false,
    images: [], // This will store the uploaded image files
    category_id: "",
    admin_user_id: JSON.parse(localStorage.getItem("admin_user")).id,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      images: files,
    }));
  };

  const handleColorChange = (newColors) => {
    // newColors is an array of { value: number, label: string }
    setSelectedColors(newColors);
  };

  const handleSizeChange = (newSizes) => {
    // newSizes is an array of { value: number, label: string }
    setSelectedSizes(newSizes);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const productVariants = [];

    // Push color-only variants
    selectedColors.forEach((color) => {
      productVariants.push({ color_id: color.value });
    });

    // Push size-only variants
    selectedSizes.forEach((size) => {
      productVariants.push({ size_id: size.value });
    });

    const form = new FormData();
    form.append("product[title]", formData.title);
    form.append("product[description]", formData.description);
    form.append("product[price]", formData.price);
    form.append("product[stock_quantity]", formData.stock_quantity);
    form.append("product[currency]", formData.currency);
    form.append("product[trending]", formData.trending);
    form.append("product[category_id]", formData.category_id);
    form.append("product[admin_user_id]", formData.admin_user_id);

    productVariants.forEach((variant, index) => {
      if (variant.color_id !== undefined) {
        form.append(
            `product[product_variants_attributes][${index}][color_id]`,
            variant.color_id
        );
      }
      if (variant.size_id !== undefined) {
        form.append(
            `product[product_variants_attributes][${index}][size_id]`,
            variant.size_id
        );
      }
    });

    formData.images.forEach((image, index) => {
      form.append("product[images][]", image);
    });

    onCreate(form);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <select
              id="category"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
          >
            <option value="">Select a category</option>
            {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
            ))}
          </select>

        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium">
            Colors
          </label>
          <MultiSelect onChange={handleColorChange}/>
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium">
            Sizes
          </label>
          <MultiSizeSelect onChange={handleSizeChange}/>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price <span className="text-red-500">*</span>
          </label>
          <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
          />
        </div>

        <div>
          <label htmlFor="stock_quantity" className="block text-sm font-medium">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
              type="number"
              id="stock_quantity"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium">
            Currency <span className="text-red-500">*</span>
          </label>
          <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
          >
            <option value="bd">BD</option>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
        </div>

        <div>
          <label htmlFor="trending" className="block text-sm font-medium">
            Trending
          </label>
          <input
              type="checkbox"
              id="trending"
              name="trending"
              checked={formData.trending}
              onChange={handleInputChange}
              className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-medium">
            Product Images
          </label>
          <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mt-1 p-2 border rounded w-full"
          />
        </div>

        <div className="mt-4">
          <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreateForm;
