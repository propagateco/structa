import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { B as Button } from "./router-C5BrmuEn.mjs";
import "react";
import "@tanstack/react-router-devtools";
import "@tanstack/react-query";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "./server.mjs";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "../../index.mjs";
import "tiny-invariant";
import "seroval";
import "@tanstack/react-router/ssr/server";
import "./server-DkMexlIi.mjs";
import "sst";
import "@better-auth/utils/random";
import "@better-auth/utils/hex";
import "@better-auth/utils";
import "@better-auth/utils/hash";
import "zod";
import "@noble/hashes/hkdf.js";
import "@noble/hashes/sha2.js";
import "jose";
import "@better-auth/utils/base64";
import "@better-auth/utils/binary";
import "@better-auth/utils/hmac";
import "kysely";
import "@noble/ciphers/chacha.js";
import "@noble/ciphers/utils.js";
import "@better-fetch/fetch";
import "jose/errors";
import "@noble/hashes/scrypt.js";
import "@noble/hashes/utils.js";
import "drizzle-orm";
import "@neondatabase/serverless";
import "drizzle-orm/neon-serverless";
import "ws";
import "drizzle-orm/pg-core";
import "@react-email/components";
import "@smithy/core";
import "@smithy/core/schema";
import "@aws-sdk/core";
import "path";
import "os";
import "node:fs/promises";
import "buffer";
import "crypto";
import "@aws-sdk/core/protocols";
import "http";
import "https";
import "stream";
import "process";
import "@aws-sdk/core/client";
import "node:fs";
import "@aws/lambda-invoke-store";
function RouteComponent() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800", children: [
    /* @__PURE__ */ jsxs("section", { className: "container mx-auto px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-5xl md:text-7xl font-bold text-teal-600 dark:text-teal-400 mb-6", children: "Renovate Smarter" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto", children: "Your AI-powered renovation assistant. Plan, visualize, and execute your home projects with expert guidance." }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 justify-center", children: [
        /* @__PURE__ */ jsx(Link, { to: "/login", children: /* @__PURE__ */ jsx(Button, { size: "lg", className: "gap-2 bg-teal-600 hover:bg-teal-700", children: "Get Started →" }) }),
        /* @__PURE__ */ jsx(Link, { to: "/about", children: /* @__PURE__ */ jsx(Button, { size: "lg", variant: "outline", className: "border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-gray-800", children: "Learn More" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "container mx-auto px-4 py-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12", children: "Everything You Need" }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsx(FeatureCard, { icon: "🏠", title: "Smart Planning", description: "AI-powered floor plan analysis and renovation suggestions" }),
        /* @__PURE__ */ jsx(FeatureCard, { icon: "📐", title: "Precise Estimates", description: "Get accurate cost and timeline estimates for your projects" }),
        /* @__PURE__ */ jsx(FeatureCard, { icon: "🤝", title: "Expert Guidance", description: "Consult with The Clerk for step-by-step renovation advice" })
      ] })
    ] })
  ] });
}
function FeatureCard({
  icon,
  title,
  description
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow", children: [
    /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: icon }),
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: description })
  ] });
}
export {
  RouteComponent as component
};
