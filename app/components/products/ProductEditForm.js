import React, { useState, useEffect } from "react";

const ProductEditForm = ({ product, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock_quantity: "",
    currency: "bd", // Default currency, you can make this dynamic if needed
    trending: false,
    images: [], // This will store the uploaded image files
  });

  // Set form data when the product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        stock_quantity: product.stock_quantity || "",
        currency: product.currency || "bd",
        trending: product.trending || false,
        images: product.images || [], // Assuming images are saved in an array
      });
    }
  }, [product]);

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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();

    // Append form data fields to FormData
    form.append("product[title]", formData.title);
    form.append("product[description]", formData.description);
    form.append("product[price]", formData.price);
    form.append("product[stock_quantity]", formData.stock_quantity);
    form.append("product[currency]", formData.currency);
    form.append("product[trending]", formData.trending);

    // Append each image file to FormData
    formData.images.forEach((image, index) => {
      form.append("product[images][]", image); // Note: 'images[]' is the key name
    });
    onSave(form); // Call the onSave function passed as a prop with the updated form data
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
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
            Description
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
            Price
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
            Stock Quantity
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
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded w-full"
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditForm;
