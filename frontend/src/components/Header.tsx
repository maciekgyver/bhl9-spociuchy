import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="flex w-full justify-center gap-x-4">
      <Link to="/">home</Link>
      <Link to="/new-event">create new event</Link>
    </div>
  );
};
