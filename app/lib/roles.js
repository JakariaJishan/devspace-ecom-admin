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
      "create:category"
  ],

  admin: [
      "view:comments",
      "create:comments",
      "update:comments",
      "delete:comments",

      "view:products",
      "create:products",
      "update:products",
  ],

  moderator: [],

  editor: [
      "view:products",
      "create:products",
      "update:products",
  ],
};

export default function hasPermission(user, permission) {
  return user.roles.some((role) => ROLES[role]?.includes(permission));
}