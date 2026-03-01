import { createBrowserRouter } from "react-router-dom";
import { mainRoutes } from "./mainRoutes";
import { adminRoutes } from "./adminRoutes";
import { commonRoutes } from "./commonRoutes";

export const router = createBrowserRouter([
  mainRoutes,
  adminRoutes,
  commonRoutes,
]);
