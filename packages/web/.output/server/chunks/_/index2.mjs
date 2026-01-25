import { exec } from "child_process";
import { promisify } from "util";
import { setCredentialFeature } from "@aws-sdk/core/client";
import { e as externalDataInterceptor } from "./externalDataInterceptor.mjs";
import { C as CredentialsProviderError, k as getProfileName } from "./server-DkMexlIi.mjs";
import { p as parseKnownFiles } from "./parseKnownFiles.mjs";
import "./getSSOTokenFromFile.mjs";
import "fs/promises";
import "crypto";
import "path";
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
import "../../index.mjs";
import "drizzle-orm";
import "@neondatabase/serverless";
import "drizzle-orm/neon-serverless";
import "ws";
import "drizzle-orm/pg-core";
import "@react-email/components";
import "react/jsx-runtime";
import "@smithy/core";
import "@smithy/core/schema";
import "@aws-sdk/core";
import "os";
import "node:fs/promises";
import "buffer";
import "@aws-sdk/core/protocols";
import "http";
import "https";
import "stream";
import "process";
import "node:fs";
import "@aws/lambda-invoke-store";
import "./server.mjs";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "tiny-invariant";
import "seroval";
import "@tanstack/react-router/ssr/server";
const getValidatedProcessCredentials = (profileName, data, profiles) => {
  if (data.Version !== 1) {
    throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
  }
  if (data.AccessKeyId === void 0 || data.SecretAccessKey === void 0) {
    throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
  }
  if (data.Expiration) {
    const currentTime = /* @__PURE__ */ new Date();
    const expireTime = new Date(data.Expiration);
    if (expireTime < currentTime) {
      throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
    }
  }
  let accountId = data.AccountId;
  if (!accountId && profiles?.[profileName]?.aws_account_id) {
    accountId = profiles[profileName].aws_account_id;
  }
  const credentials = {
    accessKeyId: data.AccessKeyId,
    secretAccessKey: data.SecretAccessKey,
    ...data.SessionToken && { sessionToken: data.SessionToken },
    ...data.Expiration && { expiration: new Date(data.Expiration) },
    ...data.CredentialScope && { credentialScope: data.CredentialScope },
    ...accountId && { accountId }
  };
  setCredentialFeature(credentials, "CREDENTIALS_PROCESS", "w");
  return credentials;
};
const resolveProcessCredentials = async (profileName, profiles, logger) => {
  const profile = profiles[profileName];
  if (profiles[profileName]) {
    const credentialProcess = profile["credential_process"];
    if (credentialProcess !== void 0) {
      const execPromise = promisify(externalDataInterceptor?.getTokenRecord?.().exec ?? exec);
      try {
        const { stdout } = await execPromise(credentialProcess);
        let data;
        try {
          data = JSON.parse(stdout.trim());
        } catch {
          throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
        }
        return getValidatedProcessCredentials(profileName, data, profiles);
      } catch (error) {
        throw new CredentialsProviderError(error.message, { logger });
      }
    } else {
      throw new CredentialsProviderError(`Profile ${profileName} did not contain credential_process.`, { logger });
    }
  } else {
    throw new CredentialsProviderError(`Profile ${profileName} could not be found in shared credentials file.`, {
      logger
    });
  }
};
const fromProcess = (init = {}) => async ({ callerClientConfig } = {}) => {
  init.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
  const profiles = await parseKnownFiles(init);
  return resolveProcessCredentials(getProfileName({
    profile: init.profile ?? callerClientConfig?.profile
  }), profiles, init.logger);
};
export {
  fromProcess
};
