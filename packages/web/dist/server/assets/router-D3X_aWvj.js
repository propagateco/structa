import { jsx, jsxs } from "react/jsx-runtime";
import { createRootRoute, Outlet, HeadContent, Link, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
const appCss = "/assets/app-BQjolM1z.css";
const Route$2 = createRootRoute({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  component: RootComponent
});
function RootComponent() {
  return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: "Index" }),
        /* @__PURE__ */ jsx(Link, { to: "/about", children: "About" })
      ] }),
      children,
      /* @__PURE__ */ jsx(TanStackRouterDevtools, { position: "bottom-right" }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$1 = () => import("./about-Bu5NFYIF.js");
const Route$1 = createFileRoute("/about")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-C0HCsTYT.js");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const AboutRoute = Route$1.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$2
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$2
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute
};
const routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultErrorComponent: (err) => /* @__PURE__ */ jsx("p", { children: err.error.stack }),
    defaultNotFoundComponent: () => /* @__PURE__ */ jsx("p", { children: "not found" }),
    scrollRestoration: true
  });
  return router;
}
export {
  getRouter
};
