import ErrorPage from "@/pages/ErrorPage";
import Login from "../pages/Login/Login";

export const commonRoutes = {
    path: "/",
    children: [
        {
            path: "login",
            element: <Login />
        },
        {
            path: "*",
            element: <ErrorPage />
        }
    ]
}