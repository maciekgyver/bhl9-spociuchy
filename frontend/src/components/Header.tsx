import { Link } from "react-router-dom";
import { HouseIcon } from "./icons/Home";
import { PropsWithChildren } from "react";
import { PlusIcon } from "./icons/Plus";
import { CalendarIcon } from "./icons/Calendar";

type HeaderLinkProps = PropsWithChildren<{
  to: string;
}>;

const HeaderLink = ({ to, children }: HeaderLinkProps) => {
  return (
    <Link
      to={to}
      className="border border-transparent hover:border-white py-1 sm:py-2 px-2 sm:px-4 rounded-xl transition-all text-center flex justify-center items-center gap-x-2 text-sm sm:text-md"
    >
      {children}
    </Link>
  );
};

export const Header = () => {
  return (
    <div className="flex w-full justify-center gap-x-2 sm:gap-x-4 py-2 border-b ">
      <HeaderLink to="/">
        <HouseIcon /> Home
      </HeaderLink>
      <HeaderLink to="/history">
        <CalendarIcon /> Event history
      </HeaderLink>
      <HeaderLink to="/new-event">
        <PlusIcon /> Create new event
      </HeaderLink>
    </div>
  );
};
