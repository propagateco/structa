import { j as jsxRuntimeExports, r as reactExports } from "../_chunks/_libs/react.mjs";
function Counter() {
  const [count, setCount] = reactExports.useState(0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      className: "increment",
      onClick: () => setCount(count + 1),
      type: "button",
      children: [
        "Clicks: ",
        count
      ]
    }
  );
}
function RouteComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "About" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Counter, {})
  ] });
}
export {
  RouteComponent as component
};
