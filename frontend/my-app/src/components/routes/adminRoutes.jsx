import React from "react";
import { Route } from "react-router-dom";
import ProtectRoute from "../auth/ProtectedRoute";
import Panel from "../admin/Panel";
import NewProduct from "../admin/NewProduct";
import UpdateProduct from "../admin/UpdateProduct";
import UploadImages from "../admin/UploadImages";
import ProcessOrder from "../admin/ProcessOrder";
import ListUsers from "../admin/ListUsers";
import UpdateUser from "../admin/UpdateUser";
import ProductReview from "../admin/ProductReviews";
import Catalog from "../admin/Catalog";
import ProductsList from "../admin/ProductsList";

const adminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/Panel"
        element={
          <ProtectRoute admin={true}>
            <Panel />
          </ProtectRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectRoute admin={true}>
            <ProductsList />
          </ProtectRoute>
        }
      />

      <Route
        path="/admin/product/new"
        element={
          <ProtectRoute admin={true}>
            <NewProduct />
          </ProtectRoute>
        }
      />

      <Route
        path="/admin/products/:id"
        element={
          <ProtectRoute admin={true}>
            <UpdateProduct />
          </ProtectRoute>
        }
      />

      <Route
        path="/admin/products/:id/upload_images"
        element={
          <ProtectRoute admin={true}>
            <UploadImages />
          </ProtectRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectRoute admin={true}>
            <Catalog />
          </ProtectRoute>
        }
      />

      <Route
        path="/admin/orders/:id"
        element={
          <ProtectRoute admin={true}>
            <ProcessOrder />
          </ProtectRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectRoute admin={true}>
            <ListUsers />
          </ProtectRoute>
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          <ProtectRoute admin={true}>
            <UpdateUser />
          </ProtectRoute>
        }
      />


       <Route
        path="/admin/reviews"
        element={
          <ProtectRoute admin={true}>
            <ProductReview />
          </ProtectRoute>
        }
      />


    </>
  );
};

export default adminRoutes;
