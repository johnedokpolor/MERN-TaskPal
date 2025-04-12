import React from "react";
import { Outlet } from "react-router-dom";

const PrivateRoute: React.FC<{ allowedRoles: object }> = ({ allowedRoles }) => {
  return <Outlet />;
};

export default PrivateRoute;
