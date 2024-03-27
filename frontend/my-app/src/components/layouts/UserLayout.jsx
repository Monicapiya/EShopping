import React from "react";
import SideMenu from "./SideMenu";

const UserLayout = ({ children }) => {
  // Define menu items for user settings
  const menuItems = [
    {
      name: "Profile",
      url: "/me/profile",
      icon: "fas fa-user",
    },
    {
      name: "Update Profile",
      url: "/me/update_profile",
      icon: "fas fa-user",
    },
   
    {
      name: "Update Password",
      url: "/me/update_password",
      icon: "fas fa-lock",
    },
  ];

  return (
    <div>
      {/* User settings title */}
      <div className="mt-2 mb-4 py-4">
        <h2 className="text-center fw-bolder">User Settings</h2>
      </div>

      {/* Container for user settings */}
      <div className="container">
        <div className="row justify-content-around">
          {/* Side menu for user settings */}
          <div className="col-12 col-lg-3">
            <SideMenu menuItems={menuItems} />
          </div>
          {/* User dashboard section */}
          <div className="col-12 col-lg-8 user-dashboard">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
