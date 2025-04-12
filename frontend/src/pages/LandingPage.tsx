import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  navigate("/login");
  return <div>LandingPage</div>;
};

export default LandingPage;
