
// This file is no longer used as the main entry point
// The Dashboard component now serves as the homepage
// This is kept for compatibility but redirects to Dashboard

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
