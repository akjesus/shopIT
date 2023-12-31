const express = require("express");
const adminRouter = express.Router();

const {
  allUsers,
  userDetails,
  updateUserProfile,
  deleteUser,
  getAllOrders,
  processOrder,
  deleteOrder,
} = require("../controllers/adminController");
const {
  createProduct,
  updateOneProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  isAuthenticated,
  authorisedRoles,
} = require("../middlewares/authMiddleware");

adminRouter.get(
  "/admin/users",
  isAuthenticated,
  authorisedRoles("admin"),
  allUsers
);
adminRouter
  .route("/admin/users/:id")
  .get(isAuthenticated, authorisedRoles("admin"), userDetails)
  .patch(isAuthenticated, authorisedRoles("admin"), updateUserProfile)
  .delete(isAuthenticated, authorisedRoles("admin"), deleteUser);

adminRouter.patch(
  "/admin/products/:id",
  isAuthenticated,
  authorisedRoles("admin"),
  updateOneProduct
);
adminRouter.delete(
  "/admin/products/:id",
  isAuthenticated,
  authorisedRoles("admin"),
  deleteProduct
);
adminRouter.post(
  "/admin/products/new",
  isAuthenticated,
  authorisedRoles("admin"),
  createProduct
);

adminRouter.get(
  "/admin/orders",
  isAuthenticated,
  authorisedRoles("admin"),
  getAllOrders
);

adminRouter
  .route("/admin/orders/:id")
  .patch(isAuthenticated, authorisedRoles("admin"), processOrder)
  .delete(isAuthenticated, authorisedRoles("admin"), deleteOrder);

module.exports = adminRouter;
