import React from "react";
import { cn } from "@/lib/utils";

interface StripeIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

const StripeIcon = React.forwardRef<HTMLDivElement, StripeIconProps>(
  (props, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center object-contain overflow-hidden",
          props.className,
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 400"
          xmlSpace="preserve"
        >
          <path
            style={{
              fillRule: "evenodd",
              clipRule: "evenodd",
              fill: "#635bff",
            }}
            d="M0 0h400v400H0z"
          />
          <path
            d="M184.4 155.5c0-9.4 7.7-13.1 20.5-13.1 18.4 0 41.6 5.6 60 15.5v-56.8C244.8 93.1 225 90 205 90c-49.1 0-81.7 25.6-81.7 68.4 0 66.7 91.9 56.1 91.9 84.9 0 11.1-9.7 14.7-23.2 14.7-20.1 0-45.7-8.2-66-19.3v57.5c22.5 9.7 45.2 13.8 66 13.8 50.3 0 84.9-24.9 84.9-68.2-.4-72-92.5-59.2-92.5-86.3z"
            style={{ fillRule: "evenodd", clipRule: "evenodd", fill: "#fff" }}
          />
        </svg>
      </div>
    );
  },
);

StripeIcon.displayName = "StripeIcon";

interface AppleIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

const AppleIcon = React.forwardRef<HTMLDivElement, AppleIconProps>(
  (props, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center object-contain overflow-hidden",
          props.className,
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 400"
          xmlSpace="preserve"
        >
          <path
            style={{
              fillRule: "evenodd",
              clipRule: "evenodd",
              fill: "#D9EBFF",
            }}
            d="M0 0h400v400H0z"
          />
          <g transform="translate(200, 200) scale(8)">
            <path
              d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
              fill="#007AFF"
              transform="translate(-12, -12)"
            />
          </g>
        </svg>
      </div>
    );
  },
);

AppleIcon.displayName = "AppleIcon";

export { StripeIcon, AppleIcon };
