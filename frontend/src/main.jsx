import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Tale from "./Tale.jsx";
import "./index.css";
import WelcomeForm from "./pages/WelcomeForm.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomeForm />,
    errorElement: <>Error Page</>,
  },
  {
    path: "/tale",
    element: <Tale />,
    errorElement: <>Error Page</>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
  // </React.StrictMode>
);
