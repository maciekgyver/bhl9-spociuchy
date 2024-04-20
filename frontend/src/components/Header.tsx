import { Link } from "react-router-dom";

type HeaderLinkProps = {
  to: string;
  children: string;
};

const HeaderLink = ({ to, children }: HeaderLinkProps) => {
  return (
    <Link
      to={to}
      className="border border-transparent hover:border-white py-2 px-4 rounded-xl transition-all"
    >
      {children}
    </Link>
  );
};

export const Header = () => {
  return (
    <div className="flex w-full justify-center gap-x-4 py-2 border-b ">
      <HeaderLink to="/">Home</HeaderLink>
      <HeaderLink to="/history">Event history</HeaderLink>
      <HeaderLink to="/new-event">Create new event</HeaderLink>
    </div>
  );
};
