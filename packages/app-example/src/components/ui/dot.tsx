import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Info } from "lucide-react";

const dotVariants = cva("w-2.5 h-2.5 rounded-full", {
  variants: {
    type: {
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-error",
      info: "bg-info",
      default: "bg-ds-mono-200",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

interface DotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dotVariants> {
  children?: React.ReactNode;
}

const Dot: React.FC<DotProps> = ({ type, children, className, ...props }) => {
  return (
    <div className="flex items-center">
      <div className={dotVariants({ type })} {...props} />
      {children && (
        <div className={cn("ml-1.5 text-sm", className)}>{children}</div>
      )}
    </div>
  );
};

interface DetailedDotProps extends DotProps {
  detail?: string;
}

export const DetailedDot: React.FC<DetailedDotProps> = ({
  detail,
  ...dotProps
}) => {
  if (!detail) {
    return <Dot {...dotProps} />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-default">
            <Dot
              {...dotProps}
              className="hover:underline underline-offset-3 flex items-center gap-1.5"
            >
              {dotProps.children} <Info className="size-3.5" />
            </Dot>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            {detail.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const mutationDotVariants = cva("w-2.5 h-2.5 rounded-full", {
  variants: {
    state: {
      saving: "bg-warning animate-pulse",
      saved: "bg-info",
      publishing: "bg-success animate-pulse",
      published: "bg-success",
      changes: "bg-warning",
      error: "bg-error",
      idle: "bg-ds-mono-200",
    },
  },
  defaultVariants: {
    state: "idle",
  },
});

export type MutationState =
  | "saving"
  | "saved"
  | "publishing"
  | "published"
  | "changes"
  | "error"
  | "idle";

interface MutationDotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mutationDotVariants> {
  children?: React.ReactNode;
  textSize?: string;
}

export const MutationDot: React.FC<MutationDotProps> = ({
  state,
  children,
  className,
  textSize = "text-sm",
  ...props
}) => {
  // Map state to display text if no children provided
  const defaultText = React.useMemo(() => {
    switch (state) {
      case "saving":
        return "Saving";
      case "saved":
        return "Saved";
      case "publishing":
        return "Publishing";
      case "published":
        return "Published";
      case "changes":
        return "Changes";
      case "error":
        return "Error";
      default:
        return "";
    }
  }, [state]);

  return (
    <div className="flex items-center">
      <div className={mutationDotVariants({ state })} {...props} />
      {(children || defaultText) && (
        <div className={cn("ml-1.5", textSize, className)}>
          {children || defaultText}
        </div>
      )}
    </div>
  );
};

export default Dot;
