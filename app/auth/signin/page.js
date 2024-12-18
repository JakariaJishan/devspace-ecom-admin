"use client";

import {useState} from "react";
import usePostData from "@/app/hooks/usePostData";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {postData, isLoading, error} = usePostData()
  const handleLogin = async (e) => {
    e.preventDefault();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/admin-login`
    const form = new FormData();
    form.append("user[email]", email);
    form.append("user[password]", password);

    postData(apiUrl, form)
      .then((response) => {
        toast.success(response.message || "Login successful");
        localStorage.setItem("admin_user", JSON.stringify(response.data));
        document.cookie = `token=${response.token}; path=/`;
        document.cookie = `roles=${JSON.stringify(response.data.roles)}; path=/; SameSite=Strict`;
        router.push("/");
      })
      .catch((err) => {
        toast.error(err.message || "Login failed");
      });

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
