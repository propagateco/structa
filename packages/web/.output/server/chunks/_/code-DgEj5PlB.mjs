import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useRouter, useSearch, Link } from "@tanstack/react-router";
import { B as Button } from "./router-C5BrmuEn.mjs";
import { C as Card } from "./card-bTrMqCgN.mjs";
import { a as authClient, I as Input } from "./auth-client-DWrpgCd6.mjs";
import { toast } from "sonner";
import { L as LoaderCircle } from "./loader-circle.mjs";
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
import "nanostores";
function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false
}) {
  const inputRefs = React.useRef(
    new Array(length).fill(null)
  );
  const handleChange = (index, e) => {
    const newValue = e.target.value;
    if (newValue.length > 1) return;
    const newOtp = value.split("");
    newOtp[index] = newValue;
    const otpValue = newOtp.join("");
    onChange(otpValue);
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData);
      inputRefs.current[Math.min(pastedData.length, length) - 1]?.focus();
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "flex gap-2 justify-center", children: Array.from({ length }).map((_, index) => /* @__PURE__ */ jsx(
    Input,
    {
      ref: (ref) => {
        inputRefs.current[index] = ref;
      },
      type: "text",
      inputMode: "numeric",
      pattern: "[0-9]*",
      maxLength: 1,
      value: value[index] || "",
      onChange: (e) => handleChange(index, e),
      onKeyDown: (e) => handleKeyDown(index, e),
      onPaste: handlePaste,
      disabled,
      className: "w-12 h-12 text-center text-xl font-bold",
      autoFocus: index === 0
    },
    `otp-${index}`
  )) });
}
function VerifyCodeComponent() {
  const router = useRouter();
  const search = useSearch({
    from: "/login/code"
  });
  const [otp, setOtp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const email = search.email || "";
  React.useEffect(() => {
    if (!email) {
      toast.error("Please enter your email first");
      router.navigate({
        to: "/login"
      });
    }
  }, [email, router]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message || "Invalid code");
          }
        }
      });
      if (result?.error) {
        toast.error(result.error.message || "Invalid code");
        return;
      }
      toast.success("Successfully logged in!");
      router.navigate({
        to: "/app"
      });
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Verify error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleResend = async () => {
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to resend code");
          }
        }
      });
      if (result?.error) {
        toast.error(result.error.message || "Failed to resend code");
        return;
      }
      toast.success("New code sent to your email!");
      setOtp("");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Resend error:", error);
    }
  };
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/app",
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message || "Google sign-in failed");
          }
        }
      });
    } catch (error) {
      toast.error("Google sign-in failed");
      console.error("Google sign-in error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };
  if (!email) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2", children: "Verify Your Email" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: [
        "Enter the 6-digit code sent to",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: email })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(OTPInput, { length: 6, value: otp, onChange: setOtp, disabled: isLoading }) }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full h-12 bg-teal-600 hover:bg-teal-700", disabled: isLoading || otp.length !== 6, children: isLoading ? "Verifying..." : "Verify & Sign In" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
      "Didn't receive a code?",
      " ",
      /* @__PURE__ */ jsx("button", { type: "button", className: "text-teal-600 hover:underline font-medium", onClick: handleResend, disabled: isLoading, children: "Resend code" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t border-gray-300 dark:border-gray-600" }) }),
        /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-sm", children: /* @__PURE__ */ jsx("span", { className: "px-2 bg-white dark:bg-gray-800 text-gray-500", children: "Or continue with" }) })
      ] }),
      /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", className: "w-full mt-4 h-12", onClick: handleGoogleSignIn, disabled: isGoogleLoading, children: [
        isGoogleLoading ? /* @__PURE__ */ jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxs("svg", { className: "mr-2 h-5 w-5", viewBox: "0 0 24 24", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx("title", { children: "Google" }),
          /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
          /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
          /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
          /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
        ] }),
        "Google"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx(Link, { to: "/login", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "text-sm text-gray-600 dark:text-gray-400", children: "← Back to login" }) }) })
  ] }) });
}
export {
  VerifyCodeComponent as component
};
