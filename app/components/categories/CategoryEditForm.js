import React, { useState, useEffect } from "react";

const CategoryEditForm = ({ category, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    image: "", // This will store the uploaded image files
  });

  // Set form data when the category prop changes
  useEffect(() => {
    if (category) {
      setFormData({
        title: category.title || "",
        image: category.image,
      });
    }
  }, [category]);

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
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();

    // Append form data fields to FormData
    form.append("category[title]", formData.title);
    form.append("category[image]", formData.image);

    onSave(form); // Call the onSave function passed as a prop with the updated form data
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
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
          <label htmlFor="image" className="block text-sm font-medium">
            Category Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
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

export default CategoryEditForm;