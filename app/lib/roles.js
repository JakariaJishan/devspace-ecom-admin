const ROLES = {
  super_admin: [
      "view:comments",
      "create:comments",
      "update:comments",
      "delete:comments",

      "view:products",
      "create:products",
      "update:products",
      "delete:products",

      "create:admin",
      "view:admin",
      "update:admin",
      "delete:admin",

      "create:category",
      "update:category",
      "view:category",
      "delete:category",

      "view:order",
      "update:order",
      "delete:order",
  ],

  admin: [
      "view:comments",
      "create:comments",
      "update:comments",
      "delete:comments",

      "view:products",
      "create:products",
      "update:products",

      "view:admin",

      "create:category",
      "update:category",
      "view:category",

      "view:order",
  ],

  moderator: [],

  editor: [
      "view:products",
      "create:products",
      "update:products",

      "view:admin",

      "create:category",
      "update:category",
      "view:category",

      "view:order",
  ],
};

export default function hasPermission(user, permission) {
  return user.roles.some((role) => ROLES[role]?.includes(permission));
}