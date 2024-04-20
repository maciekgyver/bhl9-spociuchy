import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { NewEventPage } from "../pages/NewEventPage";
import { MainLayout } from "../components/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "new-event", element: <NewEventPage /> },
      { path: "", element: <HomePage /> },
    ],
  },
]);
