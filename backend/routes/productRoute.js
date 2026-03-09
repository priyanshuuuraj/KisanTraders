import express from "express";
import {
  addProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  upload.array("productImg", 5), 
  addProduct
);

router.get("/getallproducts", getAllProduct);

router.delete(
  "/delete/:productId",
  isAuthenticated,
  isAdmin,
  deleteProduct
);

router.put(
  "/update/:productId",
  isAuthenticated,
  isAdmin,
  upload.array("productImg", 5),  
  updateProduct
);

export default router;