import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {}

export const MainLayout = ({}: MainLayoutProps) => {
  return (
    <div className="flex flex-col h-full min-h-screen items-center">
      <Header />
      <div className="flex flex-1 justify-center items-center container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
