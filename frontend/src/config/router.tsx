import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { NewEventPage } from "../pages/NewEventPage";
import { MainLayout } from "../components/MainLayout";
import { EventHistoryPage } from "../pages/EventHistoryPage";
import { EventPage } from "../pages/EventPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "new-event", element: <NewEventPage /> },
      { path: "history", element: <EventHistoryPage /> },
      { path: "event/:eventId", element: <EventPage /> },
    ],
  },
]);
