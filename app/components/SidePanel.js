"use client";
import "../globals.css";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {getCookie} from "@/app/utils/cookies";
import hasPermission from "@/app/lib/roles";
import Image from 'next/image';

export default function SidePanel({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const adminUser = JSON.parse(localStorage.getItem("admin_user"));
  // Define paths that should not use the layout
  const noLayoutPaths = ["/auth/signin"];
  const rolesFromCookie =  JSON.parse(getCookie("roles"));

  // Check if the current path matches a no-layout path
  const isNoLayout = noLayoutPaths.includes(pathname);

  if (isNoLayout) {
    return <>{children}</>;
  }

  const handleLogOut = () => {
    localStorage.removeItem("admin_user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
    document.cookie = "roles=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
    router.push("/auth/signin");
    toast.success("Logout successful");
  }
  const isActive = (href) => pathname === href;
  const isParentActive = (prefix) => pathname.startsWith(prefix);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex h-screen w-[20%] flex-col justify-between border-e bg-lime-700">
        <div className="px-4 py-6">
          <div className="flex justify-center">
            <img
                src="/logo/Devspace_logo1-removebg-preview.png"
                alt="Logo"
                className="h-[125px] w-[180px]"
            />
          </div>

          <ul className="mt-6 space-y-1">
            <li>
              <Link
                  href="/"
                  className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                      isActive("/")
                          ? "bg-lime-400 text-white"
                          : "text-white rounded-lg hover:bg-lime-400"
                  }`}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <details className="group [&_summary::-webkit-details-marker]:hidden"
                       open={isParentActive("/all_orders")}>
                <summary
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${
                    isParentActive("/all_orders")
                        ? "bg-lime-300 text-grey-200"
                        : "text-white rounded-lg hover:bg-lime-400"
                  }`}
                >
                  <span className="text-sm font-medium"> Orders </span>

                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                  <li>
                    <Link
                      href="/all_orders"
                      className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                        isActive("/all_orders")
                            ? "bg-lime-400 text-white"
                            : "text-white rounded-lg hover:bg-lime-400"
                      }`}
                    >
                      All orders
                    </Link>
                  </li>
                </ul>
              </details>
            </li>

            <li>
              <details className="group [&_summary::-webkit-details-marker]:hidden"
                       open={isParentActive("/categories")}>
                <summary
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${
                    isParentActive("/categories")
                        ? "bg-lime-300 text-grey-200"
                        : "text-white rounded-lg hover:bg-lime-400"
                  }`}
                >
                  <span className="text-sm font-medium"> Categories </span>

                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                  <li>
                    {hasPermission({ roles: rolesFromCookie }, "view:category") && (
                        <Link
                            href="/categories/all"
                            className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                                isActive("/categories/all")
                                    ? "bg-lime-400 text-white"
                                    : "text-white rounded-lg hover:bg-lime-400"
                            }`}
                        >
                          All categories
                        </Link>
                    )}
                  </li>

                  <li>
                    {hasPermission({ roles: rolesFromCookie }, "create:category") && (
                        <Link
                            href="/categories/create"
                            className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                                isActive("/categories/create")
                                    ? "bg-lime-400 text-white"
                                    : "text-white rounded-lg hover:bg-lime-400"
                            }`}
                        >
                          Create Category
                        </Link>
                    )}
                  </li>
                </ul>
              </details>
            </li>

            <li>
              <details className="group [&_summary::-webkit-details-marker]:hidden" open={isParentActive("/products")}>
                <summary
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${
                    isParentActive("/products")
                        ? "bg-lime-300 text-grey-200"
                        : "text-white rounded-lg hover:bg-lime-400"
                  }`}
                >
                  <span className="text-sm font-medium"> Products </span>

                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                  <li>
                    {hasPermission({roles: rolesFromCookie}, "view:products") && (
                      <Link
                        href="/products/all"
                        className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                          isActive("/products/all")
                              ? "bg-lime-400 text-white"
                              : "text-white rounded-lg hover:bg-lime-400"
                        }`}
                      >
                        All products
                      </Link>
                    )}
                  </li>
                  <li>
                    {hasPermission({roles: rolesFromCookie}, "create:products") && (
                      <Link
                        href="/products/create"
                        className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                          isActive("/products/create")
                              ? "bg-lime-400 text-white"
                              : "text-white rounded-lg hover:bg-lime-400"
                        }`}
                      >
                        Create Product
                      </Link>
                    )}
                  </li>
                  <li>
                    {hasPermission({roles: rolesFromCookie}, "create:colors") && (
                      <Link
                        href="/products/colors"
                        className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                          isActive("/products/colors")
                              ? "bg-lime-400 text-white"
                              : "text-white rounded-lg hover:bg-lime-400"
                        }`}
                      >
                        Colors
                      </Link>
                    )}
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details className="group [&_summary::-webkit-details-marker]:hidden" open={isParentActive("/admin")}>
                <summary
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${
                    isParentActive("/admin")
                        ? "bg-lime-300 text-grey-200"
                        : "text-white rounded-lg hover:bg-lime-400"
                  }`}
                >
                  <span className="text-sm font-medium"> Manage Admin </span>

                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                    <li>
                      {hasPermission({ roles: rolesFromCookie }, "create:admin") && (
                          <Link
                              href="/admin/create"
                              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                                  isActive("/admin/create")
                                      ? "bg-lime-400 text-white"
                                      : "text-white rounded-lg hover:bg-lime-400"
                              }`}
                          >
                            Create admin user
                          </Link>
                      )}
                    </li>

                  <li>
                    {hasPermission({ roles: rolesFromCookie }, "view:admin") && (
                        <Link
                            href="/admin/view"
                            className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                                isActive("/admin/view")
                                    ? "bg-lime-400 text-white"
                                    : "text-white rounded-lg hover:bg-lime-400"
                            }`}
                        >
                          View admin
                        </Link>
                    )}
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
          <div className="mb-2">
            <button onClick={handleLogOut}
                    className="block w-full  px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600">Log
              out
            </button>
          </div>

          <a href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
            <img
              alt=""
              src={adminUser.avatar_url}
              className="size-10 rounded-full object-cover"
            />

            <div>
              <p className="text-xs text-black">
                <strong className="block font-medium">{adminUser.name} <span className="bg-blue-500 text-white rounded-3xl p-[2px] ml-2">{adminUser.roles[0]}</span></strong>

                <span> {adminUser.email} </span>
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
    </div>
  );
}
