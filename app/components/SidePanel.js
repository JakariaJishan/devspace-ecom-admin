"use client";
import "../globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getCookie } from "@/app/utils/cookies";
import hasPermission from "@/app/lib/roles";
import {
  MdDashboard,
  MdShoppingCart,
  MdCategory,
  MdInventory,
  MdAdminPanelSettings,
} from "react-icons/md";

export default function SidePanel({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const adminUser = JSON.parse(localStorage.getItem("admin_user"));
  // Define paths that should not use the layout
  const noLayoutPaths = ["/auth/signin"];
  const rolesFromCookie = JSON.parse(getCookie("roles"));

  // Check if the current path matches a no-layout path
  const isNoLayout = noLayoutPaths.includes(pathname);

  if (isNoLayout) {
    return <>{children}</>;
  }

  const handleLogOut = () => {
    localStorage.removeItem("admin_user");
    document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
    document.cookie =
        "roles=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
    router.push("/auth/signin");
    toast.success("Logout successful");
  };
  const isActive = (href) => pathname === href;
  const isParentActive = (prefix) => pathname.startsWith(prefix);

  return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="flex h-screen w-[13%] flex-col justify-between border-e bg-[#405189]">
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
                    className={`flex items-center gap-2 block rounded-lg px-4 py-2 text-sm font-medium ${
                        isActive("/")
                            ? "text-white"
                            : "text-white/70 hover:text-white"
                    }`}
                >
                  <MdDashboard className="text-lg" />
                  Dashboard
                </Link>
              </li>

              <li>
                <details
                    className="group [&_summary::-webkit-details-marker]:hidden"
                    open={isParentActive("/all_orders")}
                >
                  <summary
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${
                          isParentActive("/all_orders")
                              ? "text-white"
                              : "text-white/70 hover:text-white"
                      }`}
                  >
                  <span className="flex items-center gap-2">
                    <MdShoppingCart className="text-lg" />{" "}
                    {/* Add the shopping cart icon here */}
                    <span className="text-sm font-medium"> Orders </span>
                  </span>

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
                                  ? "text-white"
                                  : "text-white/70 hover:text-white"
                          }`}
                      >
                        All orders
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>

              <li>
                <details
                    className="group [&_summary::-webkit-details-marker]:hidden"
                    open={isParentActive("/categories")}
                >
                  <summary
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${
                          isParentActive("/categories")
                              ? "text-white"
                              : "text-white/70 hover:text-white"
                      }`}
                  >
                  <span className="flex items-center gap-2">
                    <MdCategory className="text-lg" /> {/* Add the icon here */}
                    <span className="text-sm font-medium"> Categories </span>
                  </span>

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
                      {hasPermission(
                          { roles: rolesFromCookie },
                          "view:category"
                      ) && (
                          <Link
                              href="/categories/all"
                              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                                  isActive("/categories/all")
                                      ? "text-white"
                                      : "text-white/70 hover:text-white"
                              }`}
                          >
                            All categories
                          </Link>
                      )}
                    </li>

                    <li>
                      {hasPermission(
                          { roles: rolesFromCookie },
                          "create:category"
                      ) && (
                          <Link
                              href="/categories/create"
                              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                                  isActive("/categories/create")
                                      ? "text-white"
                                      : "text-white/70 hover:text-white"
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
                <details
                    className="group [&_summary::-webkit-details-marker]:hidden"
                    open={isParentActive("/products")}
                >
                  <summary
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${
                          isParentActive("/products")
                              ? "text-white"
                              : "text-white/70 hover:text-white"
                      }`}
                  >
                  <span className="flex items-center gap-2">
                    <MdInventory className="text-lg" />{" "}
                    {/* Add the inventory icon here */}
                    <span className="text-sm font-medium"> Products </span>
                  </span>

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
                      {hasPermission(
                          { roles: rolesFromCookie },
                          "view:products"
                      ) && (
                          <Link
                              href="/products/all"
                              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                                  isActive("/products/all")
                                      ? "text-white"
                                      : "text-white/70 hover:text-white"
                              }`}
                          >
                            All products
                          </Link>
                      )}
                    </li>
                    <li>
                      {hasPermission(
                          { roles: rolesFromCookie },
                          "create:products"
                      ) && (
                          <Link
                              href="/products/create"
                              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                                  isActive("/products/create")
                                      ? "text-white"
                                      : "text-white/70 hover:text-white"
                              }`}
                          >
                            Create Product
                          </Link>
                      )}
                    </li>
                    <li>
                      {hasPermission(
                          { roles: rolesFromCookie },
                          "create:colors"
                      ) && (
                          <Link
                              href="/products/colors"
                              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                                  isActive("/products/colors")
                                      ? "text-white"
                                      : "text-white/70 hover:text-white"
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
                <details
                    className="group [&_summary::-webkit-details-marker]:hidden"
                    open={isParentActive("/admin")}
                >
                  <summary
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${
                          isParentActive("/admin")
                              ? "text-white"
                              : "text-white/70 hover:text-white"
                      }`}
                  >
                  <span className="flex items-center gap-2">
                    <MdAdminPanelSettings className="text-lg" />{" "}
                    {/* Add the admin panel icon */}
                    <span className="text-sm font-medium"> Manage Admin </span>
                  </span>

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
                      {hasPermission(
                          { roles: rolesFromCookie },
                          "create:admin"
                      ) && (
                          <Link
                              href="/admin/create"
                              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                                  isActive("/admin/create")
                                      ? "text-white"
                                      : "text-white/70 hover:text-white"
                              }`}
                          >
                            Create admin user
                          </Link>
                      )}
                    </li>

                    <li>
                      {hasPermission(
                          { roles: rolesFromCookie },
                          "view:admin"
                      ) && (
                          <Link
                              href="/admin/view"
                              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                                  isActive("/admin/view")
                                      ? "text-white"
                                      : "text-white/70 hover:text-white"
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
              <button
                  onClick={handleLogOut}
                  className="block w-full  px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600"
              >
                Log out
              </button>
            </div>

            <a
                href="#"
                className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50"
            >
              <img
                  alt=""
                  src={adminUser.avatar_url}
                  className="size-10 rounded-full object-cover"
              />

              <div>
                <p className="text-xs text-black">
                  <strong className="block font-medium">
                    {adminUser.name}{" "}
                    <span className="bg-blue-500 text-white rounded-3xl p-[2px] ml-2">
                    {adminUser.roles[0]}
                  </span>
                  </strong>

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
