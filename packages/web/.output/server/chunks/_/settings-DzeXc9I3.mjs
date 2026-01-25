import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { C as Card } from "./card-bTrMqCgN.mjs";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { B as Button, a as cn } from "./router-C5BrmuEn.mjs";
import { L as Label } from "./label-D2lyQyU0.mjs";
import { I as Input, a as authClient } from "./auth-client-DWrpgCd6.mjs";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import "@tanstack/react-router-devtools";
import "@tanstack/react-query";
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
import "@radix-ui/react-label";
import "nanostores";
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-400",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
function SettingsComponent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("profile");
  const [isLoading, setIsLoading] = React.useState(false);
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings saved successfully!");
    }, 1e3);
  };
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.navigate({
        to: "/"
      });
    } catch (error) {
      toast.error("Failed to log out");
      console.error("Logout error:", error);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: "Settings" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Manage your account settings and preferences" })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "profile", children: "Profile" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "account", children: "Account" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "preferences", children: "Preferences" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "profile", className: "mt-6", children: /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100 mb-6", children: "Profile Information" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "firstName", children: "First Name" }),
              /* @__PURE__ */ jsx(Input, { id: "firstName", placeholder: "John" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "lastName", children: "Last Name" }),
              /* @__PURE__ */ jsx(Input, { id: "lastName", placeholder: "Doe" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
            /* @__PURE__ */ jsx(Input, { id: "email", type: "email", disabled: true, value: "user@example.com" })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full bg-teal-600 hover:bg-teal-700", disabled: isLoading, children: isLoading ? "Saving..." : "Save Changes" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "account", className: "mt-6", children: /* @__PURE__ */ jsxs(Card, { className: "p-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100 mb-2", children: "Account Settings" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm", children: "Manage your account security and preferences" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Email Notifications" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Receive updates about your projects" })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => toast.info("Feature coming soon!"), children: "Disable" })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "destructive", className: "w-full", onClick: handleLogout, children: "Log Out" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "preferences", className: "mt-6", children: /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100 mb-6", children: "Preferences" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Dark Mode" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Switch between light and dark themes" })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => toast.info("Feature coming soon!"), children: "Toggle" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Language" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Select your preferred language" })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => toast.info("Feature coming soon!"), children: "Change" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  SettingsComponent as component
};
