import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server.mjs";
import { l as loginMiddleware, a as authMiddleware } from "./server-DkMexlIi.mjs";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "../../index.mjs";
import "tiny-invariant";
import "seroval";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@tanstack/react-router";
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
const createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getAuth_createServerFn_handler = createServerRpc({
  id: "58b28b0f92992cf730bdfa37e3cb305b95f9fae3fdeee3d5258691d9a8c8d457",
  name: "getAuth",
  filename: "src/lib/auth-server.ts"
}, (opts, signal) => getAuth.__executeServer(opts, signal));
const getAuth = createServerFn().middleware([authMiddleware]).handler(getAuth_createServerFn_handler, async ({
  context
}) => {
  return context;
});
const getLoginAuth_createServerFn_handler = createServerRpc({
  id: "7b8af9c9a3dda2d57d8ad7e8566a18f9cdd2b644fbc321bdc07199f776507191",
  name: "getLoginAuth",
  filename: "src/lib/auth-server.ts"
}, (opts, signal) => getLoginAuth.__executeServer(opts, signal));
const getLoginAuth = createServerFn().middleware([loginMiddleware]).handler(getLoginAuth_createServerFn_handler, async ({
  context
}) => {
  return context;
});
export {
  getAuth_createServerFn_handler,
  getLoginAuth_createServerFn_handler
};
