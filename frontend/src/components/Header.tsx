import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="flex w-full justify-center gap-x-4">
      <Link to="/">Home</Link>
      <Link to="/history">Event history</Link>
      <Link to="/new-event">Create new event</Link>
    </div>
  );
};
