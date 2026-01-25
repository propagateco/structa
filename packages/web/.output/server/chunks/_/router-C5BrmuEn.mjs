import { jsx, jsxs } from "react/jsx-runtime";
import { createRouter, createRootRoute, createFileRoute, lazyRouteComponent, Outlet, HeadContent, Scripts, Link } from "@tanstack/react-router";
import * as React from "react";
import { forwardRef, createElement } from "react";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, b as getServerFnById } from "./server.mjs";
import { q as auth, a as authMiddleware, l as loginMiddleware } from "./server-DkMexlIi.mjs";
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const Icon = forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode = [
  ["path", { d: "M4 5h16", key: "1tepv9" }],
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 19h16", key: "1djgab" }]
];
const Menu = createLucideIcon("menu", __iconNode);
const appCss = "/assets/app-BonwVEc_.css";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
function NavigationBar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" }
  ];
  return /* @__PURE__ */ jsx("nav", { className: "bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold", children: "S" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900 dark:text-gray-100", children: "Structa" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-8", children: [
        navLinks.map((link) => /* @__PURE__ */ jsx(
          Link,
          {
            to: link.to,
            className: "text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors",
            children: link.name
          },
          link.to
        )),
        /* @__PURE__ */ jsx(Link, { to: "/login", children: /* @__PURE__ */ jsx(Button, { className: "bg-teal-600 hover:bg-teal-700", children: "Get Started" }) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400",
          onClick: () => setIsOpen(!isOpen),
          children: /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
        }
      )
    ] }),
    isOpen && /* @__PURE__ */ jsx("div", { className: "md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-4 space-y-4", children: [
      navLinks.map((link) => /* @__PURE__ */ jsx(
        Link,
        {
          to: link.to,
          className: "block py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium",
          onClick: () => setIsOpen(false),
          children: link.name
        },
        link.to
      )),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/login",
          className: "block",
          onClick: () => setIsOpen(false),
          children: /* @__PURE__ */ jsx(Button, { className: "w-full bg-teal-600 hover:bg-teal-700", children: "Get Started" })
        }
      )
    ] }) })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-4 gap-8 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-4", children: "Product" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400",
              children: "Features"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400",
              children: "Pricing"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-4", children: "Resources" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/about",
            className: "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400",
            children: "Documentation"
          }
        ) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-4", children: "Company" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/about",
            className: "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400",
            children: "About Us"
          }
        ) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-4", children: "Legal" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              to: "/about",
              className: "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400",
              children: "Privacy Policy"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              to: "/about",
              className: "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400",
              children: "Terms of Service"
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 pt-8 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-600 dark:text-gray-400 text-sm", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Structa. All rights reserved."
    ] }) })
  ] }) });
}
const Route$7 = createRootRoute({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  component: RootComponent
});
function RootComponent() {
  const [queryClient] = React.useState(() => new QueryClient());
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(Outlet, {}) }) });
}
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(NavigationBar, {}),
      /* @__PURE__ */ jsx("div", { className: "flex-1", children }),
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx(Toaster, { position: "top-center", richColors: true }),
      /* @__PURE__ */ jsx(TanStackRouterDevtools, { position: "bottom-right" }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$5 = () => import("./about-Bu5NFYIF.mjs");
const Route$6 = createFileRoute("/about")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-DZxgHwpe.mjs");
const Route$5 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./index-CSDti6k-.mjs");
const Route$4 = createFileRoute("/login/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./code-DgEj5PlB.mjs");
const Route$3 = createFileRoute("/login/code")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const createSsrRpc = (functionId, importer) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    const serverFn = await getServerFnById(functionId);
    return serverFn(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getAuth = createServerFn().middleware([authMiddleware]).handler(createSsrRpc("58b28b0f92992cf730bdfa37e3cb305b95f9fae3fdeee3d5258691d9a8c8d457"));
createServerFn().middleware([loginMiddleware]).handler(createSsrRpc("7b8af9c9a3dda2d57d8ad7e8566a18f9cdd2b644fbc321bdc07199f776507191"));
const $$splitComponentImporter$1 = () => import("./index-BxkWjw5U.mjs");
const Route$2 = createFileRoute("/_auth/app/")({
  beforeLoad: async () => {
    const context = await getAuth();
    return context;
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const Route$1 = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return await auth.handler(request);
      },
      POST: async ({ request }) => {
        return await auth.handler(request);
      },
      PUT: async ({ request }) => {
        return await auth.handler(request);
      },
      DELETE: async ({ request }) => {
        return await auth.handler(request);
      },
      PATCH: async ({ request }) => {
        return await auth.handler(request);
      },
      HEAD: async ({ request }) => {
        return await auth.handler(request);
      },
      OPTIONS: async ({ request }) => {
        return await auth.handler(request);
      }
    }
  }
});
const $$splitComponentImporter = () => import("./settings-DzeXc9I3.mjs");
const Route = createFileRoute("/_auth/app/settings")({
  beforeLoad: async () => {
    const context = await getAuth();
    return context;
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const AboutRoute = Route$6.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$7
});
const IndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$7
});
const LoginIndexRoute = Route$4.update({
  id: "/login/",
  path: "/login/",
  getParentRoute: () => Route$7
});
const LoginCodeRoute = Route$3.update({
  id: "/login/code",
  path: "/login/code",
  getParentRoute: () => Route$7
});
const AuthAppIndexRoute = Route$2.update({
  id: "/_auth/app/",
  path: "/app/",
  getParentRoute: () => Route$7
});
const ApiAuthSplatRoute = Route$1.update({
  id: "/api/auth/$",
  path: "/api/auth/$",
  getParentRoute: () => Route$7
});
const AuthAppSettingsRoute = Route.update({
  id: "/_auth/app/settings",
  path: "/app/settings",
  getParentRoute: () => Route$7
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  LoginCodeRoute,
  LoginIndexRoute,
  AuthAppSettingsRoute,
  ApiAuthSplatRoute,
  AuthAppIndexRoute
};
const routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultErrorComponent: (err) => /* @__PURE__ */ jsx("p", { children: err.error.stack }),
    defaultNotFoundComponent: () => /* @__PURE__ */ jsx("p", { children: "not found" }),
    scrollRestoration: true
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
const routerC5BrmuEn = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  B: Button,
  c: cn,
  r: router
});
export {
  Button as B,
  cn as a,
  createLucideIcon as c,
  routerC5BrmuEn as r
};
