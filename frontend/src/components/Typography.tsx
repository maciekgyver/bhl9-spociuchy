import clsx from "clsx";
import { ReactNode } from "react";

type TypographyProps = {
  children: ReactNode;
  className?: string;
};

export const MainHeading = ({ children, className }: TypographyProps) => {
  return (
    <h1 className={clsx(className, "text-4xl sm:text-5xl font-bold")}>
      {children}
    </h1>
  );
};

export const SubHeading = ({ children, className }: TypographyProps) => {
  return (
    <h2 className={clsx(className, "text-3xl sm:text-4xl font-semibold")}>
      {children}
    </h2>
  );
};

export const Paragraph = ({ children, className }: TypographyProps) => {
  return <p className={clsx(className, "text-lg sm:text-xl")}>{children}</p>;
};
