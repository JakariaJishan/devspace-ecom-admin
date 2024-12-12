const ROLES = {
  admin: [
    "view:comments",
    "create:comments",
    "update:comments",
    "delete:comments",
  ],
  moderator: ["view:comments", "create:comments", "delete:comments"],
  user: ["view:comments", "create:comments"],
};

export default function hasPermission(user, permission) {
  return user.roles.some((role) => ROLES[role]?.includes(permission));
}