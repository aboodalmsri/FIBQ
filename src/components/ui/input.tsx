import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-lg border bg-card px-4 py-3 text-base font-body transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent shadow-sm",
        hero:
          "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-2 focus-visible:ring-primary-foreground/30 focus-visible:border-transparent backdrop-blur-sm",
        search:
          "border-border bg-card shadow-card focus-visible:ring-2 focus-visible:ring-secondary focus-visible:border-transparent pl-12",
        gold:
          "border-secondary/30 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:border-secondary shadow-sm",
      },
      inputSize: {
        default: "h-11",
        sm: "h-9 text-sm px-3 py-2",
        lg: "h-14 text-lg px-5 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
