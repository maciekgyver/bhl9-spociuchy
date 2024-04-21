import { Header } from "./Header";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {}

export const MainLayout = ({}: MainLayoutProps) => {
  return (
    <div className="flex flex-col h-full min-h-screen items-center">
      <Header />
      <div className="flex flex-col flex-1 justify-center items-center container px-4">
        <Outlet />
      </div>
    </div>
  );
};
