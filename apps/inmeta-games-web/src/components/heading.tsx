import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const headingVariants = cva("font-semibold leading-none tracking-tight", {
  variants: {
    size: {
      h1: "text-4xl",
      h2: "text-3xl",
      h3: "text-2xl",
      h4: "text-xl",
      h5: "text-lg",
      h6: "text-base",
    },
  },
  defaultVariants: {
    size: "h1",
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

const Heading = React.forwardRef<HTMLHeadElement, HeadingProps>(
  ({ className, size = "h1", ...props }, ref) => {
    const Comp = size as React.ElementType;

    return (
      <Comp
        className={cn(headingVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Heading.displayName = "Heading";

export default Heading;
