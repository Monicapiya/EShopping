import React from "react";
import SideMenu from "./SideMenu";

const AdminLayout = ({ children }) => {
  // Define menu items for the side menu
  const menuItems = [
    {
      name: "Panel",
      url: "/admin/Panel",
      icon: "fas fa-tachometer-alt",
    },
    {
      name: "New Product",
      url: "/admin/product/new",
      icon: "fas fa-plus",
    },
    {
      name: "Products",
      url: "/admin/products",
      icon: "fab fa-product-hunt",
    },
    {
      name: "Order",
      url: "/admin/orders",
      icon: "fas fa-receipt",
    },
    {
      name: "Users",
      url: "/admin/users",
      icon: "fas fa-user",
    },
    {
      name: "Reviews",
      url: "/admin/reviews",
      icon: "fas fa-star",
    },
  ];

  return (
    <div>
      <div className="mt-2 mb-4 py-4">
        <h2 className="text-center fw-bolder">Admin Panel</h2>
      </div>
      <div className="row justify-content-around">
        <div className="col-12 col-lg-3">
          {/* Render the side menu */}
          <SideMenu menuItems={menuItems} />
        </div>
        <div className="col-12 col-lg-8 user-dashboard">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
