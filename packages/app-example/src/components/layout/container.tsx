import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  type = "default",
}: {
  children: React.ReactNode;
  type?: "narrow" | "wide" | "default";
}) {
  return (
    <div className="flex flex-col items-center h-full">
      {(() => {
        switch (type) {
          case "narrow":
            return (
              <NarrowResponsiveContainer>{children}</NarrowResponsiveContainer>
            );
          case "wide":
            return <ResponsiveContainer>{children}</ResponsiveContainer>;
          case "default":
            return <ResponsiveContainer>{children}</ResponsiveContainer>;
          default:
            return <ResponsiveContainer>{children}</ResponsiveContainer>;
        }
      })()}
    </div>
  );
}

export function ResponsiveContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full p-4 max-w-screen-xs sm:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-xl 2xl:max-w-screen-xl">
      {children}
    </div>
  );
}

export function NarrowResponsiveContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full p-4 max-w-screen-md">{children}</div>;
}
