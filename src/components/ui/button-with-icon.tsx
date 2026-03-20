import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonWithIconProps extends ButtonProps {
  label?: React.ReactNode;
  iconClassName?: string;
}

const ButtonWithIconDemo = React.forwardRef<HTMLButtonElement, ButtonWithIconProps>(
  ({ className, label = "Let's Collaborate", children, iconClassName, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer",
          className
        )}
        {...props}
      >
        <span className="relative z-10 transition-all duration-500">
          {children || label}
        </span>
        <div className={cn(
          "absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45",
          iconClassName
        )}>
          <ArrowUpRight size={16} />
        </div>
      </Button>
    );
  }
);

ButtonWithIconDemo.displayName = "ButtonWithIconDemo";

export default ButtonWithIconDemo;
