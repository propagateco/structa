import { redirect } from "@tanstack/react-router";
import { Resource } from "sst";
import { createRandomStringGenerator } from "@better-auth/utils/random";
import { hex } from "@better-auth/utils/hex";
import { getWebcryptoSubtle } from "@better-auth/utils";
import { createHash as createHash$1 } from "@better-auth/utils/hash";
import * as z$1 from "zod";
import { ZodObject, ZodOptional } from "zod";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { decodeJwt, decodeProtectedHeader, jwtVerify, createRemoteJWKSet, importJWK, jwtDecrypt, calculateJwkThumbprint, base64url, EncryptJWT, SignJWT } from "jose";
import { base64Url, base64 } from "@better-auth/utils/base64";
import { binary } from "@better-auth/utils/binary";
import { createHMAC } from "@better-auth/utils/hmac";
import { sql as sql$1, SqliteDialect, MysqlDialect, PostgresDialect, MssqlDialect, Kysely } from "kysely";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { hexToBytes, managedNonce, utf8ToBytes, bytesToHex } from "@noble/ciphers/utils.js";
import { betterFetch } from "@better-fetch/fetch";
import { JWTExpired } from "jose/errors";
import { scryptAsync } from "@noble/hashes/scrypt.js";
import { hexToBytes as hexToBytes$1 } from "@noble/hashes/utils.js";
import { a as addRoute, c as createRouter, f as findRoute, b as findAllRoutes } from "../../index.mjs";
import { count, desc, asc, inArray, notInArray, like, lt, lte, ne, gt, gte, eq, and, or, sql, relations } from "drizzle-orm";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import { pgTable, text, timestamp, boolean, index as index$1 } from "drizzle-orm/pg-core";
import { render, Html, Head, Preview, Body, Container, Img, Heading, Text, Section, Hr, Link } from "@react-email/components";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { normalizeProvider as normalizeProvider$1, setFeature as setFeature$1, getHttpAuthSchemeEndpointRuleSetPlugin, DefaultIdentityProviderConfig, getHttpSigningPlugin } from "@smithy/core";
import { NormalizedSchema, getSchemaSerdePlugin, TypeRegistry } from "@smithy/core/schema";
import { setFeature, resolveAwsSdkSigV4Config, resolveAwsSdkSigV4AConfig, AwsSdkSigV4Signer, AwsSdkSigV4ASigner, emitWarningIfUnsupportedVersion as emitWarningIfUnsupportedVersion$1, NODE_SIGV4A_CONFIG_OPTIONS, NODE_AUTH_SCHEME_PREFERENCE_OPTIONS } from "@aws-sdk/core";
import { sep, join } from "path";
import { homedir, platform, release } from "os";
import { readFile as readFile$1 } from "node:fs/promises";
import { Buffer as Buffer$1 } from "buffer";
import crypto$1, { createHmac, createHash } from "crypto";
import { AwsRestJsonProtocol } from "@aws-sdk/core/protocols";
import { Agent as Agent$1, request as request$1 } from "http";
import { Agent, request } from "https";
import { Readable, Writable } from "stream";
import { versions, env as env$1 } from "process";
import { setCredentialFeature } from "@aws-sdk/core/client";
import { ReadStream, lstatSync, fstatSync } from "node:fs";
import { InvokeStore } from "@aws/lambda-invoke-store";
import { H as HEADERS, S as StartServer, c as createStartHandler, d as defaultStreamHandler, g as getResponse$2, r as requestHandler, s as setCookie } from "./server.mjs";
import { attachRouterServerSsrUtils } from "@tanstack/router-core/ssr/server";
function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p2, c2) => _defu(p2, c2, "", merger), {})
  );
}
const defu = createDefu();
const getHttpHandlerExtensionConfiguration = (runtimeConfig) => {
  return {
    setHttpHandler(handler) {
      runtimeConfig.httpHandler = handler;
    },
    httpHandler() {
      return runtimeConfig.httpHandler;
    },
    updateHttpClientConfig(key, value) {
      runtimeConfig.httpHandler?.updateHttpClientConfig(key, value);
    },
    httpHandlerConfigs() {
      return runtimeConfig.httpHandler.httpHandlerConfigs();
    }
  };
};
const resolveHttpHandlerRuntimeConfig = (httpHandlerExtensionConfiguration) => {
  return {
    httpHandler: httpHandlerExtensionConfiguration.httpHandler()
  };
};
var EndpointURLScheme;
(function(EndpointURLScheme2) {
  EndpointURLScheme2["HTTP"] = "http";
  EndpointURLScheme2["HTTPS"] = "https";
})(EndpointURLScheme || (EndpointURLScheme = {}));
var AlgorithmId;
(function(AlgorithmId2) {
  AlgorithmId2["MD5"] = "md5";
  AlgorithmId2["CRC32"] = "crc32";
  AlgorithmId2["CRC32C"] = "crc32c";
  AlgorithmId2["SHA1"] = "sha1";
  AlgorithmId2["SHA256"] = "sha256";
})(AlgorithmId || (AlgorithmId = {}));
const SMITHY_CONTEXT_KEY = "__smithy_context";
var IniSectionType;
(function(IniSectionType2) {
  IniSectionType2["PROFILE"] = "profile";
  IniSectionType2["SSO_SESSION"] = "sso-session";
  IniSectionType2["SERVICES"] = "services";
})(IniSectionType || (IniSectionType = {}));
class HttpRequest {
  method;
  protocol;
  hostname;
  port;
  path;
  query;
  headers;
  username;
  password;
  fragment;
  body;
  constructor(options) {
    this.method = options.method || "GET";
    this.hostname = options.hostname || "localhost";
    this.port = options.port;
    this.query = options.query || {};
    this.headers = options.headers || {};
    this.body = options.body;
    this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
    this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
    this.username = options.username;
    this.password = options.password;
    this.fragment = options.fragment;
  }
  static clone(request2) {
    const cloned = new HttpRequest({
      ...request2,
      headers: { ...request2.headers }
    });
    if (cloned.query) {
      cloned.query = cloneQuery(cloned.query);
    }
    return cloned;
  }
  static isInstance(request2) {
    if (!request2) {
      return false;
    }
    const req = request2;
    return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
  }
  clone() {
    return HttpRequest.clone(this);
  }
}
function cloneQuery(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    const param = query[paramName];
    return {
      ...carry,
      [paramName]: Array.isArray(param) ? [...param] : param
    };
  }, {});
}
class HttpResponse {
  statusCode;
  reason;
  headers;
  body;
  constructor(options) {
    this.statusCode = options.statusCode;
    this.reason = options.reason;
    this.headers = options.headers || {};
    this.body = options.body;
  }
  static isInstance(response) {
    if (!response)
      return false;
    const resp = response;
    return typeof resp.statusCode === "number" && typeof resp.headers === "object";
  }
}
function resolveHostHeaderConfig(input) {
  return input;
}
const hostHeaderMiddleware = (options) => (next) => async (args) => {
  if (!HttpRequest.isInstance(args.request))
    return next(args);
  const { request: request2 } = args;
  const { handlerProtocol = "" } = options.requestHandler.metadata || {};
  if (handlerProtocol.indexOf("h2") >= 0 && !request2.headers[":authority"]) {
    delete request2.headers["host"];
    request2.headers[":authority"] = request2.hostname + (request2.port ? ":" + request2.port : "");
  } else if (!request2.headers["host"]) {
    let host = request2.hostname;
    if (request2.port != null)
      host += `:${request2.port}`;
    request2.headers["host"] = host;
  }
  return next(args);
};
const hostHeaderMiddlewareOptions = {
  name: "hostHeaderMiddleware",
  step: "build",
  priority: "low",
  tags: ["HOST"],
  override: true
};
const getHostHeaderPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
  }
});
const loggerMiddleware = () => (next, context) => async (args) => {
  try {
    const response = await next(args);
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog ?? context.outputFilterSensitiveLog;
    const { $metadata, ...outputWithoutMetadata } = response.output;
    logger2?.info?.({
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      output: outputFilterSensitiveLog(outputWithoutMetadata),
      metadata: $metadata
    });
    return response;
  } catch (error2) {
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    logger2?.error?.({
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      error: error2,
      metadata: error2.$metadata
    });
    throw error2;
  }
};
const loggerMiddlewareOptions = {
  name: "loggerMiddleware",
  tags: ["LOGGER"],
  step: "initialize",
  override: true
};
const getLoggerPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
  }
});
const recursionDetectionMiddlewareOptions = {
  step: "build",
  tags: ["RECURSION_DETECTION"],
  name: "recursionDetectionMiddleware",
  override: true,
  priority: "low"
};
const TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
const ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
const ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
const recursionDetectionMiddleware = () => (next) => async (args) => {
  const { request: request2 } = args;
  if (!HttpRequest.isInstance(request2)) {
    return next(args);
  }
  const traceIdHeader = Object.keys(request2.headers ?? {}).find((h2) => h2.toLowerCase() === TRACE_ID_HEADER_NAME.toLowerCase()) ?? TRACE_ID_HEADER_NAME;
  if (request2.headers.hasOwnProperty(traceIdHeader)) {
    return next(args);
  }
  const functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
  const traceIdFromEnv = process.env[ENV_TRACE_ID];
  const invokeStore = await InvokeStore.getInstanceAsync();
  const traceIdFromInvokeStore = invokeStore?.getXRayTraceId();
  const traceId = traceIdFromInvokeStore ?? traceIdFromEnv;
  const nonEmptyString = (str) => typeof str === "string" && str.length > 0;
  if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
    request2.headers[TRACE_ID_HEADER_NAME] = traceId;
  }
  return next({
    ...args,
    request: request2
  });
};
const getRecursionDetectionPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(recursionDetectionMiddleware(), recursionDetectionMiddlewareOptions);
  }
});
const DEFAULT_UA_APP_ID = void 0;
function isValidUserAgentAppId(appId) {
  if (appId === void 0) {
    return true;
  }
  return typeof appId === "string" && appId.length <= 50;
}
function resolveUserAgentConfig(input) {
  const normalizedAppIdProvider = normalizeProvider$1(input.userAgentAppId ?? DEFAULT_UA_APP_ID);
  const { customUserAgent } = input;
  return Object.assign(input, {
    customUserAgent: typeof customUserAgent === "string" ? [[customUserAgent]] : customUserAgent,
    userAgentAppId: async () => {
      const appId = await normalizedAppIdProvider();
      if (!isValidUserAgentAppId(appId)) {
        const logger2 = input.logger?.constructor?.name === "NoOpLogger" || !input.logger ? console : input.logger;
        if (typeof appId !== "string") {
          logger2?.warn("userAgentAppId must be a string or undefined.");
        } else if (appId.length > 50) {
          logger2?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.");
        }
      }
      return appId;
    }
  });
}
class EndpointCache {
  capacity;
  data = /* @__PURE__ */ new Map();
  parameters = [];
  constructor({ size, params }) {
    this.capacity = size ?? 50;
    if (params) {
      this.parameters = params;
    }
  }
  get(endpointParams, resolver) {
    const key = this.hash(endpointParams);
    if (key === false) {
      return resolver();
    }
    if (!this.data.has(key)) {
      if (this.data.size > this.capacity + 10) {
        const keys = this.data.keys();
        let i2 = 0;
        while (true) {
          const { value, done } = keys.next();
          this.data.delete(value);
          if (done || ++i2 > 10) {
            break;
          }
        }
      }
      this.data.set(key, resolver());
    }
    return this.data.get(key);
  }
  size() {
    return this.data.size;
  }
  hash(endpointParams) {
    let buffer = "";
    const { parameters } = this;
    if (parameters.length === 0) {
      return false;
    }
    for (const param of parameters) {
      const val = String(endpointParams[param] ?? "");
      if (val.includes("|;")) {
        return false;
      }
      buffer += val + "|;";
    }
    return buffer;
  }
}
const IP_V4_REGEX = new RegExp(`^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`);
const isIpAddress = (value) => IP_V4_REGEX.test(value) || value.startsWith("[") && value.endsWith("]");
const VALID_HOST_LABEL_REGEX = new RegExp(`^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$`);
const isValidHostLabel = (value, allowSubDomains = false) => {
  if (!allowSubDomains) {
    return VALID_HOST_LABEL_REGEX.test(value);
  }
  const labels = value.split(".");
  for (const label of labels) {
    if (!isValidHostLabel(label)) {
      return false;
    }
  }
  return true;
};
const customEndpointFunctions = {};
const debugId = "endpoints";
function toDebugString(input) {
  if (typeof input !== "object" || input == null) {
    return input;
  }
  if ("ref" in input) {
    return `$${toDebugString(input.ref)}`;
  }
  if ("fn" in input) {
    return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
  }
  return JSON.stringify(input, null, 2);
}
class EndpointError extends Error {
  constructor(message) {
    super(message);
    this.name = "EndpointError";
  }
}
const booleanEquals = (value1, value2) => value1 === value2;
const getAttrPathList = (path) => {
  const parts = path.split(".");
  const pathList = [];
  for (const part of parts) {
    const squareBracketIndex = part.indexOf("[");
    if (squareBracketIndex !== -1) {
      if (part.indexOf("]") !== part.length - 1) {
        throw new EndpointError(`Path: '${path}' does not end with ']'`);
      }
      const arrayIndex = part.slice(squareBracketIndex + 1, -1);
      if (Number.isNaN(parseInt(arrayIndex))) {
        throw new EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path}'`);
      }
      if (squareBracketIndex !== 0) {
        pathList.push(part.slice(0, squareBracketIndex));
      }
      pathList.push(arrayIndex);
    } else {
      pathList.push(part);
    }
  }
  return pathList;
};
const getAttr = (value, path) => getAttrPathList(path).reduce((acc, index2) => {
  if (typeof acc !== "object") {
    throw new EndpointError(`Index '${index2}' in '${path}' not found in '${JSON.stringify(value)}'`);
  } else if (Array.isArray(acc)) {
    return acc[parseInt(index2)];
  }
  return acc[index2];
}, value);
const isSet = (value) => value != null;
const not = (value) => !value;
const DEFAULT_PORTS = {
  [EndpointURLScheme.HTTP]: 80,
  [EndpointURLScheme.HTTPS]: 443
};
const parseURL = (value) => {
  const whatwgURL = (() => {
    try {
      if (value instanceof URL) {
        return value;
      }
      if (typeof value === "object" && "hostname" in value) {
        const { hostname: hostname2, port, protocol: protocol2 = "", path = "", query = {} } = value;
        const url = new URL(`${protocol2}//${hostname2}${port ? `:${port}` : ""}${path}`);
        url.search = Object.entries(query).map(([k2, v2]) => `${k2}=${v2}`).join("&");
        return url;
      }
      return new URL(value);
    } catch (error2) {
      return null;
    }
  })();
  if (!whatwgURL) {
    console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`);
    return null;
  }
  const urlString = whatwgURL.href;
  const { host, hostname, pathname, protocol, search } = whatwgURL;
  if (search) {
    return null;
  }
  const scheme = protocol.slice(0, -1);
  if (!Object.values(EndpointURLScheme).includes(scheme)) {
    return null;
  }
  const isIp = isIpAddress(hostname);
  const inputContainsDefaultPort = urlString.includes(`${host}:${DEFAULT_PORTS[scheme]}`) || typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS[scheme]}`);
  const authority = `${host}${inputContainsDefaultPort ? `:${DEFAULT_PORTS[scheme]}` : ``}`;
  return {
    scheme,
    authority,
    path: pathname,
    normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
    isIp
  };
};
const stringEquals = (value1, value2) => value1 === value2;
const substring = (input, start, stop, reverse) => {
  if (start >= stop || input.length < stop) {
    return null;
  }
  if (!reverse) {
    return input.substring(start, stop);
  }
  return input.substring(input.length - stop, input.length - start);
};
const uriEncode = (value) => encodeURIComponent(value).replace(/[!*'()]/g, (c2) => `%${c2.charCodeAt(0).toString(16).toUpperCase()}`);
const endpointFunctions = {
  booleanEquals,
  getAttr,
  isSet,
  isValidHostLabel,
  not,
  parseURL,
  stringEquals,
  substring,
  uriEncode
};
const evaluateTemplate = (template, options) => {
  const evaluatedTemplateArr = [];
  const templateContext = {
    ...options.endpointParams,
    ...options.referenceRecord
  };
  let currentIndex = 0;
  while (currentIndex < template.length) {
    const openingBraceIndex = template.indexOf("{", currentIndex);
    if (openingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(currentIndex));
      break;
    }
    evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
    const closingBraceIndex = template.indexOf("}", openingBraceIndex);
    if (closingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex));
      break;
    }
    if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}") {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex));
      currentIndex = closingBraceIndex + 2;
    }
    const parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
    if (parameterName.includes("#")) {
      const [refName, attrName] = parameterName.split("#");
      evaluatedTemplateArr.push(getAttr(templateContext[refName], attrName));
    } else {
      evaluatedTemplateArr.push(templateContext[parameterName]);
    }
    currentIndex = closingBraceIndex + 1;
  }
  return evaluatedTemplateArr.join("");
};
const getReferenceValue = ({ ref }, options) => {
  const referenceRecord = {
    ...options.endpointParams,
    ...options.referenceRecord
  };
  return referenceRecord[ref];
};
const evaluateExpression = (obj, keyName, options) => {
  if (typeof obj === "string") {
    return evaluateTemplate(obj, options);
  } else if (obj["fn"]) {
    return group$2.callFunction(obj, options);
  } else if (obj["ref"]) {
    return getReferenceValue(obj, options);
  }
  throw new EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
};
const callFunction = ({ fn, argv }, options) => {
  const evaluatedArgs = argv.map((arg) => ["boolean", "number"].includes(typeof arg) ? arg : group$2.evaluateExpression(arg, "arg", options));
  const fnSegments = fn.split(".");
  if (fnSegments[0] in customEndpointFunctions && fnSegments[1] != null) {
    return customEndpointFunctions[fnSegments[0]][fnSegments[1]](...evaluatedArgs);
  }
  return endpointFunctions[fn](...evaluatedArgs);
};
const group$2 = {
  evaluateExpression,
  callFunction
};
const evaluateCondition = ({ assign, ...fnArgs }, options) => {
  if (assign && assign in options.referenceRecord) {
    throw new EndpointError(`'${assign}' is already defined in Reference Record.`);
  }
  const value = callFunction(fnArgs, options);
  options.logger?.debug?.(`${debugId} evaluateCondition: ${toDebugString(fnArgs)} = ${toDebugString(value)}`);
  return {
    result: value === "" ? true : !!value,
    ...assign != null && { toAssign: { name: assign, value } }
  };
};
const evaluateConditions = (conditions = [], options) => {
  const conditionsReferenceRecord = {};
  for (const condition of conditions) {
    const { result, toAssign } = evaluateCondition(condition, {
      ...options,
      referenceRecord: {
        ...options.referenceRecord,
        ...conditionsReferenceRecord
      }
    });
    if (!result) {
      return { result };
    }
    if (toAssign) {
      conditionsReferenceRecord[toAssign.name] = toAssign.value;
      options.logger?.debug?.(`${debugId} assign: ${toAssign.name} := ${toDebugString(toAssign.value)}`);
    }
  }
  return { result: true, referenceRecord: conditionsReferenceRecord };
};
const getEndpointHeaders = (headers, options) => Object.entries(headers).reduce((acc, [headerKey, headerVal]) => ({
  ...acc,
  [headerKey]: headerVal.map((headerValEntry) => {
    const processedExpr = evaluateExpression(headerValEntry, "Header value entry", options);
    if (typeof processedExpr !== "string") {
      throw new EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
    }
    return processedExpr;
  })
}), {});
const getEndpointProperties = (properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => ({
  ...acc,
  [propertyKey]: group$1.getEndpointProperty(propertyVal, options)
}), {});
const getEndpointProperty = (property, options) => {
  if (Array.isArray(property)) {
    return property.map((propertyEntry) => getEndpointProperty(propertyEntry, options));
  }
  switch (typeof property) {
    case "string":
      return evaluateTemplate(property, options);
    case "object":
      if (property === null) {
        throw new EndpointError(`Unexpected endpoint property: ${property}`);
      }
      return group$1.getEndpointProperties(property, options);
    case "boolean":
      return property;
    default:
      throw new EndpointError(`Unexpected endpoint property type: ${typeof property}`);
  }
};
const group$1 = {
  getEndpointProperty,
  getEndpointProperties
};
const getEndpointUrl = (endpointUrl, options) => {
  const expression = evaluateExpression(endpointUrl, "Endpoint URL", options);
  if (typeof expression === "string") {
    try {
      return new URL(expression);
    } catch (error2) {
      console.error(`Failed to construct URL with ${expression}`, error2);
      throw error2;
    }
  }
  throw new EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
};
const evaluateEndpointRule = (endpointRule, options) => {
  const { conditions, endpoint } = endpointRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  const endpointRuleOptions = {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  };
  const { url, properties, headers } = endpoint;
  options.logger?.debug?.(`${debugId} Resolving endpoint from template: ${toDebugString(endpoint)}`);
  return {
    ...headers != void 0 && {
      headers: getEndpointHeaders(headers, endpointRuleOptions)
    },
    ...properties != void 0 && {
      properties: getEndpointProperties(properties, endpointRuleOptions)
    },
    url: getEndpointUrl(url, endpointRuleOptions)
  };
};
const evaluateErrorRule = (errorRule, options) => {
  const { conditions, error: error2 } = errorRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  throw new EndpointError(evaluateExpression(error2, "Error", {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  }));
};
const evaluateRules = (rules, options) => {
  for (const rule of rules) {
    if (rule.type === "endpoint") {
      const endpointOrUndefined = evaluateEndpointRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else if (rule.type === "error") {
      evaluateErrorRule(rule, options);
    } else if (rule.type === "tree") {
      const endpointOrUndefined = group.evaluateTreeRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else {
      throw new EndpointError(`Unknown endpoint rule: ${rule}`);
    }
  }
  throw new EndpointError(`Rules evaluation failed`);
};
const evaluateTreeRule = (treeRule, options) => {
  const { conditions, rules } = treeRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  return group.evaluateRules(rules, {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  });
};
const group = {
  evaluateRules,
  evaluateTreeRule
};
const resolveEndpoint = (ruleSetObject, options) => {
  const { endpointParams, logger: logger2 } = options;
  const { parameters, rules } = ruleSetObject;
  options.logger?.debug?.(`${debugId} Initial EndpointParams: ${toDebugString(endpointParams)}`);
  const paramsWithDefault = Object.entries(parameters).filter(([, v2]) => v2.default != null).map(([k2, v2]) => [k2, v2.default]);
  if (paramsWithDefault.length > 0) {
    for (const [paramKey, paramDefaultValue] of paramsWithDefault) {
      endpointParams[paramKey] = endpointParams[paramKey] ?? paramDefaultValue;
    }
  }
  const requiredParams = Object.entries(parameters).filter(([, v2]) => v2.required).map(([k2]) => k2);
  for (const requiredParam of requiredParams) {
    if (endpointParams[requiredParam] == null) {
      throw new EndpointError(`Missing required parameter: '${requiredParam}'`);
    }
  }
  const endpoint = evaluateRules(rules, { endpointParams, logger: logger2, referenceRecord: {} });
  options.logger?.debug?.(`${debugId} Resolved endpoint: ${toDebugString(endpoint)}`);
  return endpoint;
};
const isVirtualHostableS3Bucket = (value, allowSubDomains = false) => {
  if (allowSubDomains) {
    for (const label of value.split(".")) {
      if (!isVirtualHostableS3Bucket(label)) {
        return false;
      }
    }
    return true;
  }
  if (!isValidHostLabel(value)) {
    return false;
  }
  if (value.length < 3 || value.length > 63) {
    return false;
  }
  if (value !== value.toLowerCase()) {
    return false;
  }
  if (isIpAddress(value)) {
    return false;
  }
  return true;
};
const ARN_DELIMITER = ":";
const RESOURCE_DELIMITER = "/";
const parseArn = (value) => {
  const segments = value.split(ARN_DELIMITER);
  if (segments.length < 6)
    return null;
  const [arn, partition2, service, region, accountId, ...resourcePath] = segments;
  if (arn !== "arn" || partition2 === "" || service === "" || resourcePath.join(ARN_DELIMITER) === "")
    return null;
  const resourceId = resourcePath.map((resource) => resource.split(RESOURCE_DELIMITER)).flat();
  return {
    partition: partition2,
    service,
    region,
    accountId,
    resourceId
  };
};
const partitions = [{ "id": "aws", "outputs": { "dnsSuffix": "amazonaws.com", "dualStackDnsSuffix": "api.aws", "implicitGlobalRegion": "us-east-1", "name": "aws", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$", "regions": { "af-south-1": { "description": "Africa (Cape Town)" }, "ap-east-1": { "description": "Asia Pacific (Hong Kong)" }, "ap-east-2": { "description": "Asia Pacific (Taipei)" }, "ap-northeast-1": { "description": "Asia Pacific (Tokyo)" }, "ap-northeast-2": { "description": "Asia Pacific (Seoul)" }, "ap-northeast-3": { "description": "Asia Pacific (Osaka)" }, "ap-south-1": { "description": "Asia Pacific (Mumbai)" }, "ap-south-2": { "description": "Asia Pacific (Hyderabad)" }, "ap-southeast-1": { "description": "Asia Pacific (Singapore)" }, "ap-southeast-2": { "description": "Asia Pacific (Sydney)" }, "ap-southeast-3": { "description": "Asia Pacific (Jakarta)" }, "ap-southeast-4": { "description": "Asia Pacific (Melbourne)" }, "ap-southeast-5": { "description": "Asia Pacific (Malaysia)" }, "ap-southeast-6": { "description": "Asia Pacific (New Zealand)" }, "ap-southeast-7": { "description": "Asia Pacific (Thailand)" }, "aws-global": { "description": "aws global region" }, "ca-central-1": { "description": "Canada (Central)" }, "ca-west-1": { "description": "Canada West (Calgary)" }, "eu-central-1": { "description": "Europe (Frankfurt)" }, "eu-central-2": { "description": "Europe (Zurich)" }, "eu-north-1": { "description": "Europe (Stockholm)" }, "eu-south-1": { "description": "Europe (Milan)" }, "eu-south-2": { "description": "Europe (Spain)" }, "eu-west-1": { "description": "Europe (Ireland)" }, "eu-west-2": { "description": "Europe (London)" }, "eu-west-3": { "description": "Europe (Paris)" }, "il-central-1": { "description": "Israel (Tel Aviv)" }, "me-central-1": { "description": "Middle East (UAE)" }, "me-south-1": { "description": "Middle East (Bahrain)" }, "mx-central-1": { "description": "Mexico (Central)" }, "sa-east-1": { "description": "South America (Sao Paulo)" }, "us-east-1": { "description": "US East (N. Virginia)" }, "us-east-2": { "description": "US East (Ohio)" }, "us-west-1": { "description": "US West (N. California)" }, "us-west-2": { "description": "US West (Oregon)" } } }, { "id": "aws-cn", "outputs": { "dnsSuffix": "amazonaws.com.cn", "dualStackDnsSuffix": "api.amazonwebservices.com.cn", "implicitGlobalRegion": "cn-northwest-1", "name": "aws-cn", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^cn\\-\\w+\\-\\d+$", "regions": { "aws-cn-global": { "description": "aws-cn global region" }, "cn-north-1": { "description": "China (Beijing)" }, "cn-northwest-1": { "description": "China (Ningxia)" } } }, { "id": "aws-eusc", "outputs": { "dnsSuffix": "amazonaws.eu", "dualStackDnsSuffix": "api.amazonwebservices.eu", "implicitGlobalRegion": "eusc-de-east-1", "name": "aws-eusc", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^eusc\\-(de)\\-\\w+\\-\\d+$", "regions": { "eusc-de-east-1": { "description": "AWS European Sovereign Cloud (Germany)" } } }, { "id": "aws-iso", "outputs": { "dnsSuffix": "c2s.ic.gov", "dualStackDnsSuffix": "api.aws.ic.gov", "implicitGlobalRegion": "us-iso-east-1", "name": "aws-iso", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^us\\-iso\\-\\w+\\-\\d+$", "regions": { "aws-iso-global": { "description": "aws-iso global region" }, "us-iso-east-1": { "description": "US ISO East" }, "us-iso-west-1": { "description": "US ISO WEST" } } }, { "id": "aws-iso-b", "outputs": { "dnsSuffix": "sc2s.sgov.gov", "dualStackDnsSuffix": "api.aws.scloud", "implicitGlobalRegion": "us-isob-east-1", "name": "aws-iso-b", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^us\\-isob\\-\\w+\\-\\d+$", "regions": { "aws-iso-b-global": { "description": "aws-iso-b global region" }, "us-isob-east-1": { "description": "US ISOB East (Ohio)" }, "us-isob-west-1": { "description": "US ISOB West" } } }, { "id": "aws-iso-e", "outputs": { "dnsSuffix": "cloud.adc-e.uk", "dualStackDnsSuffix": "api.cloud-aws.adc-e.uk", "implicitGlobalRegion": "eu-isoe-west-1", "name": "aws-iso-e", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^eu\\-isoe\\-\\w+\\-\\d+$", "regions": { "aws-iso-e-global": { "description": "aws-iso-e global region" }, "eu-isoe-west-1": { "description": "EU ISOE West" } } }, { "id": "aws-iso-f", "outputs": { "dnsSuffix": "csp.hci.ic.gov", "dualStackDnsSuffix": "api.aws.hci.ic.gov", "implicitGlobalRegion": "us-isof-south-1", "name": "aws-iso-f", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^us\\-isof\\-\\w+\\-\\d+$", "regions": { "aws-iso-f-global": { "description": "aws-iso-f global region" }, "us-isof-east-1": { "description": "US ISOF EAST" }, "us-isof-south-1": { "description": "US ISOF SOUTH" } } }, { "id": "aws-us-gov", "outputs": { "dnsSuffix": "amazonaws.com", "dualStackDnsSuffix": "api.aws", "implicitGlobalRegion": "us-gov-west-1", "name": "aws-us-gov", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^us\\-gov\\-\\w+\\-\\d+$", "regions": { "aws-us-gov-global": { "description": "aws-us-gov global region" }, "us-gov-east-1": { "description": "AWS GovCloud (US-East)" }, "us-gov-west-1": { "description": "AWS GovCloud (US-West)" } } }];
const partitionsInfo = {
  partitions
};
let selectedPartitionsInfo = partitionsInfo;
const partition = (value) => {
  const { partitions: partitions2 } = selectedPartitionsInfo;
  for (const partition2 of partitions2) {
    const { regions, outputs } = partition2;
    for (const [region, regionData] of Object.entries(regions)) {
      if (region === value) {
        return {
          ...outputs,
          ...regionData
        };
      }
    }
  }
  for (const partition2 of partitions2) {
    const { regionRegex, outputs } = partition2;
    if (new RegExp(regionRegex).test(value)) {
      return {
        ...outputs
      };
    }
  }
  const DEFAULT_PARTITION = partitions2.find((partition2) => partition2.id === "aws");
  if (!DEFAULT_PARTITION) {
    throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
  }
  return {
    ...DEFAULT_PARTITION.outputs
  };
};
const awsEndpointFunctions = {
  isVirtualHostableS3Bucket,
  parseArn,
  partition
};
customEndpointFunctions.aws = awsEndpointFunctions;
function parseQueryString(querystring) {
  const query = {};
  querystring = querystring.replace(/^\?/, "");
  if (querystring) {
    for (const pair of querystring.split("&")) {
      let [key, value = null] = pair.split("=");
      key = decodeURIComponent(key);
      if (value) {
        value = decodeURIComponent(value);
      }
      if (!(key in query)) {
        query[key] = value;
      } else if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    }
  }
  return query;
}
const parseUrl = (url) => {
  if (typeof url === "string") {
    return parseUrl(new URL(url));
  }
  const { hostname, pathname, port, protocol, search } = url;
  let query;
  if (search) {
    query = parseQueryString(search);
  }
  return {
    hostname,
    port: port ? parseInt(port) : void 0,
    protocol,
    path: pathname,
    query
  };
};
const ACCOUNT_ID_ENDPOINT_REGEX = /\d{12}\.ddb/;
async function checkFeatures(context, config2, args) {
  const request2 = args.request;
  if (request2?.headers?.["smithy-protocol"] === "rpc-v2-cbor") {
    setFeature(context, "PROTOCOL_RPC_V2_CBOR", "M");
  }
  if (typeof config2.retryStrategy === "function") {
    const retryStrategy = await config2.retryStrategy();
    if (typeof retryStrategy.acquireInitialRetryToken === "function") {
      if (retryStrategy.constructor?.name?.includes("Adaptive")) {
        setFeature(context, "RETRY_MODE_ADAPTIVE", "F");
      } else {
        setFeature(context, "RETRY_MODE_STANDARD", "E");
      }
    } else {
      setFeature(context, "RETRY_MODE_LEGACY", "D");
    }
  }
  if (typeof config2.accountIdEndpointMode === "function") {
    const endpointV2 = context.endpointV2;
    if (String(endpointV2?.url?.hostname).match(ACCOUNT_ID_ENDPOINT_REGEX)) {
      setFeature(context, "ACCOUNT_ID_ENDPOINT", "O");
    }
    switch (await config2.accountIdEndpointMode?.()) {
      case "disabled":
        setFeature(context, "ACCOUNT_ID_MODE_DISABLED", "Q");
        break;
      case "preferred":
        setFeature(context, "ACCOUNT_ID_MODE_PREFERRED", "P");
        break;
      case "required":
        setFeature(context, "ACCOUNT_ID_MODE_REQUIRED", "R");
        break;
    }
  }
  const identity = context.__smithy_context?.selectedHttpAuthScheme?.identity;
  if (identity?.$source) {
    const credentials = identity;
    if (credentials.accountId) {
      setFeature(context, "RESOLVED_ACCOUNT_ID", "T");
    }
    for (const [key, value] of Object.entries(credentials.$source ?? {})) {
      setFeature(context, key, value);
    }
  }
}
const USER_AGENT = "user-agent";
const X_AMZ_USER_AGENT = "x-amz-user-agent";
const SPACE = " ";
const UA_NAME_SEPARATOR = "/";
const UA_NAME_ESCAPE_REGEX = /[^!$%&'*+\-.^_`|~\w]/g;
const UA_VALUE_ESCAPE_REGEX = /[^!$%&'*+\-.^_`|~\w#]/g;
const UA_ESCAPE_CHAR = "-";
const BYTE_LIMIT = 1024;
function encodeFeatures(features) {
  let buffer = "";
  for (const key in features) {
    const val = features[key];
    if (buffer.length + val.length + 1 <= BYTE_LIMIT) {
      if (buffer.length) {
        buffer += "," + val;
      } else {
        buffer += val;
      }
      continue;
    }
    break;
  }
  return buffer;
}
const userAgentMiddleware = (options) => (next, context) => async (args) => {
  const { request: request2 } = args;
  if (!HttpRequest.isInstance(request2)) {
    return next(args);
  }
  const { headers } = request2;
  const userAgent = context?.userAgent?.map(escapeUserAgent) || [];
  const defaultUserAgent = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
  await checkFeatures(context, options, args);
  const awsContext = context;
  defaultUserAgent.push(`m/${encodeFeatures(Object.assign({}, context.__smithy_context?.features, awsContext.__aws_sdk_context?.features))}`);
  const customUserAgent = options?.customUserAgent?.map(escapeUserAgent) || [];
  const appId = await options.userAgentAppId();
  if (appId) {
    defaultUserAgent.push(escapeUserAgent([`app`, `${appId}`]));
  }
  const sdkUserAgentValue = [].concat([...defaultUserAgent, ...userAgent, ...customUserAgent]).join(SPACE);
  const normalUAValue = [
    ...defaultUserAgent.filter((section) => section.startsWith("aws-sdk-")),
    ...customUserAgent
  ].join(SPACE);
  if (options.runtime !== "browser") {
    if (normalUAValue) {
      headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? `${headers[USER_AGENT]} ${normalUAValue}` : normalUAValue;
    }
    headers[USER_AGENT] = sdkUserAgentValue;
  } else {
    headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
  }
  return next({
    ...args,
    request: request2
  });
};
const escapeUserAgent = (userAgentPair) => {
  const name = userAgentPair[0].split(UA_NAME_SEPARATOR).map((part) => part.replace(UA_NAME_ESCAPE_REGEX, UA_ESCAPE_CHAR)).join(UA_NAME_SEPARATOR);
  const version2 = userAgentPair[1]?.replace(UA_VALUE_ESCAPE_REGEX, UA_ESCAPE_CHAR);
  const prefixSeparatorIndex = name.indexOf(UA_NAME_SEPARATOR);
  const prefix = name.substring(0, prefixSeparatorIndex);
  let uaName = name.substring(prefixSeparatorIndex + 1);
  if (prefix === "api") {
    uaName = uaName.toLowerCase();
  }
  return [prefix, uaName, version2].filter((item) => item && item.length > 0).reduce((acc, item, index2) => {
    switch (index2) {
      case 0:
        return item;
      case 1:
        return `${acc}/${item}`;
      default:
        return `${acc}#${item}`;
    }
  }, "");
};
const getUserAgentMiddlewareOptions = {
  name: "getUserAgentMiddleware",
  step: "build",
  priority: "low",
  tags: ["SET_USER_AGENT", "USER_AGENT"],
  override: true
};
const getUserAgentPlugin = (config2) => ({
  applyToStack: (clientStack) => {
    clientStack.add(userAgentMiddleware(config2), getUserAgentMiddlewareOptions);
  }
});
const booleanSelector = (obj, key, type) => {
  if (!(key in obj))
    return void 0;
  if (obj[key] === "true")
    return true;
  if (obj[key] === "false")
    return false;
  throw new Error(`Cannot load ${type} "${key}". Expected "true" or "false", got ${obj[key]}.`);
};
var SelectorType;
(function(SelectorType2) {
  SelectorType2["ENV"] = "env";
  SelectorType2["CONFIG"] = "shared config entry";
})(SelectorType || (SelectorType = {}));
const ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT";
const CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint";
const NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, ENV_USE_DUALSTACK_ENDPOINT, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_DUALSTACK_ENDPOINT, SelectorType.CONFIG),
  default: false
};
const ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT";
const CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint";
const NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, ENV_USE_FIPS_ENDPOINT, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_FIPS_ENDPOINT, SelectorType.CONFIG),
  default: false
};
const getSmithyContext = (context) => context[SMITHY_CONTEXT_KEY] || (context[SMITHY_CONTEXT_KEY] = {});
const normalizeProvider = (input) => {
  if (typeof input === "function")
    return input;
  const promisified = Promise.resolve(input);
  return () => promisified;
};
const REGION_ENV_NAME = "AWS_REGION";
const REGION_INI_NAME = "region";
const NODE_REGION_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[REGION_ENV_NAME],
  configFileSelector: (profile) => profile[REGION_INI_NAME],
  default: () => {
    throw new Error("Region is missing");
  }
};
const NODE_REGION_CONFIG_FILE_OPTIONS = {
  preferredFile: "credentials"
};
const validRegions = /* @__PURE__ */ new Set();
const checkRegion = (region, check = isValidHostLabel) => {
  if (!validRegions.has(region) && !check(region)) {
    if (region === "*") {
      console.warn(`@smithy/config-resolver WARN - Please use the caller region instead of "*". See "sigv4a" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.`);
    } else {
      throw new Error(`Region not accepted: region="${region}" is not a valid hostname component.`);
    }
  } else {
    validRegions.add(region);
  }
};
const isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));
const getRealRegion = (region) => isFipsRegion(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region;
const resolveRegionConfig = (input) => {
  const { region, useFipsEndpoint } = input;
  if (!region) {
    throw new Error("Region is missing");
  }
  return Object.assign(input, {
    region: async () => {
      const providedRegion = typeof region === "function" ? await region() : region;
      const realRegion = getRealRegion(providedRegion);
      checkRegion(realRegion);
      return realRegion;
    },
    useFipsEndpoint: async () => {
      const providedRegion = typeof region === "string" ? region : await region();
      if (isFipsRegion(providedRegion)) {
        return true;
      }
      return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
    }
  });
};
const CONTENT_LENGTH_HEADER = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
  return (next) => async (args) => {
    const request2 = args.request;
    if (HttpRequest.isInstance(request2)) {
      const { body, headers } = request2;
      if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf(CONTENT_LENGTH_HEADER) === -1) {
        try {
          const length = bodyLengthChecker(body);
          request2.headers = {
            ...request2.headers,
            [CONTENT_LENGTH_HEADER]: String(length)
          };
        } catch (error2) {
        }
      }
    }
    return next({
      ...args,
      request: request2
    });
  };
}
const contentLengthMiddlewareOptions = {
  step: "build",
  tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
  name: "contentLengthMiddleware",
  override: true
};
const getContentLengthPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
  }
});
const resolveParamsForS3 = async (endpointParams) => {
  const bucket = endpointParams?.Bucket || "";
  if (typeof endpointParams.Bucket === "string") {
    endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
  }
  if (isArnBucketName(bucket)) {
    if (endpointParams.ForcePathStyle === true) {
      throw new Error("Path-style addressing cannot be used with ARN buckets");
    }
  } else if (!isDnsCompatibleBucketName(bucket) || bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:") || bucket.toLowerCase() !== bucket || bucket.length < 3) {
    endpointParams.ForcePathStyle = true;
  }
  if (endpointParams.DisableMultiRegionAccessPoints) {
    endpointParams.disableMultiRegionAccessPoints = true;
    endpointParams.DisableMRAP = true;
  }
  return endpointParams;
};
const DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
const IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
const DOTS_PATTERN = /\.\./;
const isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName);
const isArnBucketName = (bucketName) => {
  const [arn, partition2, service, , , bucket] = bucketName.split(":");
  const isArn = arn === "arn" && bucketName.split(":").length >= 6;
  const isValidArn = Boolean(isArn && partition2 && service && bucket);
  if (isArn && !isValidArn) {
    throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
  }
  return isValidArn;
};
const createConfigValueProvider = (configKey, canonicalEndpointParamKey, config2, isClientContextParam = false) => {
  const configProvider = async () => {
    let configValue;
    if (isClientContextParam) {
      const clientContextParams = config2.clientContextParams;
      const nestedValue = clientContextParams?.[configKey];
      configValue = nestedValue ?? config2[configKey] ?? config2[canonicalEndpointParamKey];
    } else {
      configValue = config2[configKey] ?? config2[canonicalEndpointParamKey];
    }
    if (typeof configValue === "function") {
      return configValue();
    }
    return configValue;
  };
  if (configKey === "credentialScope" || canonicalEndpointParamKey === "CredentialScope") {
    return async () => {
      const credentials = typeof config2.credentials === "function" ? await config2.credentials() : config2.credentials;
      const configValue = credentials?.credentialScope ?? credentials?.CredentialScope;
      return configValue;
    };
  }
  if (configKey === "accountId" || canonicalEndpointParamKey === "AccountId") {
    return async () => {
      const credentials = typeof config2.credentials === "function" ? await config2.credentials() : config2.credentials;
      const configValue = credentials?.accountId ?? credentials?.AccountId;
      return configValue;
    };
  }
  if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") {
    return async () => {
      if (config2.isCustomEndpoint === false) {
        return void 0;
      }
      const endpoint = await configProvider();
      if (endpoint && typeof endpoint === "object") {
        if ("url" in endpoint) {
          return endpoint.url.href;
        }
        if ("hostname" in endpoint) {
          const { protocol, hostname, port, path } = endpoint;
          return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
        }
      }
      return endpoint;
    };
  }
  return configProvider;
};
class ProviderError extends Error {
  name = "ProviderError";
  tryNextLink;
  constructor(message, options = true) {
    let logger2;
    let tryNextLink = true;
    if (typeof options === "boolean") {
      logger2 = void 0;
      tryNextLink = options;
    } else if (options != null && typeof options === "object") {
      logger2 = options.logger;
      tryNextLink = options.tryNextLink ?? true;
    }
    super(message);
    this.tryNextLink = tryNextLink;
    Object.setPrototypeOf(this, ProviderError.prototype);
    logger2?.debug?.(`@smithy/property-provider ${tryNextLink ? "->" : "(!)"} ${message}`);
  }
  static from(error2, options = true) {
    return Object.assign(new this(error2.message, options), error2);
  }
}
class CredentialsProviderError extends ProviderError {
  name = "CredentialsProviderError";
  constructor(message, options = true) {
    super(message, options);
    Object.setPrototypeOf(this, CredentialsProviderError.prototype);
  }
}
const chain = (...providers) => async () => {
  if (providers.length === 0) {
    throw new ProviderError("No providers in chain");
  }
  let lastProviderError;
  for (const provider of providers) {
    try {
      const credentials = await provider();
      return credentials;
    } catch (err) {
      lastProviderError = err;
      if (err?.tryNextLink) {
        continue;
      }
      throw err;
    }
  }
  throw lastProviderError;
};
const fromStatic$1 = (staticValue) => () => Promise.resolve(staticValue);
const memoize = (provider, isExpired, requiresRefresh) => {
  let resolved;
  let pending;
  let hasResult;
  let isConstant = false;
  const coalesceProvider = async () => {
    if (!pending) {
      pending = provider();
    }
    try {
      resolved = await pending;
      hasResult = true;
      isConstant = false;
    } finally {
      pending = void 0;
    }
    return resolved;
  };
  {
    return async (options) => {
      if (!hasResult || options?.forceRefresh) {
        resolved = await coalesceProvider();
      }
      return resolved;
    };
  }
};
function getSelectorName(functionString) {
  try {
    const constants = new Set(Array.from(functionString.match(/([A-Z_]){3,}/g) ?? []));
    constants.delete("CONFIG");
    constants.delete("CONFIG_PREFIX_SEPARATOR");
    constants.delete("ENV");
    return [...constants].join(", ");
  } catch (e2) {
    return functionString;
  }
}
const fromEnv$1 = (envVarSelector, options) => async () => {
  try {
    const config2 = envVarSelector(process.env, options);
    if (config2 === void 0) {
      throw new Error();
    }
    return config2;
  } catch (e2) {
    throw new CredentialsProviderError(e2.message || `Not found in ENV: ${getSelectorName(envVarSelector.toString())}`, { logger: options?.logger });
  }
};
const homeDirCache = {};
const getHomeDirCacheKey = () => {
  if (process && process.geteuid) {
    return `${process.geteuid()}`;
  }
  return "DEFAULT";
};
const getHomeDir = () => {
  const { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${sep}` } = process.env;
  if (HOME)
    return HOME;
  if (USERPROFILE)
    return USERPROFILE;
  if (HOMEPATH)
    return `${HOMEDRIVE}${HOMEPATH}`;
  const homeDirCacheKey = getHomeDirCacheKey();
  if (!homeDirCache[homeDirCacheKey])
    homeDirCache[homeDirCacheKey] = homedir();
  return homeDirCache[homeDirCacheKey];
};
const ENV_PROFILE = "AWS_PROFILE";
const DEFAULT_PROFILE = "default";
const getProfileName = (init2) => init2.profile || process.env[ENV_PROFILE] || DEFAULT_PROFILE;
const CONFIG_PREFIX_SEPARATOR = ".";
const getConfigData = (data) => Object.entries(data).filter(([key]) => {
  const indexOfSeparator = key.indexOf(CONFIG_PREFIX_SEPARATOR);
  if (indexOfSeparator === -1) {
    return false;
  }
  return Object.values(IniSectionType).includes(key.substring(0, indexOfSeparator));
}).reduce((acc, [key, value]) => {
  const indexOfSeparator = key.indexOf(CONFIG_PREFIX_SEPARATOR);
  const updatedKey = key.substring(0, indexOfSeparator) === IniSectionType.PROFILE ? key.substring(indexOfSeparator + 1) : key;
  acc[updatedKey] = value;
  return acc;
}, {
  ...data.default && { default: data.default }
});
const ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
const getConfigFilepath = () => process.env[ENV_CONFIG_PATH] || join(getHomeDir(), ".aws", "config");
const ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
const getCredentialsFilepath = () => process.env[ENV_CREDENTIALS_PATH] || join(getHomeDir(), ".aws", "credentials");
const prefixKeyRegex = /^([\w-]+)\s(["'])?([\w-@\+\.%:/]+)\2$/;
const profileNameBlockList = ["__proto__", "profile __proto__"];
const parseIni = (iniData) => {
  const map2 = {};
  let currentSection;
  let currentSubSection;
  for (const iniLine of iniData.split(/\r?\n/)) {
    const trimmedLine = iniLine.split(/(^|\s)[;#]/)[0].trim();
    const isSection = trimmedLine[0] === "[" && trimmedLine[trimmedLine.length - 1] === "]";
    if (isSection) {
      currentSection = void 0;
      currentSubSection = void 0;
      const sectionName = trimmedLine.substring(1, trimmedLine.length - 1);
      const matches = prefixKeyRegex.exec(sectionName);
      if (matches) {
        const [, prefix, , name] = matches;
        if (Object.values(IniSectionType).includes(prefix)) {
          currentSection = [prefix, name].join(CONFIG_PREFIX_SEPARATOR);
        }
      } else {
        currentSection = sectionName;
      }
      if (profileNameBlockList.includes(sectionName)) {
        throw new Error(`Found invalid profile name "${sectionName}"`);
      }
    } else if (currentSection) {
      const indexOfEqualsSign = trimmedLine.indexOf("=");
      if (![0, -1].includes(indexOfEqualsSign)) {
        const [name, value] = [
          trimmedLine.substring(0, indexOfEqualsSign).trim(),
          trimmedLine.substring(indexOfEqualsSign + 1).trim()
        ];
        if (value === "") {
          currentSubSection = name;
        } else {
          if (currentSubSection && iniLine.trimStart() === iniLine) {
            currentSubSection = void 0;
          }
          map2[currentSection] = map2[currentSection] || {};
          const key = currentSubSection ? [currentSubSection, name].join(CONFIG_PREFIX_SEPARATOR) : name;
          map2[currentSection][key] = value;
        }
      }
    }
  }
  return map2;
};
const filePromises = {};
const fileIntercept = {};
const readFile = (path, options) => {
  if (fileIntercept[path] !== void 0) {
    return fileIntercept[path];
  }
  if (!filePromises[path] || options?.ignoreCache) {
    filePromises[path] = readFile$1(path, "utf8");
  }
  return filePromises[path];
};
const swallowError = () => ({});
const loadSharedConfigFiles = async (init2 = {}) => {
  const { filepath = getCredentialsFilepath(), configFilepath = getConfigFilepath() } = init2;
  const homeDir = getHomeDir();
  const relativeHomeDirPrefix = "~/";
  let resolvedFilepath = filepath;
  if (filepath.startsWith(relativeHomeDirPrefix)) {
    resolvedFilepath = join(homeDir, filepath.slice(2));
  }
  let resolvedConfigFilepath = configFilepath;
  if (configFilepath.startsWith(relativeHomeDirPrefix)) {
    resolvedConfigFilepath = join(homeDir, configFilepath.slice(2));
  }
  const parsedFiles = await Promise.all([
    readFile(resolvedConfigFilepath, {
      ignoreCache: init2.ignoreCache
    }).then(parseIni).then(getConfigData).catch(swallowError),
    readFile(resolvedFilepath, {
      ignoreCache: init2.ignoreCache
    }).then(parseIni).catch(swallowError)
  ]);
  return {
    configFile: parsedFiles[0],
    credentialsFile: parsedFiles[1]
  };
};
const fromSharedConfigFiles = (configSelector, { preferredFile = "config", ...init2 } = {}) => async () => {
  const profile = getProfileName(init2);
  const { configFile, credentialsFile } = await loadSharedConfigFiles(init2);
  const profileFromCredentials = credentialsFile[profile] || {};
  const profileFromConfig = configFile[profile] || {};
  const mergedProfile = preferredFile === "config" ? { ...profileFromCredentials, ...profileFromConfig } : { ...profileFromConfig, ...profileFromCredentials };
  try {
    const cfgFile = preferredFile === "config" ? configFile : credentialsFile;
    const configValue = configSelector(mergedProfile, cfgFile);
    if (configValue === void 0) {
      throw new Error();
    }
    return configValue;
  } catch (e2) {
    throw new CredentialsProviderError(e2.message || `Not found in config files w/ profile [${profile}]: ${getSelectorName(configSelector.toString())}`, { logger: init2.logger });
  }
};
const isFunction = (func) => typeof func === "function";
const fromStatic = (defaultValue) => isFunction(defaultValue) ? async () => await defaultValue() : fromStatic$1(defaultValue);
const loadConfig = ({ environmentVariableSelector, configFileSelector, default: defaultValue }, configuration = {}) => {
  const { signingName, logger: logger2 } = configuration;
  const envOptions = { signingName, logger: logger2 };
  return memoize(chain(fromEnv$1(environmentVariableSelector, envOptions), fromSharedConfigFiles(configFileSelector, configuration), fromStatic(defaultValue)));
};
const ENV_ENDPOINT_URL = "AWS_ENDPOINT_URL";
const CONFIG_ENDPOINT_URL = "endpoint_url";
const getEndpointUrlConfig = (serviceId) => ({
  environmentVariableSelector: (env2) => {
    const serviceSuffixParts = serviceId.split(" ").map((w2) => w2.toUpperCase());
    const serviceEndpointUrl = env2[[ENV_ENDPOINT_URL, ...serviceSuffixParts].join("_")];
    if (serviceEndpointUrl)
      return serviceEndpointUrl;
    const endpointUrl = env2[ENV_ENDPOINT_URL];
    if (endpointUrl)
      return endpointUrl;
    return void 0;
  },
  configFileSelector: (profile, config2) => {
    if (config2 && profile.services) {
      const servicesSection = config2[["services", profile.services].join(CONFIG_PREFIX_SEPARATOR)];
      if (servicesSection) {
        const servicePrefixParts = serviceId.split(" ").map((w2) => w2.toLowerCase());
        const endpointUrl2 = servicesSection[[servicePrefixParts.join("_"), CONFIG_ENDPOINT_URL].join(CONFIG_PREFIX_SEPARATOR)];
        if (endpointUrl2)
          return endpointUrl2;
      }
    }
    const endpointUrl = profile[CONFIG_ENDPOINT_URL];
    if (endpointUrl)
      return endpointUrl;
    return void 0;
  },
  default: void 0
});
const getEndpointFromConfig = async (serviceId) => loadConfig(getEndpointUrlConfig(serviceId ?? ""))();
const toEndpointV1 = (endpoint) => {
  if (typeof endpoint === "object") {
    if ("url" in endpoint) {
      return parseUrl(endpoint.url);
    }
    return endpoint;
  }
  return parseUrl(endpoint);
};
const getEndpointFromInstructions = async (commandInput, instructionsSupplier, clientConfig, context) => {
  if (!clientConfig.isCustomEndpoint) {
    let endpointFromConfig;
    if (clientConfig.serviceConfiguredEndpoint) {
      endpointFromConfig = await clientConfig.serviceConfiguredEndpoint();
    } else {
      endpointFromConfig = await getEndpointFromConfig(clientConfig.serviceId);
    }
    if (endpointFromConfig) {
      clientConfig.endpoint = () => Promise.resolve(toEndpointV1(endpointFromConfig));
      clientConfig.isCustomEndpoint = true;
    }
  }
  const endpointParams = await resolveParams(commandInput, instructionsSupplier, clientConfig);
  if (typeof clientConfig.endpointProvider !== "function") {
    throw new Error("config.endpointProvider is not set.");
  }
  const endpoint = clientConfig.endpointProvider(endpointParams, context);
  return endpoint;
};
const resolveParams = async (commandInput, instructionsSupplier, clientConfig) => {
  const endpointParams = {};
  const instructions = instructionsSupplier?.getEndpointParameterInstructions?.() || {};
  for (const [name, instruction] of Object.entries(instructions)) {
    switch (instruction.type) {
      case "staticContextParams":
        endpointParams[name] = instruction.value;
        break;
      case "contextParams":
        endpointParams[name] = commandInput[instruction.name];
        break;
      case "clientContextParams":
      case "builtInParams":
        endpointParams[name] = await createConfigValueProvider(instruction.name, name, clientConfig, instruction.type !== "builtInParams")();
        break;
      case "operationContextParams":
        endpointParams[name] = instruction.get(commandInput);
        break;
      default:
        throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
    }
  }
  if (Object.keys(instructions).length === 0) {
    Object.assign(endpointParams, clientConfig);
  }
  if (String(clientConfig.serviceId).toLowerCase() === "s3") {
    await resolveParamsForS3(endpointParams);
  }
  return endpointParams;
};
const endpointMiddleware = ({ config: config2, instructions }) => {
  return (next, context) => async (args) => {
    if (config2.isCustomEndpoint) {
      setFeature$1(context, "ENDPOINT_OVERRIDE", "N");
    }
    const endpoint = await getEndpointFromInstructions(args.input, {
      getEndpointParameterInstructions() {
        return instructions;
      }
    }, { ...config2 }, context);
    context.endpointV2 = endpoint;
    context.authSchemes = endpoint.properties?.authSchemes;
    const authScheme = context.authSchemes?.[0];
    if (authScheme) {
      context["signing_region"] = authScheme.signingRegion;
      context["signing_service"] = authScheme.signingName;
      const smithyContext = getSmithyContext(context);
      const httpAuthOption = smithyContext?.selectedHttpAuthScheme?.httpAuthOption;
      if (httpAuthOption) {
        httpAuthOption.signingProperties = Object.assign(httpAuthOption.signingProperties || {}, {
          signing_region: authScheme.signingRegion,
          signingRegion: authScheme.signingRegion,
          signing_service: authScheme.signingName,
          signingName: authScheme.signingName,
          signingRegionSet: authScheme.signingRegionSet
        }, authScheme.properties);
      }
    }
    return next({
      ...args
    });
  };
};
const serializerMiddlewareOption = {
  name: "serializerMiddleware"
};
const endpointMiddlewareOptions = {
  step: "serialize",
  tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
  name: "endpointV2Middleware",
  override: true,
  relation: "before",
  toMiddleware: serializerMiddlewareOption.name
};
const getEndpointPlugin = (config2, instructions) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(endpointMiddleware({
      config: config2,
      instructions
    }), endpointMiddlewareOptions);
  }
});
const resolveEndpointConfig = (input) => {
  const tls = input.tls ?? true;
  const { endpoint, useDualstackEndpoint, useFipsEndpoint } = input;
  const customEndpointProvider = endpoint != null ? async () => toEndpointV1(await normalizeProvider(endpoint)()) : void 0;
  const isCustomEndpoint = !!endpoint;
  const resolvedConfig = Object.assign(input, {
    endpoint: customEndpointProvider,
    tls,
    isCustomEndpoint,
    useDualstackEndpoint: normalizeProvider(useDualstackEndpoint ?? false),
    useFipsEndpoint: normalizeProvider(useFipsEndpoint ?? false)
  });
  let configuredEndpointPromise = void 0;
  resolvedConfig.serviceConfiguredEndpoint = async () => {
    if (input.serviceId && !configuredEndpointPromise) {
      configuredEndpointPromise = getEndpointFromConfig(input.serviceId);
    }
    return configuredEndpointPromise;
  };
  return resolvedConfig;
};
var RETRY_MODES;
(function(RETRY_MODES2) {
  RETRY_MODES2["STANDARD"] = "standard";
  RETRY_MODES2["ADAPTIVE"] = "adaptive";
})(RETRY_MODES || (RETRY_MODES = {}));
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;
const THROTTLING_ERROR_CODES = [
  "BandwidthLimitExceeded",
  "EC2ThrottledException",
  "LimitExceededException",
  "PriorRequestNotComplete",
  "ProvisionedThroughputExceededException",
  "RequestLimitExceeded",
  "RequestThrottled",
  "RequestThrottledException",
  "SlowDown",
  "ThrottledException",
  "Throttling",
  "ThrottlingException",
  "TooManyRequestsException",
  "TransactionInProgressException"
];
const TRANSIENT_ERROR_CODES = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"];
const TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];
const NODEJS_TIMEOUT_ERROR_CODES$1 = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"];
const NODEJS_NETWORK_ERROR_CODES = ["EHOSTUNREACH", "ENETUNREACH", "ENOTFOUND"];
const isRetryableByTrait = (error2) => error2?.$retryable !== void 0;
const isClockSkewCorrectedError = (error2) => error2.$metadata?.clockSkewCorrected;
const isBrowserNetworkError = (error2) => {
  const errorMessages = /* @__PURE__ */ new Set([
    "Failed to fetch",
    "NetworkError when attempting to fetch resource",
    "The Internet connection appears to be offline",
    "Load failed",
    "Network request failed"
  ]);
  const isValid = error2 && error2 instanceof TypeError;
  if (!isValid) {
    return false;
  }
  return errorMessages.has(error2.message);
};
const isThrottlingError = (error2) => error2.$metadata?.httpStatusCode === 429 || THROTTLING_ERROR_CODES.includes(error2.name) || error2.$retryable?.throttling == true;
const isTransientError = (error2, depth = 0) => isRetryableByTrait(error2) || isClockSkewCorrectedError(error2) || TRANSIENT_ERROR_CODES.includes(error2.name) || NODEJS_TIMEOUT_ERROR_CODES$1.includes(error2?.code || "") || NODEJS_NETWORK_ERROR_CODES.includes(error2?.code || "") || TRANSIENT_ERROR_STATUS_CODES.includes(error2.$metadata?.httpStatusCode || 0) || isBrowserNetworkError(error2) || error2.cause !== void 0 && depth <= 10 && isTransientError(error2.cause, depth + 1);
const isServerError = (error2) => {
  if (error2.$metadata?.httpStatusCode !== void 0) {
    const statusCode = error2.$metadata.httpStatusCode;
    if (500 <= statusCode && statusCode <= 599 && !isTransientError(error2)) {
      return true;
    }
    return false;
  }
  return false;
};
class DefaultRateLimiter {
  static setTimeoutFn = setTimeout;
  beta;
  minCapacity;
  minFillRate;
  scaleConstant;
  smooth;
  currentCapacity = 0;
  enabled = false;
  lastMaxRate = 0;
  measuredTxRate = 0;
  requestCount = 0;
  fillRate;
  lastThrottleTime;
  lastTimestamp = 0;
  lastTxRateBucket;
  maxCapacity;
  timeWindow = 0;
  constructor(options) {
    this.beta = options?.beta ?? 0.7;
    this.minCapacity = options?.minCapacity ?? 1;
    this.minFillRate = options?.minFillRate ?? 0.5;
    this.scaleConstant = options?.scaleConstant ?? 0.4;
    this.smooth = options?.smooth ?? 0.8;
    const currentTimeInSeconds = this.getCurrentTimeInSeconds();
    this.lastThrottleTime = currentTimeInSeconds;
    this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
    this.fillRate = this.minFillRate;
    this.maxCapacity = this.minCapacity;
  }
  getCurrentTimeInSeconds() {
    return Date.now() / 1e3;
  }
  async getSendToken() {
    return this.acquireTokenBucket(1);
  }
  async acquireTokenBucket(amount) {
    if (!this.enabled) {
      return;
    }
    this.refillTokenBucket();
    if (amount > this.currentCapacity) {
      const delay = (amount - this.currentCapacity) / this.fillRate * 1e3;
      await new Promise((resolve) => DefaultRateLimiter.setTimeoutFn(resolve, delay));
    }
    this.currentCapacity = this.currentCapacity - amount;
  }
  refillTokenBucket() {
    const timestamp2 = this.getCurrentTimeInSeconds();
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp2;
      return;
    }
    const fillAmount = (timestamp2 - this.lastTimestamp) * this.fillRate;
    this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
    this.lastTimestamp = timestamp2;
  }
  updateClientSendingRate(response) {
    let calculatedRate;
    this.updateMeasuredRate();
    if (isThrottlingError(response)) {
      const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
      this.lastMaxRate = rateToUse;
      this.calculateTimeWindow();
      this.lastThrottleTime = this.getCurrentTimeInSeconds();
      calculatedRate = this.cubicThrottle(rateToUse);
      this.enableTokenBucket();
    } else {
      this.calculateTimeWindow();
      calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
    }
    const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
    this.updateTokenBucketRate(newRate);
  }
  calculateTimeWindow() {
    this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
  }
  cubicThrottle(rateToUse) {
    return this.getPrecise(rateToUse * this.beta);
  }
  cubicSuccess(timestamp2) {
    return this.getPrecise(this.scaleConstant * Math.pow(timestamp2 - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
  }
  enableTokenBucket() {
    this.enabled = true;
  }
  updateTokenBucketRate(newRate) {
    this.refillTokenBucket();
    this.fillRate = Math.max(newRate, this.minFillRate);
    this.maxCapacity = Math.max(newRate, this.minCapacity);
    this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
  }
  updateMeasuredRate() {
    const t2 = this.getCurrentTimeInSeconds();
    const timeBucket = Math.floor(t2 * 2) / 2;
    this.requestCount++;
    if (timeBucket > this.lastTxRateBucket) {
      const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
      this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
      this.requestCount = 0;
      this.lastTxRateBucket = timeBucket;
    }
  }
  getPrecise(num) {
    return parseFloat(num.toFixed(8));
  }
}
const DEFAULT_RETRY_DELAY_BASE = 100;
const MAXIMUM_RETRY_DELAY = 20 * 1e3;
const THROTTLING_RETRY_DELAY_BASE = 500;
const INITIAL_RETRY_TOKENS = 500;
const RETRY_COST = 5;
const TIMEOUT_RETRY_COST = 10;
const NO_RETRY_INCREMENT = 1;
const INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
const REQUEST_HEADER = "amz-sdk-request";
const getDefaultRetryBackoffStrategy = () => {
  let delayBase = DEFAULT_RETRY_DELAY_BASE;
  const computeNextBackoffDelay = (attempts) => {
    return Math.floor(Math.min(MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
  };
  const setDelayBase = (delay) => {
    delayBase = delay;
  };
  return {
    computeNextBackoffDelay,
    setDelayBase
  };
};
const createDefaultRetryToken = ({ retryDelay, retryCount, retryCost }) => {
  const getRetryCount = () => retryCount;
  const getRetryDelay = () => Math.min(MAXIMUM_RETRY_DELAY, retryDelay);
  const getRetryCost = () => retryCost;
  return {
    getRetryCount,
    getRetryDelay,
    getRetryCost
  };
};
class StandardRetryStrategy {
  maxAttempts;
  mode = RETRY_MODES.STANDARD;
  capacity = INITIAL_RETRY_TOKENS;
  retryBackoffStrategy = getDefaultRetryBackoffStrategy();
  maxAttemptsProvider;
  constructor(maxAttempts) {
    this.maxAttempts = maxAttempts;
    this.maxAttemptsProvider = typeof maxAttempts === "function" ? maxAttempts : async () => maxAttempts;
  }
  async acquireInitialRetryToken(retryTokenScope) {
    return createDefaultRetryToken({
      retryDelay: DEFAULT_RETRY_DELAY_BASE,
      retryCount: 0
    });
  }
  async refreshRetryTokenForRetry(token, errorInfo) {
    const maxAttempts = await this.getMaxAttempts();
    if (this.shouldRetry(token, errorInfo, maxAttempts)) {
      const errorType = errorInfo.errorType;
      this.retryBackoffStrategy.setDelayBase(errorType === "THROTTLING" ? THROTTLING_RETRY_DELAY_BASE : DEFAULT_RETRY_DELAY_BASE);
      const delayFromErrorType = this.retryBackoffStrategy.computeNextBackoffDelay(token.getRetryCount());
      const retryDelay = errorInfo.retryAfterHint ? Math.max(errorInfo.retryAfterHint.getTime() - Date.now() || 0, delayFromErrorType) : delayFromErrorType;
      const capacityCost = this.getCapacityCost(errorType);
      this.capacity -= capacityCost;
      return createDefaultRetryToken({
        retryDelay,
        retryCount: token.getRetryCount() + 1,
        retryCost: capacityCost
      });
    }
    throw new Error("No retry token available");
  }
  recordSuccess(token) {
    this.capacity = Math.max(INITIAL_RETRY_TOKENS, this.capacity + (token.getRetryCost() ?? NO_RETRY_INCREMENT));
  }
  getCapacity() {
    return this.capacity;
  }
  async getMaxAttempts() {
    try {
      return await this.maxAttemptsProvider();
    } catch (error2) {
      console.warn(`Max attempts provider could not resolve. Using default of ${DEFAULT_MAX_ATTEMPTS}`);
      return DEFAULT_MAX_ATTEMPTS;
    }
  }
  shouldRetry(tokenToRenew, errorInfo, maxAttempts) {
    const attempts = tokenToRenew.getRetryCount() + 1;
    return attempts < maxAttempts && this.capacity >= this.getCapacityCost(errorInfo.errorType) && this.isRetryableError(errorInfo.errorType);
  }
  getCapacityCost(errorType) {
    return errorType === "TRANSIENT" ? TIMEOUT_RETRY_COST : RETRY_COST;
  }
  isRetryableError(errorType) {
    return errorType === "THROTTLING" || errorType === "TRANSIENT";
  }
}
class AdaptiveRetryStrategy {
  maxAttemptsProvider;
  rateLimiter;
  standardRetryStrategy;
  mode = RETRY_MODES.ADAPTIVE;
  constructor(maxAttemptsProvider, options) {
    this.maxAttemptsProvider = maxAttemptsProvider;
    const { rateLimiter } = options ?? {};
    this.rateLimiter = rateLimiter ?? new DefaultRateLimiter();
    this.standardRetryStrategy = new StandardRetryStrategy(maxAttemptsProvider);
  }
  async acquireInitialRetryToken(retryTokenScope) {
    await this.rateLimiter.getSendToken();
    return this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
  }
  async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
    this.rateLimiter.updateClientSendingRate(errorInfo);
    return this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
  }
  recordSuccess(token) {
    this.rateLimiter.updateClientSendingRate({});
    this.standardRetryStrategy.recordSuccess(token);
  }
}
const randomUUID = crypto$1.randomUUID.bind(crypto$1);
const decimalToHex = Array.from({ length: 256 }, (_, i2) => i2.toString(16).padStart(2, "0"));
const v4 = () => {
  if (randomUUID) {
    return randomUUID();
  }
  const rnds = new Uint8Array(16);
  crypto.getRandomValues(rnds);
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return decimalToHex[rnds[0]] + decimalToHex[rnds[1]] + decimalToHex[rnds[2]] + decimalToHex[rnds[3]] + "-" + decimalToHex[rnds[4]] + decimalToHex[rnds[5]] + "-" + decimalToHex[rnds[6]] + decimalToHex[rnds[7]] + "-" + decimalToHex[rnds[8]] + decimalToHex[rnds[9]] + "-" + decimalToHex[rnds[10]] + decimalToHex[rnds[11]] + decimalToHex[rnds[12]] + decimalToHex[rnds[13]] + decimalToHex[rnds[14]] + decimalToHex[rnds[15]];
};
const asSdkError = (error2) => {
  if (error2 instanceof Error)
    return error2;
  if (error2 instanceof Object)
    return Object.assign(new Error(), error2);
  if (typeof error2 === "string")
    return new Error(error2);
  return new Error(`AWS SDK error wrapper for ${error2}`);
};
const ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
const CONFIG_MAX_ATTEMPTS = "max_attempts";
const NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => {
    const value = env2[ENV_MAX_ATTEMPTS];
    if (!value)
      return void 0;
    const maxAttempt = parseInt(value);
    if (Number.isNaN(maxAttempt)) {
      throw new Error(`Environment variable ${ENV_MAX_ATTEMPTS} mast be a number, got "${value}"`);
    }
    return maxAttempt;
  },
  configFileSelector: (profile) => {
    const value = profile[CONFIG_MAX_ATTEMPTS];
    if (!value)
      return void 0;
    const maxAttempt = parseInt(value);
    if (Number.isNaN(maxAttempt)) {
      throw new Error(`Shared config file entry ${CONFIG_MAX_ATTEMPTS} mast be a number, got "${value}"`);
    }
    return maxAttempt;
  },
  default: DEFAULT_MAX_ATTEMPTS
};
const resolveRetryConfig = (input) => {
  const { retryStrategy, retryMode: _retryMode, maxAttempts: _maxAttempts } = input;
  const maxAttempts = normalizeProvider(_maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
  return Object.assign(input, {
    maxAttempts,
    retryStrategy: async () => {
      if (retryStrategy) {
        return retryStrategy;
      }
      const retryMode = await normalizeProvider(_retryMode)();
      if (retryMode === RETRY_MODES.ADAPTIVE) {
        return new AdaptiveRetryStrategy(maxAttempts);
      }
      return new StandardRetryStrategy(maxAttempts);
    }
  });
};
const ENV_RETRY_MODE = "AWS_RETRY_MODE";
const CONFIG_RETRY_MODE = "retry_mode";
const NODE_RETRY_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[ENV_RETRY_MODE],
  configFileSelector: (profile) => profile[CONFIG_RETRY_MODE],
  default: DEFAULT_RETRY_MODE
};
const getAllAliases = (name, aliases) => {
  const _aliases = [];
  if (name) {
    _aliases.push(name);
  }
  if (aliases) {
    for (const alias of aliases) {
      _aliases.push(alias);
    }
  }
  return _aliases;
};
const getMiddlewareNameWithAliases = (name, aliases) => {
  return `${name || "anonymous"}${aliases && aliases.length > 0 ? ` (a.k.a. ${aliases.join(",")})` : ""}`;
};
const constructStack = () => {
  let absoluteEntries = [];
  let relativeEntries = [];
  let identifyOnResolve = false;
  const entriesNameSet = /* @__PURE__ */ new Set();
  const sort = (entries) => entries.sort((a2, b2) => stepWeights[b2.step] - stepWeights[a2.step] || priorityWeights[b2.priority || "normal"] - priorityWeights[a2.priority || "normal"]);
  const removeByName = (toRemove) => {
    let isRemoved = false;
    const filterCb = (entry) => {
      const aliases = getAllAliases(entry.name, entry.aliases);
      if (aliases.includes(toRemove)) {
        isRemoved = true;
        for (const alias of aliases) {
          entriesNameSet.delete(alias);
        }
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  const removeByReference = (toRemove) => {
    let isRemoved = false;
    const filterCb = (entry) => {
      if (entry.middleware === toRemove) {
        isRemoved = true;
        for (const alias of getAllAliases(entry.name, entry.aliases)) {
          entriesNameSet.delete(alias);
        }
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  const cloneTo = (toStack) => {
    absoluteEntries.forEach((entry) => {
      toStack.add(entry.middleware, { ...entry });
    });
    relativeEntries.forEach((entry) => {
      toStack.addRelativeTo(entry.middleware, { ...entry });
    });
    toStack.identifyOnResolve?.(stack.identifyOnResolve());
    return toStack;
  };
  const expandRelativeMiddlewareList = (from) => {
    const expandedMiddlewareList = [];
    from.before.forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    expandedMiddlewareList.push(from);
    from.after.reverse().forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    return expandedMiddlewareList;
  };
  const getMiddlewareList = (debug = false) => {
    const normalizedAbsoluteEntries = [];
    const normalizedRelativeEntries = [];
    const normalizedEntriesNameMap = {};
    absoluteEntries.forEach((entry) => {
      const normalizedEntry = {
        ...entry,
        before: [],
        after: []
      };
      for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) {
        normalizedEntriesNameMap[alias] = normalizedEntry;
      }
      normalizedAbsoluteEntries.push(normalizedEntry);
    });
    relativeEntries.forEach((entry) => {
      const normalizedEntry = {
        ...entry,
        before: [],
        after: []
      };
      for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) {
        normalizedEntriesNameMap[alias] = normalizedEntry;
      }
      normalizedRelativeEntries.push(normalizedEntry);
    });
    normalizedRelativeEntries.forEach((entry) => {
      if (entry.toMiddleware) {
        const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
        if (toMiddleware === void 0) {
          if (debug) {
            return;
          }
          throw new Error(`${entry.toMiddleware} is not found when adding ${getMiddlewareNameWithAliases(entry.name, entry.aliases)} middleware ${entry.relation} ${entry.toMiddleware}`);
        }
        if (entry.relation === "after") {
          toMiddleware.after.push(entry);
        }
        if (entry.relation === "before") {
          toMiddleware.before.push(entry);
        }
      }
    });
    const mainChain = sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce((wholeList, expandedMiddlewareList) => {
      wholeList.push(...expandedMiddlewareList);
      return wholeList;
    }, []);
    return mainChain;
  };
  const stack = {
    add: (middleware, options = {}) => {
      const { name, override, aliases: _aliases } = options;
      const entry = {
        step: "initialize",
        priority: "normal",
        middleware,
        ...options
      };
      const aliases = getAllAliases(name, _aliases);
      if (aliases.length > 0) {
        if (aliases.some((alias) => entriesNameSet.has(alias))) {
          if (!override)
            throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
          for (const alias of aliases) {
            const toOverrideIndex = absoluteEntries.findIndex((entry2) => entry2.name === alias || entry2.aliases?.some((a2) => a2 === alias));
            if (toOverrideIndex === -1) {
              continue;
            }
            const toOverride = absoluteEntries[toOverrideIndex];
            if (toOverride.step !== entry.step || entry.priority !== toOverride.priority) {
              throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware with ${entry.priority} priority in ${entry.step} step.`);
            }
            absoluteEntries.splice(toOverrideIndex, 1);
          }
        }
        for (const alias of aliases) {
          entriesNameSet.add(alias);
        }
      }
      absoluteEntries.push(entry);
    },
    addRelativeTo: (middleware, options) => {
      const { name, override, aliases: _aliases } = options;
      const entry = {
        middleware,
        ...options
      };
      const aliases = getAllAliases(name, _aliases);
      if (aliases.length > 0) {
        if (aliases.some((alias) => entriesNameSet.has(alias))) {
          if (!override)
            throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
          for (const alias of aliases) {
            const toOverrideIndex = relativeEntries.findIndex((entry2) => entry2.name === alias || entry2.aliases?.some((a2) => a2 === alias));
            if (toOverrideIndex === -1) {
              continue;
            }
            const toOverride = relativeEntries[toOverrideIndex];
            if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) {
              throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
            }
            relativeEntries.splice(toOverrideIndex, 1);
          }
        }
        for (const alias of aliases) {
          entriesNameSet.add(alias);
        }
      }
      relativeEntries.push(entry);
    },
    clone: () => cloneTo(constructStack()),
    use: (plugin) => {
      plugin.applyToStack(stack);
    },
    remove: (toRemove) => {
      if (typeof toRemove === "string")
        return removeByName(toRemove);
      else
        return removeByReference(toRemove);
    },
    removeByTag: (toRemove) => {
      let isRemoved = false;
      const filterCb = (entry) => {
        const { tags, name, aliases: _aliases } = entry;
        if (tags && tags.includes(toRemove)) {
          const aliases = getAllAliases(name, _aliases);
          for (const alias of aliases) {
            entriesNameSet.delete(alias);
          }
          isRemoved = true;
          return false;
        }
        return true;
      };
      absoluteEntries = absoluteEntries.filter(filterCb);
      relativeEntries = relativeEntries.filter(filterCb);
      return isRemoved;
    },
    concat: (from) => {
      const cloned = cloneTo(constructStack());
      cloned.use(from);
      cloned.identifyOnResolve(identifyOnResolve || cloned.identifyOnResolve() || (from.identifyOnResolve?.() ?? false));
      return cloned;
    },
    applyToStack: cloneTo,
    identify: () => {
      return getMiddlewareList(true).map((mw) => {
        const step = mw.step ?? mw.relation + " " + mw.toMiddleware;
        return getMiddlewareNameWithAliases(mw.name, mw.aliases) + " - " + step;
      });
    },
    identifyOnResolve(toggle) {
      if (typeof toggle === "boolean")
        identifyOnResolve = toggle;
      return identifyOnResolve;
    },
    resolve: (handler, context) => {
      for (const middleware of getMiddlewareList().map((entry) => entry.middleware).reverse()) {
        handler = middleware(handler, context);
      }
      if (identifyOnResolve) {
        console.log(stack.identify());
      }
      return handler;
    }
  };
  return stack;
};
const stepWeights = {
  initialize: 5,
  serialize: 4,
  build: 3,
  finalizeRequest: 2,
  deserialize: 1
};
const priorityWeights = {
  high: 3,
  normal: 2,
  low: 1
};
class Client {
  config;
  middlewareStack = constructStack();
  initConfig;
  handlers;
  constructor(config2) {
    this.config = config2;
    const { protocol, protocolSettings } = config2;
    if (protocolSettings) {
      if (typeof protocol === "function") {
        config2.protocol = new protocol(protocolSettings);
      }
    }
  }
  send(command, optionsOrCb, cb) {
    const options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0;
    const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb;
    const useHandlerCache = options === void 0 && this.config.cacheMiddleware === true;
    let handler;
    if (useHandlerCache) {
      if (!this.handlers) {
        this.handlers = /* @__PURE__ */ new WeakMap();
      }
      const handlers = this.handlers;
      if (handlers.has(command.constructor)) {
        handler = handlers.get(command.constructor);
      } else {
        handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
        handlers.set(command.constructor, handler);
      }
    } else {
      delete this.handlers;
      handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
    }
    if (callback) {
      handler(command).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {
      });
    } else {
      return handler(command).then((result) => result.output);
    }
  }
  destroy() {
    this.config?.requestHandler?.destroy?.();
    delete this.handlers;
  }
}
const SENSITIVE_STRING = "***SensitiveInformation***";
function schemaLogFilter(schema2, data) {
  if (data == null) {
    return data;
  }
  const ns = NormalizedSchema.of(schema2);
  if (ns.getMergedTraits().sensitive) {
    return SENSITIVE_STRING;
  }
  if (ns.isListSchema()) {
    const isSensitive = !!ns.getValueSchema().getMergedTraits().sensitive;
    if (isSensitive) {
      return SENSITIVE_STRING;
    }
  } else if (ns.isMapSchema()) {
    const isSensitive = !!ns.getKeySchema().getMergedTraits().sensitive || !!ns.getValueSchema().getMergedTraits().sensitive;
    if (isSensitive) {
      return SENSITIVE_STRING;
    }
  } else if (ns.isStructSchema() && typeof data === "object") {
    const object = data;
    const newObject = {};
    for (const [member, memberNs] of ns.structIterator()) {
      if (object[member] != null) {
        newObject[member] = schemaLogFilter(memberNs, object[member]);
      }
    }
    return newObject;
  }
  return data;
}
class Command {
  middlewareStack = constructStack();
  schema;
  static classBuilder() {
    return new ClassBuilder();
  }
  resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor }) {
    for (const mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options)) {
      this.middlewareStack.use(mw);
    }
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog,
      outputFilterSensitiveLog,
      [SMITHY_CONTEXT_KEY]: {
        commandInstance: this,
        ...smithyContext
      },
      ...additionalContext
    };
    const { requestHandler: requestHandler2 } = configuration;
    return stack.resolve((request2) => requestHandler2.handle(request2.request, options || {}), handlerExecutionContext);
  }
}
class ClassBuilder {
  _init = () => {
  };
  _ep = {};
  _middlewareFn = () => [];
  _commandName = "";
  _clientName = "";
  _additionalContext = {};
  _smithyContext = {};
  _inputFilterSensitiveLog = void 0;
  _outputFilterSensitiveLog = void 0;
  _serializer = null;
  _deserializer = null;
  _operationSchema;
  init(cb) {
    this._init = cb;
  }
  ep(endpointParameterInstructions) {
    this._ep = endpointParameterInstructions;
    return this;
  }
  m(middlewareSupplier) {
    this._middlewareFn = middlewareSupplier;
    return this;
  }
  s(service, operation, smithyContext = {}) {
    this._smithyContext = {
      service,
      operation,
      ...smithyContext
    };
    return this;
  }
  c(additionalContext = {}) {
    this._additionalContext = additionalContext;
    return this;
  }
  n(clientName, commandName) {
    this._clientName = clientName;
    this._commandName = commandName;
    return this;
  }
  f(inputFilter = (_) => _, outputFilter = (_) => _) {
    this._inputFilterSensitiveLog = inputFilter;
    this._outputFilterSensitiveLog = outputFilter;
    return this;
  }
  ser(serializer) {
    this._serializer = serializer;
    return this;
  }
  de(deserializer) {
    this._deserializer = deserializer;
    return this;
  }
  sc(operation) {
    this._operationSchema = operation;
    this._smithyContext.operationSchema = operation;
    return this;
  }
  build() {
    const closure = this;
    let CommandRef;
    return CommandRef = class extends Command {
      input;
      static getEndpointParameterInstructions() {
        return closure._ep;
      }
      constructor(...[input]) {
        super();
        this.input = input ?? {};
        closure._init(this);
        this.schema = closure._operationSchema;
      }
      resolveMiddleware(stack, configuration, options) {
        const op = closure._operationSchema;
        const input = op?.[4] ?? op?.input;
        const output = op?.[5] ?? op?.output;
        return this.resolveMiddlewareWithContext(stack, configuration, options, {
          CommandCtor: CommandRef,
          middlewareFn: closure._middlewareFn,
          clientName: closure._clientName,
          commandName: closure._commandName,
          inputFilterSensitiveLog: closure._inputFilterSensitiveLog ?? (op ? schemaLogFilter.bind(null, input) : (_) => _),
          outputFilterSensitiveLog: closure._outputFilterSensitiveLog ?? (op ? schemaLogFilter.bind(null, output) : (_) => _),
          smithyContext: closure._smithyContext,
          additionalContext: closure._additionalContext
        });
      }
      serialize = closure._serializer;
      deserialize = closure._deserializer;
    };
  }
}
class ServiceException extends Error {
  $fault;
  $response;
  $retryable;
  $metadata;
  constructor(options) {
    super(options.message);
    Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype);
    this.name = options.name;
    this.$fault = options.$fault;
    this.$metadata = options.$metadata;
  }
  static isInstance(value) {
    if (!value)
      return false;
    const candidate = value;
    return ServiceException.prototype.isPrototypeOf(candidate) || Boolean(candidate.$fault) && Boolean(candidate.$metadata) && (candidate.$fault === "client" || candidate.$fault === "server");
  }
  static [Symbol.hasInstance](instance) {
    if (!instance)
      return false;
    const candidate = instance;
    if (this === ServiceException) {
      return ServiceException.isInstance(instance);
    }
    if (ServiceException.isInstance(instance)) {
      if (candidate.name && this.name) {
        return this.prototype.isPrototypeOf(instance) || candidate.name === this.name;
      }
      return this.prototype.isPrototypeOf(instance);
    }
    return false;
  }
}
const loadConfigsForDefaultMode = (mode) => {
  switch (mode) {
    case "standard":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "in-region":
      return {
        retryMode: "standard",
        connectionTimeout: 1100
      };
    case "cross-region":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "mobile":
      return {
        retryMode: "standard",
        connectionTimeout: 3e4
      };
    default:
      return {};
  }
};
let warningEmitted = false;
const emitWarningIfUnsupportedVersion = (version2) => {
  if (version2 && !warningEmitted && parseInt(version2.substring(1, version2.indexOf("."))) < 16) {
    warningEmitted = true;
  }
};
const getChecksumConfiguration = (runtimeConfig) => {
  const checksumAlgorithms = [];
  for (const id in AlgorithmId) {
    const algorithmId = AlgorithmId[id];
    if (runtimeConfig[algorithmId] === void 0) {
      continue;
    }
    checksumAlgorithms.push({
      algorithmId: () => algorithmId,
      checksumConstructor: () => runtimeConfig[algorithmId]
    });
  }
  return {
    addChecksumAlgorithm(algo) {
      checksumAlgorithms.push(algo);
    },
    checksumAlgorithms() {
      return checksumAlgorithms;
    }
  };
};
const resolveChecksumRuntimeConfig = (clientConfig) => {
  const runtimeConfig = {};
  clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
    runtimeConfig[checksumAlgorithm.algorithmId()] = checksumAlgorithm.checksumConstructor();
  });
  return runtimeConfig;
};
const getRetryConfiguration = (runtimeConfig) => {
  return {
    setRetryStrategy(retryStrategy) {
      runtimeConfig.retryStrategy = retryStrategy;
    },
    retryStrategy() {
      return runtimeConfig.retryStrategy;
    }
  };
};
const resolveRetryRuntimeConfig = (retryStrategyConfiguration) => {
  const runtimeConfig = {};
  runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy();
  return runtimeConfig;
};
const getDefaultExtensionConfiguration = (runtimeConfig) => {
  return Object.assign(getChecksumConfiguration(runtimeConfig), getRetryConfiguration(runtimeConfig));
};
const resolveDefaultRuntimeConfig = (config2) => {
  return Object.assign(resolveChecksumRuntimeConfig(config2), resolveRetryRuntimeConfig(config2));
};
class NoOpLogger {
  trace() {
  }
  debug() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
}
const isStreamingPayload = (request2) => request2?.body instanceof Readable || typeof ReadableStream !== "undefined" && request2?.body instanceof ReadableStream;
const retryMiddleware = (options) => (next, context) => async (args) => {
  let retryStrategy = await options.retryStrategy();
  const maxAttempts = await options.maxAttempts();
  if (isRetryStrategyV2(retryStrategy)) {
    retryStrategy = retryStrategy;
    let retryToken = await retryStrategy.acquireInitialRetryToken(context["partition_id"]);
    let lastError = new Error();
    let attempts = 0;
    let totalRetryDelay = 0;
    const { request: request2 } = args;
    const isRequest2 = HttpRequest.isInstance(request2);
    if (isRequest2) {
      request2.headers[INVOCATION_ID_HEADER] = v4();
    }
    while (true) {
      try {
        if (isRequest2) {
          request2.headers[REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
        }
        const { response, output } = await next(args);
        retryStrategy.recordSuccess(retryToken);
        output.$metadata.attempts = attempts + 1;
        output.$metadata.totalRetryDelay = totalRetryDelay;
        return { response, output };
      } catch (e2) {
        const retryErrorInfo = getRetryErrorInfo(e2);
        lastError = asSdkError(e2);
        if (isRequest2 && isStreamingPayload(request2)) {
          (context.logger instanceof NoOpLogger ? console : context.logger)?.warn("An error was encountered in a non-retryable streaming request.");
          throw lastError;
        }
        try {
          retryToken = await retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
        } catch (refreshError) {
          if (!lastError.$metadata) {
            lastError.$metadata = {};
          }
          lastError.$metadata.attempts = attempts + 1;
          lastError.$metadata.totalRetryDelay = totalRetryDelay;
          throw lastError;
        }
        attempts = retryToken.getRetryCount();
        const delay = retryToken.getRetryDelay();
        totalRetryDelay += delay;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } else {
    retryStrategy = retryStrategy;
    if (retryStrategy?.mode)
      context.userAgent = [...context.userAgent || [], ["cfg/retry-mode", retryStrategy.mode]];
    return retryStrategy.retry(next, args);
  }
};
const isRetryStrategyV2 = (retryStrategy) => typeof retryStrategy.acquireInitialRetryToken !== "undefined" && typeof retryStrategy.refreshRetryTokenForRetry !== "undefined" && typeof retryStrategy.recordSuccess !== "undefined";
const getRetryErrorInfo = (error2) => {
  const errorInfo = {
    error: error2,
    errorType: getRetryErrorType(error2)
  };
  const retryAfterHint = getRetryAfterHint(error2.$response);
  if (retryAfterHint) {
    errorInfo.retryAfterHint = retryAfterHint;
  }
  return errorInfo;
};
const getRetryErrorType = (error2) => {
  if (isThrottlingError(error2))
    return "THROTTLING";
  if (isTransientError(error2))
    return "TRANSIENT";
  if (isServerError(error2))
    return "SERVER_ERROR";
  return "CLIENT_ERROR";
};
const retryMiddlewareOptions = {
  name: "retryMiddleware",
  tags: ["RETRY"],
  step: "finalizeRequest",
  priority: "high",
  override: true
};
const getRetryPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
  }
});
const getRetryAfterHint = (response) => {
  if (!HttpResponse.isInstance(response))
    return;
  const retryAfterHeaderName = Object.keys(response.headers).find((key) => key.toLowerCase() === "retry-after");
  if (!retryAfterHeaderName)
    return;
  const retryAfter = response.headers[retryAfterHeaderName];
  const retryAfterSeconds = Number(retryAfter);
  if (!Number.isNaN(retryAfterSeconds))
    return new Date(retryAfterSeconds * 1e3);
  const retryAfterDate = new Date(retryAfter);
  return retryAfterDate;
};
const SHORT_TO_HEX = {};
const HEX_TO_SHORT = {};
for (let i2 = 0; i2 < 256; i2++) {
  let encodedByte = i2.toString(16).toLowerCase();
  if (encodedByte.length === 1) {
    encodedByte = `0${encodedByte}`;
  }
  SHORT_TO_HEX[i2] = encodedByte;
  HEX_TO_SHORT[encodedByte] = i2;
}
function fromHex(encoded) {
  if (encoded.length % 2 !== 0) {
    throw new Error("Hex encoded strings must have an even number length");
  }
  const out = new Uint8Array(encoded.length / 2);
  for (let i2 = 0; i2 < encoded.length; i2 += 2) {
    const encodedByte = encoded.slice(i2, i2 + 2).toLowerCase();
    if (encodedByte in HEX_TO_SHORT) {
      out[i2 / 2] = HEX_TO_SHORT[encodedByte];
    } else {
      throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
    }
  }
  return out;
}
function toHex(bytes) {
  let out = "";
  for (let i2 = 0; i2 < bytes.byteLength; i2++) {
    out += SHORT_TO_HEX[bytes[i2]];
  }
  return out;
}
const isArrayBuffer = (arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]";
const fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
  if (!isArrayBuffer(input)) {
    throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
  }
  return Buffer$1.from(input, offset, length);
};
const fromString = (input, encoding) => {
  if (typeof input !== "string") {
    throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  }
  return encoding ? Buffer$1.from(input, encoding) : Buffer$1.from(input);
};
const fromUtf8 = (input) => {
  const buf = fromString(input, "utf8");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};
const toUint8Array = (data) => {
  if (typeof data === "string") {
    return fromUtf8(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
};
const toUtf8 = (input) => {
  if (typeof input === "string") {
    return input;
  }
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
    throw new Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
  }
  return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
};
const ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
const CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
const AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
const SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
const EXPIRES_QUERY_PARAM = "X-Amz-Expires";
const SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
const TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
const AUTH_HEADER = "authorization";
const AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
const DATE_HEADER = "date";
const GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER];
const SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
const SHA256_HEADER = "x-amz-content-sha256";
const TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
const ALWAYS_UNSIGNABLE_HEADERS = {
  authorization: true,
  "cache-control": true,
  connection: true,
  expect: true,
  from: true,
  "keep-alive": true,
  "max-forwards": true,
  pragma: true,
  referer: true,
  te: true,
  trailer: true,
  "transfer-encoding": true,
  upgrade: true,
  "user-agent": true,
  "x-amzn-trace-id": true
};
const PROXY_HEADER_PATTERN = /^proxy-/;
const SEC_HEADER_PATTERN = /^sec-/;
const ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
const EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
const UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
const MAX_CACHE_SIZE = 50;
const KEY_TYPE_IDENTIFIER = "aws4_request";
const MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;
const signingKeyCache = {};
const cacheQueue = [];
const createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`;
const getSigningKey = async (sha256Constructor, credentials, shortDate, region, service) => {
  const credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
  const cacheKey = `${shortDate}:${region}:${service}:${toHex(credsHash)}:${credentials.sessionToken}`;
  if (cacheKey in signingKeyCache) {
    return signingKeyCache[cacheKey];
  }
  cacheQueue.push(cacheKey);
  while (cacheQueue.length > MAX_CACHE_SIZE) {
    delete signingKeyCache[cacheQueue.shift()];
  }
  let key = `AWS4${credentials.secretAccessKey}`;
  for (const signable of [shortDate, region, service, KEY_TYPE_IDENTIFIER]) {
    key = await hmac(sha256Constructor, key, signable);
  }
  return signingKeyCache[cacheKey] = key;
};
const hmac = (ctor, secret, data) => {
  const hash = new ctor(secret);
  hash.update(toUint8Array(data));
  return hash.digest();
};
const getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
  const canonical = {};
  for (const headerName of Object.keys(headers).sort()) {
    if (headers[headerName] == void 0) {
      continue;
    }
    const canonicalHeaderName = headerName.toLowerCase();
    if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || unsignableHeaders?.has(canonicalHeaderName) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
      if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) {
        continue;
      }
    }
    canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
  }
  return canonical;
};
const getPayloadHash = async ({ headers, body }, hashConstructor) => {
  for (const headerName of Object.keys(headers)) {
    if (headerName.toLowerCase() === SHA256_HEADER) {
      return headers[headerName];
    }
  }
  if (body == void 0) {
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  } else if (typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer(body)) {
    const hashCtor = new hashConstructor();
    hashCtor.update(toUint8Array(body));
    return toHex(await hashCtor.digest());
  }
  return UNSIGNED_PAYLOAD;
};
class HeaderFormatter {
  format(headers) {
    const chunks = [];
    for (const headerName of Object.keys(headers)) {
      const bytes = fromUtf8(headerName);
      chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
    }
    const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
    let position = 0;
    for (const chunk of chunks) {
      out.set(chunk, position);
      position += chunk.byteLength;
    }
    return out;
  }
  formatHeaderValue(header) {
    switch (header.type) {
      case "boolean":
        return Uint8Array.from([header.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, header.value]);
      case "short":
        const shortView = new DataView(new ArrayBuffer(3));
        shortView.setUint8(0, 3);
        shortView.setInt16(1, header.value, false);
        return new Uint8Array(shortView.buffer);
      case "integer":
        const intView = new DataView(new ArrayBuffer(5));
        intView.setUint8(0, 4);
        intView.setInt32(1, header.value, false);
        return new Uint8Array(intView.buffer);
      case "long":
        const longBytes = new Uint8Array(9);
        longBytes[0] = 5;
        longBytes.set(header.value.bytes, 1);
        return longBytes;
      case "binary":
        const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
        binView.setUint8(0, 6);
        binView.setUint16(1, header.value.byteLength, false);
        const binBytes = new Uint8Array(binView.buffer);
        binBytes.set(header.value, 3);
        return binBytes;
      case "string":
        const utf8Bytes = fromUtf8(header.value);
        const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7);
        strView.setUint16(1, utf8Bytes.byteLength, false);
        const strBytes = new Uint8Array(strView.buffer);
        strBytes.set(utf8Bytes, 3);
        return strBytes;
      case "timestamp":
        const tsBytes = new Uint8Array(9);
        tsBytes[0] = 8;
        tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
        return tsBytes;
      case "uuid":
        if (!UUID_PATTERN.test(header.value)) {
          throw new Error(`Invalid UUID received: ${header.value}`);
        }
        const uuidBytes = new Uint8Array(17);
        uuidBytes[0] = 9;
        uuidBytes.set(fromHex(header.value.replace(/\-/g, "")), 1);
        return uuidBytes;
    }
  }
}
var HEADER_VALUE_TYPE;
(function(HEADER_VALUE_TYPE2) {
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolTrue"] = 0] = "boolTrue";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolFalse"] = 1] = "boolFalse";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byte"] = 2] = "byte";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["short"] = 3] = "short";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["integer"] = 4] = "integer";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["long"] = 5] = "long";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byteArray"] = 6] = "byteArray";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["string"] = 7] = "string";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["timestamp"] = 8] = "timestamp";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
class Int64 {
  bytes;
  constructor(bytes) {
    this.bytes = bytes;
    if (bytes.byteLength !== 8) {
      throw new Error("Int64 buffers must be exactly 8 bytes");
    }
  }
  static fromNumber(number) {
    if (number > 9223372036854776e3 || number < -9223372036854776e3) {
      throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
    }
    const bytes = new Uint8Array(8);
    for (let i2 = 7, remaining = Math.abs(Math.round(number)); i2 > -1 && remaining > 0; i2--, remaining /= 256) {
      bytes[i2] = remaining;
    }
    if (number < 0) {
      negate(bytes);
    }
    return new Int64(bytes);
  }
  valueOf() {
    const bytes = this.bytes.slice(0);
    const negative = bytes[0] & 128;
    if (negative) {
      negate(bytes);
    }
    return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
}
function negate(bytes) {
  for (let i2 = 0; i2 < 8; i2++) {
    bytes[i2] ^= 255;
  }
  for (let i2 = 7; i2 > -1; i2--) {
    bytes[i2]++;
    if (bytes[i2] !== 0)
      break;
  }
}
const hasHeader = (soughtHeader, headers) => {
  soughtHeader = soughtHeader.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
};
const moveHeadersToQuery = (request2, options = {}) => {
  const { headers, query = {} } = HttpRequest.clone(request2);
  for (const name of Object.keys(headers)) {
    const lname = name.toLowerCase();
    if (lname.slice(0, 6) === "x-amz-" && !options.unhoistableHeaders?.has(lname) || options.hoistableHeaders?.has(lname)) {
      query[name] = headers[name];
      delete headers[name];
    }
  }
  return {
    ...request2,
    headers,
    query
  };
};
const prepareRequest = (request2) => {
  request2 = HttpRequest.clone(request2);
  for (const headerName of Object.keys(request2.headers)) {
    if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
      delete request2.headers[headerName];
    }
  }
  return request2;
};
const escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
const hexEncode = (c2) => `%${c2.charCodeAt(0).toString(16).toUpperCase()}`;
const getCanonicalQuery = ({ query = {} }) => {
  const keys = [];
  const serialized = {};
  for (const key of Object.keys(query)) {
    if (key.toLowerCase() === SIGNATURE_HEADER) {
      continue;
    }
    const encodedKey = escapeUri(key);
    keys.push(encodedKey);
    const value = query[key];
    if (typeof value === "string") {
      serialized[encodedKey] = `${encodedKey}=${escapeUri(value)}`;
    } else if (Array.isArray(value)) {
      serialized[encodedKey] = value.slice(0).reduce((encoded, value2) => encoded.concat([`${encodedKey}=${escapeUri(value2)}`]), []).sort().join("&");
    }
  }
  return keys.sort().map((key) => serialized[key]).filter((serialized2) => serialized2).join("&");
};
const iso8601 = (time) => toDate(time).toISOString().replace(/\.\d{3}Z$/, "Z");
const toDate = (time) => {
  if (typeof time === "number") {
    return new Date(time * 1e3);
  }
  if (typeof time === "string") {
    if (Number(time)) {
      return new Date(Number(time) * 1e3);
    }
    return new Date(time);
  }
  return time;
};
class SignatureV4Base {
  service;
  regionProvider;
  credentialProvider;
  sha256;
  uriEscapePath;
  applyChecksum;
  constructor({ applyChecksum, credentials, region, service, sha256: sha2562, uriEscapePath = true }) {
    this.service = service;
    this.sha256 = sha2562;
    this.uriEscapePath = uriEscapePath;
    this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
    this.regionProvider = normalizeProvider(region);
    this.credentialProvider = normalizeProvider(credentials);
  }
  createCanonicalRequest(request2, canonicalHeaders, payloadHash) {
    const sortedHeaders = Object.keys(canonicalHeaders).sort();
    return `${request2.method}
${this.getCanonicalPath(request2)}
${getCanonicalQuery(request2)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
  }
  async createStringToSign(longDate, credentialScope, canonicalRequest, algorithmIdentifier) {
    const hash = new this.sha256();
    hash.update(toUint8Array(canonicalRequest));
    const hashedRequest = await hash.digest();
    return `${algorithmIdentifier}
${longDate}
${credentialScope}
${toHex(hashedRequest)}`;
  }
  getCanonicalPath({ path }) {
    if (this.uriEscapePath) {
      const normalizedPathSegments = [];
      for (const pathSegment of path.split("/")) {
        if (pathSegment?.length === 0)
          continue;
        if (pathSegment === ".")
          continue;
        if (pathSegment === "..") {
          normalizedPathSegments.pop();
        } else {
          normalizedPathSegments.push(pathSegment);
        }
      }
      const normalizedPath = `${path?.startsWith("/") ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && path?.endsWith("/") ? "/" : ""}`;
      const doubleEncoded = escapeUri(normalizedPath);
      return doubleEncoded.replace(/%2F/g, "/");
    }
    return path;
  }
  validateResolvedCredentials(credentials) {
    if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string") {
      throw new Error("Resolved credential object is not valid");
    }
  }
  formatDate(now2) {
    const longDate = iso8601(now2).replace(/[\-:]/g, "");
    return {
      longDate,
      shortDate: longDate.slice(0, 8)
    };
  }
  getCanonicalHeaderList(headers) {
    return Object.keys(headers).sort().join(";");
  }
}
class SignatureV4 extends SignatureV4Base {
  headerFormatter = new HeaderFormatter();
  constructor({ applyChecksum, credentials, region, service, sha256: sha2562, uriEscapePath = true }) {
    super({
      applyChecksum,
      credentials,
      region,
      service,
      sha256: sha2562,
      uriEscapePath
    });
  }
  async presign(originalRequest, options = {}) {
    const { signingDate = /* @__PURE__ */ new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, hoistableHeaders, signingRegion, signingService } = options;
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const { longDate, shortDate } = this.formatDate(signingDate);
    if (expiresIn > MAX_PRESIGNED_TTL) {
      return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
    }
    const scope = createScope(shortDate, region, signingService ?? this.service);
    const request2 = moveHeadersToQuery(prepareRequest(originalRequest), { unhoistableHeaders, hoistableHeaders });
    if (credentials.sessionToken) {
      request2.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
    }
    request2.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
    request2.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
    request2.query[AMZ_DATE_QUERY_PARAM] = longDate;
    request2.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
    const canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
    request2.query[SIGNED_HEADERS_QUERY_PARAM] = this.getCanonicalHeaderList(canonicalHeaders);
    request2.query[SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, await getPayloadHash(originalRequest, this.sha256)));
    return request2;
  }
  async sign(toSign, options) {
    if (typeof toSign === "string") {
      return this.signString(toSign, options);
    } else if (toSign.headers && toSign.payload) {
      return this.signEvent(toSign, options);
    } else if (toSign.message) {
      return this.signMessage(toSign, options);
    } else {
      return this.signRequest(toSign, options);
    }
  }
  async signEvent({ headers, payload }, { signingDate = /* @__PURE__ */ new Date(), priorSignature, signingRegion, signingService }) {
    const region = signingRegion ?? await this.regionProvider();
    const { shortDate, longDate } = this.formatDate(signingDate);
    const scope = createScope(shortDate, region, signingService ?? this.service);
    const hashedPayload = await getPayloadHash({ headers: {}, body: payload }, this.sha256);
    const hash = new this.sha256();
    hash.update(headers);
    const hashedHeaders = toHex(await hash.digest());
    const stringToSign = [
      EVENT_ALGORITHM_IDENTIFIER,
      longDate,
      scope,
      priorSignature,
      hashedHeaders,
      hashedPayload
    ].join("\n");
    return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
  }
  async signMessage(signableMessage, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService }) {
    const promise = this.signEvent({
      headers: this.headerFormatter.format(signableMessage.message.headers),
      payload: signableMessage.message.body
    }, {
      signingDate,
      signingRegion,
      signingService,
      priorSignature: signableMessage.priorSignature
    });
    return promise.then((signature) => {
      return { message: signableMessage.message, signature };
    });
  }
  async signString(stringToSign, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService } = {}) {
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const { shortDate } = this.formatDate(signingDate);
    const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
    hash.update(toUint8Array(stringToSign));
    return toHex(await hash.digest());
  }
  async signRequest(requestToSign, { signingDate = /* @__PURE__ */ new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const request2 = prepareRequest(requestToSign);
    const { longDate, shortDate } = this.formatDate(signingDate);
    const scope = createScope(shortDate, region, signingService ?? this.service);
    request2.headers[AMZ_DATE_HEADER] = longDate;
    if (credentials.sessionToken) {
      request2.headers[TOKEN_HEADER] = credentials.sessionToken;
    }
    const payloadHash = await getPayloadHash(request2, this.sha256);
    if (!hasHeader(SHA256_HEADER, request2.headers) && this.applyChecksum) {
      request2.headers[SHA256_HEADER] = payloadHash;
    }
    const canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
    const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, payloadHash));
    request2.headers[AUTH_HEADER] = `${ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${this.getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature}`;
    return request2;
  }
  async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
    const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest, ALGORITHM_IDENTIFIER);
    const hash = new this.sha256(await keyPromise);
    hash.update(toUint8Array(stringToSign));
    return toHex(await hash.digest());
  }
  getSigningKey(credentials, region, shortDate, service) {
    return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
  }
}
const SESSION_TOKEN_QUERY_PARAM = "X-Amz-S3session-Token";
const SESSION_TOKEN_HEADER = SESSION_TOKEN_QUERY_PARAM.toLowerCase();
class SignatureV4S3Express extends SignatureV4 {
  async signWithCredentials(requestToSign, credentials, options) {
    const credentialsWithoutSessionToken = getCredentialsWithoutSessionToken(credentials);
    requestToSign.headers[SESSION_TOKEN_HEADER] = credentials.sessionToken;
    const privateAccess = this;
    setSingleOverride(privateAccess, credentialsWithoutSessionToken);
    return privateAccess.signRequest(requestToSign, options ?? {});
  }
  async presignWithCredentials(requestToSign, credentials, options) {
    const credentialsWithoutSessionToken = getCredentialsWithoutSessionToken(credentials);
    delete requestToSign.headers[SESSION_TOKEN_HEADER];
    requestToSign.headers[SESSION_TOKEN_QUERY_PARAM] = credentials.sessionToken;
    requestToSign.query = requestToSign.query ?? {};
    requestToSign.query[SESSION_TOKEN_QUERY_PARAM] = credentials.sessionToken;
    const privateAccess = this;
    setSingleOverride(privateAccess, credentialsWithoutSessionToken);
    return this.presign(requestToSign, options);
  }
}
function getCredentialsWithoutSessionToken(credentials) {
  const credentialsWithoutSessionToken = {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    expiration: credentials.expiration
  };
  return credentialsWithoutSessionToken;
}
function setSingleOverride(privateAccess, credentialsWithoutSessionToken) {
  const id = setTimeout(() => {
    throw new Error("SignatureV4S3Express credential override was created but not called.");
  }, 10);
  const currentCredentialProvider = privateAccess.credentialProvider;
  const overrideCredentialsProviderOnce = () => {
    clearTimeout(id);
    privateAccess.credentialProvider = currentCredentialProvider;
    return Promise.resolve(credentialsWithoutSessionToken);
  };
  privateAccess.credentialProvider = overrideCredentialsProviderOnce;
}
const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
const fromBase64 = (input) => {
  if (input.length * 3 % 4 !== 0) {
    throw new TypeError(`Incorrect padding on base64 string.`);
  }
  if (!BASE64_REGEX.exec(input)) {
    throw new TypeError(`Invalid base64 string.`);
  }
  const buffer = fromString(input, "base64");
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};
const toBase64 = (_input) => {
  let input;
  if (typeof _input === "string") {
    input = fromUtf8(_input);
  } else {
    input = _input;
  }
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
    throw new Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
  }
  return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("base64");
};
function buildQueryString(query) {
  const parts = [];
  for (let key of Object.keys(query).sort()) {
    const value = query[key];
    key = escapeUri(key);
    if (Array.isArray(value)) {
      for (let i2 = 0, iLen = value.length; i2 < iLen; i2++) {
        parts.push(`${key}=${escapeUri(value[i2])}`);
      }
    } else {
      let qsEntry = key;
      if (value || typeof value === "string") {
        qsEntry += `=${escapeUri(value)}`;
      }
      parts.push(qsEntry);
    }
  }
  return parts.join("&");
}
const NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];
const getTransformedHeaders = (headers) => {
  const transformedHeaders = {};
  for (const name of Object.keys(headers)) {
    const headerValues = headers[name];
    transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
  }
  return transformedHeaders;
};
const timing = {
  setTimeout: (cb, ms2) => setTimeout(cb, ms2),
  clearTimeout: (timeoutId) => clearTimeout(timeoutId)
};
const DEFER_EVENT_LISTENER_TIME$2 = 1e3;
const setConnectionTimeout = (request2, reject, timeoutInMs = 0) => {
  if (!timeoutInMs) {
    return -1;
  }
  const registerTimeout = (offset) => {
    const timeoutId = timing.setTimeout(() => {
      request2.destroy();
      reject(Object.assign(new Error(`@smithy/node-http-handler - the request socket did not establish a connection with the server within the configured timeout of ${timeoutInMs} ms.`), {
        name: "TimeoutError"
      }));
    }, timeoutInMs - offset);
    const doWithSocket = (socket) => {
      if (socket?.connecting) {
        socket.on("connect", () => {
          timing.clearTimeout(timeoutId);
        });
      } else {
        timing.clearTimeout(timeoutId);
      }
    };
    if (request2.socket) {
      doWithSocket(request2.socket);
    } else {
      request2.on("socket", doWithSocket);
    }
  };
  if (timeoutInMs < 2e3) {
    registerTimeout(0);
    return 0;
  }
  return timing.setTimeout(registerTimeout.bind(null, DEFER_EVENT_LISTENER_TIME$2), DEFER_EVENT_LISTENER_TIME$2);
};
const setRequestTimeout = (req, reject, timeoutInMs = 0, throwOnRequestTimeout, logger2) => {
  if (timeoutInMs) {
    return timing.setTimeout(() => {
      let msg = `@smithy/node-http-handler - [${throwOnRequestTimeout ? "ERROR" : "WARN"}] a request has exceeded the configured ${timeoutInMs} ms requestTimeout.`;
      if (throwOnRequestTimeout) {
        const error2 = Object.assign(new Error(msg), {
          name: "TimeoutError",
          code: "ETIMEDOUT"
        });
        req.destroy(error2);
        reject(error2);
      } else {
        msg += ` Init client requestHandler with throwOnRequestTimeout=true to turn this into an error.`;
        logger2?.warn?.(msg);
      }
    }, timeoutInMs);
  }
  return -1;
};
const DEFER_EVENT_LISTENER_TIME$1 = 3e3;
const setSocketKeepAlive = (request2, { keepAlive, keepAliveMsecs }, deferTimeMs = DEFER_EVENT_LISTENER_TIME$1) => {
  if (keepAlive !== true) {
    return -1;
  }
  const registerListener = () => {
    if (request2.socket) {
      request2.socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
    } else {
      request2.on("socket", (socket) => {
        socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
      });
    }
  };
  if (deferTimeMs === 0) {
    registerListener();
    return 0;
  }
  return timing.setTimeout(registerListener, deferTimeMs);
};
const DEFER_EVENT_LISTENER_TIME = 3e3;
const setSocketTimeout = (request2, reject, timeoutInMs = 0) => {
  const registerTimeout = (offset) => {
    const timeout = timeoutInMs - offset;
    const onTimeout = () => {
      request2.destroy();
      reject(Object.assign(new Error(`@smithy/node-http-handler - the request socket timed out after ${timeoutInMs} ms of inactivity (configured by client requestHandler).`), { name: "TimeoutError" }));
    };
    if (request2.socket) {
      request2.socket.setTimeout(timeout, onTimeout);
      request2.on("close", () => request2.socket?.removeListener("timeout", onTimeout));
    } else {
      request2.setTimeout(timeout, onTimeout);
    }
  };
  if (0 < timeoutInMs && timeoutInMs < 6e3) {
    registerTimeout(0);
    return 0;
  }
  return timing.setTimeout(registerTimeout.bind(null, timeoutInMs === 0 ? 0 : DEFER_EVENT_LISTENER_TIME), DEFER_EVENT_LISTENER_TIME);
};
const MIN_WAIT_TIME = 6e3;
async function writeRequestBody(httpRequest, request2, maxContinueTimeoutMs = MIN_WAIT_TIME, externalAgent = false) {
  const headers = request2.headers ?? {};
  const expect = headers.Expect || headers.expect;
  let timeoutId = -1;
  let sendBody = true;
  if (!externalAgent && expect === "100-continue") {
    sendBody = await Promise.race([
      new Promise((resolve) => {
        timeoutId = Number(timing.setTimeout(() => resolve(true), Math.max(MIN_WAIT_TIME, maxContinueTimeoutMs)));
      }),
      new Promise((resolve) => {
        httpRequest.on("continue", () => {
          timing.clearTimeout(timeoutId);
          resolve(true);
        });
        httpRequest.on("response", () => {
          timing.clearTimeout(timeoutId);
          resolve(false);
        });
        httpRequest.on("error", () => {
          timing.clearTimeout(timeoutId);
          resolve(false);
        });
      })
    ]);
  }
  if (sendBody) {
    writeBody(httpRequest, request2.body);
  }
}
function writeBody(httpRequest, body) {
  if (body instanceof Readable) {
    body.pipe(httpRequest);
    return;
  }
  if (body) {
    if (Buffer.isBuffer(body) || typeof body === "string") {
      httpRequest.end(body);
      return;
    }
    const uint8 = body;
    if (typeof uint8 === "object" && uint8.buffer && typeof uint8.byteOffset === "number" && typeof uint8.byteLength === "number") {
      httpRequest.end(Buffer.from(uint8.buffer, uint8.byteOffset, uint8.byteLength));
      return;
    }
    httpRequest.end(Buffer.from(body));
    return;
  }
  httpRequest.end();
}
class NodeHttpHandler {
  config;
  configProvider;
  socketWarningTimestamp = 0;
  externalAgent = false;
  metadata = { handlerProtocol: "http/1.1" };
  static create(instanceOrOptions) {
    if (typeof instanceOrOptions?.handle === "function") {
      return instanceOrOptions;
    }
    return new NodeHttpHandler(instanceOrOptions);
  }
  static checkSocketUsage(agent, socketWarningTimestamp, logger2 = console) {
    const { sockets, requests, maxSockets } = agent;
    if (typeof maxSockets !== "number" || maxSockets === Infinity) {
      return socketWarningTimestamp;
    }
    const interval = 15e3;
    if (Date.now() - interval < socketWarningTimestamp) {
      return socketWarningTimestamp;
    }
    if (sockets && requests) {
      for (const origin in sockets) {
        const socketsInUse = sockets[origin]?.length ?? 0;
        const requestsEnqueued = requests[origin]?.length ?? 0;
        if (socketsInUse >= maxSockets && requestsEnqueued >= 2 * maxSockets) {
          logger2?.warn?.(`@smithy/node-http-handler:WARN - socket usage at capacity=${socketsInUse} and ${requestsEnqueued} additional requests are enqueued.
See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html
or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config.`);
          return Date.now();
        }
      }
    }
    return socketWarningTimestamp;
  }
  constructor(options) {
    this.configProvider = new Promise((resolve, reject) => {
      if (typeof options === "function") {
        options().then((_options) => {
          resolve(this.resolveDefaultConfig(_options));
        }).catch(reject);
      } else {
        resolve(this.resolveDefaultConfig(options));
      }
    });
  }
  resolveDefaultConfig(options) {
    const { requestTimeout, connectionTimeout, socketTimeout, socketAcquisitionWarningTimeout, httpAgent, httpsAgent, throwOnRequestTimeout } = options || {};
    const keepAlive = true;
    const maxSockets = 50;
    return {
      connectionTimeout,
      requestTimeout,
      socketTimeout,
      socketAcquisitionWarningTimeout,
      throwOnRequestTimeout,
      httpAgent: (() => {
        if (httpAgent instanceof Agent$1 || typeof httpAgent?.destroy === "function") {
          this.externalAgent = true;
          return httpAgent;
        }
        return new Agent$1({ keepAlive, maxSockets, ...httpAgent });
      })(),
      httpsAgent: (() => {
        if (httpsAgent instanceof Agent || typeof httpsAgent?.destroy === "function") {
          this.externalAgent = true;
          return httpsAgent;
        }
        return new Agent({ keepAlive, maxSockets, ...httpsAgent });
      })(),
      logger: console
    };
  }
  destroy() {
    this.config?.httpAgent?.destroy();
    this.config?.httpsAgent?.destroy();
  }
  async handle(request$2, { abortSignal, requestTimeout } = {}) {
    if (!this.config) {
      this.config = await this.configProvider;
    }
    return new Promise((_resolve, _reject) => {
      const config2 = this.config;
      let writeRequestBodyPromise = void 0;
      const timeouts = [];
      const resolve = async (arg) => {
        await writeRequestBodyPromise;
        timeouts.forEach(timing.clearTimeout);
        _resolve(arg);
      };
      const reject = async (arg) => {
        await writeRequestBodyPromise;
        timeouts.forEach(timing.clearTimeout);
        _reject(arg);
      };
      if (abortSignal?.aborted) {
        const abortError = new Error("Request aborted");
        abortError.name = "AbortError";
        reject(abortError);
        return;
      }
      const isSSL = request$2.protocol === "https:";
      const headers = request$2.headers ?? {};
      const expectContinue = (headers.Expect ?? headers.expect) === "100-continue";
      let agent = isSSL ? config2.httpsAgent : config2.httpAgent;
      if (expectContinue && !this.externalAgent) {
        agent = new (isSSL ? Agent : Agent$1)({
          keepAlive: false,
          maxSockets: Infinity
        });
      }
      timeouts.push(timing.setTimeout(() => {
        this.socketWarningTimestamp = NodeHttpHandler.checkSocketUsage(agent, this.socketWarningTimestamp, config2.logger);
      }, config2.socketAcquisitionWarningTimeout ?? (config2.requestTimeout ?? 2e3) + (config2.connectionTimeout ?? 1e3)));
      const queryString = buildQueryString(request$2.query || {});
      let auth2 = void 0;
      if (request$2.username != null || request$2.password != null) {
        const username = request$2.username ?? "";
        const password = request$2.password ?? "";
        auth2 = `${username}:${password}`;
      }
      let path = request$2.path;
      if (queryString) {
        path += `?${queryString}`;
      }
      if (request$2.fragment) {
        path += `#${request$2.fragment}`;
      }
      let hostname = request$2.hostname ?? "";
      if (hostname[0] === "[" && hostname.endsWith("]")) {
        hostname = request$2.hostname.slice(1, -1);
      } else {
        hostname = request$2.hostname;
      }
      const nodeHttpsOptions = {
        headers: request$2.headers,
        host: hostname,
        method: request$2.method,
        path,
        port: request$2.port,
        agent,
        auth: auth2
      };
      const requestFunc = isSSL ? request : request$1;
      const req = requestFunc(nodeHttpsOptions, (res) => {
        const httpResponse = new HttpResponse({
          statusCode: res.statusCode || -1,
          reason: res.statusMessage,
          headers: getTransformedHeaders(res.headers),
          body: res
        });
        resolve({ response: httpResponse });
      });
      req.on("error", (err) => {
        if (NODEJS_TIMEOUT_ERROR_CODES.includes(err.code)) {
          reject(Object.assign(err, { name: "TimeoutError" }));
        } else {
          reject(err);
        }
      });
      if (abortSignal) {
        const onAbort = () => {
          req.destroy();
          const abortError = new Error("Request aborted");
          abortError.name = "AbortError";
          reject(abortError);
        };
        if (typeof abortSignal.addEventListener === "function") {
          const signal = abortSignal;
          signal.addEventListener("abort", onAbort, { once: true });
          req.once("close", () => signal.removeEventListener("abort", onAbort));
        } else {
          abortSignal.onabort = onAbort;
        }
      }
      const effectiveRequestTimeout = requestTimeout ?? config2.requestTimeout;
      timeouts.push(setConnectionTimeout(req, reject, config2.connectionTimeout));
      timeouts.push(setRequestTimeout(req, reject, effectiveRequestTimeout, config2.throwOnRequestTimeout, config2.logger ?? console));
      timeouts.push(setSocketTimeout(req, reject, config2.socketTimeout));
      const httpAgent = nodeHttpsOptions.agent;
      if (typeof httpAgent === "object" && "keepAlive" in httpAgent) {
        timeouts.push(setSocketKeepAlive(req, {
          keepAlive: httpAgent.keepAlive,
          keepAliveMsecs: httpAgent.keepAliveMsecs
        }));
      }
      writeRequestBodyPromise = writeRequestBody(req, request$2, effectiveRequestTimeout, this.externalAgent).catch((e2) => {
        timeouts.forEach(timing.clearTimeout);
        return _reject(e2);
      });
    });
  }
  updateHttpClientConfig(key, value) {
    this.config = void 0;
    this.configProvider = this.configProvider.then((config2) => {
      return {
        ...config2,
        [key]: value
      };
    });
  }
  httpHandlerConfigs() {
    return this.config ?? {};
  }
}
class Collector extends Writable {
  bufferedBytes = [];
  _write(chunk, encoding, callback) {
    this.bufferedBytes.push(chunk);
    callback();
  }
}
const streamCollector = (stream) => {
  if (isReadableStreamInstance(stream)) {
    return collectReadableStream(stream);
  }
  return new Promise((resolve, reject) => {
    const collector = new Collector();
    stream.pipe(collector);
    stream.on("error", (err) => {
      collector.end();
      reject(err);
    });
    collector.on("error", reject);
    collector.on("finish", function() {
      const bytes = new Uint8Array(Buffer.concat(this.bufferedBytes));
      resolve(bytes);
    });
  });
};
const isReadableStreamInstance = (stream) => typeof ReadableStream === "function" && stream instanceof ReadableStream;
async function collectReadableStream(stream) {
  const chunks = [];
  const reader = stream.getReader();
  let isDone = false;
  let length = 0;
  while (!isDone) {
    const { done, value } = await reader.read();
    if (value) {
      chunks.push(value);
      length += value.length;
    }
    isDone = done;
  }
  const collected = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    collected.set(chunk, offset);
    offset += chunk.length;
  }
  return collected;
}
class SignatureV4MultiRegion {
  sigv4aSigner;
  sigv4Signer;
  signerOptions;
  static sigv4aDependency() {
    return "none";
  }
  constructor(options) {
    this.sigv4Signer = new SignatureV4S3Express(options);
    this.signerOptions = options;
  }
  async sign(requestToSign, options = {}) {
    if (options.signingRegion === "*") {
      return this.getSigv4aSigner().sign(requestToSign, options);
    }
    return this.sigv4Signer.sign(requestToSign, options);
  }
  async signWithCredentials(requestToSign, credentials, options = {}) {
    if (options.signingRegion === "*") {
      this.getSigv4aSigner();
      {
        throw new Error(`signWithCredentials with signingRegion '*' is only supported when using the CRT dependency @aws-sdk/signature-v4-crt. Please check whether you have installed the "@aws-sdk/signature-v4-crt" package explicitly. You must also register the package by calling [require("@aws-sdk/signature-v4-crt");] or an ESM equivalent such as [import "@aws-sdk/signature-v4-crt";]. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`);
      }
    }
    return this.sigv4Signer.signWithCredentials(requestToSign, credentials, options);
  }
  async presign(originalRequest, options = {}) {
    if (options.signingRegion === "*") {
      this.getSigv4aSigner();
      {
        throw new Error(`presign with signingRegion '*' is only supported when using the CRT dependency @aws-sdk/signature-v4-crt. Please check whether you have installed the "@aws-sdk/signature-v4-crt" package explicitly. You must also register the package by calling [require("@aws-sdk/signature-v4-crt");] or an ESM equivalent such as [import "@aws-sdk/signature-v4-crt";]. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`);
      }
    }
    return this.sigv4Signer.presign(originalRequest, options);
  }
  async presignWithCredentials(originalRequest, credentials, options = {}) {
    if (options.signingRegion === "*") {
      throw new Error("Method presignWithCredentials is not supported for [signingRegion=*].");
    }
    return this.sigv4Signer.presignWithCredentials(originalRequest, credentials, options);
  }
  getSigv4aSigner() {
    if (!this.sigv4aSigner) {
      if (this.signerOptions.runtime === "node") {
        {
          throw new Error("Neither CRT nor JS SigV4a implementation is available. Please load either @aws-sdk/signature-v4-crt or @aws-sdk/signature-v4a. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt");
        }
      } else {
        {
          throw new Error("JS SigV4a implementation is not available or not a valid constructor. Please check whether you have installed the @aws-sdk/signature-v4a package explicitly. The CRT implementation is not available for browsers. You must also register the package by calling [require('@aws-sdk/signature-v4a');] or an ESM equivalent such as [import '@aws-sdk/signature-v4a';]. For more information please go to https://github.com/aws/aws-sdk-js-v3#using-javascript-non-crt-implementation-of-sigv4a");
        }
      }
    }
    return this.sigv4aSigner;
  }
}
const z = "required", A = "type", B = "fn", C = "argv", D = "ref";
const a = false, b = true, c = "isSet", d = "booleanEquals", e = "endpoint", f = "tree", g = "error", h = { [z]: false, [A]: "string" }, i = { [z]: true, "default": false, [A]: "boolean" }, j = { [D]: "EndpointId" }, k = { [B]: c, [C]: [{ [D]: "Region" }] }, l = { [B]: "aws.partition", [C]: [{ [D]: "Region" }], "assign": "PartitionResult" }, m = { [D]: "UseFIPS" }, n = { [D]: "Endpoint" }, o = { "authSchemes": [{ "name": "sigv4a", "signingName": "ses", "signingRegionSet": ["*"] }] }, p = {}, q = { [B]: d, [C]: [{ [D]: "UseDualStack" }, true] }, r = { [B]: d, [C]: [true, { [B]: "getAttr", [C]: [{ [D]: "PartitionResult" }, "supportsDualStack"] }] }, s = { [g]: "DualStack is enabled but this partition does not support DualStack", [A]: g }, t = { [B]: d, [C]: [m, true] }, u = { [B]: "getAttr", [C]: [{ [D]: "PartitionResult" }, "supportsFIPS"] }, v = [{ [B]: c, [C]: [n] }], w = [q], x = [r], y = [t];
const _data = { parameters: { Region: h, UseDualStack: i, UseFIPS: i, Endpoint: h, EndpointId: h }, rules: [{ conditions: [{ [B]: c, [C]: [j] }, k, l], rules: [{ conditions: [{ [B]: "isValidHostLabel", [C]: [j, b] }], rules: [{ conditions: [{ [B]: d, [C]: [m, a] }], rules: [{ conditions: v, endpoint: { url: n, properties: o, headers: p }, [A]: e }, { conditions: w, rules: [{ conditions: x, rules: [{ endpoint: { url: "https://{EndpointId}.endpoints.email.global.{PartitionResult#dualStackDnsSuffix}", properties: o, headers: p }, [A]: e }], [A]: f }, s], [A]: f }, { endpoint: { url: "https://{EndpointId}.endpoints.email.{PartitionResult#dnsSuffix}", properties: o, headers: p }, [A]: e }], [A]: f }, { error: "Invalid Configuration: FIPS is not supported with multi-region endpoints", [A]: g }], [A]: f }, { error: "EndpointId must be a valid host label", [A]: g }], [A]: f }, { conditions: v, rules: [{ conditions: y, error: "Invalid Configuration: FIPS and custom endpoint are not supported", [A]: g }, { conditions: w, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", [A]: g }, { endpoint: { url: n, properties: p, headers: p }, [A]: e }], [A]: f }, { conditions: [k], rules: [{ conditions: [l], rules: [{ conditions: [t, q], rules: [{ conditions: [{ [B]: d, [C]: [b, u] }, r], rules: [{ endpoint: { url: "https://email-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: p, headers: p }, [A]: e }], [A]: f }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", [A]: g }], [A]: f }, { conditions: y, rules: [{ conditions: [{ [B]: d, [C]: [u, b] }], rules: [{ endpoint: { url: "https://email-fips.{Region}.{PartitionResult#dnsSuffix}", properties: p, headers: p }, [A]: e }], [A]: f }, { error: "FIPS is enabled but this partition does not support FIPS", [A]: g }], [A]: f }, { conditions: w, rules: [{ conditions: x, rules: [{ endpoint: { url: "https://email.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: p, headers: p }, [A]: e }], [A]: f }, s], [A]: f }, { endpoint: { url: "https://email.{Region}.{PartitionResult#dnsSuffix}", properties: p, headers: p }, [A]: e }], [A]: f }], [A]: f }, { error: "Invalid Configuration: Missing Region", [A]: g }] };
const ruleSet = _data;
const cache$1 = new EndpointCache({
  size: 50,
  params: ["Endpoint", "EndpointId", "Region", "UseDualStack", "UseFIPS"]
});
const defaultEndpointResolver = (endpointParams, context = {}) => {
  return cache$1.get(endpointParams, () => resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  }));
};
customEndpointFunctions.aws = awsEndpointFunctions;
const createEndpointRuleSetHttpAuthSchemeParametersProvider = (defaultHttpAuthSchemeParametersProvider) => async (config2, context, input) => {
  if (!input) {
    throw new Error("Could not find `input` for `defaultEndpointRuleSetHttpAuthSchemeParametersProvider`");
  }
  const defaultParameters = await defaultHttpAuthSchemeParametersProvider(config2, context, input);
  const instructionsFn = getSmithyContext(context)?.commandInstance?.constructor?.getEndpointParameterInstructions;
  if (!instructionsFn) {
    throw new Error(`getEndpointParameterInstructions() is not defined on '${context.commandName}'`);
  }
  const endpointParameters = await resolveParams(input, { getEndpointParameterInstructions: instructionsFn }, config2);
  return Object.assign(defaultParameters, endpointParameters);
};
const _defaultSESv2HttpAuthSchemeParametersProvider = async (config2, context, input) => {
  return {
    operation: getSmithyContext(context).operation,
    region: await normalizeProvider(config2.region)() || (() => {
      throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
    })()
  };
};
const defaultSESv2HttpAuthSchemeParametersProvider = createEndpointRuleSetHttpAuthSchemeParametersProvider(_defaultSESv2HttpAuthSchemeParametersProvider);
function createAwsAuthSigv4HttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "ses",
      region: authParameters.region
    },
    propertiesExtractor: (config2, context) => ({
      signingProperties: {
        config: config2,
        context
      }
    })
  };
}
function createAwsAuthSigv4aHttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4a",
    signingProperties: {
      name: "ses",
      region: authParameters.region
    },
    propertiesExtractor: (config2, context) => ({
      signingProperties: {
        config: config2,
        context
      }
    })
  };
}
const createEndpointRuleSetHttpAuthSchemeProvider = (defaultEndpointResolver2, defaultHttpAuthSchemeResolver, createHttpAuthOptionFunctions) => {
  const endpointRuleSetHttpAuthSchemeProvider = (authParameters) => {
    const endpoint = defaultEndpointResolver2(authParameters);
    const authSchemes = endpoint.properties?.authSchemes;
    if (!authSchemes) {
      return defaultHttpAuthSchemeResolver(authParameters);
    }
    const options = [];
    for (const scheme of authSchemes) {
      const { name: resolvedName, properties = {}, ...rest } = scheme;
      const name = resolvedName.toLowerCase();
      if (resolvedName !== name) {
        console.warn(`HttpAuthScheme has been normalized with lowercasing: '${resolvedName}' to '${name}'`);
      }
      let schemeId;
      if (name === "sigv4a") {
        schemeId = "aws.auth#sigv4a";
        const sigv4Present = authSchemes.find((s2) => {
          const name2 = s2.name.toLowerCase();
          return name2 !== "sigv4a" && name2.startsWith("sigv4");
        });
        if (SignatureV4MultiRegion.sigv4aDependency() === "none" && sigv4Present) {
          continue;
        }
      } else if (name.startsWith("sigv4")) {
        schemeId = "aws.auth#sigv4";
      } else {
        throw new Error(`Unknown HttpAuthScheme found in '@smithy.rules#endpointRuleSet': '${name}'`);
      }
      const createOption = createHttpAuthOptionFunctions[schemeId];
      if (!createOption) {
        throw new Error(`Could not find HttpAuthOption create function for '${schemeId}'`);
      }
      const option = createOption(authParameters);
      option.schemeId = schemeId;
      option.signingProperties = { ...option.signingProperties || {}, ...rest, ...properties };
      options.push(option);
    }
    return options;
  };
  return endpointRuleSetHttpAuthSchemeProvider;
};
const _defaultSESv2HttpAuthSchemeProvider = (authParameters) => {
  const options = [];
  switch (authParameters.operation) {
    default: {
      options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
      options.push(createAwsAuthSigv4aHttpAuthOption(authParameters));
    }
  }
  return options;
};
const defaultSESv2HttpAuthSchemeProvider = createEndpointRuleSetHttpAuthSchemeProvider(defaultEndpointResolver, _defaultSESv2HttpAuthSchemeProvider, {
  "aws.auth#sigv4": createAwsAuthSigv4HttpAuthOption,
  "aws.auth#sigv4a": createAwsAuthSigv4aHttpAuthOption
});
const resolveHttpAuthSchemeConfig = (config2) => {
  const config_0 = resolveAwsSdkSigV4Config(config2);
  const config_1 = resolveAwsSdkSigV4AConfig(config_0);
  return Object.assign(config_1, {
    authSchemePreference: normalizeProvider(config2.authSchemePreference ?? [])
  });
};
const resolveClientEndpointParameters = (options) => {
  return Object.assign(options, {
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "ses"
  });
};
const commonParams = {
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};
const version = "3.971.0";
const packageInfo = {
  version
};
const ENV_KEY = "AWS_ACCESS_KEY_ID";
const ENV_SECRET = "AWS_SECRET_ACCESS_KEY";
const ENV_SESSION = "AWS_SESSION_TOKEN";
const ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION";
const ENV_CREDENTIAL_SCOPE = "AWS_CREDENTIAL_SCOPE";
const ENV_ACCOUNT_ID = "AWS_ACCOUNT_ID";
const fromEnv = (init2) => async () => {
  init2?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
  const accessKeyId = process.env[ENV_KEY];
  const secretAccessKey = process.env[ENV_SECRET];
  const sessionToken = process.env[ENV_SESSION];
  const expiry = process.env[ENV_EXPIRATION];
  const credentialScope = process.env[ENV_CREDENTIAL_SCOPE];
  const accountId = process.env[ENV_ACCOUNT_ID];
  if (accessKeyId && secretAccessKey) {
    const credentials = {
      accessKeyId,
      secretAccessKey,
      ...sessionToken && { sessionToken },
      ...expiry && { expiration: new Date(expiry) },
      ...credentialScope && { credentialScope },
      ...accountId && { accountId }
    };
    setCredentialFeature(credentials, "CREDENTIALS_ENV_VARS", "g");
    return credentials;
  }
  throw new CredentialsProviderError("Unable to find environment variable credentials.", { logger: init2?.logger });
};
const index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ENV_ACCOUNT_ID,
  ENV_CREDENTIAL_SCOPE,
  ENV_EXPIRATION,
  ENV_KEY,
  ENV_SECRET,
  ENV_SESSION,
  fromEnv
});
const ENV_IMDS_DISABLED$1 = "AWS_EC2_METADATA_DISABLED";
const remoteProvider = async (init2) => {
  const { ENV_CMDS_FULL_URI, ENV_CMDS_RELATIVE_URI, fromContainerMetadata, fromInstanceMetadata } = await import("./index5.mjs");
  if (process.env[ENV_CMDS_RELATIVE_URI] || process.env[ENV_CMDS_FULL_URI]) {
    init2.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
    const { fromHttp } = await import("./index3.mjs");
    return chain(fromHttp(init2), fromContainerMetadata(init2));
  }
  if (process.env[ENV_IMDS_DISABLED$1] && process.env[ENV_IMDS_DISABLED$1] !== "false") {
    return async () => {
      throw new CredentialsProviderError("EC2 Instance Metadata Service access disabled", { logger: init2.logger });
    };
  }
  init2.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata");
  return fromInstanceMetadata(init2);
};
function memoizeChain(providers, treatAsExpired) {
  const chain2 = internalCreateChain(providers);
  let activeLock;
  let passiveLock;
  let credentials;
  const provider = async (options) => {
    if (options?.forceRefresh) {
      return await chain2(options);
    }
    if (credentials?.expiration) {
      if (credentials?.expiration?.getTime() < Date.now()) {
        credentials = void 0;
      }
    }
    if (activeLock) {
      await activeLock;
    } else if (!credentials || treatAsExpired?.(credentials)) {
      if (credentials) {
        if (!passiveLock) {
          passiveLock = chain2(options).then((c2) => {
            credentials = c2;
            passiveLock = void 0;
          });
        }
      } else {
        activeLock = chain2(options).then((c2) => {
          credentials = c2;
          activeLock = void 0;
        });
        return provider(options);
      }
    }
    return credentials;
  };
  return provider;
}
const internalCreateChain = (providers) => async (awsIdentityProperties) => {
  let lastProviderError;
  for (const provider of providers) {
    try {
      return await provider(awsIdentityProperties);
    } catch (err) {
      lastProviderError = err;
      if (err?.tryNextLink) {
        continue;
      }
      throw err;
    }
  }
  throw lastProviderError;
};
let multipleCredentialSourceWarningEmitted = false;
const defaultProvider = (init2 = {}) => memoizeChain([
  async () => {
    const profile = init2.profile ?? process.env[ENV_PROFILE];
    if (profile) {
      const envStaticCredentialsAreSet = process.env[ENV_KEY] && process.env[ENV_SECRET];
      if (envStaticCredentialsAreSet) {
        if (!multipleCredentialSourceWarningEmitted) {
          const warnFn = init2.logger?.warn && init2.logger?.constructor?.name !== "NoOpLogger" ? init2.logger.warn.bind(init2.logger) : console.warn;
          warnFn(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`);
          multipleCredentialSourceWarningEmitted = true;
        }
      }
      throw new CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
        logger: init2.logger,
        tryNextLink: true
      });
    }
    init2.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv");
    return fromEnv(init2)();
  },
  async (awsIdentityProperties) => {
    init2.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
    const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoSession } = init2;
    if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) {
      throw new CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", { logger: init2.logger });
    }
    const { fromSSO } = await import("./index6.mjs");
    return fromSSO(init2)(awsIdentityProperties);
  },
  async (awsIdentityProperties) => {
    init2.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
    const { fromIni } = await import("./index4.mjs");
    return fromIni(init2)(awsIdentityProperties);
  },
  async (awsIdentityProperties) => {
    init2.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
    const { fromProcess } = await import("./index2.mjs");
    return fromProcess(init2)(awsIdentityProperties);
  },
  async (awsIdentityProperties) => {
    init2.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
    const { fromTokenFile } = await import("./index.mjs");
    return fromTokenFile(init2)(awsIdentityProperties);
  },
  async () => {
    init2.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider");
    return (await remoteProvider(init2))();
  },
  async () => {
    throw new CredentialsProviderError("Could not load credentials from any providers", {
      tryNextLink: false,
      logger: init2.logger
    });
  }
], credentialsTreatedAsExpired);
const credentialsTreatedAsExpired = (credentials) => credentials?.expiration !== void 0 && credentials.expiration.getTime() - Date.now() < 3e5;
const isCrtAvailable = () => {
  return null;
};
const createDefaultUserAgentProvider = ({ serviceId, clientVersion }) => {
  return async (config2) => {
    const sections = [
      ["aws-sdk-js", clientVersion],
      ["ua", "2.1"],
      [`os/${platform()}`, release()],
      ["lang/js"],
      ["md/nodejs", `${versions.node}`]
    ];
    const crtAvailable = isCrtAvailable();
    if (crtAvailable) {
      sections.push(crtAvailable);
    }
    if (serviceId) {
      sections.push([`api/${serviceId}`, clientVersion]);
    }
    if (env$1.AWS_EXECUTION_ENV) {
      sections.push([`exec-env/${env$1.AWS_EXECUTION_ENV}`]);
    }
    const appId = await config2?.userAgentAppId?.();
    const resolvedUserAgent = appId ? [...sections, [`app/${appId}`]] : [...sections];
    return resolvedUserAgent;
  };
};
const UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID";
const UA_APP_ID_INI_NAME = "sdk_ua_app_id";
const UA_APP_ID_INI_NAME_DEPRECATED = "sdk-ua-app-id";
const NODE_APP_ID_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[UA_APP_ID_ENV_NAME],
  configFileSelector: (profile) => profile[UA_APP_ID_INI_NAME] ?? profile[UA_APP_ID_INI_NAME_DEPRECATED],
  default: DEFAULT_UA_APP_ID
};
class Hash {
  algorithmIdentifier;
  secret;
  hash;
  constructor(algorithmIdentifier, secret) {
    this.algorithmIdentifier = algorithmIdentifier;
    this.secret = secret;
    this.reset();
  }
  update(toHash, encoding) {
    this.hash.update(toUint8Array(castSourceData(toHash, encoding)));
  }
  digest() {
    return Promise.resolve(this.hash.digest());
  }
  reset() {
    this.hash = this.secret ? createHmac(this.algorithmIdentifier, castSourceData(this.secret)) : createHash(this.algorithmIdentifier);
  }
}
function castSourceData(toCast, encoding) {
  if (Buffer$1.isBuffer(toCast)) {
    return toCast;
  }
  if (typeof toCast === "string") {
    return fromString(toCast, encoding);
  }
  if (ArrayBuffer.isView(toCast)) {
    return fromArrayBuffer(toCast.buffer, toCast.byteOffset, toCast.byteLength);
  }
  return fromArrayBuffer(toCast);
}
const calculateBodyLength = (body) => {
  if (!body) {
    return 0;
  }
  if (typeof body === "string") {
    return Buffer.byteLength(body);
  } else if (typeof body.byteLength === "number") {
    return body.byteLength;
  } else if (typeof body.size === "number") {
    return body.size;
  } else if (typeof body.start === "number" && typeof body.end === "number") {
    return body.end + 1 - body.start;
  } else if (body instanceof ReadStream) {
    if (body.path != null) {
      return lstatSync(body.path).size;
    } else if (typeof body.fd === "number") {
      return fstatSync(body.fd).size;
    }
  }
  throw new Error(`Body Length computation failed for ${body}`);
};
const AWS_EXECUTION_ENV = "AWS_EXECUTION_ENV";
const AWS_REGION_ENV = "AWS_REGION";
const AWS_DEFAULT_REGION_ENV = "AWS_DEFAULT_REGION";
const ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
const DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"];
const IMDS_REGION_PATH = "/latest/meta-data/placement/region";
const AWS_DEFAULTS_MODE_ENV = "AWS_DEFAULTS_MODE";
const AWS_DEFAULTS_MODE_CONFIG = "defaults_mode";
const NODE_DEFAULTS_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => {
    return env2[AWS_DEFAULTS_MODE_ENV];
  },
  configFileSelector: (profile) => {
    return profile[AWS_DEFAULTS_MODE_CONFIG];
  },
  default: "legacy"
};
const resolveDefaultsModeConfig = ({ region = loadConfig(NODE_REGION_CONFIG_OPTIONS), defaultsMode = loadConfig(NODE_DEFAULTS_MODE_CONFIG_OPTIONS) } = {}) => memoize(async () => {
  const mode = typeof defaultsMode === "function" ? await defaultsMode() : defaultsMode;
  switch (mode?.toLowerCase()) {
    case "auto":
      return resolveNodeDefaultsModeAuto(region);
    case "in-region":
    case "cross-region":
    case "mobile":
    case "standard":
    case "legacy":
      return Promise.resolve(mode?.toLocaleLowerCase());
    case void 0:
      return Promise.resolve("legacy");
    default:
      throw new Error(`Invalid parameter for "defaultsMode", expect ${DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
  }
});
const resolveNodeDefaultsModeAuto = async (clientRegion) => {
  if (clientRegion) {
    const resolvedRegion = typeof clientRegion === "function" ? await clientRegion() : clientRegion;
    const inferredRegion = await inferPhysicalRegion();
    if (!inferredRegion) {
      return "standard";
    }
    if (resolvedRegion === inferredRegion) {
      return "in-region";
    } else {
      return "cross-region";
    }
  }
  return "standard";
};
const inferPhysicalRegion = async () => {
  if (process.env[AWS_EXECUTION_ENV] && (process.env[AWS_REGION_ENV] || process.env[AWS_DEFAULT_REGION_ENV])) {
    return process.env[AWS_REGION_ENV] ?? process.env[AWS_DEFAULT_REGION_ENV];
  }
  if (!process.env[ENV_IMDS_DISABLED]) {
    try {
      const { getInstanceMetadataEndpoint, httpRequest } = await import("./index5.mjs");
      const endpoint = await getInstanceMetadataEndpoint();
      return (await httpRequest({ ...endpoint, path: IMDS_REGION_PATH })).toString();
    } catch (e2) {
    }
  }
};
const getRuntimeConfig$1 = (config2) => {
  return {
    apiVersion: "2019-09-27",
    base64Decoder: config2?.base64Decoder ?? fromBase64,
    base64Encoder: config2?.base64Encoder ?? toBase64,
    disableHostPrefix: config2?.disableHostPrefix ?? false,
    endpointProvider: config2?.endpointProvider ?? defaultEndpointResolver,
    extensions: config2?.extensions ?? [],
    httpAuthSchemeProvider: config2?.httpAuthSchemeProvider ?? defaultSESv2HttpAuthSchemeProvider,
    httpAuthSchemes: config2?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new AwsSdkSigV4Signer()
      },
      {
        schemeId: "aws.auth#sigv4a",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4a"),
        signer: new AwsSdkSigV4ASigner()
      }
    ],
    logger: config2?.logger ?? new NoOpLogger(),
    protocol: config2?.protocol ?? AwsRestJsonProtocol,
    protocolSettings: config2?.protocolSettings ?? {
      defaultNamespace: "com.amazonaws.sesv2",
      version: "2019-09-27",
      serviceTarget: "SimpleEmailService_v2"
    },
    serviceId: config2?.serviceId ?? "SESv2",
    signerConstructor: config2?.signerConstructor ?? SignatureV4MultiRegion,
    urlParser: config2?.urlParser ?? parseUrl,
    utf8Decoder: config2?.utf8Decoder ?? fromUtf8,
    utf8Encoder: config2?.utf8Encoder ?? toUtf8
  };
};
const getRuntimeConfig = (config2) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config2);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig$1(config2);
  emitWarningIfUnsupportedVersion$1(process.version);
  const loaderConfig = {
    profile: config2?.profile,
    logger: clientSharedValues.logger
  };
  return {
    ...clientSharedValues,
    ...config2,
    runtime: "node",
    defaultsMode,
    authSchemePreference: config2?.authSchemePreference ?? loadConfig(NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
    bodyLengthChecker: config2?.bodyLengthChecker ?? calculateBodyLength,
    credentialDefaultProvider: config2?.credentialDefaultProvider ?? defaultProvider,
    defaultUserAgentProvider: config2?.defaultUserAgentProvider ?? createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: packageInfo.version }),
    maxAttempts: config2?.maxAttempts ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config2),
    region: config2?.region ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, { ...NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
    requestHandler: NodeHttpHandler.create(config2?.requestHandler ?? defaultConfigProvider),
    retryMode: config2?.retryMode ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }, config2),
    sha256: config2?.sha256 ?? Hash.bind(null, "sha256"),
    sigv4aSigningRegionSet: config2?.sigv4aSigningRegionSet ?? loadConfig(NODE_SIGV4A_CONFIG_OPTIONS, loaderConfig),
    streamCollector: config2?.streamCollector ?? streamCollector,
    useDualstackEndpoint: config2?.useDualstackEndpoint ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    useFipsEndpoint: config2?.useFipsEndpoint ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    userAgentAppId: config2?.userAgentAppId ?? loadConfig(NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
  };
};
const getAwsRegionExtensionConfiguration = (runtimeConfig) => {
  return {
    setRegion(region) {
      runtimeConfig.region = region;
    },
    region() {
      return runtimeConfig.region;
    }
  };
};
const resolveAwsRegionExtensionConfiguration = (awsRegionExtensionConfiguration) => {
  return {
    region: awsRegionExtensionConfiguration.region()
  };
};
const getHttpAuthExtensionConfiguration = (runtimeConfig) => {
  const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
  let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
  let _credentials = runtimeConfig.credentials;
  return {
    setHttpAuthScheme(httpAuthScheme) {
      const index2 = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
      if (index2 === -1) {
        _httpAuthSchemes.push(httpAuthScheme);
      } else {
        _httpAuthSchemes.splice(index2, 1, httpAuthScheme);
      }
    },
    httpAuthSchemes() {
      return _httpAuthSchemes;
    },
    setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
      _httpAuthSchemeProvider = httpAuthSchemeProvider;
    },
    httpAuthSchemeProvider() {
      return _httpAuthSchemeProvider;
    },
    setCredentials(credentials) {
      _credentials = credentials;
    },
    credentials() {
      return _credentials;
    }
  };
};
const resolveHttpAuthRuntimeConfig = (config2) => {
  return {
    httpAuthSchemes: config2.httpAuthSchemes(),
    httpAuthSchemeProvider: config2.httpAuthSchemeProvider(),
    credentials: config2.credentials()
  };
};
const resolveRuntimeExtensions = (runtimeConfig, extensions) => {
  const extensionConfiguration = Object.assign(getAwsRegionExtensionConfiguration(runtimeConfig), getDefaultExtensionConfiguration(runtimeConfig), getHttpHandlerExtensionConfiguration(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return Object.assign(runtimeConfig, resolveAwsRegionExtensionConfiguration(extensionConfiguration), resolveDefaultRuntimeConfig(extensionConfiguration), resolveHttpHandlerRuntimeConfig(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};
class SESv2Client extends Client {
  config;
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig(configuration || {});
    super(_config_0);
    this.initConfig = _config_0;
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveUserAgentConfig(_config_1);
    const _config_3 = resolveRetryConfig(_config_2);
    const _config_4 = resolveRegionConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveEndpointConfig(_config_5);
    const _config_7 = resolveHttpAuthSchemeConfig(_config_6);
    const _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
    this.config = _config_8;
    this.middlewareStack.use(getSchemaSerdePlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
      httpAuthSchemeParametersProvider: defaultSESv2HttpAuthSchemeParametersProvider,
      identityProviderConfigProvider: async (config2) => new DefaultIdentityProviderConfig({
        "aws.auth#sigv4": config2.credentials,
        "aws.auth#sigv4a": config2.credentials
      })
    }));
    this.middlewareStack.use(getHttpSigningPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
}
class SESv2ServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, SESv2ServiceException.prototype);
  }
}
class AccountSuspendedException extends SESv2ServiceException {
  name = "AccountSuspendedException";
  $fault = "client";
  constructor(opts) {
    super({
      name: "AccountSuspendedException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, AccountSuspendedException.prototype);
  }
}
class AlreadyExistsException extends SESv2ServiceException {
  name = "AlreadyExistsException";
  $fault = "client";
  constructor(opts) {
    super({
      name: "AlreadyExistsException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, AlreadyExistsException.prototype);
  }
}
class BadRequestException extends SESv2ServiceException {
  name = "BadRequestException";
  $fault = "client";
  constructor(opts) {
    super({
      name: "BadRequestException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}
class InternalServiceErrorException extends SESv2ServiceException {
  name = "InternalServiceErrorException";
  $fault = "server";
  constructor(opts) {
    super({
      name: "InternalServiceErrorException",
      $fault: "server",
      ...opts
    });
    Object.setPrototypeOf(this, InternalServiceErrorException.prototype);
  }
}
class NotFoundException extends SESv2ServiceException {
  name = "NotFoundException";
  $fault = "client";
  constructor(opts) {
    super({
      name: "NotFoundException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}
class TooManyRequestsException extends SESv2ServiceException {
  name = "TooManyRequestsException";
  $fault = "client";
  constructor(opts) {
    super({
      name: "TooManyRequestsException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, TooManyRequestsException.prototype);
  }
}
class ConcurrentModificationException extends SESv2ServiceException {
  name = "ConcurrentModificationException";
  $fault = "server";
  constructor(opts) {
    super({
      name: "ConcurrentModificationException",
      $fault: "server",
      ...opts
    });
    Object.setPrototypeOf(this, ConcurrentModificationException.prototype);
  }
}
class ConflictException extends SESv2ServiceException {
  name = "ConflictException";
  $fault = "client";
  constructor(opts) {
    super({
      name: "ConflictException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}
class LimitExceededException extends SESv2ServiceException {
  name = "LimitExceededException";
  $fault = "client";
  constructor(opts) {
    super({
      name: "LimitExceededException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, LimitExceededException.prototype);
  }
}
class MailFromDomainNotVerifiedException extends SESv2ServiceException {
  name = "MailFromDomainNotVerifiedException";
  $fault = "client";
  constructor(opts) {
    super({
      name: "MailFromDomainNotVerifiedException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, MailFromDomainNotVerifiedException.prototype);
  }
}
class MessageRejected extends SESv2ServiceException {
  name = "MessageRejected";
  $fault = "client";
  constructor(opts) {
    super({
      name: "MessageRejected",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, MessageRejected.prototype);
  }
}
class SendingPausedException extends SESv2ServiceException {
  name = "SendingPausedException";
  $fault = "client";
  constructor(opts) {
    super({
      name: "SendingPausedException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, SendingPausedException.prototype);
  }
}
class InvalidNextTokenException extends SESv2ServiceException {
  name = "InvalidNextTokenException";
  $fault = "client";
  constructor(opts) {
    super({
      name: "InvalidNextTokenException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, InvalidNextTokenException.prototype);
  }
}
const _A = "Attachment";
const _AEE = "AlreadyExistsException";
const _AL = "AttachmentList";
const _ASE = "AccountSuspendedException";
const _At = "Attachments";
const _B = "Body";
const _BA = "BccAddresses";
const _BRE = "BadRequestException";
const _CA = "CcAddresses";
const _CD = "ContentDisposition";
const _CDo = "ContentDescription";
const _CE = "ConflictException";
const _CI = "ContentId";
const _CLN = "ContactListName";
const _CME = "ConcurrentModificationException";
const _CSN = "ConfigurationSetName";
const _CT = "ContentType";
const _CTE = "ContentTransferEncoding";
const _Ch = "Charset";
const _Con = "Content";
const _Da = "Data";
const _Des = "Destination";
const _EC = "EmailContent";
const _EIn = "EndpointId";
const _ET = "EmailTags";
const _ETC = "EmailTemplateContent";
const _FEA = "FromEmailAddress";
const _FEAIA = "FromEmailAddressIdentityArn";
const _FFEA = "FeedbackForwardingEmailAddress";
const _FFEAIA = "FeedbackForwardingEmailAddressIdentityArn";
const _FN = "FileName";
const _H = "Html";
const _He = "Headers";
const _INTE = "InvalidNextTokenException";
const _ISEE = "InternalServiceErrorException";
const _LEE = "LimitExceededException";
const _LMO = "ListManagementOptions";
const _MFDNVE = "MailFromDomainNotVerifiedException";
const _MH = "MessageHeader";
const _MHL = "MessageHeaderList";
const _MI = "MessageId";
const _MRe = "MessageRejected";
const _MTL = "MessageTagList";
const _MTe = "MessageTag";
const _Me = "Message";
const _NFE = "NotFoundException";
const _Na = "Name";
const _RC = "RawContent";
const _RM = "RawMessage";
const _RTA = "ReplyToAddresses";
const _Ra = "Raw";
const _SER = "SendEmailRequest";
const _SERe = "SendEmailResponse";
const _SEen = "SendEmail";
const _SPE = "SendingPausedException";
const _Si = "Simple";
const _Su = "Subject";
const _T = "Text";
const _TAe = "TemplateArn";
const _TAo = "ToAddresses";
const _TC = "TemplateContent";
const _TD = "TemplateData";
const _TMRE = "TooManyRequestsException";
const _TN = "TemplateName";
const _TNe = "TenantName";
const _TNo = "TopicName";
const _Te = "Template";
const _V = "Value";
const _c = "client";
const _e = "error";
const _h = "http";
const _hE = "httpError";
const _m = "message";
const _s = "server";
const _sm = "smithy.ts.sdk.synthetic.com.amazonaws.sesv2";
const n0 = "com.amazonaws.sesv2";
var AccountSuspendedException$ = [
  -3,
  n0,
  _ASE,
  { [_e]: _c, [_hE]: 400 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(AccountSuspendedException$, AccountSuspendedException);
var AlreadyExistsException$ = [
  -3,
  n0,
  _AEE,
  { [_e]: _c, [_hE]: 400 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(AlreadyExistsException$, AlreadyExistsException);
var Attachment$ = [
  3,
  n0,
  _A,
  0,
  [_RC, _FN, _CD, _CDo, _CI, _CTE, _CT],
  [21, 0, 0, 0, 0, 0, 0],
  2
];
var BadRequestException$ = [
  -3,
  n0,
  _BRE,
  { [_e]: _c, [_hE]: 400 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(BadRequestException$, BadRequestException);
var Body$ = [
  3,
  n0,
  _B,
  0,
  [_T, _H],
  [() => Content$, () => Content$]
];
var ConcurrentModificationException$ = [
  -3,
  n0,
  _CME,
  { [_e]: _s, [_hE]: 500 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(ConcurrentModificationException$, ConcurrentModificationException);
var ConflictException$ = [
  -3,
  n0,
  _CE,
  { [_e]: _c, [_hE]: 409 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(ConflictException$, ConflictException);
var Content$ = [
  3,
  n0,
  _Con,
  0,
  [_Da, _Ch],
  [0, 0],
  1
];
var Destination$ = [
  3,
  n0,
  _Des,
  0,
  [_TAo, _CA, _BA],
  [64 | 0, 64 | 0, 64 | 0]
];
var EmailContent$ = [
  3,
  n0,
  _EC,
  0,
  [_Si, _Ra, _Te],
  [() => Message$, () => RawMessage$, () => Template$]
];
var EmailTemplateContent$ = [
  3,
  n0,
  _ETC,
  0,
  [_Su, _T, _H],
  [0, 0, 0]
];
var InternalServiceErrorException$ = [
  -3,
  n0,
  _ISEE,
  { [_e]: _s, [_hE]: 500 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(InternalServiceErrorException$, InternalServiceErrorException);
var InvalidNextTokenException$ = [
  -3,
  n0,
  _INTE,
  { [_e]: _c, [_hE]: 400 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(InvalidNextTokenException$, InvalidNextTokenException);
var LimitExceededException$ = [
  -3,
  n0,
  _LEE,
  { [_e]: _c, [_hE]: 400 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(LimitExceededException$, LimitExceededException);
var ListManagementOptions$ = [
  3,
  n0,
  _LMO,
  0,
  [_CLN, _TNo],
  [0, 0],
  1
];
var MailFromDomainNotVerifiedException$ = [
  -3,
  n0,
  _MFDNVE,
  { [_e]: _c, [_hE]: 400 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(MailFromDomainNotVerifiedException$, MailFromDomainNotVerifiedException);
var Message$ = [
  3,
  n0,
  _Me,
  0,
  [_Su, _B, _He, _At],
  [() => Content$, () => Body$, () => MessageHeaderList, () => AttachmentList],
  2
];
var MessageHeader$ = [
  3,
  n0,
  _MH,
  0,
  [_Na, _V],
  [0, 0],
  2
];
var MessageRejected$ = [
  -3,
  n0,
  _MRe,
  { [_e]: _c, [_hE]: 400 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(MessageRejected$, MessageRejected);
var MessageTag$ = [
  3,
  n0,
  _MTe,
  0,
  [_Na, _V],
  [0, 0],
  2
];
var NotFoundException$ = [
  -3,
  n0,
  _NFE,
  { [_e]: _c, [_hE]: 404 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(NotFoundException$, NotFoundException);
var RawMessage$ = [
  3,
  n0,
  _RM,
  0,
  [_Da],
  [21],
  1
];
var SendEmailRequest$ = [
  3,
  n0,
  _SER,
  0,
  [_Con, _FEA, _FEAIA, _Des, _RTA, _FFEA, _FFEAIA, _ET, _CSN, _EIn, _TNe, _LMO],
  [() => EmailContent$, 0, 0, () => Destination$, 64 | 0, 0, 0, () => MessageTagList, 0, 0, 0, () => ListManagementOptions$],
  1
];
var SendEmailResponse$ = [
  3,
  n0,
  _SERe,
  0,
  [_MI],
  [0]
];
var SendingPausedException$ = [
  -3,
  n0,
  _SPE,
  { [_e]: _c, [_hE]: 400 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(SendingPausedException$, SendingPausedException);
var Template$ = [
  3,
  n0,
  _Te,
  0,
  [_TN, _TAe, _TC, _TD, _He, _At],
  [0, 0, () => EmailTemplateContent$, 0, () => MessageHeaderList, () => AttachmentList]
];
var TooManyRequestsException$ = [
  -3,
  n0,
  _TMRE,
  { [_e]: _c, [_hE]: 429 },
  [_m],
  [0]
];
TypeRegistry.for(n0).registerError(TooManyRequestsException$, TooManyRequestsException);
var SESv2ServiceException$ = [-3, _sm, "SESv2ServiceException", 0, [], []];
TypeRegistry.for(_sm).registerError(SESv2ServiceException$, SESv2ServiceException);
var AttachmentList = [
  1,
  n0,
  _AL,
  0,
  () => Attachment$
];
var MessageHeaderList = [
  1,
  n0,
  _MHL,
  0,
  () => MessageHeader$
];
var MessageTagList = [
  1,
  n0,
  _MTL,
  0,
  () => MessageTag$
];
var SendEmail$ = [
  9,
  n0,
  _SEen,
  { [_h]: ["POST", "/v2/email/outbound-emails", 200] },
  () => SendEmailRequest$,
  () => SendEmailResponse$
];
class SendEmailCommand extends Command.classBuilder().ep({
  ...commonParams,
  EndpointId: { type: "contextParams", name: "EndpointId" }
}).m(function(Command2, cs, config2, o2) {
  return [getEndpointPlugin(config2, Command2.getEndpointParameterInstructions())];
}).s("SimpleEmailService_v2", "SendEmail", {}).n("SESv2Client", "SendEmailCommand").sc(SendEmail$).build() {
}
const createMiddleware$1 = (options, __opts) => {
  const resolvedOptions = {
    type: "request",
    ...__opts || options
  };
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createMiddleware$1(
        {},
        Object.assign(resolvedOptions, { middleware })
      );
    },
    inputValidator: (inputValidator) => {
      return createMiddleware$1(
        {},
        Object.assign(resolvedOptions, { inputValidator })
      );
    },
    client: (client) => {
      return createMiddleware$1(
        {},
        Object.assign(resolvedOptions, { client })
      );
    },
    server: (server) => {
      return createMiddleware$1(
        {},
        Object.assign(resolvedOptions, { server })
      );
    }
  };
};
const symbol = /* @__PURE__ */ Symbol.for("better-auth:global");
let bind = null;
const __context = {};
const __betterAuthVersion = "1.4.17";
function __getBetterAuthGlobal() {
  if (!globalThis[symbol]) {
    globalThis[symbol] = {
      version: __betterAuthVersion,
      epoch: 1,
      context: __context
    };
    bind = globalThis[symbol];
  }
  bind = globalThis[symbol];
  if (bind.version !== __betterAuthVersion) {
    bind.version = __betterAuthVersion;
    bind.epoch++;
  }
  return globalThis[symbol];
}
function getBetterAuthVersion() {
  return __getBetterAuthGlobal().version;
}
const AsyncLocalStoragePromise = import(
  /* @vite-ignore */
  /* webpackIgnore: true */
  "node:async_hooks"
).then((mod) => mod.AsyncLocalStorage).catch((err) => {
  if ("AsyncLocalStorage" in globalThis) return globalThis.AsyncLocalStorage;
  if (typeof window !== "undefined") return null;
  console.warn("[better-auth] Warning: AsyncLocalStorage is not available in this environment. Some features may not work as expected.");
  console.warn("[better-auth] Please read more about this warning at https://better-auth.com/docs/installation#mount-handler");
  console.warn("[better-auth] If you are using Cloudflare Workers, please see: https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag");
  throw err;
});
async function getAsyncLocalStorage() {
  const mod = await AsyncLocalStoragePromise;
  if (mod === null) throw new Error("getAsyncLocalStorage is only available in server code");
  else return mod;
}
const ensureAsyncStorage$2 = async () => {
  const betterAuthGlobal = __getBetterAuthGlobal();
  if (!betterAuthGlobal.context.endpointContextAsyncStorage) {
    const AsyncLocalStorage$1 = await getAsyncLocalStorage();
    betterAuthGlobal.context.endpointContextAsyncStorage = new AsyncLocalStorage$1();
  }
  return betterAuthGlobal.context.endpointContextAsyncStorage;
};
async function getCurrentAuthContext() {
  const context = (await ensureAsyncStorage$2()).getStore();
  if (!context) throw new Error("No auth context found. Please make sure you are calling this function within a `runWithEndpointContext` callback.");
  return context;
}
async function runWithEndpointContext(context, fn) {
  return (await ensureAsyncStorage$2()).run(context, fn);
}
const ensureAsyncStorage$1 = async () => {
  const betterAuthGlobal = __getBetterAuthGlobal();
  if (!betterAuthGlobal.context.requestStateAsyncStorage) {
    const AsyncLocalStorage$1 = await getAsyncLocalStorage();
    betterAuthGlobal.context.requestStateAsyncStorage = new AsyncLocalStorage$1();
  }
  return betterAuthGlobal.context.requestStateAsyncStorage;
};
async function hasRequestState() {
  return (await ensureAsyncStorage$1()).getStore() !== void 0;
}
async function getCurrentRequestState() {
  const store = (await ensureAsyncStorage$1()).getStore();
  if (!store) throw new Error("No request state found. Please make sure you are calling this function within a `runWithRequestState` callback.");
  return store;
}
async function runWithRequestState(store, fn) {
  return (await ensureAsyncStorage$1()).run(store, fn);
}
function defineRequestState(initFn) {
  const ref = Object.freeze({});
  return {
    get ref() {
      return ref;
    },
    async get() {
      const store = await getCurrentRequestState();
      if (!store.has(ref)) {
        const initialValue = await initFn();
        store.set(ref, initialValue);
        return initialValue;
      }
      return store.get(ref);
    },
    async set(value) {
      (await getCurrentRequestState()).set(ref, value);
    }
  };
}
const ensureAsyncStorage = async () => {
  const betterAuthGlobal = __getBetterAuthGlobal();
  if (!betterAuthGlobal.context.adapterAsyncStorage) {
    const AsyncLocalStorage$1 = await getAsyncLocalStorage();
    betterAuthGlobal.context.adapterAsyncStorage = new AsyncLocalStorage$1();
  }
  return betterAuthGlobal.context.adapterAsyncStorage;
};
const getCurrentAdapter = async (fallback) => {
  return ensureAsyncStorage().then((als) => {
    return als.getStore() || fallback;
  }).catch(() => {
    return fallback;
  });
};
const runWithAdapter = async (adapter, fn) => {
  let called = true;
  return ensureAsyncStorage().then((als) => {
    called = true;
    return als.run(adapter, fn);
  }).catch((err) => {
    if (!called) return fn();
    throw err;
  });
};
const runWithTransaction = async (adapter, fn) => {
  let called = true;
  return ensureAsyncStorage().then((als) => {
    called = true;
    return adapter.transaction(async (trx) => {
      return als.run(trx, fn);
    });
  }).catch((err) => {
    if (!called) return fn();
    throw err;
  });
};
const { set: setOAuthState } = defineRequestState(() => null);
const generateRandomString = createRandomStringGenerator("a-z", "0-9", "A-Z", "-_");
function constantTimeEqual(a2, b2) {
  if (typeof a2 === "string") a2 = new TextEncoder().encode(a2);
  if (typeof b2 === "string") b2 = new TextEncoder().encode(b2);
  const aBuffer = new Uint8Array(a2);
  const bBuffer = new Uint8Array(b2);
  let c2 = aBuffer.length ^ bBuffer.length;
  const length = Math.max(aBuffer.length, bBuffer.length);
  for (let i2 = 0; i2 < length; i2++) c2 |= (i2 < aBuffer.length ? aBuffer[i2] : 0) ^ (i2 < bBuffer.length ? bBuffer[i2] : 0);
  return c2 === 0;
}
async function signJWT(payload, secret, expiresIn = 3600) {
  return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(Math.floor(Date.now() / 1e3) + expiresIn).sign(new TextEncoder().encode(secret));
}
async function verifyJWT(token, secret) {
  try {
    return (await jwtVerify(token, new TextEncoder().encode(secret))).payload;
  } catch {
    return null;
  }
}
const info = new Uint8Array([
  66,
  101,
  116,
  116,
  101,
  114,
  65,
  117,
  116,
  104,
  46,
  106,
  115,
  32,
  71,
  101,
  110,
  101,
  114,
  97,
  116,
  101,
  100,
  32,
  69,
  110,
  99,
  114,
  121,
  112,
  116,
  105,
  111,
  110,
  32,
  75,
  101,
  121
]);
const now = () => Date.now() / 1e3 | 0;
const alg = "dir";
const enc = "A256CBC-HS512";
async function symmetricEncodeJWT(payload, secret, salt, expiresIn = 3600) {
  const encryptionSecret = hkdf(sha256, new TextEncoder().encode(secret), new TextEncoder().encode(salt), info, 64);
  const thumbprint = await calculateJwkThumbprint({
    kty: "oct",
    k: base64url.encode(encryptionSecret)
  }, "sha256");
  return await new EncryptJWT(payload).setProtectedHeader({
    alg,
    enc,
    kid: thumbprint
  }).setIssuedAt().setExpirationTime(now() + expiresIn).setJti(crypto.randomUUID()).encrypt(encryptionSecret);
}
async function symmetricDecodeJWT(token, secret, salt) {
  if (!token) return null;
  try {
    const { payload } = await jwtDecrypt(token, async ({ kid }) => {
      const encryptionSecret = hkdf(sha256, new TextEncoder().encode(secret), new TextEncoder().encode(salt), info, 64);
      if (kid === void 0) return encryptionSecret;
      if (kid === await calculateJwkThumbprint({
        kty: "oct",
        k: base64url.encode(encryptionSecret)
      }, "sha256")) return encryptionSecret;
      throw new Error("no matching decryption secret");
    }, {
      clockTolerance: 15,
      keyManagementAlgorithms: [alg],
      contentEncryptionAlgorithms: [enc, "A256GCM"]
    });
    return payload;
  } catch {
    return null;
  }
}
function defineErrorCodes(codes) {
  return codes;
}
function deprecate(fn, message, logger2) {
  let warned = false;
  return function(...args) {
    if (!warned) {
      (logger2?.warn ?? console.warn)(`[Deprecation] ${message}`);
      warned = true;
    }
    return fn.apply(this, args);
  };
}
const generateId$1 = (size) => {
  return createRandomStringGenerator("a-z", "A-Z", "0-9")(size || 32);
};
function isValidIP(ip) {
  return z$1.ipv4().safeParse(ip).success || z$1.ipv6().safeParse(ip).success;
}
function isIPv6(ip) {
  return z$1.ipv6().safeParse(ip).success;
}
function extractIPv4FromMapped(ipv6) {
  const lower = ipv6.toLowerCase();
  if (lower.startsWith("::ffff:")) {
    const ipv4Part = lower.substring(7);
    if (z$1.ipv4().safeParse(ipv4Part).success) return ipv4Part;
  }
  const parts = ipv6.split(":");
  if (parts.length === 7 && parts[5]?.toLowerCase() === "ffff") {
    const ipv4Part = parts[6];
    if (ipv4Part && z$1.ipv4().safeParse(ipv4Part).success) return ipv4Part;
  }
  if (lower.includes("::ffff:") || lower.includes(":ffff:")) {
    const groups = expandIPv6(ipv6);
    if (groups.length === 8 && groups[0] === "0000" && groups[1] === "0000" && groups[2] === "0000" && groups[3] === "0000" && groups[4] === "0000" && groups[5] === "ffff" && groups[6] && groups[7]) return `${Number.parseInt(groups[6].substring(0, 2), 16)}.${Number.parseInt(groups[6].substring(2, 4), 16)}.${Number.parseInt(groups[7].substring(0, 2), 16)}.${Number.parseInt(groups[7].substring(2, 4), 16)}`;
  }
  return null;
}
function expandIPv6(ipv6) {
  if (ipv6.includes("::")) {
    const sides = ipv6.split("::");
    const left = sides[0] ? sides[0].split(":") : [];
    const right = sides[1] ? sides[1].split(":") : [];
    const missingGroups = 8 - left.length - right.length;
    const zeros = Array(missingGroups).fill("0000");
    const paddedLeft = left.map((g2) => g2.padStart(4, "0"));
    const paddedRight = right.map((g2) => g2.padStart(4, "0"));
    return [
      ...paddedLeft,
      ...zeros,
      ...paddedRight
    ];
  }
  return ipv6.split(":").map((g2) => g2.padStart(4, "0"));
}
function normalizeIPv6(ipv6, subnetPrefix) {
  const groups = expandIPv6(ipv6);
  if (subnetPrefix < 128) {
    let bitsRemaining = subnetPrefix;
    return groups.map((group2) => {
      if (bitsRemaining <= 0) return "0000";
      if (bitsRemaining >= 16) {
        bitsRemaining -= 16;
        return group2;
      }
      const masked = Number.parseInt(group2, 16) & (65535 << 16 - bitsRemaining & 65535);
      bitsRemaining = 0;
      return masked.toString(16).padStart(4, "0");
    }).join(":").toLowerCase();
  }
  return groups.join(":").toLowerCase();
}
function normalizeIP(ip, options = {}) {
  if (z$1.ipv4().safeParse(ip).success) return ip.toLowerCase();
  if (!isIPv6(ip)) return ip.toLowerCase();
  const ipv4 = extractIPv4FromMapped(ip);
  if (ipv4) return ipv4.toLowerCase();
  return normalizeIPv6(ip, options.ipv6Subnet || 64);
}
function createRateLimitKey(ip, path) {
  return `${ip}|${path}`;
}
const _envShim = /* @__PURE__ */ Object.create(null);
const _getEnv = (useShim) => globalThis.process?.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || (useShim ? _envShim : globalThis);
const env = new Proxy(_envShim, {
  get(_, prop) {
    return _getEnv()[prop] ?? _envShim[prop];
  },
  has(_, prop) {
    return prop in _getEnv() || prop in _envShim;
  },
  set(_, prop, value) {
    const env$12 = _getEnv(true);
    env$12[prop] = value;
    return true;
  },
  deleteProperty(_, prop) {
    if (!prop) return false;
    const env$12 = _getEnv(true);
    delete env$12[prop];
    return true;
  },
  ownKeys() {
    const env$12 = _getEnv(true);
    return Object.keys(env$12);
  }
});
function toBoolean(val) {
  return val ? val !== "false" : false;
}
const nodeENV = typeof process !== "undefined" && process.env && "production" || "";
const isProduction = nodeENV === "production";
const isDevelopment = () => nodeENV === "dev" || nodeENV === "development";
const isTest = () => nodeENV === "test" || toBoolean(env.TEST);
function getEnvVar(key, fallback) {
  if (typeof process !== "undefined" && process.env) return process.env[key] ?? fallback;
  if (typeof Deno !== "undefined") return Deno.env.get(key) ?? fallback;
  if (typeof Bun !== "undefined") return Bun.env[key] ?? fallback;
  return fallback;
}
function getBooleanEnvVar(key, fallback = true) {
  const value = getEnvVar(key);
  if (!value) return fallback;
  return value !== "0" && value.toLowerCase() !== "false" && value !== "";
}
const ENV = Object.freeze({
  get BETTER_AUTH_SECRET() {
    return getEnvVar("BETTER_AUTH_SECRET");
  },
  get AUTH_SECRET() {
    return getEnvVar("AUTH_SECRET");
  },
  get BETTER_AUTH_TELEMETRY() {
    return getEnvVar("BETTER_AUTH_TELEMETRY");
  },
  get BETTER_AUTH_TELEMETRY_ID() {
    return getEnvVar("BETTER_AUTH_TELEMETRY_ID");
  },
  get NODE_ENV() {
    return getEnvVar("NODE_ENV", "development");
  },
  get PACKAGE_VERSION() {
    return getEnvVar("PACKAGE_VERSION", "0.0.0");
  },
  get BETTER_AUTH_TELEMETRY_ENDPOINT() {
    return getEnvVar("BETTER_AUTH_TELEMETRY_ENDPOINT", "https://telemetry.better-auth.com/v1/track");
  }
});
const COLORS_2 = 1;
const COLORS_16 = 4;
const COLORS_256 = 8;
const COLORS_16m = 24;
const TERM_ENVS = {
  eterm: COLORS_16,
  cons25: COLORS_16,
  console: COLORS_16,
  cygwin: COLORS_16,
  dtterm: COLORS_16,
  gnome: COLORS_16,
  hurd: COLORS_16,
  jfbterm: COLORS_16,
  konsole: COLORS_16,
  kterm: COLORS_16,
  mlterm: COLORS_16,
  mosh: COLORS_16m,
  putty: COLORS_16,
  st: COLORS_16,
  "rxvt-unicode-24bit": COLORS_16m,
  terminator: COLORS_16m,
  "xterm-kitty": COLORS_16m
};
const CI_ENVS_MAP = new Map(Object.entries({
  APPVEYOR: COLORS_256,
  BUILDKITE: COLORS_256,
  CIRCLECI: COLORS_16m,
  DRONE: COLORS_256,
  GITEA_ACTIONS: COLORS_16m,
  GITHUB_ACTIONS: COLORS_16m,
  GITLAB_CI: COLORS_256,
  TRAVIS: COLORS_256
}));
const TERM_ENVS_REG_EXP = [
  /ansi/,
  /color/,
  /linux/,
  /direct/,
  /^con[0-9]*x[0-9]/,
  /^rxvt/,
  /^screen/,
  /^xterm/,
  /^vt100/,
  /^vt220/
];
function getColorDepth() {
  if (getEnvVar("FORCE_COLOR") !== void 0) switch (getEnvVar("FORCE_COLOR")) {
    case "":
    case "1":
    case "true":
      return COLORS_16;
    case "2":
      return COLORS_256;
    case "3":
      return COLORS_16m;
    default:
      return COLORS_2;
  }
  if (getEnvVar("NODE_DISABLE_COLORS") !== void 0 && getEnvVar("NODE_DISABLE_COLORS") !== "" || getEnvVar("NO_COLOR") !== void 0 && getEnvVar("NO_COLOR") !== "" || getEnvVar("TERM") === "dumb") return COLORS_2;
  if (getEnvVar("TMUX")) return COLORS_16m;
  if ("TF_BUILD" in env && "AGENT_NAME" in env) return COLORS_16;
  if ("CI" in env) {
    for (const { 0: envName, 1: colors } of CI_ENVS_MAP) if (envName in env) return colors;
    if (getEnvVar("CI_NAME") === "codeship") return COLORS_256;
    return COLORS_2;
  }
  if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.exec(getEnvVar("TEAMCITY_VERSION")) !== null ? COLORS_16 : COLORS_2;
  switch (getEnvVar("TERM_PROGRAM")) {
    case "iTerm.app":
      if (!getEnvVar("TERM_PROGRAM_VERSION") || /^[0-2]\./.exec(getEnvVar("TERM_PROGRAM_VERSION")) !== null) return COLORS_256;
      return COLORS_16m;
    case "HyperTerm":
    case "MacTerm":
      return COLORS_16m;
    case "Apple_Terminal":
      return COLORS_256;
  }
  if (getEnvVar("COLORTERM") === "truecolor" || getEnvVar("COLORTERM") === "24bit") return COLORS_16m;
  if (getEnvVar("TERM")) {
    if (/truecolor/.exec(getEnvVar("TERM")) !== null) return COLORS_16m;
    if (/^xterm-256/.exec(getEnvVar("TERM")) !== null) return COLORS_256;
    const termEnv = getEnvVar("TERM").toLowerCase();
    if (TERM_ENVS[termEnv]) return TERM_ENVS[termEnv];
    if (TERM_ENVS_REG_EXP.some((term) => term.exec(termEnv) !== null)) return COLORS_16;
  }
  if (getEnvVar("COLORTERM")) return COLORS_16;
  return COLORS_2;
}
const TTY_COLORS = {
  reset: "\x1B[0m",
  bright: "\x1B[1m",
  dim: "\x1B[2m",
  fg: {
    red: "\x1B[31m",
    green: "\x1B[32m",
    yellow: "\x1B[33m",
    blue: "\x1B[34m",
    magenta: "\x1B[35m"
  },
  bg: {
    black: "\x1B[40m"
  }
};
const levels = [
  "debug",
  "info",
  "success",
  "warn",
  "error"
];
function shouldPublishLog(currentLogLevel, logLevel) {
  return levels.indexOf(logLevel) >= levels.indexOf(currentLogLevel);
}
const levelColors = {
  info: TTY_COLORS.fg.blue,
  success: TTY_COLORS.fg.green,
  warn: TTY_COLORS.fg.yellow,
  error: TTY_COLORS.fg.red,
  debug: TTY_COLORS.fg.magenta
};
const formatMessage = (level, message, colorsEnabled) => {
  const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
  if (colorsEnabled) return `${TTY_COLORS.dim}${timestamp2}${TTY_COLORS.reset} ${levelColors[level]}${level.toUpperCase()}${TTY_COLORS.reset} ${TTY_COLORS.bright}[Better Auth]:${TTY_COLORS.reset} ${message}`;
  return `${timestamp2} ${level.toUpperCase()} [Better Auth]: ${message}`;
};
const createLogger = (options) => {
  const enabled = options?.disabled !== true;
  const logLevel = options?.level ?? "error";
  const colorsEnabled = options?.disableColors !== void 0 ? !options.disableColors : getColorDepth() !== 1;
  const LogFunc = (level, message, args = []) => {
    if (!enabled || !shouldPublishLog(logLevel, level)) return;
    const formattedMessage = formatMessage(level, message, colorsEnabled);
    if (!options || typeof options.log !== "function") {
      if (level === "error") console.error(formattedMessage, ...args);
      else if (level === "warn") console.warn(formattedMessage, ...args);
      else console.log(formattedMessage, ...args);
      return;
    }
    options.log(level === "success" ? "info" : level, message, ...args);
  };
  return {
    ...Object.fromEntries(levels.map((level) => [level, (...[message, ...args]) => LogFunc(level, message, args)])),
    get level() {
      return logLevel;
    }
  };
};
const logger = createLogger();
function safeJSONParse(data) {
  function reviver(_, value) {
    if (typeof value === "string") {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) return date;
      }
    }
    return value;
  }
  try {
    if (typeof data !== "string") return data;
    return JSON.parse(data, reviver);
  } catch (e2) {
    logger.error("Error parsing JSON", { error: e2 });
    return null;
  }
}
const BASE_ERROR_CODES = defineErrorCodes({
  USER_NOT_FOUND: "User not found",
  FAILED_TO_CREATE_USER: "Failed to create user",
  FAILED_TO_CREATE_SESSION: "Failed to create session",
  FAILED_TO_UPDATE_USER: "Failed to update user",
  FAILED_TO_GET_SESSION: "Failed to get session",
  INVALID_PASSWORD: "Invalid password",
  INVALID_EMAIL: "Invalid email",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
  PROVIDER_NOT_FOUND: "Provider not found",
  INVALID_TOKEN: "Invalid token",
  ID_TOKEN_NOT_SUPPORTED: "id_token not supported",
  FAILED_TO_GET_USER_INFO: "Failed to get user info",
  USER_EMAIL_NOT_FOUND: "User email not found",
  EMAIL_NOT_VERIFIED: "Email not verified",
  PASSWORD_TOO_SHORT: "Password too short",
  PASSWORD_TOO_LONG: "Password too long",
  USER_ALREADY_EXISTS: "User already exists.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Use another email.",
  EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",
  SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.",
  FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
  ACCOUNT_NOT_FOUND: "Account not found",
  USER_ALREADY_HAS_PASSWORD: "User already has a password. Provide that to delete the account.",
  CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: "Cross-site navigation login blocked. This request appears to be a CSRF attack.",
  VERIFICATION_EMAIL_NOT_ENABLED: "Verification email isn't enabled",
  EMAIL_ALREADY_VERIFIED: "Email is already verified",
  EMAIL_MISMATCH: "Email mismatch",
  SESSION_NOT_FRESH: "Session is not fresh",
  LINKED_ACCOUNT_ALREADY_EXISTS: "Linked account already exists",
  INVALID_ORIGIN: "Invalid origin",
  INVALID_CALLBACK_URL: "Invalid callbackURL",
  INVALID_REDIRECT_URL: "Invalid redirectURL",
  INVALID_ERROR_CALLBACK_URL: "Invalid errorCallbackURL",
  INVALID_NEW_USER_CALLBACK_URL: "Invalid newUserCallbackURL",
  MISSING_OR_NULL_ORIGIN: "Missing or null Origin",
  CALLBACK_URL_REQUIRED: "callbackURL is required",
  FAILED_TO_CREATE_VERIFICATION: "Unable to create verification",
  FIELD_NOT_ALLOWED: "Field not allowed to be set",
  ASYNC_VALIDATION_NOT_SUPPORTED: "Async validation is not supported",
  VALIDATION_ERROR: "Validation Error",
  MISSING_FIELD: "Field is required"
});
var BetterAuthError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "BetterAuthError";
    this.message = message;
    this.stack = "";
  }
};
const config = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64
};
async function generateKey(password, salt) {
  return await scryptAsync(password.normalize("NFKC"), salt, {
    N: config.N,
    p: config.p,
    r: config.r,
    dkLen: config.dkLen,
    maxmem: 128 * config.N * config.r * 2
  });
}
const hashPassword = async (password) => {
  const salt = hex.encode(crypto.getRandomValues(new Uint8Array(16)));
  const key = await generateKey(password, salt);
  return `${salt}:${hex.encode(key)}`;
};
const verifyPassword$1 = async ({ hash, password }) => {
  const [salt, key] = hash.split(":");
  if (!salt || !key) throw new BetterAuthError("Invalid password hash");
  return constantTimeEqual(await generateKey(password, salt), hexToBytes$1(key));
};
const symmetricEncrypt = async ({ key, data }) => {
  const keyAsBytes = await createHash$1("SHA-256").digest(key);
  const dataAsBytes = utf8ToBytes(data);
  return bytesToHex(managedNonce(xchacha20poly1305)(new Uint8Array(keyAsBytes)).encrypt(dataAsBytes));
};
const symmetricDecrypt = async ({ key, data }) => {
  const keyAsBytes = await createHash$1("SHA-256").digest(key);
  const dataAsBytes = hexToBytes(data);
  const chacha = managedNonce(xchacha20poly1305)(new Uint8Array(keyAsBytes));
  return new TextDecoder().decode(chacha.decrypt(dataAsBytes));
};
const getDate = (span, unit = "ms") => {
  return new Date(Date.now() + (unit === "sec" ? span * 1e3 : span));
};
const getAuthTables = (options) => {
  const pluginSchema = (options.plugins ?? []).reduce((acc, plugin) => {
    const schema2 = plugin.schema;
    if (!schema2) return acc;
    for (const [key, value] of Object.entries(schema2)) acc[key] = {
      fields: {
        ...acc[key]?.fields,
        ...value.fields
      },
      modelName: value.modelName || key
    };
    return acc;
  }, {});
  const shouldAddRateLimitTable = options.rateLimit?.storage === "database";
  const rateLimitTable = { rateLimit: {
    modelName: options.rateLimit?.modelName || "rateLimit",
    fields: {
      key: {
        type: "string",
        fieldName: options.rateLimit?.fields?.key || "key"
      },
      count: {
        type: "number",
        fieldName: options.rateLimit?.fields?.count || "count"
      },
      lastRequest: {
        type: "number",
        bigint: true,
        fieldName: options.rateLimit?.fields?.lastRequest || "lastRequest"
      }
    }
  } };
  const { user: user2, session: session2, account: account2, verification: verification2, ...pluginTables } = pluginSchema;
  const sessionTable = { session: {
    modelName: options.session?.modelName || "session",
    fields: {
      expiresAt: {
        type: "date",
        required: true,
        fieldName: options.session?.fields?.expiresAt || "expiresAt"
      },
      token: {
        type: "string",
        required: true,
        fieldName: options.session?.fields?.token || "token",
        unique: true
      },
      createdAt: {
        type: "date",
        required: true,
        fieldName: options.session?.fields?.createdAt || "createdAt",
        defaultValue: () => /* @__PURE__ */ new Date()
      },
      updatedAt: {
        type: "date",
        required: true,
        fieldName: options.session?.fields?.updatedAt || "updatedAt",
        onUpdate: () => /* @__PURE__ */ new Date()
      },
      ipAddress: {
        type: "string",
        required: false,
        fieldName: options.session?.fields?.ipAddress || "ipAddress"
      },
      userAgent: {
        type: "string",
        required: false,
        fieldName: options.session?.fields?.userAgent || "userAgent"
      },
      userId: {
        type: "string",
        fieldName: options.session?.fields?.userId || "userId",
        references: {
          model: options.user?.modelName || "user",
          field: "id",
          onDelete: "cascade"
        },
        required: true,
        index: true
      },
      ...session2?.fields,
      ...options.session?.additionalFields
    },
    order: 2
  } };
  return {
    user: {
      modelName: options.user?.modelName || "user",
      fields: {
        name: {
          type: "string",
          required: true,
          fieldName: options.user?.fields?.name || "name",
          sortable: true
        },
        email: {
          type: "string",
          unique: true,
          required: true,
          fieldName: options.user?.fields?.email || "email",
          sortable: true
        },
        emailVerified: {
          type: "boolean",
          defaultValue: false,
          required: true,
          fieldName: options.user?.fields?.emailVerified || "emailVerified",
          input: false
        },
        image: {
          type: "string",
          required: false,
          fieldName: options.user?.fields?.image || "image"
        },
        createdAt: {
          type: "date",
          defaultValue: () => /* @__PURE__ */ new Date(),
          required: true,
          fieldName: options.user?.fields?.createdAt || "createdAt"
        },
        updatedAt: {
          type: "date",
          defaultValue: () => /* @__PURE__ */ new Date(),
          onUpdate: () => /* @__PURE__ */ new Date(),
          required: true,
          fieldName: options.user?.fields?.updatedAt || "updatedAt"
        },
        ...user2?.fields,
        ...options.user?.additionalFields
      },
      order: 1
    },
    ...!options.secondaryStorage || options.session?.storeSessionInDatabase ? sessionTable : {},
    account: {
      modelName: options.account?.modelName || "account",
      fields: {
        accountId: {
          type: "string",
          required: true,
          fieldName: options.account?.fields?.accountId || "accountId"
        },
        providerId: {
          type: "string",
          required: true,
          fieldName: options.account?.fields?.providerId || "providerId"
        },
        userId: {
          type: "string",
          references: {
            model: options.user?.modelName || "user",
            field: "id",
            onDelete: "cascade"
          },
          required: true,
          fieldName: options.account?.fields?.userId || "userId",
          index: true
        },
        accessToken: {
          type: "string",
          required: false,
          returned: false,
          fieldName: options.account?.fields?.accessToken || "accessToken"
        },
        refreshToken: {
          type: "string",
          required: false,
          returned: false,
          fieldName: options.account?.fields?.refreshToken || "refreshToken"
        },
        idToken: {
          type: "string",
          required: false,
          returned: false,
          fieldName: options.account?.fields?.idToken || "idToken"
        },
        accessTokenExpiresAt: {
          type: "date",
          required: false,
          returned: false,
          fieldName: options.account?.fields?.accessTokenExpiresAt || "accessTokenExpiresAt"
        },
        refreshTokenExpiresAt: {
          type: "date",
          required: false,
          returned: false,
          fieldName: options.account?.fields?.refreshTokenExpiresAt || "refreshTokenExpiresAt"
        },
        scope: {
          type: "string",
          required: false,
          fieldName: options.account?.fields?.scope || "scope"
        },
        password: {
          type: "string",
          required: false,
          returned: false,
          fieldName: options.account?.fields?.password || "password"
        },
        createdAt: {
          type: "date",
          required: true,
          fieldName: options.account?.fields?.createdAt || "createdAt",
          defaultValue: () => /* @__PURE__ */ new Date()
        },
        updatedAt: {
          type: "date",
          required: true,
          fieldName: options.account?.fields?.updatedAt || "updatedAt",
          onUpdate: () => /* @__PURE__ */ new Date()
        },
        ...account2?.fields,
        ...options.account?.additionalFields
      },
      order: 3
    },
    verification: {
      modelName: options.verification?.modelName || "verification",
      fields: {
        identifier: {
          type: "string",
          required: true,
          fieldName: options.verification?.fields?.identifier || "identifier",
          index: true
        },
        value: {
          type: "string",
          required: true,
          fieldName: options.verification?.fields?.value || "value"
        },
        expiresAt: {
          type: "date",
          required: true,
          fieldName: options.verification?.fields?.expiresAt || "expiresAt"
        },
        createdAt: {
          type: "date",
          required: true,
          defaultValue: () => /* @__PURE__ */ new Date(),
          fieldName: options.verification?.fields?.createdAt || "createdAt"
        },
        updatedAt: {
          type: "date",
          required: true,
          defaultValue: () => /* @__PURE__ */ new Date(),
          onUpdate: () => /* @__PURE__ */ new Date(),
          fieldName: options.verification?.fields?.updatedAt || "updatedAt"
        },
        ...verification2?.fields,
        ...options.verification?.additionalFields
      },
      order: 4
    },
    ...pluginTables,
    ...shouldAddRateLimitTable ? rateLimitTable : {}
  };
};
const coreSchema = z$1.object({
  id: z$1.string(),
  createdAt: z$1.date().default(() => /* @__PURE__ */ new Date()),
  updatedAt: z$1.date().default(() => /* @__PURE__ */ new Date())
});
const accountSchema = coreSchema.extend({
  providerId: z$1.string(),
  accountId: z$1.string(),
  userId: z$1.coerce.string(),
  accessToken: z$1.string().nullish(),
  refreshToken: z$1.string().nullish(),
  idToken: z$1.string().nullish(),
  accessTokenExpiresAt: z$1.date().nullish(),
  refreshTokenExpiresAt: z$1.date().nullish(),
  scope: z$1.string().nullish(),
  password: z$1.string().nullish()
});
const rateLimitSchema = z$1.object({
  key: z$1.string(),
  count: z$1.number(),
  lastRequest: z$1.number()
});
const sessionSchema = coreSchema.extend({
  userId: z$1.coerce.string(),
  expiresAt: z$1.date(),
  token: z$1.string(),
  ipAddress: z$1.string().nullish(),
  userAgent: z$1.string().nullish()
});
const userSchema = coreSchema.extend({
  email: z$1.string().transform((val) => val.toLowerCase()),
  emailVerified: z$1.boolean().default(false),
  name: z$1.string(),
  image: z$1.string().nullish()
});
const verificationSchema = coreSchema.extend({
  value: z$1.string(),
  expiresAt: z$1.date(),
  identifier: z$1.string()
});
const import___better_auth_core_db = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  accountSchema,
  coreSchema,
  getAuthTables,
  rateLimitSchema,
  sessionSchema,
  userSchema,
  verificationSchema
}, Symbol.toStringTag, { value: "Module" }));
function isErrorStackTraceLimitWritable() {
  const desc2 = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
  if (desc2 === void 0) return Object.isExtensible(Error);
  return Object.prototype.hasOwnProperty.call(desc2, "writable") ? desc2.writable : desc2.set !== void 0;
}
function hideInternalStackFrames(stack) {
  const lines = stack.split("\n    at ");
  if (lines.length <= 1) return stack;
  lines.splice(1, 1);
  return lines.join("\n    at ");
}
function makeErrorForHideStackFrame(Base, clazz) {
  class HideStackFramesError extends Base {
    #hiddenStack;
    constructor(...args) {
      if (isErrorStackTraceLimitWritable()) {
        const limit = Error.stackTraceLimit;
        Error.stackTraceLimit = 0;
        super(...args);
        Error.stackTraceLimit = limit;
      } else super(...args);
      const stack = (/* @__PURE__ */ new Error()).stack;
      if (stack) this.#hiddenStack = hideInternalStackFrames(stack.replace(/^Error/, this.name));
    }
    get errorStack() {
      return this.#hiddenStack;
    }
  }
  Object.defineProperty(HideStackFramesError.prototype, "constructor", {
    get() {
      return clazz;
    },
    enumerable: false,
    configurable: true
  });
  return HideStackFramesError;
}
const statusCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  "I'M_A_TEAPOT": 418,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NOT_EXTENDED: 510,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
var InternalAPIError = class extends Error {
  constructor(status = "INTERNAL_SERVER_ERROR", body = void 0, headers = {}, statusCode = typeof status === "number" ? status : statusCodes[status]) {
    super(body?.message, body?.cause ? { cause: body.cause } : void 0);
    this.status = status;
    this.body = body;
    this.headers = headers;
    this.statusCode = statusCode;
    this.name = "APIError";
    this.status = status;
    this.headers = headers;
    this.statusCode = statusCode;
    this.body = body ? {
      code: body?.message?.toUpperCase().replace(/ /g, "_").replace(/[^A-Z0-9_]/g, ""),
      ...body
    } : void 0;
  }
};
var ValidationError = class extends InternalAPIError {
  constructor(message, issues) {
    super(400, {
      message,
      code: "VALIDATION_ERROR"
    });
    this.message = message;
    this.issues = issues;
    this.issues = issues;
  }
};
var BetterCallError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "BetterCallError";
  }
};
const APIError = makeErrorForHideStackFrame(InternalAPIError, Error);
const jsonContentTypeRegex = /^application\/([a-z0-9.+-]*\+)?json/i;
async function getBody(request2, allowedMediaTypes) {
  const contentType = request2.headers.get("content-type") || "";
  const normalizedContentType = contentType.toLowerCase();
  if (!request2.body) return;
  if (allowedMediaTypes && allowedMediaTypes.length > 0) {
    if (!allowedMediaTypes.some((allowed) => {
      const normalizedContentTypeBase = normalizedContentType.split(";")[0].trim();
      const normalizedAllowed = allowed.toLowerCase().trim();
      return normalizedContentTypeBase === normalizedAllowed || normalizedContentTypeBase.includes(normalizedAllowed);
    })) {
      if (!normalizedContentType) throw new APIError(415, {
        message: `Content-Type is required. Allowed types: ${allowedMediaTypes.join(", ")}`,
        code: "UNSUPPORTED_MEDIA_TYPE"
      });
      throw new APIError(415, {
        message: `Content-Type "${contentType}" is not allowed. Allowed types: ${allowedMediaTypes.join(", ")}`,
        code: "UNSUPPORTED_MEDIA_TYPE"
      });
    }
  }
  if (jsonContentTypeRegex.test(normalizedContentType)) return await request2.json();
  if (normalizedContentType.includes("application/x-www-form-urlencoded")) {
    const formData = await request2.formData();
    const result = {};
    formData.forEach((value, key) => {
      result[key] = value.toString();
    });
    return result;
  }
  if (normalizedContentType.includes("multipart/form-data")) {
    const formData = await request2.formData();
    const result = {};
    formData.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  if (normalizedContentType.includes("text/plain")) return await request2.text();
  if (normalizedContentType.includes("application/octet-stream")) return await request2.arrayBuffer();
  if (normalizedContentType.includes("application/pdf") || normalizedContentType.includes("image/") || normalizedContentType.includes("video/")) return await request2.blob();
  if (normalizedContentType.includes("application/stream") || request2.body instanceof ReadableStream) return request2.body;
  return await request2.text();
}
function isAPIError(error2) {
  return error2 instanceof APIError || error2?.name === "APIError";
}
function tryDecode(str) {
  try {
    return str.includes("%") ? decodeURIComponent(str) : str;
  } catch {
    return str;
  }
}
async function tryCatch(promise) {
  try {
    return {
      data: await promise,
      error: null
    };
  } catch (error2) {
    return {
      data: null,
      error: error2
    };
  }
}
function isRequest(obj) {
  return obj instanceof Request || Object.prototype.toString.call(obj) === "[object Request]";
}
function isJSONSerializable(value) {
  if (value === void 0) return false;
  const t2 = typeof value;
  if (t2 === "string" || t2 === "number" || t2 === "boolean" || t2 === null) return true;
  if (t2 !== "object") return false;
  if (Array.isArray(value)) return true;
  if (value.buffer) return false;
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
function safeStringify(obj, replacer, space) {
  let id = 0;
  const seen = /* @__PURE__ */ new WeakMap();
  const safeReplacer = (key, value) => {
    if (typeof value === "bigint") return value.toString();
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return `[Circular ref-${seen.get(value)}]`;
      seen.set(value, id++);
    }
    return value;
  };
  return JSON.stringify(obj, safeReplacer, space);
}
function isJSONResponse(value) {
  if (!value || typeof value !== "object") return false;
  return "_flag" in value && value._flag === "json";
}
function toResponse(data, init2) {
  if (data instanceof Response) {
    if (init2?.headers instanceof Headers) init2.headers.forEach((value, key) => {
      data.headers.set(key, value);
    });
    return data;
  }
  if (isJSONResponse(data)) {
    const body$1 = data.body;
    const routerResponse = data.routerResponse;
    if (routerResponse instanceof Response) return routerResponse;
    const headers$1 = new Headers();
    if (routerResponse?.headers) {
      const headers$2 = new Headers(routerResponse.headers);
      for (const [key, value] of headers$2.entries()) headers$2.set(key, value);
    }
    if (data.headers) for (const [key, value] of new Headers(data.headers).entries()) headers$1.set(key, value);
    if (init2?.headers) for (const [key, value] of new Headers(init2.headers).entries()) headers$1.set(key, value);
    headers$1.set("Content-Type", "application/json");
    return new Response(JSON.stringify(body$1), {
      ...routerResponse,
      headers: headers$1,
      status: data.status ?? init2?.status ?? routerResponse?.status,
      statusText: init2?.statusText ?? routerResponse?.statusText
    });
  }
  if (isAPIError(data)) return toResponse(data.body, {
    status: init2?.status ?? data.statusCode,
    statusText: data.status.toString(),
    headers: init2?.headers || data.headers
  });
  let body = data;
  let headers = new Headers(init2?.headers);
  if (!data) {
    if (data === null) body = JSON.stringify(null);
    headers.set("content-type", "application/json");
  } else if (typeof data === "string") {
    body = data;
    headers.set("Content-Type", "text/plain");
  } else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
    body = data;
    headers.set("Content-Type", "application/octet-stream");
  } else if (data instanceof Blob) {
    body = data;
    headers.set("Content-Type", data.type || "application/octet-stream");
  } else if (data instanceof FormData) body = data;
  else if (data instanceof URLSearchParams) {
    body = data;
    headers.set("Content-Type", "application/x-www-form-urlencoded");
  } else if (data instanceof ReadableStream) {
    body = data;
    headers.set("Content-Type", "application/octet-stream");
  } else if (isJSONSerializable(data)) {
    body = safeStringify(data);
    headers.set("Content-Type", "application/json");
  }
  return new Response(body, {
    ...init2,
    headers
  });
}
const algorithm = {
  name: "HMAC",
  hash: "SHA-256"
};
const getCryptoKey = async (secret) => {
  const secretBuf = typeof secret === "string" ? new TextEncoder().encode(secret) : secret;
  return await getWebcryptoSubtle().importKey("raw", secretBuf, algorithm, false, ["sign", "verify"]);
};
const verifySignature = async (base64Signature, value, secret) => {
  try {
    const signatureBinStr = atob(base64Signature);
    const signature = new Uint8Array(signatureBinStr.length);
    for (let i2 = 0, len = signatureBinStr.length; i2 < len; i2++) signature[i2] = signatureBinStr.charCodeAt(i2);
    return await getWebcryptoSubtle().verify(algorithm, secret, signature, new TextEncoder().encode(value));
  } catch (e2) {
    return false;
  }
};
const makeSignature = async (value, secret) => {
  const key = await getCryptoKey(secret);
  const signature = await getWebcryptoSubtle().sign(algorithm.name, key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
};
const signCookieValue = async (value, secret) => {
  const signature = await makeSignature(value, secret);
  value = `${value}.${signature}`;
  value = encodeURIComponent(value);
  return value;
};
const getCookieKey = (key, prefix) => {
  let finalKey = key;
  if (prefix) if (prefix === "secure") finalKey = "__Secure-" + key;
  else if (prefix === "host") finalKey = "__Host-" + key;
  else return;
  return finalKey;
};
function parseCookies(str) {
  if (typeof str !== "string") throw new TypeError("argument str must be a string");
  const cookies = /* @__PURE__ */ new Map();
  let index2 = 0;
  while (index2 < str.length) {
    const eqIdx = str.indexOf("=", index2);
    if (eqIdx === -1) break;
    let endIdx = str.indexOf(";", index2);
    if (endIdx === -1) endIdx = str.length;
    else if (endIdx < eqIdx) {
      index2 = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index2, eqIdx).trim();
    if (!cookies.has(key)) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) val = val.slice(1, -1);
      cookies.set(key, tryDecode(val));
    }
    index2 = endIdx + 1;
  }
  return cookies;
}
const _serialize = (key, value, opt = {}) => {
  let cookie;
  if (opt?.prefix === "secure") cookie = `${`__Secure-${key}`}=${value}`;
  else if (opt?.prefix === "host") cookie = `${`__Host-${key}`}=${value}`;
  else cookie = `${key}=${value}`;
  if (key.startsWith("__Secure-") && !opt.secure) opt.secure = true;
  if (key.startsWith("__Host-")) {
    if (!opt.secure) opt.secure = true;
    if (opt.path !== "/") opt.path = "/";
    if (opt.domain) opt.domain = void 0;
  }
  if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
    if (opt.maxAge > 3456e4) throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");
    cookie += `; Max-Age=${Math.floor(opt.maxAge)}`;
  }
  if (opt.domain && opt.prefix !== "host") cookie += `; Domain=${opt.domain}`;
  if (opt.path) cookie += `; Path=${opt.path}`;
  if (opt.expires) {
    if (opt.expires.getTime() - Date.now() > 3456e7) throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");
    cookie += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) cookie += "; HttpOnly";
  if (opt.secure) cookie += "; Secure";
  if (opt.sameSite) cookie += `; SameSite=${opt.sameSite.charAt(0).toUpperCase() + opt.sameSite.slice(1)}`;
  if (opt.partitioned) {
    if (!opt.secure) opt.secure = true;
    cookie += "; Partitioned";
  }
  return cookie;
};
const serializeCookie = (key, value, opt) => {
  value = encodeURIComponent(value);
  return _serialize(key, value, opt);
};
const serializeSignedCookie = async (key, value, secret, opt) => {
  value = await signCookieValue(value, secret);
  return _serialize(key, value, opt);
};
async function runValidation(options, context = {}) {
  let request2 = {
    body: context.body,
    query: context.query
  };
  if (options.body) {
    const result = await options.body["~standard"].validate(context.body);
    if (result.issues) return {
      data: null,
      error: fromError(result.issues, "body")
    };
    request2.body = result.value;
  }
  if (options.query) {
    const result = await options.query["~standard"].validate(context.query);
    if (result.issues) return {
      data: null,
      error: fromError(result.issues, "query")
    };
    request2.query = result.value;
  }
  if (options.requireHeaders && !context.headers) return {
    data: null,
    error: {
      message: "Headers is required",
      issues: []
    }
  };
  if (options.requireRequest && !context.request) return {
    data: null,
    error: {
      message: "Request is required",
      issues: []
    }
  };
  return {
    data: request2,
    error: null
  };
}
function fromError(error2, validating) {
  return {
    message: error2.map((e2) => {
      return `[${e2.path?.length ? `${validating}.` + e2.path.map((x2) => typeof x2 === "object" ? x2.key : x2).join(".") : validating}] ${e2.message}`;
    }).join("; "),
    issues: error2
  };
}
const createInternalContext = async (context, { options, path }) => {
  const headers = new Headers();
  let responseStatus = void 0;
  const { data, error: error2 } = await runValidation(options, context);
  if (error2) throw new ValidationError(error2.message, error2.issues);
  const requestHeaders = "headers" in context ? context.headers instanceof Headers ? context.headers : new Headers(context.headers) : "request" in context && isRequest(context.request) ? context.request.headers : null;
  const requestCookies = requestHeaders?.get("cookie");
  const parsedCookies = requestCookies ? parseCookies(requestCookies) : void 0;
  const internalContext = {
    ...context,
    body: data.body,
    query: data.query,
    path: context.path || path || "virtual:",
    context: "context" in context && context.context ? context.context : {},
    returned: void 0,
    headers: context?.headers,
    request: context?.request,
    params: "params" in context ? context.params : void 0,
    method: context.method ?? (Array.isArray(options.method) ? options.method[0] : options.method === "*" ? "GET" : options.method),
    setHeader: (key, value) => {
      headers.set(key, value);
    },
    getHeader: (key) => {
      if (!requestHeaders) return null;
      return requestHeaders.get(key);
    },
    getCookie: (key, prefix) => {
      const finalKey = getCookieKey(key, prefix);
      if (!finalKey) return null;
      return parsedCookies?.get(finalKey) || null;
    },
    getSignedCookie: async (key, secret, prefix) => {
      const finalKey = getCookieKey(key, prefix);
      if (!finalKey) return null;
      const value = parsedCookies?.get(finalKey);
      if (!value) return null;
      const signatureStartPos = value.lastIndexOf(".");
      if (signatureStartPos < 1) return null;
      const signedValue = value.substring(0, signatureStartPos);
      const signature = value.substring(signatureStartPos + 1);
      if (signature.length !== 44 || !signature.endsWith("=")) return null;
      return await verifySignature(signature, signedValue, await getCryptoKey(secret)) ? signedValue : false;
    },
    setCookie: (key, value, options$1) => {
      const cookie = serializeCookie(key, value, options$1);
      headers.append("set-cookie", cookie);
      return cookie;
    },
    setSignedCookie: async (key, value, secret, options$1) => {
      const cookie = await serializeSignedCookie(key, value, secret, options$1);
      headers.append("set-cookie", cookie);
      return cookie;
    },
    redirect: (url) => {
      headers.set("location", url);
      return new APIError("FOUND", void 0, headers);
    },
    error: (status, body, headers$1) => {
      return new APIError(status, body, headers$1);
    },
    setStatus: (status) => {
      responseStatus = status;
    },
    json: (json, routerResponse) => {
      if (!context.asResponse) return json;
      return {
        body: routerResponse?.body || json,
        routerResponse,
        _flag: "json"
      };
    },
    responseHeaders: headers,
    get responseStatus() {
      return responseStatus;
    }
  };
  for (const middleware of options.use || []) {
    const response = await middleware({
      ...internalContext,
      returnHeaders: true,
      asResponse: false
    });
    if (response.response) Object.assign(internalContext.context, response.response);
    if (response.headers) response.headers.forEach((value, key) => {
      internalContext.responseHeaders.set(key, value);
    });
  }
  return internalContext;
};
function createEndpoint(pathOrOptions, handlerOrOptions, handlerOrNever) {
  const path = typeof pathOrOptions === "string" ? pathOrOptions : void 0;
  const options = typeof handlerOrOptions === "object" ? handlerOrOptions : pathOrOptions;
  const handler = typeof handlerOrOptions === "function" ? handlerOrOptions : handlerOrNever;
  if ((options.method === "GET" || options.method === "HEAD") && options.body) throw new BetterCallError("Body is not allowed with GET or HEAD methods");
  if (path && /\/{2,}/.test(path)) throw new BetterCallError("Path cannot contain consecutive slashes");
  const internalHandler = async (...inputCtx) => {
    const context = inputCtx[0] || {};
    const { data: internalContext, error: validationError } = await tryCatch(createInternalContext(context, {
      options,
      path
    }));
    if (validationError) {
      if (!(validationError instanceof ValidationError)) throw validationError;
      if (options.onValidationError) await options.onValidationError({
        message: validationError.message,
        issues: validationError.issues
      });
      throw new APIError(400, {
        message: validationError.message,
        code: "VALIDATION_ERROR"
      });
    }
    const response = await handler(internalContext).catch(async (e2) => {
      if (isAPIError(e2)) {
        const onAPIError = options.onAPIError;
        if (onAPIError) await onAPIError(e2);
        if (context.asResponse) return e2;
      }
      throw e2;
    });
    const headers = internalContext.responseHeaders;
    const status = internalContext.responseStatus;
    return context.asResponse ? toResponse(response, {
      headers,
      status
    }) : context.returnHeaders ? context.returnStatus ? {
      headers,
      response,
      status
    } : {
      headers,
      response
    } : context.returnStatus ? {
      response,
      status
    } : response;
  };
  internalHandler.options = options;
  internalHandler.path = path;
  return internalHandler;
}
createEndpoint.create = (opts) => {
  return (path, options, handler) => {
    return createEndpoint(path, {
      ...options,
      use: [...options?.use || [], ...opts?.use || []]
    }, handler);
  };
};
function createMiddleware(optionsOrHandler, handler) {
  const internalHandler = async (inputCtx) => {
    const context = inputCtx;
    const _handler = typeof optionsOrHandler === "function" ? optionsOrHandler : handler;
    const internalContext = await createInternalContext(context, {
      options: typeof optionsOrHandler === "function" ? {} : optionsOrHandler,
      path: "/"
    });
    if (!_handler) throw new Error("handler must be defined");
    const response = await _handler(internalContext);
    const headers = internalContext.responseHeaders;
    return context.returnHeaders ? {
      headers,
      response
    } : response;
  };
  internalHandler.options = typeof optionsOrHandler === "function" ? {} : optionsOrHandler;
  return internalHandler;
}
createMiddleware.create = (opts) => {
  function fn(optionsOrHandler, handler) {
    if (typeof optionsOrHandler === "function") return createMiddleware({ use: opts?.use }, optionsOrHandler);
    if (!handler) throw new Error("Middleware handler is required");
    return createMiddleware({
      ...optionsOrHandler,
      method: "*",
      use: [...opts?.use || [], ...optionsOrHandler.use || []]
    }, handler);
  }
  return fn;
};
const paths = {};
function getTypeFromZodType$1(zodType) {
  switch (zodType.constructor.name) {
    case "ZodString":
      return "string";
    case "ZodNumber":
      return "number";
    case "ZodBoolean":
      return "boolean";
    case "ZodObject":
      return "object";
    case "ZodArray":
      return "array";
    default:
      return "string";
  }
}
function getParameters$1(options) {
  const parameters = [];
  if (options.metadata?.openapi?.parameters) {
    parameters.push(...options.metadata.openapi.parameters);
    return parameters;
  }
  if (options.query instanceof ZodObject) Object.entries(options.query.shape).forEach(([key, value]) => {
    if (value instanceof ZodObject) parameters.push({
      name: key,
      in: "query",
      schema: {
        type: getTypeFromZodType$1(value),
        ..."minLength" in value && value.minLength ? { minLength: value.minLength } : {},
        description: value.description
      }
    });
  });
  return parameters;
}
function getRequestBody$1(options) {
  if (options.metadata?.openapi?.requestBody) return options.metadata.openapi.requestBody;
  if (!options.body) return void 0;
  if (options.body instanceof ZodObject || options.body instanceof ZodOptional) {
    const shape = options.body.shape;
    if (!shape) return void 0;
    const properties = {};
    const required = [];
    Object.entries(shape).forEach(([key, value]) => {
      if (value instanceof ZodObject) {
        properties[key] = {
          type: getTypeFromZodType$1(value),
          description: value.description
        };
        if (!(value instanceof ZodOptional)) required.push(key);
      }
    });
    return {
      required: options.body instanceof ZodOptional ? false : options.body ? true : false,
      content: { "application/json": { schema: {
        type: "object",
        properties,
        required
      } } }
    };
  }
}
function getResponse$1(responses) {
  return {
    "400": {
      content: { "application/json": { schema: {
        type: "object",
        properties: { message: { type: "string" } },
        required: ["message"]
      } } },
      description: "Bad Request. Usually due to missing parameters, or invalid parameters."
    },
    "401": {
      content: { "application/json": { schema: {
        type: "object",
        properties: { message: { type: "string" } },
        required: ["message"]
      } } },
      description: "Unauthorized. Due to missing or invalid authentication."
    },
    "403": {
      content: { "application/json": { schema: {
        type: "object",
        properties: { message: { type: "string" } }
      } } },
      description: "Forbidden. You do not have permission to access this resource or to perform this action."
    },
    "404": {
      content: { "application/json": { schema: {
        type: "object",
        properties: { message: { type: "string" } }
      } } },
      description: "Not Found. The requested resource was not found."
    },
    "429": {
      content: { "application/json": { schema: {
        type: "object",
        properties: { message: { type: "string" } }
      } } },
      description: "Too Many Requests. You have exceeded the rate limit. Try again later."
    },
    "500": {
      content: { "application/json": { schema: {
        type: "object",
        properties: { message: { type: "string" } }
      } } },
      description: "Internal Server Error. This is a problem with the server that you cannot fix."
    },
    ...responses
  };
}
async function generator$1(endpoints, config2) {
  const components = { schemas: {} };
  Object.entries(endpoints).forEach(([_, value]) => {
    const options = value.options;
    if (!value.path || options.metadata?.SERVER_ONLY) return;
    if (options.method === "GET") paths[value.path] = { get: {
      tags: ["Default", ...options.metadata?.openapi?.tags || []],
      description: options.metadata?.openapi?.description,
      operationId: options.metadata?.openapi?.operationId,
      security: [{ bearerAuth: [] }],
      parameters: getParameters$1(options),
      responses: getResponse$1(options.metadata?.openapi?.responses)
    } };
    if (options.method === "POST") {
      const body = getRequestBody$1(options);
      paths[value.path] = { post: {
        tags: ["Default", ...options.metadata?.openapi?.tags || []],
        description: options.metadata?.openapi?.description,
        operationId: options.metadata?.openapi?.operationId,
        security: [{ bearerAuth: [] }],
        parameters: getParameters$1(options),
        ...body ? { requestBody: body } : { requestBody: { content: { "application/json": { schema: {
          type: "object",
          properties: {}
        } } } } },
        responses: getResponse$1(options.metadata?.openapi?.responses)
      } };
    }
  });
  return {
    openapi: "3.1.1",
    info: {
      title: "Better Auth",
      description: "API Reference for your Better Auth Instance",
      version: "1.1.0"
    },
    components,
    security: [{ apiKeyCookie: [] }],
    servers: [{ url: config2?.url }],
    tags: [{
      name: "Default",
      description: "Default endpoints that are included with Better Auth by default. These endpoints are not part of any plugin."
    }],
    paths
  };
}
const getHTML$1 = (apiReference, config2) => `<!doctype html>
<html>
  <head>
    <title>Scalar API Reference</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script
      id="api-reference"
      type="application/json">
    ${JSON.stringify(apiReference)}
    <\/script>
	 <script>
      var configuration = {
	  	favicon: ${config2?.logo ? `data:image/svg+xml;utf8,${encodeURIComponent(config2.logo)}` : void 0} ,
	   	theme: ${config2?.theme || "saturn"},
        metaData: {
			title: ${config2?.title || "Open API Reference"},
			description: ${config2?.description || "Better Call Open API"},
		}
      }
      document.getElementById('api-reference').dataset.configuration =
        JSON.stringify(configuration)
    <\/script>
	  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"><\/script>
  </body>
</html>`;
const createRouter$1 = (endpoints, config2) => {
  if (!config2?.openapi?.disabled) {
    const openapi = {
      path: "/api/reference",
      ...config2?.openapi
    };
    endpoints["openapi"] = createEndpoint(openapi.path, { method: "GET" }, async (c2) => {
      const schema2 = await generator$1(endpoints);
      return new Response(getHTML$1(schema2, openapi.scalar), { headers: { "Content-Type": "text/html" } });
    });
  }
  const router2 = createRouter();
  const middlewareRouter = createRouter();
  for (const endpoint of Object.values(endpoints)) {
    if (!endpoint.options || !endpoint.path) continue;
    if (endpoint.options?.metadata?.SERVER_ONLY) continue;
    const methods = Array.isArray(endpoint.options?.method) ? endpoint.options.method : [endpoint.options?.method];
    for (const method of methods) addRoute(router2, method, endpoint.path, endpoint);
  }
  if (config2?.routerMiddleware?.length) for (const { path, middleware } of config2.routerMiddleware) addRoute(middlewareRouter, "*", path, middleware);
  const processRequest = async (request2) => {
    const url = new URL(request2.url);
    const pathname = url.pathname;
    const path = config2?.basePath && config2.basePath !== "/" ? pathname.split(config2.basePath).reduce((acc, curr, index2) => {
      if (index2 !== 0) if (index2 > 1) acc.push(`${config2.basePath}${curr}`);
      else acc.push(curr);
      return acc;
    }, []).join("") : url.pathname;
    if (!path?.length) return new Response(null, {
      status: 404,
      statusText: "Not Found"
    });
    if (/\/{2,}/.test(path)) return new Response(null, {
      status: 404,
      statusText: "Not Found"
    });
    const route = findRoute(router2, request2.method, path);
    if (path.endsWith("/") !== route?.data?.path?.endsWith("/") && !config2?.skipTrailingSlashes) return new Response(null, {
      status: 404,
      statusText: "Not Found"
    });
    if (!route?.data) return new Response(null, {
      status: 404,
      statusText: "Not Found"
    });
    const query = {};
    url.searchParams.forEach((value, key) => {
      if (key in query) if (Array.isArray(query[key])) query[key].push(value);
      else query[key] = [query[key], value];
      else query[key] = value;
    });
    const handler = route.data;
    try {
      const allowedMediaTypes = handler.options.metadata?.allowedMediaTypes || config2?.allowedMediaTypes;
      const context = {
        path,
        method: request2.method,
        headers: request2.headers,
        params: route.params ? JSON.parse(JSON.stringify(route.params)) : {},
        request: request2,
        body: handler.options.disableBody ? void 0 : await getBody(handler.options.cloneRequest ? request2.clone() : request2, allowedMediaTypes),
        query,
        _flag: "router",
        asResponse: true,
        context: config2?.routerContext
      };
      const middlewareRoutes = findAllRoutes(middlewareRouter, "*", path);
      if (middlewareRoutes?.length) for (const { data: middleware, params } of middlewareRoutes) {
        const res = await middleware({
          ...context,
          params,
          asResponse: false
        });
        if (res instanceof Response) return res;
      }
      return await handler(context);
    } catch (error2) {
      if (config2?.onError) try {
        const errorResponse = await config2.onError(error2);
        if (errorResponse instanceof Response) return toResponse(errorResponse);
      } catch (error$1) {
        if (isAPIError(error$1)) return toResponse(error$1);
        throw error$1;
      }
      if (config2?.throwError) throw error2;
      if (isAPIError(error2)) return toResponse(error2);
      console.error(`# SERVER_ERROR: `, error2);
      return new Response(null, {
        status: 500,
        statusText: "Internal Server Error"
      });
    }
  };
  return {
    handler: async (request2) => {
      const onReq = await config2?.onRequest?.(request2);
      if (onReq instanceof Response) return onReq;
      const res = await processRequest(isRequest(onReq) ? onReq : request2);
      const onRes = await config2?.onResponse?.(res);
      if (onRes instanceof Response) return onRes;
      return res;
    },
    endpoints
  };
};
const cache = /* @__PURE__ */ new WeakMap();
function parseOutputData(data, schema2) {
  const fields = schema2.fields;
  const parsedData = {};
  for (const key in data) {
    const field = fields[key];
    if (!field) {
      parsedData[key] = data[key];
      continue;
    }
    if (field.returned === false && key !== "id") continue;
    parsedData[key] = data[key];
  }
  return parsedData;
}
function getFields(options, table, mode) {
  const cacheKey = `${table}:${mode}`;
  if (!cache.has(options)) cache.set(options, /* @__PURE__ */ new Map());
  const tableCache = cache.get(options);
  if (tableCache.has(cacheKey)) return tableCache.get(cacheKey);
  const coreSchema2 = mode === "output" ? getAuthTables(options)[table]?.fields ?? {} : {};
  const additionalFields = table === "user" || table === "session" || table === "account" ? options[table]?.additionalFields : void 0;
  let schema2 = {
    ...coreSchema2,
    ...additionalFields ?? {}
  };
  for (const plugin of options.plugins || []) if (plugin.schema && plugin.schema[table]) schema2 = {
    ...schema2,
    ...plugin.schema[table].fields
  };
  tableCache.set(cacheKey, schema2);
  return schema2;
}
function parseUserOutput(options, user2) {
  return parseOutputData(user2, { fields: getFields(options, "user", "output") });
}
function parseSessionOutput(options, session2) {
  return parseOutputData(session2, { fields: getFields(options, "session", "output") });
}
function parseAccountOutput(options, account2) {
  const { accessToken: _accessToken, refreshToken: _refreshToken, idToken: _idToken, accessTokenExpiresAt: _accessTokenExpiresAt, refreshTokenExpiresAt: _refreshTokenExpiresAt, password: _password, ...rest } = parseOutputData(account2, { fields: getFields(options, "account", "output") });
  return rest;
}
function parseInputData(data, schema2) {
  const action = schema2.action || "create";
  const fields = schema2.fields;
  const parsedData = Object.assign(/* @__PURE__ */ Object.create(null), null);
  for (const key in fields) {
    if (key in data) {
      if (fields[key].input === false) {
        if (fields[key].defaultValue !== void 0) {
          if (action !== "update") {
            parsedData[key] = fields[key].defaultValue;
            continue;
          }
        }
        if (data[key]) throw new APIError("BAD_REQUEST", { message: `${key} is not allowed to be set` });
        continue;
      }
      if (fields[key].validator?.input && data[key] !== void 0) {
        const result = fields[key].validator.input["~standard"].validate(data[key]);
        if (result instanceof Promise) throw new APIError("INTERNAL_SERVER_ERROR", { message: "Async validation is not supported for additional fields" });
        if ("issues" in result && result.issues) throw new APIError("BAD_REQUEST", { message: result.issues[0]?.message || "Validation Error" });
        parsedData[key] = result.value;
        continue;
      }
      if (fields[key].transform?.input && data[key] !== void 0) {
        parsedData[key] = fields[key].transform?.input(data[key]);
        continue;
      }
      parsedData[key] = data[key];
      continue;
    }
    if (fields[key].defaultValue !== void 0 && action === "create") {
      if (typeof fields[key].defaultValue === "function") {
        parsedData[key] = fields[key].defaultValue();
        continue;
      }
      parsedData[key] = fields[key].defaultValue;
      continue;
    }
    if (fields[key].required && action === "create") throw new APIError("BAD_REQUEST", { message: `${key} is required` });
  }
  return parsedData;
}
function parseUserInput(options, user2 = {}, action) {
  return parseInputData(user2, {
    fields: getFields(options, "user", "input"),
    action
  });
}
function parseAdditionalUserInput(options, user2) {
  const schema2 = getFields(options, "user", "input");
  return parseInputData(user2 || {}, { fields: schema2 });
}
function parseAccountInput(options, account2) {
  return parseInputData(account2, { fields: getFields(options, "account", "input") });
}
function parseSessionInput(options, session2) {
  return parseInputData(session2, { fields: getFields(options, "session", "input") });
}
function mergeSchema(schema2, newSchema) {
  if (!newSchema) return schema2;
  for (const table in newSchema) {
    const newModelName = newSchema[table]?.modelName;
    if (newModelName) schema2[table].modelName = newModelName;
    for (const field in schema2[table].fields) {
      const newField = newSchema[table]?.fields?.[field];
      if (!newField) continue;
      schema2[table].fields[field].fieldName = newField;
    }
  }
  return schema2;
}
const ALLOWED_COOKIE_SIZE = 4096;
const ESTIMATED_EMPTY_COOKIE_SIZE = 200;
const CHUNK_SIZE = ALLOWED_COOKIE_SIZE - ESTIMATED_EMPTY_COOKIE_SIZE;
function parseCookiesFromContext(ctx) {
  const cookieHeader = ctx.headers?.get("cookie");
  if (!cookieHeader) return {};
  const cookies = {};
  const pairs = cookieHeader.split("; ");
  for (const pair of pairs) {
    const [name, ...valueParts] = pair.split("=");
    if (name && valueParts.length > 0) cookies[name] = valueParts.join("=");
  }
  return cookies;
}
function getChunkIndex(cookieName) {
  const parts = cookieName.split(".");
  const lastPart = parts[parts.length - 1];
  const index2 = parseInt(lastPart || "0", 10);
  return isNaN(index2) ? 0 : index2;
}
function readExistingChunks(cookieName, ctx) {
  const chunks = {};
  const cookies = parseCookiesFromContext(ctx);
  for (const [name, value] of Object.entries(cookies)) if (name.startsWith(cookieName)) chunks[name] = value;
  return chunks;
}
function joinChunks(chunks) {
  return Object.keys(chunks).sort((a2, b2) => {
    return getChunkIndex(a2) - getChunkIndex(b2);
  }).map((key) => chunks[key]).join("");
}
function chunkCookie(storeName, cookie, chunks, logger2) {
  const chunkCount = Math.ceil(cookie.value.length / CHUNK_SIZE);
  if (chunkCount === 1) {
    chunks[cookie.name] = cookie.value;
    return [cookie];
  }
  const cookies = [];
  for (let i2 = 0; i2 < chunkCount; i2++) {
    const name = `${cookie.name}.${i2}`;
    const start = i2 * CHUNK_SIZE;
    const value = cookie.value.substring(start, start + CHUNK_SIZE);
    cookies.push({
      ...cookie,
      name,
      value
    });
    chunks[name] = value;
  }
  logger2.debug(`CHUNKING_${storeName.toUpperCase()}_COOKIE`, {
    message: `${storeName} cookie exceeds allowed ${ALLOWED_COOKIE_SIZE} bytes.`,
    emptyCookieSize: ESTIMATED_EMPTY_COOKIE_SIZE,
    valueSize: cookie.value.length,
    chunkCount,
    chunks: cookies.map((c2) => c2.value.length + ESTIMATED_EMPTY_COOKIE_SIZE)
  });
  return cookies;
}
function getCleanCookies(chunks, cookieOptions) {
  const cleanedChunks = {};
  for (const name in chunks) cleanedChunks[name] = {
    name,
    value: "",
    attributes: {
      ...cookieOptions,
      maxAge: 0
    }
  };
  return cleanedChunks;
}
const storeFactory = (storeName) => (cookieName, cookieOptions, ctx) => {
  const chunks = readExistingChunks(cookieName, ctx);
  const logger2 = ctx.context.logger;
  return {
    getValue() {
      return joinChunks(chunks);
    },
    hasChunks() {
      return Object.keys(chunks).length > 0;
    },
    chunk(value, options) {
      const cleanedChunks = getCleanCookies(chunks, cookieOptions);
      for (const name in chunks) delete chunks[name];
      const cookies = cleanedChunks;
      const chunked = chunkCookie(storeName, {
        name: cookieName,
        value,
        attributes: {
          ...cookieOptions,
          ...options
        }
      }, chunks, logger2);
      for (const chunk of chunked) cookies[chunk.name] = chunk;
      return Object.values(cookies);
    },
    clean() {
      const cleanedChunks = getCleanCookies(chunks, cookieOptions);
      for (const name in chunks) delete chunks[name];
      return Object.values(cleanedChunks);
    },
    setCookies(cookies) {
      for (const cookie of cookies) ctx.setCookie(cookie.name, cookie.value, cookie.attributes);
    }
  };
};
const createSessionStore = storeFactory("Session");
const createAccountStore = storeFactory("Account");
function getChunkedCookie(ctx, cookieName) {
  const value = ctx.getCookie(cookieName);
  if (value) return value;
  const chunks = [];
  const cookieHeader = ctx.headers?.get("cookie");
  if (!cookieHeader) return null;
  const cookies = {};
  const pairs = cookieHeader.split("; ");
  for (const pair of pairs) {
    const [name, ...valueParts] = pair.split("=");
    if (name && valueParts.length > 0) cookies[name] = valueParts.join("=");
  }
  for (const [name, val] of Object.entries(cookies)) if (name.startsWith(cookieName + ".")) {
    const indexStr = name.split(".").at(-1);
    const index2 = parseInt(indexStr || "0", 10);
    if (!isNaN(index2)) chunks.push({
      index: index2,
      value: val
    });
  }
  if (chunks.length > 0) {
    chunks.sort((a2, b2) => a2.index - b2.index);
    return chunks.map((c2) => c2.value).join("");
  }
  return null;
}
async function setAccountCookie(c2, accountData) {
  const accountDataCookie = c2.context.authCookies.accountData;
  const options = {
    maxAge: 300,
    ...accountDataCookie.attributes
  };
  const data = await symmetricEncodeJWT(accountData, c2.context.secret, "better-auth-account", options.maxAge);
  if (data.length > ALLOWED_COOKIE_SIZE) {
    const accountStore = createAccountStore(accountDataCookie.name, options, c2);
    const cookies = accountStore.chunk(data, options);
    accountStore.setCookies(cookies);
  } else {
    const accountStore = createAccountStore(accountDataCookie.name, options, c2);
    if (accountStore.hasChunks()) {
      const cleanCookies = accountStore.clean();
      accountStore.setCookies(cleanCookies);
    }
    c2.setCookie(accountDataCookie.name, data, options);
  }
}
async function getAccountCookie(c2) {
  const accountCookie = getChunkedCookie(c2, c2.context.authCookies.accountData.name);
  if (accountCookie) {
    const accountData = safeJSONParse(await symmetricDecodeJWT(accountCookie, c2.context.secret, "better-auth-account"));
    if (accountData) return accountData;
  }
  return null;
}
const getSessionQuerySchema = z$1.optional(z$1.object({
  disableCookieCache: z$1.coerce.boolean().meta({ description: "Disable cookie cache and fetch session from database" }).optional(),
  disableRefresh: z$1.coerce.boolean().meta({ description: "Disable session refresh. Useful for checking session status, without updating the session" }).optional()
}));
const SEC = 1e3;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365.25;
const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)(?: (ago|from now))?$/i;
function parse(value) {
  const match = REGEX.exec(value);
  if (!match || match[4] && match[1]) throw new TypeError(`Invalid time string format: "${value}". Use formats like "7d", "30m", "1 hour", etc.`);
  const n2 = parseFloat(match[2]);
  const unit = match[3].toLowerCase();
  let result;
  switch (unit) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      result = n2 * YEAR;
      break;
    case "months":
    case "month":
    case "mo":
      result = n2 * MONTH;
      break;
    case "weeks":
    case "week":
    case "w":
      result = n2 * WEEK;
      break;
    case "days":
    case "day":
    case "d":
      result = n2 * DAY;
      break;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      result = n2 * HOUR;
      break;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      result = n2 * MIN;
      break;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      result = n2 * SEC;
      break;
    default:
      throw new TypeError(`Unknown time unit: "${unit}"`);
  }
  if (match[1] === "-" || match[4] === "ago") return -result;
  return result;
}
function ms(value) {
  return parse(value);
}
function sec(value) {
  return Math.round(parse(value) / 1e3);
}
const SECURE_COOKIE_PREFIX = "__Secure-";
function parseSetCookieHeader(setCookie2) {
  const cookies = /* @__PURE__ */ new Map();
  setCookie2.split(", ").forEach((cookieString) => {
    const [nameValue, ...attributes] = cookieString.split(";").map((part) => part.trim());
    const [name, ...valueParts] = (nameValue || "").split("=");
    const value = valueParts.join("=");
    if (!name || value === void 0) return;
    const attrObj = { value };
    attributes.forEach((attribute) => {
      const [attrName, ...attrValueParts] = attribute.split("=");
      const attrValue = attrValueParts.join("=");
      const normalizedAttrName = attrName.trim().toLowerCase();
      switch (normalizedAttrName) {
        case "max-age":
          attrObj["max-age"] = attrValue ? parseInt(attrValue.trim(), 10) : void 0;
          break;
        case "expires":
          attrObj.expires = attrValue ? new Date(attrValue.trim()) : void 0;
          break;
        case "domain":
          attrObj.domain = attrValue ? attrValue.trim() : void 0;
          break;
        case "path":
          attrObj.path = attrValue ? attrValue.trim() : void 0;
          break;
        case "secure":
          attrObj.secure = true;
          break;
        case "httponly":
          attrObj.httponly = true;
          break;
        case "samesite":
          attrObj.samesite = attrValue ? attrValue.trim().toLowerCase() : void 0;
          break;
        default:
          attrObj[normalizedAttrName] = attrValue ? attrValue.trim() : true;
          break;
      }
    });
    cookies.set(name, attrObj);
  });
  return cookies;
}
function createCookieGetter(options) {
  const secureCookiePrefix = (options.advanced?.useSecureCookies !== void 0 ? options.advanced?.useSecureCookies : options.baseURL ? options.baseURL.startsWith("https://") ? true : false : isProduction) ? SECURE_COOKIE_PREFIX : "";
  const crossSubdomainEnabled = !!options.advanced?.crossSubDomainCookies?.enabled;
  const domain = crossSubdomainEnabled ? options.advanced?.crossSubDomainCookies?.domain || (options.baseURL ? new URL(options.baseURL).hostname : void 0) : void 0;
  if (crossSubdomainEnabled && !domain) throw new BetterAuthError("baseURL is required when crossSubdomainCookies are enabled");
  function createCookie(cookieName, overrideAttributes = {}) {
    const prefix = options.advanced?.cookiePrefix || "better-auth";
    const name = options.advanced?.cookies?.[cookieName]?.name || `${prefix}.${cookieName}`;
    const attributes = options.advanced?.cookies?.[cookieName]?.attributes;
    return {
      name: `${secureCookiePrefix}${name}`,
      attributes: {
        secure: !!secureCookiePrefix,
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        ...crossSubdomainEnabled ? { domain } : {},
        ...options.advanced?.defaultCookieAttributes,
        ...overrideAttributes,
        ...attributes
      }
    };
  }
  return createCookie;
}
function getCookies(options) {
  const createCookie = createCookieGetter(options);
  const sessionToken = createCookie("session_token", { maxAge: options.session?.expiresIn || sec("7d") });
  const sessionData = createCookie("session_data", { maxAge: options.session?.cookieCache?.maxAge || 300 });
  const accountData = createCookie("account_data", { maxAge: options.session?.cookieCache?.maxAge || 300 });
  const dontRememberToken = createCookie("dont_remember");
  return {
    sessionToken: {
      name: sessionToken.name,
      attributes: sessionToken.attributes
    },
    sessionData: {
      name: sessionData.name,
      attributes: sessionData.attributes
    },
    dontRememberToken: {
      name: dontRememberToken.name,
      attributes: dontRememberToken.attributes
    },
    accountData: {
      name: accountData.name,
      attributes: accountData.attributes
    }
  };
}
async function setCookieCache(ctx, session2, dontRememberMe) {
  if (ctx.context.options.session?.cookieCache?.enabled) {
    const filteredSession = Object.entries(session2.session).reduce((acc, [key, value]) => {
      const fieldConfig = ctx.context.options.session?.additionalFields?.[key];
      if (!fieldConfig || fieldConfig.returned !== false) acc[key] = value;
      return acc;
    }, {});
    const filteredUser = parseUserOutput(ctx.context.options, session2.user);
    const versionConfig = ctx.context.options.session?.cookieCache?.version;
    let version2 = "1";
    if (versionConfig) {
      if (typeof versionConfig === "string") version2 = versionConfig;
      else if (typeof versionConfig === "function") {
        const result = versionConfig(session2.session, session2.user);
        version2 = result instanceof Promise ? await result : result;
      }
    }
    const sessionData = {
      session: filteredSession,
      user: filteredUser,
      updatedAt: Date.now(),
      version: version2
    };
    const options = {
      ...ctx.context.authCookies.sessionData.attributes,
      maxAge: dontRememberMe ? void 0 : ctx.context.authCookies.sessionData.attributes.maxAge
    };
    const expiresAtDate = getDate(options.maxAge || 60, "sec").getTime();
    const strategy = ctx.context.options.session?.cookieCache?.strategy || "compact";
    let data;
    if (strategy === "jwe") data = await symmetricEncodeJWT(sessionData, ctx.context.secret, "better-auth-session", options.maxAge || 300);
    else if (strategy === "jwt") data = await signJWT(sessionData, ctx.context.secret, options.maxAge || 300);
    else data = base64Url.encode(JSON.stringify({
      session: sessionData,
      expiresAt: expiresAtDate,
      signature: await createHMAC("SHA-256", "base64urlnopad").sign(ctx.context.secret, JSON.stringify({
        ...sessionData,
        expiresAt: expiresAtDate
      }))
    }), { padding: false });
    if (data.length > 4093) {
      const sessionStore = createSessionStore(ctx.context.authCookies.sessionData.name, options, ctx);
      const cookies = sessionStore.chunk(data, options);
      sessionStore.setCookies(cookies);
    } else {
      const sessionStore = createSessionStore(ctx.context.authCookies.sessionData.name, options, ctx);
      if (sessionStore.hasChunks()) {
        const cleanCookies = sessionStore.clean();
        sessionStore.setCookies(cleanCookies);
      }
      ctx.setCookie(ctx.context.authCookies.sessionData.name, data, options);
    }
  }
}
async function setSessionCookie(ctx, session2, dontRememberMe, overrides) {
  const dontRememberMeCookie = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
  dontRememberMe = dontRememberMe !== void 0 ? dontRememberMe : !!dontRememberMeCookie;
  const options = ctx.context.authCookies.sessionToken.attributes;
  const maxAge = dontRememberMe ? void 0 : ctx.context.sessionConfig.expiresIn;
  await ctx.setSignedCookie(ctx.context.authCookies.sessionToken.name, session2.session.token, ctx.context.secret, {
    ...options,
    maxAge,
    ...overrides
  });
  if (dontRememberMe) await ctx.setSignedCookie(ctx.context.authCookies.dontRememberToken.name, "true", ctx.context.secret, ctx.context.authCookies.dontRememberToken.attributes);
  await setCookieCache(ctx, session2, dontRememberMe);
  ctx.context.setNewSession(session2);
  if (ctx.context.options.secondaryStorage) await ctx.context.secondaryStorage?.set(session2.session.token, JSON.stringify({
    user: session2.user,
    session: session2.session
  }), Math.floor((new Date(session2.session.expiresAt).getTime() - Date.now()) / 1e3));
}
function expireCookie(ctx, cookie) {
  ctx.setCookie(cookie.name, "", {
    ...cookie.attributes,
    maxAge: 0
  });
}
function deleteSessionCookie(ctx, skipDontRememberMe) {
  expireCookie(ctx, ctx.context.authCookies.sessionToken);
  expireCookie(ctx, ctx.context.authCookies.sessionData);
  if (ctx.context.options.account?.storeAccountCookie) {
    expireCookie(ctx, ctx.context.authCookies.accountData);
    const accountStore = createAccountStore(ctx.context.authCookies.accountData.name, ctx.context.authCookies.accountData.attributes, ctx);
    const cleanCookies$1 = accountStore.clean();
    accountStore.setCookies(cleanCookies$1);
  }
  if (ctx.context.oauthConfig.storeStateStrategy === "cookie") expireCookie(ctx, ctx.context.createAuthCookie("oauth_state"));
  const sessionStore = createSessionStore(ctx.context.authCookies.sessionData.name, ctx.context.authCookies.sessionData.attributes, ctx);
  const cleanCookies = sessionStore.clean();
  sessionStore.setCookies(cleanCookies);
  expireCookie(ctx, ctx.context.authCookies.dontRememberToken);
}
async function generateState(c2, link, additionalData) {
  const callbackURL = c2.body?.callbackURL || c2.context.options.baseURL;
  if (!callbackURL) throw new APIError("BAD_REQUEST", { message: "callbackURL is required" });
  const codeVerifier = generateRandomString(128);
  const state = generateRandomString(32);
  const storeStateStrategy = c2.context.oauthConfig.storeStateStrategy;
  const stateData = {
    ...additionalData ? additionalData : {},
    callbackURL,
    codeVerifier,
    errorURL: c2.body?.errorCallbackURL,
    newUserURL: c2.body?.newUserCallbackURL,
    link,
    expiresAt: Date.now() + 600 * 1e3,
    requestSignUp: c2.body?.requestSignUp,
    state
  };
  await setOAuthState(stateData);
  if (storeStateStrategy === "cookie") {
    const encryptedData = await symmetricEncrypt({
      key: c2.context.secret,
      data: JSON.stringify(stateData)
    });
    const stateCookie$1 = c2.context.createAuthCookie("oauth_state", { maxAge: 600 * 1e3 });
    c2.setCookie(stateCookie$1.name, encryptedData, stateCookie$1.attributes);
    return {
      state,
      codeVerifier
    };
  }
  const stateCookie = c2.context.createAuthCookie("state", { maxAge: 300 * 1e3 });
  await c2.setSignedCookie(stateCookie.name, state, c2.context.secret, stateCookie.attributes);
  const expiresAt = /* @__PURE__ */ new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  const verification2 = await c2.context.internalAdapter.createVerificationValue({
    value: JSON.stringify(stateData),
    identifier: state,
    expiresAt
  });
  if (!verification2) {
    c2.context.logger.error("Unable to create verification. Make sure the database adapter is properly working and there is a verification table in the database");
    throw new APIError("INTERNAL_SERVER_ERROR", { message: "Unable to create verification" });
  }
  return {
    state: verification2.identifier,
    codeVerifier
  };
}
async function parseState(c2) {
  const state = c2.query.state || c2.body.state;
  const storeStateStrategy = c2.context.oauthConfig.storeStateStrategy;
  const stateDataSchema = z$1.looseObject({
    callbackURL: z$1.string(),
    codeVerifier: z$1.string(),
    errorURL: z$1.string().optional(),
    newUserURL: z$1.string().optional(),
    expiresAt: z$1.number(),
    link: z$1.object({
      email: z$1.string(),
      userId: z$1.coerce.string()
    }).optional(),
    requestSignUp: z$1.boolean().optional(),
    state: z$1.string().optional()
  });
  let parsedData;
  const skipStateCookieCheck = c2.context.oauthConfig?.skipStateCookieCheck;
  if (storeStateStrategy === "cookie") {
    const stateCookie = c2.context.createAuthCookie("oauth_state");
    const encryptedData = c2.getCookie(stateCookie.name);
    if (!encryptedData) {
      c2.context.logger.error("State Mismatch. OAuth state cookie not found", { state });
      const errorURL = c2.context.options.onAPIError?.errorURL || `${c2.context.baseURL}/error`;
      throw c2.redirect(`${errorURL}?error=please_restart_the_process`);
    }
    try {
      const decryptedData = await symmetricDecrypt({
        key: c2.context.secret,
        data: encryptedData
      });
      parsedData = stateDataSchema.parse(JSON.parse(decryptedData));
    } catch (error2) {
      c2.context.logger.error("Failed to decrypt or parse OAuth state cookie", { error: error2 });
      const errorURL = c2.context.options.onAPIError?.errorURL || `${c2.context.baseURL}/error`;
      throw c2.redirect(`${errorURL}?error=please_restart_the_process`);
    }
    if (!c2.context.oauthConfig?.skipStateCookieCheck && parsedData.state && parsedData.state !== state) {
      c2.context.logger.error("State Mismatch. State parameter does not match", {
        expected: parsedData.state,
        received: state
      });
      const errorURL = c2.context.options.onAPIError?.errorURL || `${c2.context.baseURL}/error`;
      throw c2.redirect(`${errorURL}?error=state_mismatch`);
    }
    expireCookie(c2, stateCookie);
  } else {
    const data = await c2.context.internalAdapter.findVerificationValue(state);
    if (!data) {
      c2.context.logger.error("State Mismatch. Verification not found", { state });
      const errorURL = c2.context.options.onAPIError?.errorURL || `${c2.context.baseURL}/error`;
      throw c2.redirect(`${errorURL}?error=please_restart_the_process`);
    }
    parsedData = stateDataSchema.parse(JSON.parse(data.value));
    const stateCookie = c2.context.createAuthCookie("state");
    const stateCookieValue = await c2.getSignedCookie(stateCookie.name, c2.context.secret);
    if (!skipStateCookieCheck && (!stateCookieValue || stateCookieValue !== state)) {
      const errorURL = c2.context.options.onAPIError?.errorURL || `${c2.context.baseURL}/error`;
      throw c2.redirect(`${errorURL}?error=state_mismatch`);
    }
    expireCookie(c2, stateCookie);
    await c2.context.internalAdapter.deleteVerificationValue(data.id);
  }
  if (!parsedData.errorURL) parsedData.errorURL = c2.context.options.onAPIError?.errorURL || `${c2.context.baseURL}/error`;
  if (parsedData.expiresAt < Date.now()) {
    const errorURL = c2.context.options.onAPIError?.errorURL || `${c2.context.baseURL}/error`;
    throw c2.redirect(`${errorURL}?error=please_restart_the_process`);
  }
  if (parsedData) await setOAuthState(parsedData);
  return parsedData;
}
const HIDE_METADATA = { scope: "server" };
const LOCALHOST_IP = "127.0.0.1";
function getIp(req, options) {
  if (options.advanced?.ipAddress?.disableIpTracking) return null;
  const headers = "headers" in req ? req.headers : req;
  const ipHeaders = options.advanced?.ipAddress?.ipAddressHeaders || ["x-forwarded-for"];
  for (const key of ipHeaders) {
    const value = "get" in headers ? headers.get(key) : headers[key];
    if (typeof value === "string") {
      const ip = value.split(",")[0].trim();
      if (isValidIP(ip)) return normalizeIP(ip, { ipv6Subnet: options.advanced?.ipAddress?.ipv6Subnet });
    }
  }
  if (isTest() || isDevelopment()) return LOCALHOST_IP;
  return null;
}
function checkHasPath(url) {
  try {
    return (new URL(url).pathname.replace(/\/+$/, "") || "/") !== "/";
  } catch {
    throw new BetterAuthError(`Invalid base URL: ${url}. Please provide a valid base URL.`);
  }
}
function assertHasProtocol(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new BetterAuthError(`Invalid base URL: ${url}. URL must include 'http://' or 'https://'`);
  } catch (error2) {
    if (error2 instanceof BetterAuthError) throw error2;
    throw new BetterAuthError(`Invalid base URL: ${url}. Please provide a valid base URL.`, { cause: error2 });
  }
}
function withPath(url, path = "/api/auth") {
  assertHasProtocol(url);
  if (checkHasPath(url)) return url;
  const trimmedUrl = url.replace(/\/+$/, "");
  if (!path || path === "/") return trimmedUrl;
  path = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedUrl}${path}`;
}
function validateProxyHeader(header, type) {
  if (!header || header.trim() === "") return false;
  if (type === "proto") return header === "http" || header === "https";
  if (type === "host") {
    if ([
      /\.\./,
      /\0/,
      /[\s]/,
      /^[.]/,
      /[<>'"]/,
      /javascript:/i,
      /file:/i,
      /data:/i
    ].some((pattern) => pattern.test(header))) return false;
    return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(:[0-9]{1,5})?$/.test(header) || /^(\d{1,3}\.){3}\d{1,3}(:[0-9]{1,5})?$/.test(header) || /^\[[0-9a-fA-F:]+\](:[0-9]{1,5})?$/.test(header) || /^localhost(:[0-9]{1,5})?$/i.test(header);
  }
  return false;
}
function getBaseURL(url, path, request2, loadEnv, trustedProxyHeaders) {
  if (url) return withPath(url, path);
  {
    const fromEnv2 = env.BETTER_AUTH_URL || env.NEXT_PUBLIC_BETTER_AUTH_URL || env.PUBLIC_BETTER_AUTH_URL || env.NUXT_PUBLIC_BETTER_AUTH_URL || env.NUXT_PUBLIC_AUTH_URL || (env.BASE_URL !== "/" ? env.BASE_URL : void 0);
    if (fromEnv2) return withPath(fromEnv2, path);
  }
  const fromRequest = request2?.headers.get("x-forwarded-host");
  const fromRequestProto = request2?.headers.get("x-forwarded-proto");
  if (fromRequest && fromRequestProto && trustedProxyHeaders) {
    if (validateProxyHeader(fromRequestProto, "proto") && validateProxyHeader(fromRequest, "host")) try {
      return withPath(`${fromRequestProto}://${fromRequest}`, path);
    } catch (_error) {
    }
  }
  if (request2) {
    const url$1 = getOrigin(request2.url);
    if (!url$1) throw new BetterAuthError("Could not get origin from request. Please provide a valid base URL.");
    return withPath(url$1, path);
  }
  if (typeof window !== "undefined" && window.location) return withPath(window.location.origin, path);
}
function getOrigin(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin === "null" ? null : parsedUrl.origin;
  } catch {
    return null;
  }
}
function getProtocol(url) {
  try {
    return new URL(url).protocol;
  } catch {
    return null;
  }
}
function getHost(url) {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}
function escapeRegExpChar(char) {
  if (char === "-" || char === "^" || char === "$" || char === "+" || char === "." || char === "(" || char === ")" || char === "|" || char === "[" || char === "]" || char === "{" || char === "}" || char === "*" || char === "?" || char === "\\") return `\\${char}`;
  else return char;
}
function escapeRegExpString(str) {
  let result = "";
  for (let i2 = 0; i2 < str.length; i2++) result += escapeRegExpChar(str[i2]);
  return result;
}
function transform(pattern, separator = true) {
  if (Array.isArray(pattern)) return `(?:${pattern.map((p2) => `^${transform(p2, separator)}$`).join("|")})`;
  let separatorSplitter = "";
  let separatorMatcher = "";
  let wildcard = ".";
  if (separator === true) {
    separatorSplitter = "/";
    separatorMatcher = "[/\\\\]";
    wildcard = "[^/\\\\]";
  } else if (separator) {
    separatorSplitter = separator;
    separatorMatcher = escapeRegExpString(separatorSplitter);
    if (separatorMatcher.length > 1) {
      separatorMatcher = `(?:${separatorMatcher})`;
      wildcard = `((?!${separatorMatcher}).)`;
    } else wildcard = `[^${separatorMatcher}]`;
  }
  const requiredSeparator = separator ? `${separatorMatcher}+?` : "";
  const optionalSeparator = separator ? `${separatorMatcher}*?` : "";
  const segments = separator ? pattern.split(separatorSplitter) : [pattern];
  let result = "";
  for (let s2 = 0; s2 < segments.length; s2++) {
    const segment = segments[s2];
    const nextSegment = segments[s2 + 1];
    let currentSeparator = "";
    if (!segment && s2 > 0) continue;
    if (separator) if (s2 === segments.length - 1) currentSeparator = optionalSeparator;
    else if (nextSegment !== "**") currentSeparator = requiredSeparator;
    else currentSeparator = "";
    if (separator && segment === "**") {
      if (currentSeparator) {
        result += s2 === 0 ? "" : currentSeparator;
        result += `(?:${wildcard}*?${currentSeparator})*?`;
      }
      continue;
    }
    for (let c2 = 0; c2 < segment.length; c2++) {
      const char = segment[c2];
      if (char === "\\") {
        if (c2 < segment.length - 1) {
          result += escapeRegExpChar(segment[c2 + 1]);
          c2++;
        }
      } else if (char === "?") result += wildcard;
      else if (char === "*") result += `${wildcard}*?`;
      else result += escapeRegExpChar(char);
    }
    result += currentSeparator;
  }
  return result;
}
function isMatch(regexp, sample) {
  if (typeof sample !== "string") throw new TypeError(`Sample must be a string, but ${typeof sample} given`);
  return regexp.test(sample);
}
function wildcardMatch(pattern, options) {
  if (typeof pattern !== "string" && !Array.isArray(pattern)) throw new TypeError(`The first argument must be a single pattern string or an array of patterns, but ${typeof pattern} given`);
  if (typeof options === "string" || typeof options === "boolean") options = { separator: options };
  if (arguments.length === 2 && !(typeof options === "undefined" || typeof options === "object" && options !== null && !Array.isArray(options))) throw new TypeError(`The second argument must be an options object or a string/boolean separator, but ${typeof options} given`);
  options = options || {};
  if (options.separator === "\\") throw new Error("\\ is not a valid separator because it is used for escaping. Try setting the separator to `true` instead");
  const regexpPattern = transform(pattern, options.separator);
  const regexp = new RegExp(`^${regexpPattern}$`, options.flags);
  const fn = isMatch.bind(null, regexp);
  fn.options = options;
  fn.pattern = pattern;
  fn.regexp = regexp;
  return fn;
}
const matchesOriginPattern = (url, pattern, settings) => {
  if (url.startsWith("/")) {
    if (settings?.allowRelativePaths) return url.startsWith("/") && /^\/(?!\/|\\|%2f|%5c)[\w\-.\+/@]*(?:\?[\w\-.\+/=&%@]*)?$/.test(url);
    return false;
  }
  if (pattern.includes("*") || pattern.includes("?")) {
    if (pattern.includes("://")) return wildcardMatch(pattern)(getOrigin(url) || url);
    const host = getHost(url);
    if (!host) return false;
    return wildcardMatch(pattern)(host);
  }
  const protocol = getProtocol(url);
  return protocol === "http:" || protocol === "https:" || !protocol ? pattern === getOrigin(url) : url.startsWith(pattern);
};
const optionsMiddleware = createMiddleware(async () => {
  return {};
});
const createAuthMiddleware = createMiddleware.create({ use: [optionsMiddleware, createMiddleware(async () => {
  return {};
})] });
const use = [optionsMiddleware];
function createAuthEndpoint(pathOrOptions, handlerOrOptions, handlerOrNever) {
  const path = typeof pathOrOptions === "string" ? pathOrOptions : void 0;
  const options = typeof handlerOrOptions === "object" ? handlerOrOptions : pathOrOptions;
  const handler = typeof handlerOrOptions === "function" ? handlerOrOptions : handlerOrNever;
  if (path) return createEndpoint(path, {
    ...options,
    use: [...options?.use || [], ...use]
  }, async (ctx) => runWithEndpointContext(ctx, () => handler(ctx)));
  return createEndpoint({
    ...options,
    use: [...options?.use || [], ...use]
  }, async (ctx) => runWithEndpointContext(ctx, () => handler(ctx)));
}
function shouldSkipCSRFForBackwardCompat(ctx) {
  return ctx.context.skipOriginCheck && ctx.context.options.advanced?.disableCSRFCheck === void 0;
}
const logBackwardCompatWarning = deprecate(function logBackwardCompatWarning$1() {
}, "disableOriginCheck: true currently also disables CSRF checks. In a future version, disableOriginCheck will ONLY disable URL validation. To keep CSRF disabled, add disableCSRFCheck: true to your config.");
const originCheckMiddleware = createAuthMiddleware(async (ctx) => {
  if (ctx.request?.method === "GET" || ctx.request?.method === "OPTIONS" || ctx.request?.method === "HEAD" || !ctx.request) return;
  await validateOrigin(ctx);
  if (ctx.context.skipOriginCheck) return;
  const { body, query } = ctx;
  const callbackURL = body?.callbackURL || query?.callbackURL;
  const redirectURL = body?.redirectTo;
  const errorCallbackURL = body?.errorCallbackURL;
  const newUserCallbackURL = body?.newUserCallbackURL;
  const validateURL = (url, label) => {
    if (!url) return;
    if (!ctx.context.isTrustedOrigin(url, { allowRelativePaths: label !== "origin" })) {
      ctx.context.logger.error(`Invalid ${label}: ${url}`);
      ctx.context.logger.info(`If it's a valid URL, please add ${url} to trustedOrigins in your auth config
`, `Current list of trustedOrigins: ${ctx.context.trustedOrigins}`);
      throw new APIError("FORBIDDEN", { message: `Invalid ${label}` });
    }
  };
  callbackURL && validateURL(callbackURL, "callbackURL");
  redirectURL && validateURL(redirectURL, "redirectURL");
  errorCallbackURL && validateURL(errorCallbackURL, "errorCallbackURL");
  newUserCallbackURL && validateURL(newUserCallbackURL, "newUserCallbackURL");
});
const originCheck = (getValue) => createAuthMiddleware(async (ctx) => {
  if (!ctx.request) return;
  if (ctx.context.skipOriginCheck) return;
  const callbackURL = getValue(ctx);
  const validateURL = (url, label) => {
    if (!url) return;
    if (!ctx.context.isTrustedOrigin(url, { allowRelativePaths: label !== "origin" })) {
      ctx.context.logger.error(`Invalid ${label}: ${url}`);
      ctx.context.logger.info(`If it's a valid URL, please add ${url} to trustedOrigins in your auth config
`, `Current list of trustedOrigins: ${ctx.context.trustedOrigins}`);
      throw new APIError("FORBIDDEN", { message: `Invalid ${label}` });
    }
  };
  const callbacks = Array.isArray(callbackURL) ? callbackURL : [callbackURL];
  for (const url of callbacks) validateURL(url, "callbackURL");
});
async function validateOrigin(ctx, forceValidate = false) {
  const headers = ctx.request?.headers;
  if (!headers || !ctx.request) return;
  const originHeader = headers.get("origin") || headers.get("referer") || "";
  const useCookies = headers.has("cookie");
  if (ctx.context.skipCSRFCheck) return;
  if (shouldSkipCSRFForBackwardCompat(ctx)) {
    ctx.context.options.advanced?.disableOriginCheck === true && logBackwardCompatWarning();
    return;
  }
  if (!(forceValidate || useCookies)) return;
  if (!originHeader || originHeader === "null") throw new APIError("FORBIDDEN", { message: BASE_ERROR_CODES.MISSING_OR_NULL_ORIGIN });
  const trustedOrigins = Array.isArray(ctx.context.options.trustedOrigins) ? ctx.context.trustedOrigins : [...ctx.context.trustedOrigins, ...(await ctx.context.options.trustedOrigins?.(ctx.request))?.filter((v2) => Boolean(v2)) || []];
  if (!trustedOrigins.some((origin) => matchesOriginPattern(originHeader, origin))) {
    ctx.context.logger.error(`Invalid origin: ${originHeader}`);
    ctx.context.logger.info(`If it's a valid URL, please add ${originHeader} to trustedOrigins in your auth config
`, `Current list of trustedOrigins: ${trustedOrigins}`);
    throw new APIError("FORBIDDEN", { message: "Invalid origin" });
  }
}
const formCsrfMiddleware = createAuthMiddleware(async (ctx) => {
  if (!ctx.request) return;
  await validateFormCsrf(ctx);
});
async function validateFormCsrf(ctx) {
  const req = ctx.request;
  if (!req) return;
  if (ctx.context.skipCSRFCheck) return;
  if (shouldSkipCSRFForBackwardCompat(ctx)) return;
  const headers = req.headers;
  if (headers.has("cookie")) return await validateOrigin(ctx);
  const site = headers.get("Sec-Fetch-Site");
  const mode = headers.get("Sec-Fetch-Mode");
  const dest = headers.get("Sec-Fetch-Dest");
  if (Boolean(site && site.trim() || mode && mode.trim() || dest && dest.trim())) {
    if (site === "cross-site" && mode === "navigate") {
      ctx.context.logger.error("Blocked cross-site navigation login attempt (CSRF protection)", {
        secFetchSite: site,
        secFetchMode: mode,
        secFetchDest: dest
      });
      throw new APIError("FORBIDDEN", { message: BASE_ERROR_CODES.CROSS_SITE_NAVIGATION_LOGIN_BLOCKED });
    }
    return await validateOrigin(ctx, true);
  }
}
function shouldRateLimit(max, window2, rateLimitData) {
  const now2 = Date.now();
  const windowInMs = window2 * 1e3;
  return now2 - rateLimitData.lastRequest < windowInMs && rateLimitData.count >= max;
}
function rateLimitResponse(retryAfter) {
  return new Response(JSON.stringify({ message: "Too many requests. Please try again later." }), {
    status: 429,
    statusText: "Too Many Requests",
    headers: { "X-Retry-After": retryAfter.toString() }
  });
}
function getRetryAfter(lastRequest, window2) {
  const now2 = Date.now();
  const windowInMs = window2 * 1e3;
  return Math.ceil((lastRequest + windowInMs - now2) / 1e3);
}
function createDBStorage(ctx) {
  const model = "rateLimit";
  const db2 = ctx.adapter;
  return {
    get: async (key) => {
      const data = (await db2.findMany({
        model,
        where: [{
          field: "key",
          value: key
        }]
      }))[0];
      if (typeof data?.lastRequest === "bigint") data.lastRequest = Number(data.lastRequest);
      return data;
    },
    set: async (key, value, _update) => {
      try {
        if (_update) await db2.updateMany({
          model,
          where: [{
            field: "key",
            value: key
          }],
          update: {
            count: value.count,
            lastRequest: value.lastRequest
          }
        });
        else await db2.create({
          model,
          data: {
            key,
            count: value.count,
            lastRequest: value.lastRequest
          }
        });
      } catch (e2) {
        ctx.logger.error("Error setting rate limit", e2);
      }
    }
  };
}
const memory = /* @__PURE__ */ new Map();
function getRateLimitStorage(ctx, rateLimitSettings) {
  if (ctx.options.rateLimit?.customStorage) return ctx.options.rateLimit.customStorage;
  const storage = ctx.rateLimit.storage;
  if (storage === "secondary-storage") return {
    get: async (key) => {
      const data = await ctx.options.secondaryStorage?.get(key);
      return data ? safeJSONParse(data) : void 0;
    },
    set: async (key, value, _update) => {
      const ttl = rateLimitSettings?.window ?? ctx.options.rateLimit?.window ?? 10;
      await ctx.options.secondaryStorage?.set?.(key, JSON.stringify(value), ttl);
    }
  };
  else if (storage === "memory") return {
    async get(key) {
      const entry = memory.get(key);
      if (!entry) return;
      if (Date.now() >= entry.expiresAt) {
        memory.delete(key);
        return;
      }
      return entry.data;
    },
    async set(key, value, _update) {
      const ttl = rateLimitSettings?.window ?? ctx.options.rateLimit?.window ?? 10;
      const expiresAt = Date.now() + ttl * 1e3;
      memory.set(key, {
        data: value,
        expiresAt
      });
    }
  };
  return createDBStorage(ctx);
}
async function onRequestRateLimit(req, ctx) {
  if (!ctx.rateLimit.enabled) return;
  const path = new URL(req.url).pathname.replace(ctx.options.basePath || "/api/auth", "").replace(/\/+$/, "");
  let window2 = ctx.rateLimit.window;
  let max = ctx.rateLimit.max;
  const ip = getIp(req, ctx.options);
  if (!ip) return;
  const key = createRateLimitKey(ip, path);
  const specialRule = getDefaultSpecialRules().find((rule) => rule.pathMatcher(path));
  if (specialRule) {
    window2 = specialRule.window;
    max = specialRule.max;
  }
  for (const plugin of ctx.options.plugins || []) if (plugin.rateLimit) {
    const matchedRule = plugin.rateLimit.find((rule) => rule.pathMatcher(path));
    if (matchedRule) {
      window2 = matchedRule.window;
      max = matchedRule.max;
      break;
    }
  }
  if (ctx.rateLimit.customRules) {
    const _path = Object.keys(ctx.rateLimit.customRules).find((p2) => {
      if (p2.includes("*")) return wildcardMatch(p2)(path);
      return p2 === path;
    });
    if (_path) {
      const customRule = ctx.rateLimit.customRules[_path];
      const resolved = typeof customRule === "function" ? await customRule(req) : customRule;
      if (resolved) {
        window2 = resolved.window;
        max = resolved.max;
      }
      if (resolved === false) return;
    }
  }
  const storage = getRateLimitStorage(ctx, { window: window2 });
  const data = await storage.get(key);
  const now2 = Date.now();
  if (!data) await storage.set(key, {
    key,
    count: 1,
    lastRequest: now2
  });
  else {
    const timeSinceLastRequest = now2 - data.lastRequest;
    if (shouldRateLimit(max, window2, data)) return rateLimitResponse(getRetryAfter(data.lastRequest, window2));
    else if (timeSinceLastRequest > window2 * 1e3) await storage.set(key, {
      ...data,
      count: 1,
      lastRequest: now2
    }, true);
    else await storage.set(key, {
      ...data,
      count: data.count + 1,
      lastRequest: now2
    }, true);
  }
}
function getDefaultSpecialRules() {
  return [{
    pathMatcher(path) {
      return path.startsWith("/sign-in") || path.startsWith("/sign-up") || path.startsWith("/change-password") || path.startsWith("/change-email");
    },
    window: 10,
    max: 3
  }];
}
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (all, symbols) => {
  let target = {};
  for (var name in all) {
    __defProp(target, name, {
      get: all[name],
      enumerable: true
    });
  }
  return target;
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (var keys = __getOwnPropNames(from), i2 = 0, n2 = keys.length, key; i2 < n2; i2++) {
      key = keys[i2];
      if (!__hasOwnProp.call(to, key) && key !== except) {
        __defProp(to, key, {
          get: ((k2) => from[k2]).bind(null, key),
          enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable
        });
      }
    }
  }
  return to;
};
var __reExport = (target, mod, secondTarget, symbols) => {
  __copyProps(target, mod, "default");
};
async function getBaseAdapter(options, handleDirectDatabase) {
  let adapter;
  if (!options.database) {
    const tables = getAuthTables(options);
    const memoryDB = Object.keys(tables).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});
    const { memoryAdapter } = await import("./index-bro8BKSR.mjs");
    adapter = memoryAdapter(memoryDB)(options);
  } else if (typeof options.database === "function") adapter = options.database(options);
  else adapter = await handleDirectDatabase(options);
  if (!adapter.transaction) {
    logger.warn("Adapter does not correctly implement transaction function, patching it automatically. Please update your adapter implementation.");
    adapter.transaction = async (cb) => {
      return cb(adapter);
    };
  }
  return adapter;
}
async function getAdapter(options) {
  return getBaseAdapter(options, async (opts) => {
    const { createKyselyAdapter: createKyselyAdapter2 } = await import("./index-xqpIp7VM.mjs");
    const { kysely, databaseType, transaction } = await createKyselyAdapter2(opts);
    if (!kysely) throw new BetterAuthError("Failed to initialize database adapter");
    const { kyselyAdapter } = await import("./index-xqpIp7VM.mjs");
    return kyselyAdapter(kysely, {
      type: databaseType || "sqlite",
      debugLogs: opts.database && "debugLogs" in opts.database ? opts.database.debugLogs : false,
      transaction
    })(opts);
  });
}
const createFieldAttribute = (type, config2) => {
  return {
    type,
    ...config2
  };
};
function convertToDB(fields, values) {
  const result = values.id ? { id: values.id } : {};
  for (const key in fields) {
    const field = fields[key];
    const value = values[key];
    if (value === void 0) continue;
    result[field.fieldName || key] = value;
  }
  return result;
}
function convertFromDB(fields, values) {
  if (!values) return null;
  const result = { id: values.id };
  for (const [key, value] of Object.entries(fields)) result[key] = values[value.fieldName || key];
  return result;
}
function getWithHooks(adapter, ctx) {
  const hooks = ctx.hooks;
  async function createWithHooks(data, model, customCreateFn) {
    const context = await getCurrentAuthContext().catch(() => null);
    let actualData = data;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.create?.before;
      if (toRun) {
        const result = await toRun(actualData, context);
        if (result === false) return null;
        if (typeof result === "object" && "data" in result) actualData = {
          ...actualData,
          ...result.data
        };
      }
    }
    const customCreated = customCreateFn ? await customCreateFn.fn(actualData) : null;
    const created = !customCreateFn || customCreateFn.executeMainFn ? await (await getCurrentAdapter(adapter)).create({
      model,
      data: actualData,
      forceAllowId: true
    }) : customCreated;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.create?.after;
      if (toRun) await toRun(created, context);
    }
    return created;
  }
  async function updateWithHooks(data, where, model, customUpdateFn) {
    const context = await getCurrentAuthContext().catch(() => null);
    let actualData = data;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.update?.before;
      if (toRun) {
        const result = await toRun(data, context);
        if (result === false) return null;
        if (typeof result === "object" && "data" in result) actualData = {
          ...actualData,
          ...result.data
        };
      }
    }
    const customUpdated = customUpdateFn ? await customUpdateFn.fn(actualData) : null;
    const updated = !customUpdateFn || customUpdateFn.executeMainFn ? await (await getCurrentAdapter(adapter)).update({
      model,
      update: actualData,
      where
    }) : customUpdated;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.update?.after;
      if (toRun) await toRun(updated, context);
    }
    return updated;
  }
  async function updateManyWithHooks(data, where, model, customUpdateFn) {
    const context = await getCurrentAuthContext().catch(() => null);
    let actualData = data;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.update?.before;
      if (toRun) {
        const result = await toRun(data, context);
        if (result === false) return null;
        if (typeof result === "object" && "data" in result) actualData = {
          ...actualData,
          ...result.data
        };
      }
    }
    const customUpdated = customUpdateFn ? await customUpdateFn.fn(actualData) : null;
    const updated = !customUpdateFn || customUpdateFn.executeMainFn ? await (await getCurrentAdapter(adapter)).updateMany({
      model,
      update: actualData,
      where
    }) : customUpdated;
    for (const hook of hooks || []) {
      const toRun = hook[model]?.update?.after;
      if (toRun) await toRun(updated, context);
    }
    return updated;
  }
  async function deleteWithHooks(where, model, customDeleteFn) {
    const context = await getCurrentAuthContext().catch(() => null);
    let entityToDelete = null;
    try {
      entityToDelete = (await (await getCurrentAdapter(adapter)).findMany({
        model,
        where,
        limit: 1
      }))[0] || null;
    } catch {
    }
    if (entityToDelete) for (const hook of hooks || []) {
      const toRun = hook[model]?.delete?.before;
      if (toRun) {
        if (await toRun(entityToDelete, context) === false) return null;
      }
    }
    const customDeleted = customDeleteFn ? await customDeleteFn.fn(where) : null;
    const deleted = !customDeleteFn || customDeleteFn.executeMainFn ? await (await getCurrentAdapter(adapter)).delete({
      model,
      where
    }) : customDeleted;
    if (entityToDelete) for (const hook of hooks || []) {
      const toRun = hook[model]?.delete?.after;
      if (toRun) await toRun(entityToDelete, context);
    }
    return deleted;
  }
  async function deleteManyWithHooks(where, model, customDeleteFn) {
    const context = await getCurrentAuthContext().catch(() => null);
    let entitiesToDelete = [];
    try {
      entitiesToDelete = await (await getCurrentAdapter(adapter)).findMany({
        model,
        where
      });
    } catch {
    }
    for (const entity of entitiesToDelete) for (const hook of hooks || []) {
      const toRun = hook[model]?.delete?.before;
      if (toRun) {
        if (await toRun(entity, context) === false) return null;
      }
    }
    const customDeleted = customDeleteFn ? await customDeleteFn.fn(where) : null;
    const deleted = !customDeleteFn || customDeleteFn.executeMainFn ? await (await getCurrentAdapter(adapter)).deleteMany({
      model,
      where
    }) : customDeleted;
    for (const entity of entitiesToDelete) for (const hook of hooks || []) {
      const toRun = hook[model]?.delete?.after;
      if (toRun) await toRun(entity, context);
    }
    return deleted;
  }
  return {
    createWithHooks,
    updateWithHooks,
    updateManyWithHooks,
    deleteWithHooks,
    deleteManyWithHooks
  };
}
const createInternalAdapter = (adapter, ctx) => {
  const logger2 = ctx.logger;
  const options = ctx.options;
  const secondaryStorage = options.secondaryStorage;
  const sessionExpiration = options.session?.expiresIn || 3600 * 24 * 7;
  const { createWithHooks, updateWithHooks, updateManyWithHooks, deleteWithHooks, deleteManyWithHooks } = getWithHooks(adapter, ctx);
  async function refreshUserSessions(user2) {
    if (!secondaryStorage) return;
    const listRaw = await secondaryStorage.get(`active-sessions-${user2.id}`);
    if (!listRaw) return;
    const now2 = Date.now();
    const validSessions = (safeJSONParse(listRaw) || []).filter((s2) => s2.expiresAt > now2);
    await Promise.all(validSessions.map(async ({ token }) => {
      const cached = await secondaryStorage.get(token);
      if (!cached) return;
      const parsed = safeJSONParse(cached);
      if (!parsed) return;
      const sessionTTL = Math.max(Math.floor(new Date(parsed.session.expiresAt).getTime() - now2) / 1e3, 0);
      await secondaryStorage.set(token, JSON.stringify({
        session: parsed.session,
        user: user2
      }), Math.floor(sessionTTL));
    }));
  }
  return {
    createOAuthUser: async (user2, account2) => {
      return runWithTransaction(adapter, async () => {
        const createdUser = await createWithHooks({
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          ...user2
        }, "user", void 0);
        return {
          user: createdUser,
          account: await createWithHooks({
            ...account2,
            userId: createdUser.id,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }, "account", void 0)
        };
      });
    },
    createUser: async (user2) => {
      return await createWithHooks({
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        ...user2,
        email: user2.email?.toLowerCase()
      }, "user", void 0);
    },
    createAccount: async (account2) => {
      return await createWithHooks({
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        ...account2
      }, "account", void 0);
    },
    listSessions: async (userId) => {
      if (secondaryStorage) {
        const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
        if (!currentList) return [];
        const list = safeJSONParse(currentList) || [];
        const now2 = Date.now();
        const seenTokens = /* @__PURE__ */ new Set();
        const sessions = [];
        for (const { token, expiresAt } of list) {
          if (expiresAt <= now2 || seenTokens.has(token)) continue;
          seenTokens.add(token);
          const data = await secondaryStorage.get(token);
          if (!data) continue;
          const parsed = safeJSONParse(data);
          if (!parsed) continue;
          sessions.push(parseSessionOutput(ctx.options, {
            ...parsed.session,
            expiresAt: new Date(parsed.session.expiresAt)
          }));
        }
        return sessions;
      }
      return await (await getCurrentAdapter(adapter)).findMany({
        model: "session",
        where: [{
          field: "userId",
          value: userId
        }]
      });
    },
    listUsers: async (limit, offset, sortBy, where) => {
      return await (await getCurrentAdapter(adapter)).findMany({
        model: "user",
        limit,
        offset,
        sortBy,
        where
      });
    },
    countTotalUsers: async (where) => {
      const total = await (await getCurrentAdapter(adapter)).count({
        model: "user",
        where
      });
      if (typeof total === "string") return parseInt(total);
      return total;
    },
    deleteUser: async (userId) => {
      if (!secondaryStorage || options.session?.storeSessionInDatabase) await deleteManyWithHooks([{
        field: "userId",
        value: userId
      }], "session", void 0);
      await deleteManyWithHooks([{
        field: "userId",
        value: userId
      }], "account", void 0);
      await deleteWithHooks([{
        field: "id",
        value: userId
      }], "user", void 0);
    },
    createSession: async (userId, dontRememberMe, override, overrideAll) => {
      const ctx$1 = await getCurrentAuthContext().catch(() => null);
      const headers = ctx$1?.headers || ctx$1?.request?.headers;
      const { id: _, ...rest } = override || {};
      const defaultAdditionalFields = parseSessionInput(ctx$1?.context.options ?? options, {});
      const data = {
        ipAddress: ctx$1?.request || ctx$1?.headers ? getIp(ctx$1?.request || ctx$1?.headers, ctx$1?.context.options) || "" : "",
        userAgent: headers?.get("user-agent") || "",
        ...rest,
        expiresAt: dontRememberMe ? getDate(3600 * 24, "sec") : getDate(sessionExpiration, "sec"),
        userId,
        token: generateId$1(32),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        ...defaultAdditionalFields,
        ...overrideAll ? rest : {}
      };
      return await createWithHooks(data, "session", secondaryStorage ? {
        fn: async (sessionData) => {
          const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
          let list = [];
          const now2 = Date.now();
          if (currentList) {
            list = safeJSONParse(currentList) || [];
            list = list.filter((session2) => session2.expiresAt > now2 && session2.token !== data.token);
          }
          const sorted = [...list, {
            token: data.token,
            expiresAt: data.expiresAt.getTime()
          }].sort((a2, b2) => a2.expiresAt - b2.expiresAt);
          const furthestSessionExp = sorted.at(-1)?.expiresAt ?? data.expiresAt.getTime();
          const furthestSessionTTL = Math.max(Math.floor((furthestSessionExp - now2) / 1e3), 0);
          if (furthestSessionTTL > 0) await secondaryStorage.set(`active-sessions-${userId}`, JSON.stringify(sorted), furthestSessionTTL);
          const user2 = await adapter.findOne({
            model: "user",
            where: [{
              field: "id",
              value: userId
            }]
          });
          const sessionTTL = Math.max(Math.floor((data.expiresAt.getTime() - now2) / 1e3), 0);
          if (sessionTTL > 0) await secondaryStorage.set(data.token, JSON.stringify({
            session: sessionData,
            user: user2
          }), sessionTTL);
          return sessionData;
        },
        executeMainFn: options.session?.storeSessionInDatabase
      } : void 0);
    },
    findSession: async (token) => {
      if (secondaryStorage) {
        const sessionStringified = await secondaryStorage.get(token);
        if (!sessionStringified && !options.session?.storeSessionInDatabase) return null;
        if (sessionStringified) {
          const s2 = safeJSONParse(sessionStringified);
          if (!s2) return null;
          return {
            session: parseSessionOutput(ctx.options, {
              ...s2.session,
              expiresAt: new Date(s2.session.expiresAt),
              createdAt: new Date(s2.session.createdAt),
              updatedAt: new Date(s2.session.updatedAt)
            }),
            user: parseUserOutput(ctx.options, {
              ...s2.user,
              createdAt: new Date(s2.user.createdAt),
              updatedAt: new Date(s2.user.updatedAt)
            })
          };
        }
      }
      const result = await (await getCurrentAdapter(adapter)).findOne({
        model: "session",
        where: [{
          value: token,
          field: "token"
        }],
        join: { user: true }
      });
      if (!result) return null;
      const { user: user2, ...session2 } = result;
      if (!user2) return null;
      return {
        session: parseSessionOutput(ctx.options, session2),
        user: parseUserOutput(ctx.options, user2)
      };
    },
    findSessions: async (sessionTokens) => {
      if (secondaryStorage) {
        const sessions$1 = [];
        for (const sessionToken of sessionTokens) {
          const sessionStringified = await secondaryStorage.get(sessionToken);
          if (sessionStringified) {
            const s2 = safeJSONParse(sessionStringified);
            if (!s2) return [];
            const session2 = {
              session: {
                ...s2.session,
                expiresAt: new Date(s2.session.expiresAt)
              },
              user: {
                ...s2.user,
                createdAt: new Date(s2.user.createdAt),
                updatedAt: new Date(s2.user.updatedAt)
              }
            };
            sessions$1.push(session2);
          }
        }
        return sessions$1;
      }
      const sessions = await (await getCurrentAdapter(adapter)).findMany({
        model: "session",
        where: [{
          field: "token",
          value: sessionTokens,
          operator: "in"
        }],
        join: { user: true }
      });
      if (!sessions.length) return [];
      if (sessions.some((session2) => !session2.user)) return [];
      return sessions.map((_session) => {
        const { user: user2, ...session2 } = _session;
        return {
          session: session2,
          user: user2
        };
      });
    },
    updateSession: async (sessionToken, session2) => {
      return await updateWithHooks(session2, [{
        field: "token",
        value: sessionToken
      }], "session", secondaryStorage ? {
        async fn(data) {
          const currentSession = await secondaryStorage.get(sessionToken);
          if (!currentSession) return null;
          const parsedSession = safeJSONParse(currentSession);
          if (!parsedSession) return null;
          const mergedSession = {
            ...parsedSession.session,
            ...data,
            expiresAt: new Date(data.expiresAt ?? parsedSession.session.expiresAt),
            createdAt: new Date(parsedSession.session.createdAt),
            updatedAt: new Date(data.updatedAt ?? parsedSession.session.updatedAt)
          };
          const updatedSession = parseSessionOutput(ctx.options, mergedSession);
          const now2 = Date.now();
          const expiresMs = new Date(updatedSession.expiresAt).getTime();
          const sessionTTL = Math.max(Math.floor((expiresMs - now2) / 1e3), 0);
          if (sessionTTL > 0) {
            await secondaryStorage.set(sessionToken, JSON.stringify({
              session: updatedSession,
              user: parsedSession.user
            }), sessionTTL);
            const listKey = `active-sessions-${updatedSession.userId}`;
            const listRaw = await secondaryStorage.get(listKey);
            const sorted = (listRaw ? safeJSONParse(listRaw) || [] : []).filter((s2) => s2.token !== sessionToken && s2.expiresAt > now2).concat([{
              token: sessionToken,
              expiresAt: expiresMs
            }]).sort((a2, b2) => a2.expiresAt - b2.expiresAt);
            const furthestSessionExp = sorted.at(-1)?.expiresAt;
            if (furthestSessionExp && furthestSessionExp > now2) await secondaryStorage.set(listKey, JSON.stringify(sorted), Math.floor((furthestSessionExp - now2) / 1e3));
            else await secondaryStorage.delete(listKey);
          }
          return updatedSession;
        },
        executeMainFn: options.session?.storeSessionInDatabase
      } : void 0);
    },
    deleteSession: async (token) => {
      if (secondaryStorage) {
        const data = await secondaryStorage.get(token);
        if (data) {
          const { session: session2 } = safeJSONParse(data) ?? {};
          if (!session2) {
            logger2.error("Session not found in secondary storage");
            return;
          }
          const userId = session2.userId;
          const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
          if (currentList) {
            const list = safeJSONParse(currentList) || [];
            const now2 = Date.now();
            const filtered = list.filter((session$1) => session$1.expiresAt > now2 && session$1.token !== token);
            const furthestSessionExp = filtered.sort((a2, b2) => a2.expiresAt - b2.expiresAt).at(-1)?.expiresAt;
            if (filtered.length > 0 && furthestSessionExp && furthestSessionExp > Date.now()) await secondaryStorage.set(`active-sessions-${userId}`, JSON.stringify(filtered), Math.floor((furthestSessionExp - now2) / 1e3));
            else await secondaryStorage.delete(`active-sessions-${userId}`);
          } else logger2.error("Active sessions list not found in secondary storage");
        }
        await secondaryStorage.delete(token);
        if (!options.session?.storeSessionInDatabase || ctx.options.session?.preserveSessionInDatabase) return;
      }
      await deleteWithHooks([{
        field: "token",
        value: token
      }], "session", void 0);
    },
    deleteAccounts: async (userId) => {
      await deleteManyWithHooks([{
        field: "userId",
        value: userId
      }], "account", void 0);
    },
    deleteAccount: async (accountId) => {
      await deleteWithHooks([{
        field: "id",
        value: accountId
      }], "account", void 0);
    },
    deleteSessions: async (userIdOrSessionTokens) => {
      if (secondaryStorage) {
        if (typeof userIdOrSessionTokens === "string") {
          const activeSession = await secondaryStorage.get(`active-sessions-${userIdOrSessionTokens}`);
          const sessions = activeSession ? safeJSONParse(activeSession) : [];
          if (!sessions) return;
          for (const session2 of sessions) await secondaryStorage.delete(session2.token);
          await secondaryStorage.delete(`active-sessions-${userIdOrSessionTokens}`);
        } else for (const sessionToken of userIdOrSessionTokens) if (await secondaryStorage.get(sessionToken)) await secondaryStorage.delete(sessionToken);
        if (!options.session?.storeSessionInDatabase || ctx.options.session?.preserveSessionInDatabase) return;
      }
      await deleteManyWithHooks([{
        field: Array.isArray(userIdOrSessionTokens) ? "token" : "userId",
        value: userIdOrSessionTokens,
        operator: Array.isArray(userIdOrSessionTokens) ? "in" : void 0
      }], "session", void 0);
    },
    findOAuthUser: async (email, accountId, providerId) => {
      const account2 = await (await getCurrentAdapter(adapter)).findOne({
        model: "account",
        where: [{
          value: accountId,
          field: "accountId"
        }, {
          value: providerId,
          field: "providerId"
        }],
        join: { user: true }
      });
      if (account2) if (account2.user) return {
        user: account2.user,
        linkedAccount: account2,
        accounts: [account2]
      };
      else {
        const user2 = await (await getCurrentAdapter(adapter)).findOne({
          model: "user",
          where: [{
            value: email.toLowerCase(),
            field: "email"
          }]
        });
        if (user2) return {
          user: user2,
          linkedAccount: account2,
          accounts: [account2]
        };
        return null;
      }
      else {
        const user2 = await (await getCurrentAdapter(adapter)).findOne({
          model: "user",
          where: [{
            value: email.toLowerCase(),
            field: "email"
          }]
        });
        if (user2) return {
          user: user2,
          linkedAccount: null,
          accounts: await (await getCurrentAdapter(adapter)).findMany({
            model: "account",
            where: [{
              value: user2.id,
              field: "userId"
            }]
          }) || []
        };
        else return null;
      }
    },
    findUserByEmail: async (email, options$1) => {
      const result = await (await getCurrentAdapter(adapter)).findOne({
        model: "user",
        where: [{
          value: email.toLowerCase(),
          field: "email"
        }],
        join: { ...options$1?.includeAccounts ? { account: true } : {} }
      });
      if (!result) return null;
      const { account: accounts, ...user2 } = result;
      return {
        user: user2,
        accounts: accounts ?? []
      };
    },
    findUserById: async (userId) => {
      if (!userId) return null;
      return await (await getCurrentAdapter(adapter)).findOne({
        model: "user",
        where: [{
          field: "id",
          value: userId
        }]
      });
    },
    linkAccount: async (account2) => {
      return await createWithHooks({
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        ...account2
      }, "account", void 0);
    },
    updateUser: async (userId, data) => {
      const user2 = await updateWithHooks(data, [{
        field: "id",
        value: userId
      }], "user", void 0);
      await refreshUserSessions(user2);
      return user2;
    },
    updateUserByEmail: async (email, data) => {
      const user2 = await updateWithHooks(data, [{
        field: "email",
        value: email.toLowerCase()
      }], "user", void 0);
      await refreshUserSessions(user2);
      return user2;
    },
    updatePassword: async (userId, password) => {
      await updateManyWithHooks({ password }, [{
        field: "userId",
        value: userId
      }, {
        field: "providerId",
        value: "credential"
      }], "account", void 0);
    },
    findAccounts: async (userId) => {
      return await (await getCurrentAdapter(adapter)).findMany({
        model: "account",
        where: [{
          field: "userId",
          value: userId
        }]
      });
    },
    findAccount: async (accountId) => {
      return await (await getCurrentAdapter(adapter)).findOne({
        model: "account",
        where: [{
          field: "accountId",
          value: accountId
        }]
      });
    },
    findAccountByProviderId: async (accountId, providerId) => {
      return await (await getCurrentAdapter(adapter)).findOne({
        model: "account",
        where: [{
          field: "accountId",
          value: accountId
        }, {
          field: "providerId",
          value: providerId
        }]
      });
    },
    findAccountByUserId: async (userId) => {
      return await (await getCurrentAdapter(adapter)).findMany({
        model: "account",
        where: [{
          field: "userId",
          value: userId
        }]
      });
    },
    updateAccount: async (id, data) => {
      return await updateWithHooks(data, [{
        field: "id",
        value: id
      }], "account", void 0);
    },
    createVerificationValue: async (data) => {
      return await createWithHooks({
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        ...data
      }, "verification", void 0);
    },
    findVerificationValue: async (identifier) => {
      const verification2 = await (await getCurrentAdapter(adapter)).findMany({
        model: "verification",
        where: [{
          field: "identifier",
          value: identifier
        }],
        sortBy: {
          field: "createdAt",
          direction: "desc"
        },
        limit: 1
      });
      if (!options.verification?.disableCleanup) await deleteManyWithHooks([{
        field: "expiresAt",
        value: /* @__PURE__ */ new Date(),
        operator: "lt"
      }], "verification", void 0);
      return verification2[0];
    },
    deleteVerificationValue: async (id) => {
      await deleteWithHooks([{
        field: "id",
        value: id
      }], "verification", void 0);
    },
    deleteVerificationByIdentifier: async (identifier) => {
      await deleteWithHooks([{
        field: "identifier",
        value: identifier
      }], "verification", void 0);
    },
    updateVerificationValue: async (id, data) => {
      return await updateWithHooks(data, [{
        field: "id",
        value: id
      }], "verification", void 0);
    }
  };
};
function toZodSchema({ fields, isClientSide }) {
  const zodFields = Object.keys(fields).reduce((acc, key) => {
    const field = fields[key];
    if (!field) return acc;
    if (isClientSide && field.input === false) return acc;
    let schema2;
    if (field.type === "json") schema2 = z$1.json ? z$1.json() : z$1.any();
    else if (field.type === "string[]" || field.type === "number[]") schema2 = z$1.array(field.type === "string[]" ? z$1.string() : z$1.number());
    else if (Array.isArray(field.type)) schema2 = z$1.any();
    else schema2 = z$1[field.type]();
    if (field?.required === false) schema2 = schema2.optional();
    if (!isClientSide && field?.returned === false) return acc;
    return {
      ...acc,
      [key]: schema2
    };
  }, {});
  return z$1.object(zodFields);
}
function getSchema(config2) {
  const tables = (0, db_exports.getAuthTables)(config2);
  const schema2 = {};
  for (const key in tables) {
    const table = tables[key];
    const fields = table.fields;
    const actualFields = {};
    Object.entries(fields).forEach(([key$1, field]) => {
      actualFields[field.fieldName || key$1] = field;
      if (field.references) {
        const refTable = tables[field.references.model];
        if (refTable) actualFields[field.fieldName || key$1].references = {
          ...field.references,
          model: refTable.modelName,
          field: field.references.field
        };
      }
    });
    if (schema2[table.modelName]) {
      schema2[table.modelName].fields = {
        ...schema2[table.modelName].fields,
        ...actualFields
      };
      continue;
    }
    schema2[table.modelName] = {
      fields: actualFields,
      order: table.order || Infinity
    };
  }
  return schema2;
}
function getKyselyDatabaseType(db2) {
  if (!db2) return null;
  if ("dialect" in db2) return getKyselyDatabaseType(db2.dialect);
  if ("createDriver" in db2) {
    if (db2 instanceof SqliteDialect) return "sqlite";
    if (db2 instanceof MysqlDialect) return "mysql";
    if (db2 instanceof PostgresDialect) return "postgres";
    if (db2 instanceof MssqlDialect) return "mssql";
  }
  if ("aggregate" in db2) return "sqlite";
  if ("getConnection" in db2) return "mysql";
  if ("connect" in db2) return "postgres";
  if ("fileControl" in db2) return "sqlite";
  if ("open" in db2 && "close" in db2 && "prepare" in db2) return "sqlite";
  return null;
}
const createKyselyAdapter = async (config2) => {
  const db2 = config2.database;
  if (!db2) return {
    kysely: null,
    databaseType: null,
    transaction: void 0
  };
  if ("db" in db2) return {
    kysely: db2.db,
    databaseType: db2.type,
    transaction: db2.transaction
  };
  if ("dialect" in db2) return {
    kysely: new Kysely({ dialect: db2.dialect }),
    databaseType: db2.type,
    transaction: db2.transaction
  };
  let dialect = void 0;
  const databaseType = getKyselyDatabaseType(db2);
  if ("createDriver" in db2) dialect = db2;
  if ("aggregate" in db2 && !("createSession" in db2)) dialect = new SqliteDialect({ database: db2 });
  if ("getConnection" in db2) dialect = new MysqlDialect(db2);
  if ("connect" in db2) dialect = new PostgresDialect({ pool: db2 });
  if ("fileControl" in db2) {
    const { BunSqliteDialect } = await import("./bun-sqlite-dialect-CZkoC8t5.mjs");
    dialect = new BunSqliteDialect({ database: db2 });
  }
  if ("createSession" in db2 && typeof window === "undefined") {
    let DatabaseSync = void 0;
    try {
      const nodeSqlite = "node:sqlite";
      ({ DatabaseSync } = await import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        nodeSqlite
      ));
    } catch (error2) {
      if (error2 !== null && typeof error2 === "object" && "code" in error2 && error2.code !== "ERR_UNKNOWN_BUILTIN_MODULE") throw error2;
    }
    if (DatabaseSync && db2 instanceof DatabaseSync) {
      const { NodeSqliteDialect } = await import("./node-sqlite-dialect-0sBQYD8M.mjs");
      dialect = new NodeSqliteDialect({ database: db2 });
    }
  }
  return {
    kysely: dialect ? new Kysely({ dialect }) : null,
    databaseType,
    transaction: void 0
  };
};
const initGetDefaultModelName = ({ usePlural, schema: schema2 }) => {
  const getDefaultModelName = (model) => {
    if (usePlural && model.charAt(model.length - 1) === "s") {
      const pluralessModel = model.slice(0, -1);
      let m$1 = schema2[pluralessModel] ? pluralessModel : void 0;
      if (!m$1) m$1 = Object.entries(schema2).find(([_, f2]) => f2.modelName === pluralessModel)?.[0];
      if (m$1) return m$1;
    }
    let m2 = schema2[model] ? model : void 0;
    if (!m2) m2 = Object.entries(schema2).find(([_, f2]) => f2.modelName === model)?.[0];
    if (!m2) throw new BetterAuthError(`Model "${model}" not found in schema`);
    return m2;
  };
  return getDefaultModelName;
};
const initGetDefaultFieldName = ({ schema: schema2, usePlural }) => {
  const getDefaultModelName = initGetDefaultModelName({
    schema: schema2,
    usePlural
  });
  const getDefaultFieldName = ({ field, model: unsafeModel }) => {
    if (field === "id" || field === "_id") return "id";
    const model = getDefaultModelName(unsafeModel);
    let f2 = schema2[model]?.fields[field];
    if (!f2) {
      const result = Object.entries(schema2[model].fields).find(([_, f$1]) => f$1.fieldName === field);
      if (result) {
        f2 = result[1];
        field = result[0];
      }
    }
    if (!f2) throw new BetterAuthError(`Field ${field} not found in model ${model}`);
    return field;
  };
  return getDefaultFieldName;
};
const initGetIdField = ({ usePlural, schema: schema2, disableIdGeneration, options, customIdGenerator, supportsUUIDs }) => {
  const getDefaultModelName = initGetDefaultModelName({
    usePlural,
    schema: schema2
  });
  const idField = ({ customModelName, forceAllowId }) => {
    const useNumberId = options.advanced?.database?.useNumberId || options.advanced?.database?.generateId === "serial";
    const useUUIDs = options.advanced?.database?.generateId === "uuid";
    const shouldGenerateId = (() => {
      if (disableIdGeneration) return false;
      else if (useNumberId && !forceAllowId) return false;
      else if (useUUIDs) return !supportsUUIDs;
      else return true;
    })();
    const model = getDefaultModelName(customModelName ?? "id");
    return {
      type: useNumberId ? "number" : "string",
      required: shouldGenerateId ? true : false,
      ...shouldGenerateId ? { defaultValue() {
        if (disableIdGeneration) return void 0;
        const generateId$1$1 = options.advanced?.database?.generateId;
        if (generateId$1$1 === false || useNumberId) return void 0;
        if (typeof generateId$1$1 === "function") return generateId$1$1({ model });
        if (customIdGenerator) return customIdGenerator({ model });
        if (generateId$1$1 === "uuid") return crypto.randomUUID();
        return generateId$1();
      } } : {},
      transform: {
        input: (value) => {
          if (!value) return void 0;
          if (useNumberId) {
            const numberValue = Number(value);
            if (isNaN(numberValue)) return;
            return numberValue;
          }
          if (useUUIDs) {
            if (shouldGenerateId && !forceAllowId) return value;
            if (disableIdGeneration) return void 0;
            if (supportsUUIDs) return void 0;
            if (forceAllowId && typeof value === "string") if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) return value;
            else {
              const stack = (/* @__PURE__ */ new Error()).stack?.split("\n").filter((_, i2) => i2 !== 1).join("\n").replace("Error:", "");
              logger.warn("[Adapter Factory] - Invalid UUID value for field `id` provided when `forceAllowId` is true. Generating a new UUID.", stack);
            }
            if (typeof value !== "string" && !supportsUUIDs) return crypto.randomUUID();
            return;
          }
          return value;
        },
        output: (value) => {
          if (!value) return void 0;
          return String(value);
        }
      }
    };
  };
  return idField;
};
const initGetFieldAttributes = ({ usePlural, schema: schema2, options, customIdGenerator, disableIdGeneration }) => {
  const getDefaultModelName = initGetDefaultModelName({
    usePlural,
    schema: schema2
  });
  const getDefaultFieldName = initGetDefaultFieldName({
    usePlural,
    schema: schema2
  });
  const idField = initGetIdField({
    usePlural,
    schema: schema2,
    options,
    customIdGenerator,
    disableIdGeneration
  });
  const getFieldAttributes = ({ model, field }) => {
    const defaultModelName = getDefaultModelName(model);
    const defaultFieldName = getDefaultFieldName({
      field,
      model: defaultModelName
    });
    const fields = schema2[defaultModelName].fields;
    fields.id = idField({ customModelName: defaultModelName });
    const fieldAttributes = fields[defaultFieldName];
    if (!fieldAttributes) throw new BetterAuthError(`Field ${field} not found in model ${model}`);
    return fieldAttributes;
  };
  return getFieldAttributes;
};
const initGetFieldName = ({ schema: schema2, usePlural }) => {
  const getDefaultModelName = initGetDefaultModelName({
    schema: schema2,
    usePlural
  });
  const getDefaultFieldName = initGetDefaultFieldName({
    schema: schema2,
    usePlural
  });
  function getFieldName({ model: modelName, field: fieldName }) {
    const model = getDefaultModelName(modelName);
    const field = getDefaultFieldName({
      model,
      field: fieldName
    });
    return schema2[model]?.fields[field]?.fieldName || field;
  }
  return getFieldName;
};
const initGetModelName = ({ usePlural, schema: schema2 }) => {
  const getDefaultModelName = initGetDefaultModelName({
    schema: schema2,
    usePlural
  });
  const getModelName = (model) => {
    const defaultModelKey = getDefaultModelName(model);
    if (schema2 && schema2[defaultModelKey] && schema2[defaultModelKey].modelName !== model) return usePlural ? `${schema2[defaultModelKey].modelName}s` : schema2[defaultModelKey].modelName;
    return usePlural ? `${model}s` : model;
  };
  return getModelName;
};
function withApplyDefault(value, field, action) {
  if (action === "update") {
    if (value === void 0 && field.onUpdate !== void 0) {
      if (typeof field.onUpdate === "function") return field.onUpdate();
      return field.onUpdate;
    }
    return value;
  }
  if (action === "create") {
    if (value === void 0 || field.required === true && value === null) {
      if (field.defaultValue !== void 0) {
        if (typeof field.defaultValue === "function") return field.defaultValue();
        return field.defaultValue;
      }
    }
  }
  return value;
}
let debugLogs = [];
let transactionId = -1;
const createAsIsTransaction = (adapter) => (fn) => fn(adapter);
const createAdapterFactory = ({ adapter: customAdapter, config: cfg }) => (options) => {
  const uniqueAdapterFactoryInstanceId = Math.random().toString(36).substring(2, 15);
  const config2 = {
    ...cfg,
    supportsBooleans: cfg.supportsBooleans ?? true,
    supportsDates: cfg.supportsDates ?? true,
    supportsJSON: cfg.supportsJSON ?? false,
    adapterName: cfg.adapterName ?? cfg.adapterId,
    supportsNumericIds: cfg.supportsNumericIds ?? true,
    supportsUUIDs: cfg.supportsUUIDs ?? false,
    supportsArrays: cfg.supportsArrays ?? false,
    transaction: cfg.transaction ?? false,
    disableTransformInput: cfg.disableTransformInput ?? false,
    disableTransformOutput: cfg.disableTransformOutput ?? false,
    disableTransformJoin: cfg.disableTransformJoin ?? false
  };
  if ((options.advanced?.database?.useNumberId === true || options.advanced?.database?.generateId === "serial") && config2.supportsNumericIds === false) throw new BetterAuthError(`[${config2.adapterName}] Your database or database adapter does not support numeric ids. Please disable "useNumberId" in your config.`);
  const schema2 = getAuthTables(options);
  const debugLog = (...args) => {
    if (config2.debugLogs === true || typeof config2.debugLogs === "object") {
      const logger$1 = createLogger({ level: "info" });
      if (typeof config2.debugLogs === "object" && "isRunningAdapterTests" in config2.debugLogs) {
        if (config2.debugLogs.isRunningAdapterTests) {
          args.shift();
          debugLogs.push({
            instance: uniqueAdapterFactoryInstanceId,
            args
          });
        }
        return;
      }
      if (typeof config2.debugLogs === "object" && config2.debugLogs.logCondition && !config2.debugLogs.logCondition?.()) return;
      if (typeof args[0] === "object" && "method" in args[0]) {
        const method = args.shift().method;
        if (typeof config2.debugLogs === "object") {
          if (method === "create" && !config2.debugLogs.create) return;
          else if (method === "update" && !config2.debugLogs.update) return;
          else if (method === "updateMany" && !config2.debugLogs.updateMany) return;
          else if (method === "findOne" && !config2.debugLogs.findOne) return;
          else if (method === "findMany" && !config2.debugLogs.findMany) return;
          else if (method === "delete" && !config2.debugLogs.delete) return;
          else if (method === "deleteMany" && !config2.debugLogs.deleteMany) return;
          else if (method === "count" && !config2.debugLogs.count) return;
        }
        logger$1.info(`[${config2.adapterName}]`, ...args);
      } else logger$1.info(`[${config2.adapterName}]`, ...args);
    }
  };
  const logger2 = createLogger(options.logger);
  const getDefaultModelName = initGetDefaultModelName({
    usePlural: config2.usePlural,
    schema: schema2
  });
  const getDefaultFieldName = initGetDefaultFieldName({
    usePlural: config2.usePlural,
    schema: schema2
  });
  const getModelName = initGetModelName({
    usePlural: config2.usePlural,
    schema: schema2
  });
  const getFieldName = initGetFieldName({
    schema: schema2,
    usePlural: config2.usePlural
  });
  const idField = initGetIdField({
    schema: schema2,
    options,
    usePlural: config2.usePlural,
    disableIdGeneration: config2.disableIdGeneration,
    customIdGenerator: config2.customIdGenerator,
    supportsUUIDs: config2.supportsUUIDs
  });
  const getFieldAttributes = initGetFieldAttributes({
    schema: schema2,
    options,
    usePlural: config2.usePlural,
    disableIdGeneration: config2.disableIdGeneration,
    customIdGenerator: config2.customIdGenerator
  });
  const transformInput = async (data, defaultModelName, action, forceAllowId) => {
    const transformedData = {};
    const fields = schema2[defaultModelName].fields;
    const newMappedKeys = config2.mapKeysTransformInput ?? {};
    const useNumberId = options.advanced?.database?.useNumberId || options.advanced?.database?.generateId === "serial";
    fields.id = idField({
      customModelName: defaultModelName,
      forceAllowId: forceAllowId && "id" in data
    });
    for (const field in fields) {
      let value = data[field];
      const fieldAttributes = fields[field];
      const newFieldName = newMappedKeys[field] || fields[field].fieldName || field;
      if (value === void 0 && (fieldAttributes.defaultValue === void 0 && !fieldAttributes.transform?.input && !(action === "update" && fieldAttributes.onUpdate) || action === "update" && !fieldAttributes.onUpdate)) continue;
      if (fieldAttributes && fieldAttributes.type === "date" && !(value instanceof Date) && typeof value === "string") try {
        value = new Date(value);
      } catch {
        logger2.error("[Adapter Factory] Failed to convert string to date", {
          value,
          field
        });
      }
      let newValue = withApplyDefault(value, fieldAttributes, action);
      if (fieldAttributes.transform?.input) newValue = await fieldAttributes.transform.input(newValue);
      if (fieldAttributes.references?.field === "id" && useNumberId) if (Array.isArray(newValue)) newValue = newValue.map((x2) => x2 !== null ? Number(x2) : null);
      else newValue = newValue !== null ? Number(newValue) : null;
      else if (config2.supportsJSON === false && typeof newValue === "object" && fieldAttributes.type === "json") newValue = JSON.stringify(newValue);
      else if (config2.supportsArrays === false && Array.isArray(newValue) && (fieldAttributes.type === "string[]" || fieldAttributes.type === "number[]")) newValue = JSON.stringify(newValue);
      else if (config2.supportsDates === false && newValue instanceof Date && fieldAttributes.type === "date") newValue = newValue.toISOString();
      else if (config2.supportsBooleans === false && typeof newValue === "boolean") newValue = newValue ? 1 : 0;
      if (config2.customTransformInput) newValue = config2.customTransformInput({
        data: newValue,
        action,
        field: newFieldName,
        fieldAttributes,
        model: getModelName(defaultModelName),
        schema: schema2,
        options
      });
      if (newValue !== void 0) transformedData[newFieldName] = newValue;
    }
    return transformedData;
  };
  const transformOutput = async (data, unsafe_model, select = [], join2) => {
    const transformSingleOutput = async (data$1, unsafe_model$1, select$1 = []) => {
      if (!data$1) return null;
      const newMappedKeys = config2.mapKeysTransformOutput ?? {};
      const transformedData$1 = {};
      const tableSchema = schema2[getDefaultModelName(unsafe_model$1)].fields;
      const idKey = Object.entries(newMappedKeys).find(([_, v2]) => v2 === "id")?.[0];
      tableSchema[idKey ?? "id"] = { type: options.advanced?.database?.useNumberId || options.advanced?.database?.generateId === "serial" ? "number" : "string" };
      for (const key in tableSchema) {
        if (select$1.length && !select$1.includes(key)) continue;
        const field = tableSchema[key];
        if (field) {
          const originalKey = field.fieldName || key;
          let newValue = data$1[Object.entries(newMappedKeys).find(([_, v2]) => v2 === originalKey)?.[0] || originalKey];
          if (field.transform?.output) newValue = await field.transform.output(newValue);
          const newFieldName = newMappedKeys[key] || key;
          if (originalKey === "id" || field.references?.field === "id") {
            if (typeof newValue !== "undefined" && newValue !== null) newValue = String(newValue);
          } else if (config2.supportsJSON === false && typeof newValue === "string" && field.type === "json") newValue = safeJSONParse(newValue);
          else if (config2.supportsArrays === false && typeof newValue === "string" && (field.type === "string[]" || field.type === "number[]")) newValue = safeJSONParse(newValue);
          else if (config2.supportsDates === false && typeof newValue === "string" && field.type === "date") newValue = new Date(newValue);
          else if (config2.supportsBooleans === false && typeof newValue === "number" && field.type === "boolean") newValue = newValue === 1;
          if (config2.customTransformOutput) newValue = config2.customTransformOutput({
            data: newValue,
            field: newFieldName,
            fieldAttributes: field,
            select: select$1,
            model: getModelName(unsafe_model$1),
            schema: schema2,
            options
          });
          transformedData$1[newFieldName] = newValue;
        }
      }
      return transformedData$1;
    };
    if (!join2 || Object.keys(join2).length === 0) return await transformSingleOutput(data, unsafe_model, select);
    unsafe_model = getDefaultModelName(unsafe_model);
    const transformedData = await transformSingleOutput(data, unsafe_model, select);
    const requiredModels = Object.entries(join2).map(([model, joinConfig]) => ({
      modelName: getModelName(model),
      defaultModelName: getDefaultModelName(model),
      joinConfig
    }));
    if (!data) return null;
    for (const { modelName, defaultModelName, joinConfig } of requiredModels) {
      let joinedData = await (async () => {
        if (options.experimental?.joins) return data[modelName];
        else return await handleFallbackJoin({
          baseModel: unsafe_model,
          baseData: transformedData,
          joinModel: modelName,
          specificJoinConfig: joinConfig
        });
      })();
      if (joinedData === void 0 || joinedData === null) joinedData = joinConfig.relation === "one-to-one" ? null : [];
      if (joinConfig.relation === "one-to-many" && !Array.isArray(joinedData)) joinedData = [joinedData];
      const transformed = [];
      if (Array.isArray(joinedData)) for (const item of joinedData) {
        const transformedItem = await transformSingleOutput(item, modelName, []);
        transformed.push(transformedItem);
      }
      else {
        const transformedItem = await transformSingleOutput(joinedData, modelName, []);
        transformed.push(transformedItem);
      }
      transformedData[defaultModelName] = (joinConfig.relation === "one-to-one" ? transformed[0] : transformed) ?? null;
    }
    return transformedData;
  };
  const transformWhereClause = ({ model, where, action }) => {
    if (!where) return void 0;
    const newMappedKeys = config2.mapKeysTransformInput ?? {};
    return where.map((w2) => {
      const { field: unsafe_field, value, operator = "eq", connector = "AND" } = w2;
      if (operator === "in") {
        if (!Array.isArray(value)) throw new BetterAuthError("Value must be an array");
      }
      let newValue = value;
      const defaultModelName = getDefaultModelName(model);
      const defaultFieldName = getDefaultFieldName({
        field: unsafe_field,
        model
      });
      const fieldName = newMappedKeys[defaultFieldName] || getFieldName({
        field: defaultFieldName,
        model: defaultModelName
      });
      const fieldAttr = getFieldAttributes({
        field: defaultFieldName,
        model: defaultModelName
      });
      const useNumberId = options.advanced?.database?.useNumberId || options.advanced?.database?.generateId === "serial";
      if (defaultFieldName === "id" || fieldAttr.references?.field === "id") {
        if (useNumberId) if (Array.isArray(value)) newValue = value.map(Number);
        else newValue = Number(value);
      }
      if (fieldAttr.type === "date" && value instanceof Date && !config2.supportsDates) newValue = value.toISOString();
      if (fieldAttr.type === "boolean" && typeof value === "boolean" && !config2.supportsBooleans) newValue = value ? 1 : 0;
      if (fieldAttr.type === "json" && typeof value === "object" && !config2.supportsJSON) try {
        newValue = JSON.stringify(value);
      } catch (error2) {
        throw new Error(`Failed to stringify JSON value for field ${fieldName}`, { cause: error2 });
      }
      if (config2.customTransformInput) newValue = config2.customTransformInput({
        data: newValue,
        fieldAttributes: fieldAttr,
        field: fieldName,
        model: getModelName(model),
        schema: schema2,
        options,
        action
      });
      return {
        operator,
        connector,
        field: fieldName,
        value: newValue
      };
    });
  };
  const transformJoinClause = (baseModel, unsanitizedJoin, select) => {
    if (!unsanitizedJoin) return void 0;
    if (Object.keys(unsanitizedJoin).length === 0) return void 0;
    const transformedJoin = {};
    for (const [model, join2] of Object.entries(unsanitizedJoin)) {
      if (!join2) continue;
      const defaultModelName = getDefaultModelName(model);
      const defaultBaseModelName = getDefaultModelName(baseModel);
      let foreignKeys = Object.entries(schema2[defaultModelName].fields).filter(([field, fieldAttributes]) => fieldAttributes.references && getDefaultModelName(fieldAttributes.references.model) === defaultBaseModelName);
      let isForwardJoin = true;
      if (!foreignKeys.length) {
        foreignKeys = Object.entries(schema2[defaultBaseModelName].fields).filter(([field, fieldAttributes]) => fieldAttributes.references && getDefaultModelName(fieldAttributes.references.model) === defaultModelName);
        isForwardJoin = false;
      }
      if (!foreignKeys.length) throw new BetterAuthError(`No foreign key found for model ${model} and base model ${baseModel} while performing join operation.`);
      else if (foreignKeys.length > 1) throw new BetterAuthError(`Multiple foreign keys found for model ${model} and base model ${baseModel} while performing join operation. Only one foreign key is supported.`);
      const [foreignKey, foreignKeyAttributes] = foreignKeys[0];
      if (!foreignKeyAttributes.references) throw new BetterAuthError(`No references found for foreign key ${foreignKey} on model ${model} while performing join operation.`);
      let from;
      let to;
      let requiredSelectField;
      if (isForwardJoin) {
        requiredSelectField = foreignKeyAttributes.references.field;
        from = getFieldName({
          model: baseModel,
          field: requiredSelectField
        });
        to = getFieldName({
          model,
          field: foreignKey
        });
      } else {
        requiredSelectField = foreignKey;
        from = getFieldName({
          model: baseModel,
          field: requiredSelectField
        });
        to = getFieldName({
          model,
          field: foreignKeyAttributes.references.field
        });
      }
      if (select && !select.includes(requiredSelectField)) select.push(requiredSelectField);
      const isUnique = to === "id" ? true : foreignKeyAttributes.unique ?? false;
      let limit = options.advanced?.database?.defaultFindManyLimit ?? 100;
      if (isUnique) limit = 1;
      else if (typeof join2 === "object" && typeof join2.limit === "number") limit = join2.limit;
      transformedJoin[getModelName(model)] = {
        on: {
          from,
          to
        },
        limit,
        relation: isUnique ? "one-to-one" : "one-to-many"
      };
    }
    return {
      join: transformedJoin,
      select
    };
  };
  const handleFallbackJoin = async ({ baseModel, baseData, joinModel, specificJoinConfig: joinConfig }) => {
    if (!baseData) return baseData;
    const modelName = getModelName(joinModel);
    const field = joinConfig.on.to;
    const value = baseData[getDefaultFieldName({
      field: joinConfig.on.from,
      model: baseModel
    })];
    if (value === null || value === void 0) return joinConfig.relation === "one-to-one" ? null : [];
    let result;
    const where = transformWhereClause({
      model: modelName,
      where: [{
        field,
        value,
        operator: "eq",
        connector: "AND"
      }],
      action: "findOne"
    });
    try {
      if (joinConfig.relation === "one-to-one") result = await adapterInstance.findOne({
        model: modelName,
        where
      });
      else {
        const limit = joinConfig.limit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
        result = await adapterInstance.findMany({
          model: modelName,
          where,
          limit
        });
      }
    } catch (error2) {
      logger2.error(`Failed to query fallback join for model ${modelName}:`, {
        where,
        limit: joinConfig.limit
      });
      console.error(error2);
      throw error2;
    }
    return result;
  };
  const adapterInstance = customAdapter({
    options,
    schema: schema2,
    debugLog,
    getFieldName,
    getModelName,
    getDefaultModelName,
    getDefaultFieldName,
    getFieldAttributes,
    transformInput,
    transformOutput,
    transformWhereClause
  });
  let lazyLoadTransaction = null;
  const adapter = {
    transaction: async (cb) => {
      if (!lazyLoadTransaction) if (!config2.transaction) lazyLoadTransaction = createAsIsTransaction(adapter);
      else {
        logger2.debug(`[${config2.adapterName}] - Using provided transaction implementation.`);
        lazyLoadTransaction = config2.transaction;
      }
      return lazyLoadTransaction(cb);
    },
    create: async ({ data: unsafeData, model: unsafeModel, select, forceAllowId = false }) => {
      transactionId++;
      const thisTransactionId = transactionId;
      const model = getModelName(unsafeModel);
      unsafeModel = getDefaultModelName(unsafeModel);
      if ("id" in unsafeData && typeof unsafeData.id !== "undefined" && !forceAllowId) {
        logger2.warn(`[${config2.adapterName}] - You are trying to create a record with an id. This is not allowed as we handle id generation for you, unless you pass in the \`forceAllowId\` parameter. The id will be ignored.`);
        const stack = (/* @__PURE__ */ new Error()).stack?.split("\n").filter((_, i2) => i2 !== 1).join("\n").replace("Error:", "Create method with `id` being called at:");
        console.log(stack);
        unsafeData.id = void 0;
      }
      debugLog({ method: "create" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("create")} ${formatAction("Unsafe Input")}:`, {
        model,
        data: unsafeData
      });
      let data = unsafeData;
      if (!config2.disableTransformInput) data = await transformInput(unsafeData, unsafeModel, "create", forceAllowId);
      debugLog({ method: "create" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("create")} ${formatAction("Parsed Input")}:`, {
        model,
        data
      });
      const res = await adapterInstance.create({
        data,
        model
      });
      debugLog({ method: "create" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("create")} ${formatAction("DB Result")}:`, {
        model,
        res
      });
      let transformed = res;
      if (!config2.disableTransformOutput) transformed = await transformOutput(res, unsafeModel, select, void 0);
      debugLog({ method: "create" }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("create")} ${formatAction("Parsed Result")}:`, {
        model,
        data: transformed
      });
      return transformed;
    },
    update: async ({ model: unsafeModel, where: unsafeWhere, update: unsafeData }) => {
      transactionId++;
      const thisTransactionId = transactionId;
      unsafeModel = getDefaultModelName(unsafeModel);
      const model = getModelName(unsafeModel);
      const where = transformWhereClause({
        model: unsafeModel,
        where: unsafeWhere,
        action: "update"
      });
      debugLog({ method: "update" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("update")} ${formatAction("Unsafe Input")}:`, {
        model,
        data: unsafeData
      });
      let data = unsafeData;
      if (!config2.disableTransformInput) data = await transformInput(unsafeData, unsafeModel, "update");
      debugLog({ method: "update" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("update")} ${formatAction("Parsed Input")}:`, {
        model,
        data
      });
      const res = await adapterInstance.update({
        model,
        where,
        update: data
      });
      debugLog({ method: "update" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("update")} ${formatAction("DB Result")}:`, {
        model,
        data: res
      });
      let transformed = res;
      if (!config2.disableTransformOutput) transformed = await transformOutput(res, unsafeModel, void 0, void 0);
      debugLog({ method: "update" }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("update")} ${formatAction("Parsed Result")}:`, {
        model,
        data: transformed
      });
      return transformed;
    },
    updateMany: async ({ model: unsafeModel, where: unsafeWhere, update: unsafeData }) => {
      transactionId++;
      const thisTransactionId = transactionId;
      const model = getModelName(unsafeModel);
      const where = transformWhereClause({
        model: unsafeModel,
        where: unsafeWhere,
        action: "updateMany"
      });
      unsafeModel = getDefaultModelName(unsafeModel);
      debugLog({ method: "updateMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("updateMany")} ${formatAction("Unsafe Input")}:`, {
        model,
        data: unsafeData
      });
      let data = unsafeData;
      if (!config2.disableTransformInput) data = await transformInput(unsafeData, unsafeModel, "update");
      debugLog({ method: "updateMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("updateMany")} ${formatAction("Parsed Input")}:`, {
        model,
        data
      });
      const updatedCount = await adapterInstance.updateMany({
        model,
        where,
        update: data
      });
      debugLog({ method: "updateMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("updateMany")} ${formatAction("DB Result")}:`, {
        model,
        data: updatedCount
      });
      debugLog({ method: "updateMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("updateMany")} ${formatAction("Parsed Result")}:`, {
        model,
        data: updatedCount
      });
      return updatedCount;
    },
    findOne: async ({ model: unsafeModel, where: unsafeWhere, select, join: unsafeJoin }) => {
      transactionId++;
      const thisTransactionId = transactionId;
      const model = getModelName(unsafeModel);
      const where = transformWhereClause({
        model: unsafeModel,
        where: unsafeWhere,
        action: "findOne"
      });
      unsafeModel = getDefaultModelName(unsafeModel);
      let join2;
      let passJoinToAdapter = true;
      if (!config2.disableTransformJoin) {
        const result = transformJoinClause(unsafeModel, unsafeJoin, select);
        if (result) {
          join2 = result.join;
          select = result.select;
        }
        if (!options.experimental?.joins && join2 && Object.keys(join2).length > 0) passJoinToAdapter = false;
      } else join2 = unsafeJoin;
      debugLog({ method: "findOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("findOne")}:`, {
        model,
        where,
        select,
        join: join2
      });
      const res = await adapterInstance.findOne({
        model,
        where,
        select,
        join: passJoinToAdapter ? join2 : void 0
      });
      debugLog({ method: "findOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("findOne")} ${formatAction("DB Result")}:`, {
        model,
        data: res
      });
      let transformed = res;
      if (!config2.disableTransformOutput) transformed = await transformOutput(res, unsafeModel, select, join2);
      debugLog({ method: "findOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("findOne")} ${formatAction("Parsed Result")}:`, {
        model,
        data: transformed
      });
      return transformed;
    },
    findMany: async ({ model: unsafeModel, where: unsafeWhere, limit: unsafeLimit, sortBy, offset, join: unsafeJoin }) => {
      transactionId++;
      const thisTransactionId = transactionId;
      const limit = unsafeLimit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
      const model = getModelName(unsafeModel);
      const where = transformWhereClause({
        model: unsafeModel,
        where: unsafeWhere,
        action: "findMany"
      });
      unsafeModel = getDefaultModelName(unsafeModel);
      let join2;
      let passJoinToAdapter = true;
      if (!config2.disableTransformJoin) {
        const result = transformJoinClause(unsafeModel, unsafeJoin, void 0);
        if (result) join2 = result.join;
        if (!options.experimental?.joins && join2 && Object.keys(join2).length > 0) passJoinToAdapter = false;
      } else join2 = unsafeJoin;
      debugLog({ method: "findMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("findMany")}:`, {
        model,
        where,
        limit,
        sortBy,
        offset,
        join: join2
      });
      const res = await adapterInstance.findMany({
        model,
        where,
        limit,
        sortBy,
        offset,
        join: passJoinToAdapter ? join2 : void 0
      });
      debugLog({ method: "findMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("findMany")} ${formatAction("DB Result")}:`, {
        model,
        data: res
      });
      let transformed = res;
      if (!config2.disableTransformOutput) transformed = await Promise.all(res.map(async (r2) => {
        return await transformOutput(r2, unsafeModel, void 0, join2);
      }));
      debugLog({ method: "findMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("findMany")} ${formatAction("Parsed Result")}:`, {
        model,
        data: transformed
      });
      return transformed;
    },
    delete: async ({ model: unsafeModel, where: unsafeWhere }) => {
      transactionId++;
      const thisTransactionId = transactionId;
      const model = getModelName(unsafeModel);
      const where = transformWhereClause({
        model: unsafeModel,
        where: unsafeWhere,
        action: "delete"
      });
      unsafeModel = getDefaultModelName(unsafeModel);
      debugLog({ method: "delete" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("delete")}:`, {
        model,
        where
      });
      await adapterInstance.delete({
        model,
        where
      });
      debugLog({ method: "delete" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("delete")} ${formatAction("DB Result")}:`, { model });
    },
    deleteMany: async ({ model: unsafeModel, where: unsafeWhere }) => {
      transactionId++;
      const thisTransactionId = transactionId;
      const model = getModelName(unsafeModel);
      const where = transformWhereClause({
        model: unsafeModel,
        where: unsafeWhere,
        action: "deleteMany"
      });
      unsafeModel = getDefaultModelName(unsafeModel);
      debugLog({ method: "deleteMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("deleteMany")} ${formatAction("DeleteMany")}:`, {
        model,
        where
      });
      const res = await adapterInstance.deleteMany({
        model,
        where
      });
      debugLog({ method: "deleteMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("deleteMany")} ${formatAction("DB Result")}:`, {
        model,
        data: res
      });
      return res;
    },
    count: async ({ model: unsafeModel, where: unsafeWhere }) => {
      transactionId++;
      const thisTransactionId = transactionId;
      const model = getModelName(unsafeModel);
      const where = transformWhereClause({
        model: unsafeModel,
        where: unsafeWhere,
        action: "count"
      });
      unsafeModel = getDefaultModelName(unsafeModel);
      debugLog({ method: "count" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("count")}:`, {
        model,
        where
      });
      const res = await adapterInstance.count({
        model,
        where
      });
      debugLog({ method: "count" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("count")}:`, {
        model,
        data: res
      });
      return res;
    },
    createSchema: adapterInstance.createSchema ? async (_, file) => {
      const tables = getAuthTables(options);
      if (options.secondaryStorage && !options.session?.storeSessionInDatabase) delete tables.session;
      if (options.rateLimit && options.rateLimit.storage === "database" && (typeof options.rateLimit.enabled === "undefined" || options.rateLimit.enabled === true)) tables.ratelimit = {
        modelName: options.rateLimit.modelName ?? "ratelimit",
        fields: {
          key: {
            type: "string",
            unique: true,
            required: true,
            fieldName: options.rateLimit.fields?.key ?? "key"
          },
          count: {
            type: "number",
            required: true,
            fieldName: options.rateLimit.fields?.count ?? "count"
          },
          lastRequest: {
            type: "number",
            required: true,
            bigint: true,
            defaultValue: () => Date.now(),
            fieldName: options.rateLimit.fields?.lastRequest ?? "lastRequest"
          }
        }
      };
      return adapterInstance.createSchema({
        file,
        tables
      });
    } : void 0,
    options: {
      adapterConfig: config2,
      ...adapterInstance.options ?? {}
    },
    id: config2.adapterId,
    ...config2.debugLogs?.isRunningAdapterTests ? { adapterTestDebugLogs: {
      resetDebugLogs() {
        debugLogs = debugLogs.filter((log) => log.instance !== uniqueAdapterFactoryInstanceId);
      },
      printDebugLogs() {
        const separator = `─`.repeat(80);
        const logs = debugLogs.filter((log$1) => log$1.instance === uniqueAdapterFactoryInstanceId);
        if (logs.length === 0) return;
        const log = logs.reverse().map((log$1) => {
          log$1.args[0] = `
${log$1.args[0]}`;
          return [...log$1.args, "\n"];
        }).reduce((prev, curr) => {
          return [...curr, ...prev];
        }, [`
${separator}`]);
        console.log(...log);
      }
    } } : {}
  };
  return adapter;
};
function formatTransactionId(transactionId$1) {
  if (getColorDepth() < 8) return `#${transactionId$1}`;
  return `${TTY_COLORS.fg.magenta}#${transactionId$1}${TTY_COLORS.reset}`;
}
function formatStep(step, total) {
  return `${TTY_COLORS.bg.black}${TTY_COLORS.fg.yellow}[${step}/${total}]${TTY_COLORS.reset}`;
}
function formatMethod(method) {
  return `${TTY_COLORS.bright}${method}${TTY_COLORS.reset}`;
}
function formatAction(action) {
  return `${TTY_COLORS.dim}(${action})${TTY_COLORS.reset}`;
}
const map = {
  postgres: {
    string: [
      "character varying",
      "varchar",
      "text",
      "uuid"
    ],
    number: [
      "int4",
      "integer",
      "bigint",
      "smallint",
      "numeric",
      "real",
      "double precision"
    ],
    boolean: ["bool", "boolean"],
    date: [
      "timestamptz",
      "timestamp",
      "date"
    ],
    json: ["json", "jsonb"]
  },
  mysql: {
    string: [
      "varchar",
      "text",
      "uuid"
    ],
    number: [
      "integer",
      "int",
      "bigint",
      "smallint",
      "decimal",
      "float",
      "double"
    ],
    boolean: ["boolean", "tinyint"],
    date: [
      "timestamp",
      "datetime",
      "date"
    ],
    json: ["json"]
  },
  sqlite: {
    string: ["TEXT"],
    number: ["INTEGER", "REAL"],
    boolean: ["INTEGER", "BOOLEAN"],
    date: ["DATE", "INTEGER"],
    json: ["TEXT"]
  },
  mssql: {
    string: [
      "varchar",
      "nvarchar",
      "uniqueidentifier"
    ],
    number: [
      "int",
      "bigint",
      "smallint",
      "decimal",
      "float",
      "double"
    ],
    boolean: ["bit", "smallint"],
    date: [
      "datetime2",
      "date",
      "datetime"
    ],
    json: ["varchar", "nvarchar"]
  }
};
function matchType(columnDataType, fieldType, dbType) {
  function normalize(type) {
    return type.toLowerCase().split("(")[0].trim();
  }
  if (fieldType === "string[]" || fieldType === "number[]") return columnDataType.toLowerCase().includes("json");
  const types2 = map[dbType];
  return (Array.isArray(fieldType) ? types2["string"].map((t2) => t2.toLowerCase()) : types2[fieldType].map((t2) => t2.toLowerCase())).includes(normalize(columnDataType));
}
async function getPostgresSchema(db2) {
  try {
    const result = await sql$1`SHOW search_path`.execute(db2);
    if (result.rows[0]?.search_path) return result.rows[0].search_path.split(",").map((s2) => s2.trim()).map((s2) => s2.replace(/^["']|["']$/g, "")).filter((s2) => !s2.startsWith("$"))[0] || "public";
  } catch {
  }
  return "public";
}
async function getMigrations(config2) {
  const betterAuthSchema = getSchema(config2);
  const logger$1 = createLogger(config2.logger);
  let { kysely: db2, databaseType: dbType } = await createKyselyAdapter(config2);
  if (!dbType) {
    logger$1.warn("Could not determine database type, defaulting to sqlite. Please provide a type in the database options to avoid this.");
    dbType = "sqlite";
  }
  if (!db2) {
    logger$1.error("Only kysely adapter is supported for migrations. You can use `generate` command to generate the schema, if you're using a different adapter.");
    process.exit(1);
  }
  let currentSchema = "public";
  if (dbType === "postgres") {
    currentSchema = await getPostgresSchema(db2);
    logger$1.debug(`PostgreSQL migration: Using schema '${currentSchema}' (from search_path)`);
    try {
      if (!(await sql$1`
				SELECT schema_name 
				FROM information_schema.schemata 
				WHERE schema_name = ${currentSchema}
			`.execute(db2)).rows[0]) logger$1.warn(`Schema '${currentSchema}' does not exist. Tables will be inspected from available schemas. Consider creating the schema first or checking your database configuration.`);
    } catch (error2) {
      logger$1.debug(`Could not verify schema existence: ${error2 instanceof Error ? error2.message : String(error2)}`);
    }
  }
  const allTableMetadata = await db2.introspection.getTables();
  let tableMetadata = allTableMetadata;
  if (dbType === "postgres") try {
    const tablesInSchema = await sql$1`
				SELECT table_name 
				FROM information_schema.tables 
				WHERE table_schema = ${currentSchema}
				AND table_type = 'BASE TABLE'
			`.execute(db2);
    const tableNamesInSchema = new Set(tablesInSchema.rows.map((row) => row.table_name));
    tableMetadata = allTableMetadata.filter((table) => table.schema === currentSchema && tableNamesInSchema.has(table.name));
    logger$1.debug(`Found ${tableMetadata.length} table(s) in schema '${currentSchema}': ${tableMetadata.map((t2) => t2.name).join(", ") || "(none)"}`);
  } catch (error2) {
    logger$1.warn(`Could not filter tables by schema. Using all discovered tables. Error: ${error2 instanceof Error ? error2.message : String(error2)}`);
  }
  const toBeCreated = [];
  const toBeAdded = [];
  for (const [key, value] of Object.entries(betterAuthSchema)) {
    const table = tableMetadata.find((t2) => t2.name === key);
    if (!table) {
      const tIndex = toBeCreated.findIndex((t2) => t2.table === key);
      const tableData = {
        table: key,
        fields: value.fields,
        order: value.order || Infinity
      };
      const insertIndex = toBeCreated.findIndex((t2) => (t2.order || Infinity) > tableData.order);
      if (insertIndex === -1) if (tIndex === -1) toBeCreated.push(tableData);
      else toBeCreated[tIndex].fields = {
        ...toBeCreated[tIndex].fields,
        ...value.fields
      };
      else toBeCreated.splice(insertIndex, 0, tableData);
      continue;
    }
    const toBeAddedFields = {};
    for (const [fieldName, field] of Object.entries(value.fields)) {
      const column = table.columns.find((c2) => c2.name === fieldName);
      if (!column) {
        toBeAddedFields[fieldName] = field;
        continue;
      }
      if (matchType(column.dataType, field.type, dbType)) continue;
      else logger$1.warn(`Field ${fieldName} in table ${key} has a different type in the database. Expected ${field.type} but got ${column.dataType}.`);
    }
    if (Object.keys(toBeAddedFields).length > 0) toBeAdded.push({
      table: key,
      fields: toBeAddedFields,
      order: value.order || Infinity
    });
  }
  const migrations = [];
  const useUUIDs = config2.advanced?.database?.generateId === "uuid";
  const useNumberId = config2.advanced?.database?.useNumberId || config2.advanced?.database?.generateId === "serial";
  function getType(field, fieldName) {
    const type = field.type;
    const provider = dbType || "sqlite";
    const typeMap = {
      string: {
        sqlite: "text",
        postgres: "text",
        mysql: field.unique ? "varchar(255)" : field.references ? "varchar(36)" : field.sortable ? "varchar(255)" : field.index ? "varchar(255)" : "text",
        mssql: field.unique || field.sortable ? "varchar(255)" : field.references ? "varchar(36)" : "varchar(8000)"
      },
      boolean: {
        sqlite: "integer",
        postgres: "boolean",
        mysql: "boolean",
        mssql: "smallint"
      },
      number: {
        sqlite: field.bigint ? "bigint" : "integer",
        postgres: field.bigint ? "bigint" : "integer",
        mysql: field.bigint ? "bigint" : "integer",
        mssql: field.bigint ? "bigint" : "integer"
      },
      date: {
        sqlite: "date",
        postgres: "timestamptz",
        mysql: "timestamp(3)",
        mssql: sql$1`datetime2(3)`
      },
      json: {
        sqlite: "text",
        postgres: "jsonb",
        mysql: "json",
        mssql: "varchar(8000)"
      },
      id: {
        postgres: useNumberId ? sql$1`integer GENERATED BY DEFAULT AS IDENTITY` : useUUIDs ? "uuid" : "text",
        mysql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
        mssql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
        sqlite: useNumberId ? "integer" : "text"
      },
      foreignKeyId: {
        postgres: useNumberId ? "integer" : useUUIDs ? "uuid" : "text",
        mysql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
        mssql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
        sqlite: useNumberId ? "integer" : "text"
      },
      "string[]": {
        sqlite: "text",
        postgres: "jsonb",
        mysql: "json",
        mssql: "varchar(8000)"
      },
      "number[]": {
        sqlite: "text",
        postgres: "jsonb",
        mysql: "json",
        mssql: "varchar(8000)"
      }
    };
    if (fieldName === "id" || field.references?.field === "id") {
      if (fieldName === "id") return typeMap.id[provider];
      return typeMap.foreignKeyId[provider];
    }
    if (Array.isArray(type)) return "text";
    if (!(type in typeMap)) throw new Error(`Unsupported field type '${String(type)}' for field '${fieldName}'. Allowed types are: string, number, boolean, date, string[], number[]. If you need to store structured data, store it as a JSON string (type: "string") or split it into primitive fields. See https://better-auth.com/docs/advanced/schema#additional-fields`);
    return typeMap[type][provider];
  }
  const getModelName = initGetModelName({
    schema: getAuthTables(config2),
    usePlural: false
  });
  const getFieldName = initGetFieldName({
    schema: getAuthTables(config2),
    usePlural: false
  });
  function getReferencePath(model, field) {
    try {
      return `${getModelName(model)}.${getFieldName({
        model,
        field
      })}`;
    } catch {
      return `${model}.${field}`;
    }
  }
  if (toBeAdded.length) for (const table of toBeAdded) for (const [fieldName, field] of Object.entries(table.fields)) {
    const type = getType(field, fieldName);
    const builder = db2.schema.alterTable(table.table);
    if (field.index) {
      const index2 = db2.schema.alterTable(table.table).addIndex(`${table.table}_${fieldName}_idx`);
      migrations.push(index2);
    }
    const built = builder.addColumn(fieldName, type, (col) => {
      col = field.required !== false ? col.notNull() : col;
      if (field.references) col = col.references(getReferencePath(field.references.model, field.references.field)).onDelete(field.references.onDelete || "cascade");
      if (field.unique) col = col.unique();
      if (field.type === "date" && typeof field.defaultValue === "function" && (dbType === "postgres" || dbType === "mysql" || dbType === "mssql")) if (dbType === "mysql") col = col.defaultTo(sql$1`CURRENT_TIMESTAMP(3)`);
      else col = col.defaultTo(sql$1`CURRENT_TIMESTAMP`);
      return col;
    });
    migrations.push(built);
  }
  const toBeIndexed = [];
  if (config2.advanced?.database?.useNumberId) logger$1.warn("`useNumberId` is deprecated. Please use `generateId` with `serial` instead.");
  if (toBeCreated.length) for (const table of toBeCreated) {
    const idType = getType({ type: useNumberId ? "number" : "string" }, "id");
    let dbT = db2.schema.createTable(table.table).addColumn("id", idType, (col) => {
      if (useNumberId) {
        if (dbType === "postgres") return col.primaryKey().notNull();
        else if (dbType === "sqlite") return col.primaryKey().notNull();
        else if (dbType === "mssql") return col.identity().primaryKey().notNull();
        return col.autoIncrement().primaryKey().notNull();
      }
      if (useUUIDs) {
        if (dbType === "postgres") return col.primaryKey().defaultTo(sql$1`pg_catalog.gen_random_uuid()`).notNull();
        return col.primaryKey().notNull();
      }
      return col.primaryKey().notNull();
    });
    for (const [fieldName, field] of Object.entries(table.fields)) {
      const type = getType(field, fieldName);
      dbT = dbT.addColumn(fieldName, type, (col) => {
        col = field.required !== false ? col.notNull() : col;
        if (field.references) col = col.references(getReferencePath(field.references.model, field.references.field)).onDelete(field.references.onDelete || "cascade");
        if (field.unique) col = col.unique();
        if (field.type === "date" && typeof field.defaultValue === "function" && (dbType === "postgres" || dbType === "mysql" || dbType === "mssql")) if (dbType === "mysql") col = col.defaultTo(sql$1`CURRENT_TIMESTAMP(3)`);
        else col = col.defaultTo(sql$1`CURRENT_TIMESTAMP`);
        return col;
      });
      if (field.index) {
        const builder = db2.schema.createIndex(`${table.table}_${fieldName}_${field.unique ? "uidx" : "idx"}`).on(table.table).columns([fieldName]);
        toBeIndexed.push(field.unique ? builder.unique() : builder);
      }
    }
    migrations.push(dbT);
  }
  if (toBeIndexed.length) for (const index2 of toBeIndexed) migrations.push(index2);
  async function runMigrations() {
    for (const migration of migrations) await migration.execute();
  }
  async function compileMigrations() {
    return migrations.map((m2) => m2.compile().sql).join(";\n\n") + ";";
  }
  return {
    toBeCreated,
    toBeAdded,
    runMigrations,
    compileMigrations
  };
}
var db_exports = /* @__PURE__ */ __export({
  convertFromDB: () => convertFromDB,
  convertToDB: () => convertToDB,
  createFieldAttribute: () => createFieldAttribute,
  createInternalAdapter: () => createInternalAdapter,
  getAdapter: () => getAdapter,
  getBaseAdapter: () => getBaseAdapter,
  getMigrations: () => getMigrations,
  getSchema: () => getSchema,
  getWithHooks: () => getWithHooks,
  matchType: () => matchType,
  mergeSchema: () => mergeSchema,
  parseAccountInput: () => parseAccountInput,
  parseAccountOutput: () => parseAccountOutput,
  parseAdditionalUserInput: () => parseAdditionalUserInput,
  parseInputData: () => parseInputData,
  parseSessionInput: () => parseSessionInput,
  parseSessionOutput: () => parseSessionOutput,
  parseUserInput: () => parseUserInput,
  parseUserOutput: () => parseUserOutput,
  toZodSchema: () => toZodSchema
});
__reExport(db_exports, import___better_auth_core_db);
const getSession = () => createAuthEndpoint("/get-session", {
  method: "GET",
  operationId: "getSession",
  query: getSessionQuerySchema,
  requireHeaders: true,
  metadata: { openapi: {
    operationId: "getSession",
    description: "Get the current session",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        nullable: true,
        properties: {
          session: { $ref: "#/components/schemas/Session" },
          user: { $ref: "#/components/schemas/User" }
        },
        required: ["session", "user"]
      } } }
    } }
  } }
}, async (ctx) => {
  try {
    const sessionCookieToken = await ctx.getSignedCookie(ctx.context.authCookies.sessionToken.name, ctx.context.secret);
    if (!sessionCookieToken) return null;
    const sessionDataCookie = getChunkedCookie(ctx, ctx.context.authCookies.sessionData.name);
    let sessionDataPayload = null;
    if (sessionDataCookie) {
      const strategy = ctx.context.options.session?.cookieCache?.strategy || "compact";
      if (strategy === "jwe") {
        const payload = await symmetricDecodeJWT(sessionDataCookie, ctx.context.secret, "better-auth-session");
        if (payload && payload.session && payload.user) sessionDataPayload = {
          session: {
            session: payload.session,
            user: payload.user,
            updatedAt: payload.updatedAt,
            version: payload.version
          },
          expiresAt: payload.exp ? payload.exp * 1e3 : Date.now()
        };
        else {
          expireCookie(ctx, ctx.context.authCookies.sessionData);
          return ctx.json(null);
        }
      } else if (strategy === "jwt") {
        const payload = await verifyJWT(sessionDataCookie, ctx.context.secret);
        if (payload && payload.session && payload.user) sessionDataPayload = {
          session: {
            session: payload.session,
            user: payload.user,
            updatedAt: payload.updatedAt,
            version: payload.version
          },
          expiresAt: payload.exp ? payload.exp * 1e3 : Date.now()
        };
        else {
          expireCookie(ctx, ctx.context.authCookies.sessionData);
          return ctx.json(null);
        }
      } else {
        const parsed = safeJSONParse(binary.decode(base64Url.decode(sessionDataCookie)));
        if (parsed) if (await createHMAC("SHA-256", "base64urlnopad").verify(ctx.context.secret, JSON.stringify({
          ...parsed.session,
          expiresAt: parsed.expiresAt
        }), parsed.signature)) sessionDataPayload = parsed;
        else {
          expireCookie(ctx, ctx.context.authCookies.sessionData);
          return ctx.json(null);
        }
      }
    }
    const dontRememberMe = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
    if (sessionDataPayload?.session && ctx.context.options.session?.cookieCache?.enabled && !ctx.query?.disableCookieCache) {
      const session$1 = sessionDataPayload.session;
      const versionConfig = ctx.context.options.session?.cookieCache?.version;
      let expectedVersion = "1";
      if (versionConfig) {
        if (typeof versionConfig === "string") expectedVersion = versionConfig;
        else if (typeof versionConfig === "function") {
          const result = versionConfig(session$1.session, session$1.user);
          expectedVersion = result instanceof Promise ? await result : result;
        }
      }
      if ((session$1.version || "1") !== expectedVersion) expireCookie(ctx, ctx.context.authCookies.sessionData);
      else {
        const cachedSessionExpiresAt = new Date(session$1.session.expiresAt);
        if (sessionDataPayload.expiresAt < Date.now() || cachedSessionExpiresAt < /* @__PURE__ */ new Date()) expireCookie(ctx, ctx.context.authCookies.sessionData);
        else {
          const cookieRefreshCache = ctx.context.sessionConfig.cookieRefreshCache;
          if (cookieRefreshCache === false) {
            ctx.context.session = session$1;
            const parsedSession$2 = parseSessionOutput(ctx.context.options, {
              ...session$1.session,
              expiresAt: new Date(session$1.session.expiresAt),
              createdAt: new Date(session$1.session.createdAt),
              updatedAt: new Date(session$1.session.updatedAt)
            });
            const parsedUser$2 = parseUserOutput(ctx.context.options, {
              ...session$1.user,
              createdAt: new Date(session$1.user.createdAt),
              updatedAt: new Date(session$1.user.updatedAt)
            });
            return ctx.json({
              session: parsedSession$2,
              user: parsedUser$2
            });
          }
          if (sessionDataPayload.expiresAt - Date.now() < cookieRefreshCache.updateAge * 1e3) {
            const newExpiresAt = getDate(ctx.context.options.session?.cookieCache?.maxAge || 300, "sec");
            const refreshedSession = {
              session: {
                ...session$1.session,
                expiresAt: newExpiresAt
              },
              user: session$1.user,
              updatedAt: Date.now()
            };
            await setCookieCache(ctx, refreshedSession, false);
            const parsedRefreshedSession = parseSessionOutput(ctx.context.options, {
              ...refreshedSession.session,
              expiresAt: new Date(refreshedSession.session.expiresAt),
              createdAt: new Date(refreshedSession.session.createdAt),
              updatedAt: new Date(refreshedSession.session.updatedAt)
            });
            const parsedRefreshedUser = parseUserOutput(ctx.context.options, {
              ...refreshedSession.user,
              createdAt: new Date(refreshedSession.user.createdAt),
              updatedAt: new Date(refreshedSession.user.updatedAt)
            });
            ctx.context.session = {
              session: parsedRefreshedSession,
              user: parsedRefreshedUser
            };
            return ctx.json({
              session: parsedRefreshedSession,
              user: parsedRefreshedUser
            });
          }
          const parsedSession$1 = parseSessionOutput(ctx.context.options, {
            ...session$1.session,
            expiresAt: new Date(session$1.session.expiresAt),
            createdAt: new Date(session$1.session.createdAt),
            updatedAt: new Date(session$1.session.updatedAt)
          });
          const parsedUser$1 = parseUserOutput(ctx.context.options, {
            ...session$1.user,
            createdAt: new Date(session$1.user.createdAt),
            updatedAt: new Date(session$1.user.updatedAt)
          });
          ctx.context.session = {
            session: parsedSession$1,
            user: parsedUser$1
          };
          return ctx.json({
            session: parsedSession$1,
            user: parsedUser$1
          });
        }
      }
    }
    const session2 = await ctx.context.internalAdapter.findSession(sessionCookieToken);
    ctx.context.session = session2;
    if (!session2 || session2.session.expiresAt < /* @__PURE__ */ new Date()) {
      deleteSessionCookie(ctx);
      if (session2)
        await ctx.context.internalAdapter.deleteSession(session2.session.token);
      return ctx.json(null);
    }
    if (dontRememberMe || ctx.query?.disableRefresh) {
      const parsedSession$1 = parseSessionOutput(ctx.context.options, session2.session);
      const parsedUser$1 = parseUserOutput(ctx.context.options, session2.user);
      return ctx.json({
        session: parsedSession$1,
        user: parsedUser$1
      });
    }
    const expiresIn = ctx.context.sessionConfig.expiresIn;
    const updateAge = ctx.context.sessionConfig.updateAge;
    if (session2.session.expiresAt.valueOf() - expiresIn * 1e3 + updateAge * 1e3 <= Date.now() && (!ctx.query?.disableRefresh || !ctx.context.options.session?.disableSessionRefresh)) {
      const updatedSession = await ctx.context.internalAdapter.updateSession(session2.session.token, {
        expiresAt: getDate(ctx.context.sessionConfig.expiresIn, "sec"),
        updatedAt: /* @__PURE__ */ new Date()
      });
      if (!updatedSession) {
        deleteSessionCookie(ctx);
        return ctx.json(null, { status: 401 });
      }
      const maxAge = (updatedSession.expiresAt.valueOf() - Date.now()) / 1e3;
      await setSessionCookie(ctx, {
        session: updatedSession,
        user: session2.user
      }, false, { maxAge });
      const parsedUpdatedSession = parseSessionOutput(ctx.context.options, updatedSession);
      const parsedUser$1 = parseUserOutput(ctx.context.options, session2.user);
      return ctx.json({
        session: parsedUpdatedSession,
        user: parsedUser$1
      });
    }
    await setCookieCache(ctx, session2, !!dontRememberMe);
    const parsedSession = parseSessionOutput(ctx.context.options, session2.session);
    const parsedUser = parseUserOutput(ctx.context.options, session2.user);
    return ctx.json({
      session: parsedSession,
      user: parsedUser
    });
  } catch (error2) {
    ctx.context.logger.error("INTERNAL_SERVER_ERROR", error2);
    throw new APIError("INTERNAL_SERVER_ERROR", { message: BASE_ERROR_CODES.FAILED_TO_GET_SESSION });
  }
});
const getSessionFromCtx = async (ctx, config2) => {
  if (ctx.context.session) return ctx.context.session;
  const session2 = await getSession()({
    ...ctx,
    asResponse: false,
    headers: ctx.headers,
    returnHeaders: false,
    returnStatus: false,
    query: {
      ...config2,
      ...ctx.query
    }
  }).catch((e2) => {
    return null;
  });
  ctx.context.session = session2;
  return session2;
};
const sessionMiddleware = createAuthMiddleware(async (ctx) => {
  const session2 = await getSessionFromCtx(ctx);
  if (!session2?.session) throw new APIError("UNAUTHORIZED");
  return { session: session2 };
});
const sensitiveSessionMiddleware = createAuthMiddleware(async (ctx) => {
  const session2 = await getSessionFromCtx(ctx, { disableCookieCache: true });
  if (!session2?.session) throw new APIError("UNAUTHORIZED");
  return { session: session2 };
});
createAuthMiddleware(async (ctx) => {
  const session2 = await getSessionFromCtx(ctx);
  if (!session2?.session && (ctx.request || ctx.headers)) throw new APIError("UNAUTHORIZED");
  return { session: session2 };
});
const freshSessionMiddleware = createAuthMiddleware(async (ctx) => {
  const session2 = await getSessionFromCtx(ctx);
  if (!session2?.session) throw new APIError("UNAUTHORIZED");
  if (ctx.context.sessionConfig.freshAge === 0) return { session: session2 };
  const freshAge = ctx.context.sessionConfig.freshAge;
  const lastUpdated = new Date(session2.session.updatedAt || session2.session.createdAt).getTime();
  if (!(Date.now() - lastUpdated < freshAge * 1e3)) throw new APIError("FORBIDDEN", { message: "Session is not fresh" });
  return { session: session2 };
});
const listSessions = () => createAuthEndpoint("/list-sessions", {
  method: "GET",
  operationId: "listUserSessions",
  use: [sessionMiddleware],
  requireHeaders: true,
  metadata: { openapi: {
    operationId: "listUserSessions",
    description: "List all active sessions for the user",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "array",
        items: { $ref: "#/components/schemas/Session" }
      } } }
    } }
  } }
}, async (ctx) => {
  try {
    const activeSessions = (await ctx.context.internalAdapter.listSessions(ctx.context.session.user.id)).filter((session2) => {
      return session2.expiresAt > /* @__PURE__ */ new Date();
    });
    return ctx.json(activeSessions.map((session2) => parseSessionOutput(ctx.context.options, session2)));
  } catch (e2) {
    ctx.context.logger.error(e2);
    throw ctx.error("INTERNAL_SERVER_ERROR");
  }
});
const revokeSession = createAuthEndpoint("/revoke-session", {
  method: "POST",
  body: z$1.object({ token: z$1.string().meta({ description: "The token to revoke" }) }),
  use: [sensitiveSessionMiddleware],
  requireHeaders: true,
  metadata: { openapi: {
    description: "Revoke a single session",
    requestBody: { content: { "application/json": { schema: {
      type: "object",
      properties: { token: {
        type: "string",
        description: "The token to revoke"
      } },
      required: ["token"]
    } } } },
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { status: {
          type: "boolean",
          description: "Indicates if the session was revoked successfully"
        } },
        required: ["status"]
      } } }
    } }
  } }
}, async (ctx) => {
  const token = ctx.body.token;
  if ((await ctx.context.internalAdapter.findSession(token))?.session.userId === ctx.context.session.user.id) try {
    await ctx.context.internalAdapter.deleteSession(token);
  } catch (error2) {
    ctx.context.logger.error(error2 && typeof error2 === "object" && "name" in error2 ? error2.name : "", error2);
    throw new APIError("INTERNAL_SERVER_ERROR");
  }
  return ctx.json({ status: true });
});
const revokeSessions = createAuthEndpoint("/revoke-sessions", {
  method: "POST",
  use: [sensitiveSessionMiddleware],
  requireHeaders: true,
  metadata: { openapi: {
    description: "Revoke all sessions for the user",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { status: {
          type: "boolean",
          description: "Indicates if all sessions were revoked successfully"
        } },
        required: ["status"]
      } } }
    } }
  } }
}, async (ctx) => {
  try {
    await ctx.context.internalAdapter.deleteSessions(ctx.context.session.user.id);
  } catch (error2) {
    ctx.context.logger.error(error2 && typeof error2 === "object" && "name" in error2 ? error2.name : "", error2);
    throw new APIError("INTERNAL_SERVER_ERROR");
  }
  return ctx.json({ status: true });
});
const revokeOtherSessions = createAuthEndpoint("/revoke-other-sessions", {
  method: "POST",
  requireHeaders: true,
  use: [sensitiveSessionMiddleware],
  metadata: { openapi: {
    description: "Revoke all other sessions for the user except the current one",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { status: {
          type: "boolean",
          description: "Indicates if all other sessions were revoked successfully"
        } },
        required: ["status"]
      } } }
    } }
  } }
}, async (ctx) => {
  const session2 = ctx.context.session;
  if (!session2.user) throw new APIError("UNAUTHORIZED");
  const otherSessions = (await ctx.context.internalAdapter.listSessions(session2.user.id)).filter((session$1) => {
    return session$1.expiresAt > /* @__PURE__ */ new Date();
  }).filter((session$1) => session$1.token !== ctx.context.session.session.token);
  await Promise.all(otherSessions.map((session$1) => ctx.context.internalAdapter.deleteSession(session$1.token)));
  return ctx.json({ status: true });
});
function decryptOAuthToken(token, ctx) {
  if (!token) return token;
  if (ctx.options.account?.encryptOAuthTokens) return symmetricDecrypt({
    key: ctx.secret,
    data: token
  });
  return token;
}
function setTokenUtil(token, ctx) {
  if (ctx.options.account?.encryptOAuthTokens && token) return symmetricEncrypt({
    key: ctx.secret,
    data: token
  });
  return token;
}
function getOAuth2Tokens(data) {
  const getDate2 = (seconds) => {
    const now2 = /* @__PURE__ */ new Date();
    return new Date(now2.getTime() + seconds * 1e3);
  };
  return {
    tokenType: data.token_type,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessTokenExpiresAt: data.expires_in ? getDate2(data.expires_in) : void 0,
    refreshTokenExpiresAt: data.refresh_token_expires_in ? getDate2(data.refresh_token_expires_in) : void 0,
    scopes: data?.scope ? typeof data.scope === "string" ? data.scope.split(" ") : data.scope : [],
    idToken: data.id_token,
    raw: data
  };
}
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64Url.encode(new Uint8Array(hash), { padding: false });
}
async function createAuthorizationURL({ id, options, authorizationEndpoint, state, codeVerifier, scopes, claims, redirectURI, duration, prompt, accessType, responseType, display, loginHint, hd, responseMode, additionalParams, scopeJoiner }) {
  const url = new URL(options.authorizationEndpoint || authorizationEndpoint);
  url.searchParams.set("response_type", responseType || "code");
  const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
  url.searchParams.set("client_id", primaryClientId);
  url.searchParams.set("state", state);
  if (scopes) url.searchParams.set("scope", scopes.join(scopeJoiner || " "));
  url.searchParams.set("redirect_uri", options.redirectURI || redirectURI);
  duration && url.searchParams.set("duration", duration);
  display && url.searchParams.set("display", display);
  loginHint && url.searchParams.set("login_hint", loginHint);
  prompt && url.searchParams.set("prompt", prompt);
  hd && url.searchParams.set("hd", hd);
  accessType && url.searchParams.set("access_type", accessType);
  responseMode && url.searchParams.set("response_mode", responseMode);
  if (codeVerifier) {
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("code_challenge", codeChallenge);
  }
  if (claims) {
    const claimsObj = claims.reduce((acc, claim) => {
      acc[claim] = null;
      return acc;
    }, {});
    url.searchParams.set("claims", JSON.stringify({ id_token: {
      email: null,
      email_verified: null,
      ...claimsObj
    } }));
  }
  if (additionalParams) Object.entries(additionalParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url;
}
function createRefreshAccessTokenRequest({ refreshToken: refreshToken2, options, authentication, extraParams, resource }) {
  const body = new URLSearchParams();
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    accept: "application/json"
  };
  body.set("grant_type", "refresh_token");
  body.set("refresh_token", refreshToken2);
  if (authentication === "basic") {
    const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
    if (primaryClientId) headers["authorization"] = "Basic " + base64.encode(`${primaryClientId}:${options.clientSecret ?? ""}`);
    else headers["authorization"] = "Basic " + base64.encode(`:${options.clientSecret ?? ""}`);
  } else {
    const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
    body.set("client_id", primaryClientId);
    if (options.clientSecret) body.set("client_secret", options.clientSecret);
  }
  if (resource) if (typeof resource === "string") body.append("resource", resource);
  else for (const _resource of resource) body.append("resource", _resource);
  if (extraParams) for (const [key, value] of Object.entries(extraParams)) body.set(key, value);
  return {
    body,
    headers
  };
}
async function refreshAccessToken({ refreshToken: refreshToken2, options, tokenEndpoint, authentication, extraParams }) {
  const { body, headers } = createRefreshAccessTokenRequest({
    refreshToken: refreshToken2,
    options,
    authentication,
    extraParams
  });
  const { data, error: error2 } = await betterFetch(tokenEndpoint, {
    method: "POST",
    body,
    headers
  });
  if (error2) throw error2;
  const tokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    tokenType: data.token_type,
    scopes: data.scope?.split(" "),
    idToken: data.id_token
  };
  if (data.expires_in) {
    const now2 = /* @__PURE__ */ new Date();
    tokens.accessTokenExpiresAt = new Date(now2.getTime() + data.expires_in * 1e3);
  }
  return tokens;
}
function createAuthorizationCodeRequest({ code: code2, codeVerifier, redirectURI, options, authentication, deviceId, headers, additionalParams = {}, resource }) {
  const body = new URLSearchParams();
  const requestHeaders = {
    "content-type": "application/x-www-form-urlencoded",
    accept: "application/json",
    ...headers
  };
  body.set("grant_type", "authorization_code");
  body.set("code", code2);
  codeVerifier && body.set("code_verifier", codeVerifier);
  options.clientKey && body.set("client_key", options.clientKey);
  deviceId && body.set("device_id", deviceId);
  body.set("redirect_uri", options.redirectURI || redirectURI);
  if (resource) if (typeof resource === "string") body.append("resource", resource);
  else for (const _resource of resource) body.append("resource", _resource);
  if (authentication === "basic") {
    const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
    requestHeaders["authorization"] = `Basic ${base64.encode(`${primaryClientId}:${options.clientSecret ?? ""}`)}`;
  } else {
    const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
    body.set("client_id", primaryClientId);
    if (options.clientSecret) body.set("client_secret", options.clientSecret);
  }
  for (const [key, value] of Object.entries(additionalParams)) if (!body.has(key)) body.append(key, value);
  return {
    body,
    headers: requestHeaders
  };
}
async function validateAuthorizationCode({ code: code2, codeVerifier, redirectURI, options, tokenEndpoint, authentication, deviceId, headers, additionalParams = {}, resource }) {
  const { body, headers: requestHeaders } = createAuthorizationCodeRequest({
    code: code2,
    codeVerifier,
    redirectURI,
    options,
    authentication,
    deviceId,
    headers,
    additionalParams,
    resource
  });
  const { data, error: error2 } = await betterFetch(tokenEndpoint, {
    method: "POST",
    body,
    headers: requestHeaders
  });
  if (error2) throw error2;
  return getOAuth2Tokens(data);
}
const apple = (options) => {
  const tokenEndpoint = "https://appleid.apple.com/auth/token";
  return {
    id: "apple",
    name: "Apple",
    async createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scope = options.disableDefaultScope ? [] : ["email", "name"];
      if (options.scope) _scope.push(...options.scope);
      if (scopes) _scope.push(...scopes);
      return await createAuthorizationURL({
        id: "apple",
        options,
        authorizationEndpoint: "https://appleid.apple.com/auth/authorize",
        scopes: _scope,
        state,
        redirectURI,
        responseMode: "form_post",
        responseType: "code id_token"
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    async verifyIdToken(token, nonce) {
      if (options.disableIdTokenSignIn) return false;
      if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
      const { kid, alg: jwtAlg } = decodeProtectedHeader(token);
      if (!kid || !jwtAlg) return false;
      const { payload: jwtClaims } = await jwtVerify(token, await getApplePublicKey(kid), {
        algorithms: [jwtAlg],
        issuer: "https://appleid.apple.com",
        audience: options.audience && options.audience.length ? options.audience : options.appBundleIdentifier ? options.appBundleIdentifier : options.clientId,
        maxTokenAge: "1h"
      });
      ["email_verified", "is_private_email"].forEach((field) => {
        if (jwtClaims[field] !== void 0) jwtClaims[field] = Boolean(jwtClaims[field]);
      });
      if (nonce && jwtClaims.nonce !== nonce) return false;
      return !!jwtClaims;
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://appleid.apple.com/auth/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      if (!token.idToken) return null;
      const profile = decodeJwt(token.idToken);
      if (!profile) return null;
      const name = token.user ? `${token.user.name?.firstName} ${token.user.name?.lastName}` : profile.name || profile.email;
      const emailVerified = typeof profile.email_verified === "boolean" ? profile.email_verified : profile.email_verified === "true";
      const enrichedProfile = {
        ...profile,
        name
      };
      const userMap = await options.mapProfileToUser?.(enrichedProfile);
      return {
        user: {
          id: profile.sub,
          name: enrichedProfile.name,
          emailVerified,
          email: profile.email,
          ...userMap
        },
        data: enrichedProfile
      };
    },
    options
  };
};
const getApplePublicKey = async (kid) => {
  const { data } = await betterFetch(`https://appleid.apple.com/auth/keys`);
  if (!data?.keys) throw new APIError("BAD_REQUEST", { message: "Keys not found" });
  const jwk = data.keys.find((key) => key.kid === kid);
  if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
  return await importJWK(jwk, jwk.alg);
};
const atlassian = (options) => {
  return {
    id: "atlassian",
    name: "Atlassian",
    async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      if (!options.clientId || !options.clientSecret) {
        logger.error("Client Id and Secret are required for Atlassian");
        throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
      }
      if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Atlassian");
      const _scopes = options.disableDefaultScope ? [] : ["read:jira-user", "offline_access"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "atlassian",
        options,
        authorizationEndpoint: "https://auth.atlassian.com/authorize",
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI,
        additionalParams: { audience: "api.atlassian.com" },
        prompt: options.prompt
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint: "https://auth.atlassian.com/oauth/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://auth.atlassian.com/oauth/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      if (!token.accessToken) return null;
      try {
        const { data: profile } = await betterFetch("https://api.atlassian.com/me", { headers: { Authorization: `Bearer ${token.accessToken}` } });
        if (!profile) return null;
        const userMap = await options.mapProfileToUser?.(profile);
        return {
          user: {
            id: profile.account_id,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            emailVerified: false,
            ...userMap
          },
          data: profile
        };
      } catch (error2) {
        logger.error("Failed to fetch user info from Figma:", error2);
        return null;
      }
    },
    options
  };
};
const cognito = (options) => {
  if (!options.domain || !options.region || !options.userPoolId) {
    logger.error("Domain, region and userPoolId are required for Amazon Cognito. Make sure to provide them in the options.");
    throw new BetterAuthError("DOMAIN_AND_REGION_REQUIRED");
  }
  const cleanDomain = options.domain.replace(/^https?:\/\//, "");
  const authorizationEndpoint = `https://${cleanDomain}/oauth2/authorize`;
  const tokenEndpoint = `https://${cleanDomain}/oauth2/token`;
  const userInfoEndpoint = `https://${cleanDomain}/oauth2/userinfo`;
  return {
    id: "cognito",
    name: "Cognito",
    async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      if (!options.clientId) {
        logger.error("ClientId is required for Amazon Cognito. Make sure to provide them in the options.");
        throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
      }
      if (options.requireClientSecret && !options.clientSecret) {
        logger.error("Client Secret is required when requireClientSecret is true. Make sure to provide it in the options.");
        throw new BetterAuthError("CLIENT_SECRET_REQUIRED");
      }
      const _scopes = options.disableDefaultScope ? [] : [
        "openid",
        "profile",
        "email"
      ];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      const url = await createAuthorizationURL({
        id: "cognito",
        options: { ...options },
        authorizationEndpoint,
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI,
        prompt: options.prompt
      });
      const scopeValue = url.searchParams.get("scope");
      if (scopeValue) {
        url.searchParams.delete("scope");
        const encodedScope = encodeURIComponent(scopeValue);
        const urlString = url.toString();
        const separator = urlString.includes("?") ? "&" : "?";
        return new URL(`${urlString}${separator}scope=${encodedScope}`);
      }
      return url;
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint
      });
    },
    async verifyIdToken(token, nonce) {
      if (options.disableIdTokenSignIn) return false;
      if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
      try {
        const { kid, alg: jwtAlg } = decodeProtectedHeader(token);
        if (!kid || !jwtAlg) return false;
        const publicKey = await getCognitoPublicKey(kid, options.region, options.userPoolId);
        const expectedIssuer = `https://cognito-idp.${options.region}.amazonaws.com/${options.userPoolId}`;
        const { payload: jwtClaims } = await jwtVerify(token, publicKey, {
          algorithms: [jwtAlg],
          issuer: expectedIssuer,
          audience: options.clientId,
          maxTokenAge: "1h"
        });
        if (nonce && jwtClaims.nonce !== nonce) return false;
        return true;
      } catch (error2) {
        logger.error("Failed to verify ID token:", error2);
        return false;
      }
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      if (token.idToken) try {
        const profile = decodeJwt(token.idToken);
        if (!profile) return null;
        const name = profile.name || profile.given_name || profile.username || profile.email;
        const enrichedProfile = {
          ...profile,
          name
        };
        const userMap = await options.mapProfileToUser?.(enrichedProfile);
        return {
          user: {
            id: profile.sub,
            name: enrichedProfile.name,
            email: profile.email,
            image: profile.picture,
            emailVerified: profile.email_verified,
            ...userMap
          },
          data: enrichedProfile
        };
      } catch (error2) {
        logger.error("Failed to decode ID token:", error2);
      }
      if (token.accessToken) try {
        const { data: userInfo } = await betterFetch(userInfoEndpoint, { headers: { Authorization: `Bearer ${token.accessToken}` } });
        if (userInfo) {
          const userMap = await options.mapProfileToUser?.(userInfo);
          return {
            user: {
              id: userInfo.sub,
              name: userInfo.name || userInfo.given_name || userInfo.username,
              email: userInfo.email,
              image: userInfo.picture,
              emailVerified: userInfo.email_verified,
              ...userMap
            },
            data: userInfo
          };
        }
      } catch (error2) {
        logger.error("Failed to fetch user info from Cognito:", error2);
      }
      return null;
    },
    options
  };
};
const getCognitoPublicKey = async (kid, region, userPoolId) => {
  const COGNITO_JWKS_URI = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  try {
    const { data } = await betterFetch(COGNITO_JWKS_URI);
    if (!data?.keys) throw new APIError("BAD_REQUEST", { message: "Keys not found" });
    const jwk = data.keys.find((key) => key.kid === kid);
    if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
    return await importJWK(jwk, jwk.alg);
  } catch (error2) {
    logger.error("Failed to fetch Cognito public key:", error2);
    throw error2;
  }
};
const discord = (options) => {
  return {
    id: "discord",
    name: "Discord",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["identify", "email"];
      if (scopes) _scopes.push(...scopes);
      if (options.scope) _scopes.push(...options.scope);
      const permissionsParam = _scopes.includes("bot") && options.permissions !== void 0 ? `&permissions=${options.permissions}` : "";
      return new URL(`https://discord.com/api/oauth2/authorize?scope=${_scopes.join("+")}&response_type=code&client_id=${options.clientId}&redirect_uri=${encodeURIComponent(options.redirectURI || redirectURI)}&state=${state}&prompt=${options.prompt || "none"}${permissionsParam}`);
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        redirectURI,
        options,
        tokenEndpoint: "https://discord.com/api/oauth2/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://discord.com/api/oauth2/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://discord.com/api/users/@me", { headers: { authorization: `Bearer ${token.accessToken}` } });
      if (error2) return null;
      if (profile.avatar === null) profile.image_url = `https://cdn.discordapp.com/embed/avatars/${profile.discriminator === "0" ? Number(BigInt(profile.id) >> BigInt(22)) % 6 : parseInt(profile.discriminator) % 5}.png`;
      else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png";
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.global_name || profile.username || "",
          email: profile.email,
          emailVerified: profile.verified,
          image: profile.image_url,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const dropbox = (options) => {
  const tokenEndpoint = "https://api.dropboxapi.com/oauth2/token";
  return {
    id: "dropbox",
    name: "Dropbox",
    createAuthorizationURL: async ({ state, scopes, codeVerifier, redirectURI }) => {
      const _scopes = options.disableDefaultScope ? [] : ["account_info.read"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      const additionalParams = {};
      if (options.accessType) additionalParams.token_access_type = options.accessType;
      return await createAuthorizationURL({
        id: "dropbox",
        options,
        authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
        scopes: _scopes,
        state,
        redirectURI,
        codeVerifier,
        additionalParams
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return await validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://api.dropbox.com/oauth2/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://api.dropboxapi.com/2/users/get_current_account", {
        method: "POST",
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });
      if (error2) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.account_id,
          name: profile.name?.display_name,
          email: profile.email,
          emailVerified: profile.email_verified || false,
          image: profile.profile_photo_url,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const facebook = (options) => {
  return {
    id: "facebook",
    name: "Facebook",
    async createAuthorizationURL({ state, scopes, redirectURI, loginHint }) {
      const _scopes = options.disableDefaultScope ? [] : ["email", "public_profile"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return await createAuthorizationURL({
        id: "facebook",
        options,
        authorizationEndpoint: "https://www.facebook.com/v21.0/dialog/oauth",
        scopes: _scopes,
        state,
        redirectURI,
        loginHint,
        additionalParams: options.configId ? { config_id: options.configId } : {}
      });
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        redirectURI,
        options,
        tokenEndpoint: "https://graph.facebook.com/oauth/access_token"
      });
    },
    async verifyIdToken(token, nonce) {
      if (options.disableIdTokenSignIn) return false;
      if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
      if (token.split(".").length === 3) try {
        const { payload: jwtClaims } = await jwtVerify(token, createRemoteJWKSet(new URL("https://limited.facebook.com/.well-known/oauth/openid/jwks/")), {
          algorithms: ["RS256"],
          audience: options.clientId,
          issuer: "https://www.facebook.com"
        });
        if (nonce && jwtClaims.nonce !== nonce) return false;
        return !!jwtClaims;
      } catch {
        return false;
      }
      return true;
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://graph.facebook.com/v18.0/oauth/access_token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      if (token.idToken && token.idToken.split(".").length === 3) {
        const profile$1 = decodeJwt(token.idToken);
        const user2 = {
          id: profile$1.sub,
          name: profile$1.name,
          email: profile$1.email,
          picture: { data: {
            url: profile$1.picture,
            height: 100,
            width: 100,
            is_silhouette: false
          } }
        };
        const userMap$1 = await options.mapProfileToUser?.({
          ...user2,
          email_verified: false
        });
        return {
          user: {
            ...user2,
            emailVerified: false,
            ...userMap$1
          },
          data: profile$1
        };
      }
      const { data: profile, error: error2 } = await betterFetch("https://graph.facebook.com/me?fields=" + [
        "id",
        "name",
        "email",
        "picture",
        ...options?.fields || []
      ].join(","), { auth: {
        type: "Bearer",
        token: token.accessToken
      } });
      if (error2) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture.data.url,
          emailVerified: profile.email_verified,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const figma = (options) => {
  return {
    id: "figma",
    name: "Figma",
    async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      if (!options.clientId || !options.clientSecret) {
        logger.error("Client Id and Client Secret are required for Figma. Make sure to provide them in the options.");
        throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
      }
      if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Figma");
      const _scopes = options.disableDefaultScope ? [] : ["current_user:read"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return await createAuthorizationURL({
        id: "figma",
        options,
        authorizationEndpoint: "https://www.figma.com/oauth",
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint: "https://api.figma.com/v1/oauth/token",
        authentication: "basic"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://api.figma.com/v1/oauth/token",
        authentication: "basic"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      try {
        const { data: profile } = await betterFetch("https://api.figma.com/v1/me", { headers: { Authorization: `Bearer ${token.accessToken}` } });
        if (!profile) {
          logger.error("Failed to fetch user from Figma");
          return null;
        }
        const userMap = await options.mapProfileToUser?.(profile);
        return {
          user: {
            id: profile.id,
            name: profile.handle,
            email: profile.email,
            image: profile.img_url,
            emailVerified: false,
            ...userMap
          },
          data: profile
        };
      } catch (error2) {
        logger.error("Failed to fetch user info from Figma:", error2);
        return null;
      }
    },
    options
  };
};
const github = (options) => {
  const tokenEndpoint = "https://github.com/login/oauth/access_token";
  return {
    id: "github",
    name: "GitHub",
    createAuthorizationURL({ state, scopes, loginHint, codeVerifier, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["read:user", "user:email"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "github",
        options,
        authorizationEndpoint: "https://github.com/login/oauth/authorize",
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI,
        loginHint,
        prompt: options.prompt
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://github.com/login/oauth/access_token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://api.github.com/user", { headers: {
        "User-Agent": "better-auth",
        authorization: `Bearer ${token.accessToken}`
      } });
      if (error2) return null;
      const { data: emails } = await betterFetch("https://api.github.com/user/emails", { headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "User-Agent": "better-auth"
      } });
      if (!profile.email && emails) profile.email = (emails.find((e2) => e2.primary) ?? emails[0])?.email;
      const emailVerified = emails?.find((e2) => e2.email === profile.email)?.verified ?? false;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          emailVerified,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const cleanDoubleSlashes = (input = "") => {
  return input.split("://").map((str) => str.replace(/\/{2,}/g, "/")).join("://");
};
const issuerToEndpoints = (issuer) => {
  const baseUrl = issuer || "https://gitlab.com";
  return {
    authorizationEndpoint: cleanDoubleSlashes(`${baseUrl}/oauth/authorize`),
    tokenEndpoint: cleanDoubleSlashes(`${baseUrl}/oauth/token`),
    userinfoEndpoint: cleanDoubleSlashes(`${baseUrl}/api/v4/user`)
  };
};
const gitlab = (options) => {
  const { authorizationEndpoint, tokenEndpoint, userinfoEndpoint } = issuerToEndpoints(options.issuer);
  const issuerId = "gitlab";
  return {
    id: issuerId,
    name: "Gitlab",
    createAuthorizationURL: async ({ state, scopes, codeVerifier, loginHint, redirectURI }) => {
      const _scopes = options.disableDefaultScope ? [] : ["read_user"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return await createAuthorizationURL({
        id: issuerId,
        options,
        authorizationEndpoint,
        scopes: _scopes,
        state,
        redirectURI,
        codeVerifier,
        loginHint
      });
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI, codeVerifier }) => {
      return validateAuthorizationCode({
        code: code2,
        redirectURI,
        options,
        codeVerifier,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch(userinfoEndpoint, { headers: { authorization: `Bearer ${token.accessToken}` } });
      if (error2 || profile.state !== "active" || profile.locked) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.name ?? profile.username,
          email: profile.email,
          image: profile.avatar_url,
          emailVerified: profile.email_verified ?? false,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const google = (options) => {
  return {
    id: "google",
    name: "Google",
    async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, loginHint, display }) {
      if (!options.clientId || !options.clientSecret) {
        logger.error("Client Id and Client Secret is required for Google. Make sure to provide them in the options.");
        throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
      }
      if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Google");
      const _scopes = options.disableDefaultScope ? [] : [
        "email",
        "profile",
        "openid"
      ];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return await createAuthorizationURL({
        id: "google",
        options,
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI,
        prompt: options.prompt,
        accessType: options.accessType,
        display: display || options.display,
        loginHint,
        hd: options.hd,
        additionalParams: { include_granted_scopes: "true" }
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint: "https://oauth2.googleapis.com/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token"
      });
    },
    async verifyIdToken(token, nonce) {
      if (options.disableIdTokenSignIn) return false;
      if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
      const { kid, alg: jwtAlg } = decodeProtectedHeader(token);
      if (!kid || !jwtAlg) return false;
      const { payload: jwtClaims } = await jwtVerify(token, await getGooglePublicKey(kid), {
        algorithms: [jwtAlg],
        issuer: ["https://accounts.google.com", "accounts.google.com"],
        audience: options.clientId,
        maxTokenAge: "1h"
      });
      if (nonce && jwtClaims.nonce !== nonce) return false;
      return true;
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      if (!token.idToken) return null;
      const user2 = decodeJwt(token.idToken);
      const userMap = await options.mapProfileToUser?.(user2);
      return {
        user: {
          id: user2.sub,
          name: user2.name,
          email: user2.email,
          image: user2.picture,
          emailVerified: user2.email_verified,
          ...userMap
        },
        data: user2
      };
    },
    options
  };
};
const getGooglePublicKey = async (kid) => {
  const { data } = await betterFetch("https://www.googleapis.com/oauth2/v3/certs");
  if (!data?.keys) throw new APIError("BAD_REQUEST", { message: "Keys not found" });
  const jwk = data.keys.find((key) => key.kid === kid);
  if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
  return await importJWK(jwk, jwk.alg);
};
const huggingface = (options) => {
  return {
    id: "huggingface",
    name: "Hugging Face",
    createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : [
        "openid",
        "profile",
        "email"
      ];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "huggingface",
        options,
        authorizationEndpoint: "https://huggingface.co/oauth/authorize",
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint: "https://huggingface.co/oauth/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://huggingface.co/oauth/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://huggingface.co/oauth/userinfo", {
        method: "GET",
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });
      if (error2) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.sub,
          name: profile.name || profile.preferred_username,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified ?? false,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const kakao = (options) => {
  return {
    id: "kakao",
    name: "Kakao",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : [
        "account_email",
        "profile_image",
        "profile_nickname"
      ];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "kakao",
        options,
        authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
        scopes: _scopes,
        state,
        redirectURI
      });
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        redirectURI,
        options,
        tokenEndpoint: "https://kauth.kakao.com/oauth/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://kauth.kakao.com/oauth/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://kapi.kakao.com/v2/user/me", { headers: { Authorization: `Bearer ${token.accessToken}` } });
      if (error2 || !profile) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      const account2 = profile.kakao_account || {};
      const kakaoProfile = account2.profile || {};
      return {
        user: {
          id: String(profile.id),
          name: kakaoProfile.nickname || account2.name || void 0,
          email: account2.email,
          image: kakaoProfile.profile_image_url || kakaoProfile.thumbnail_image_url,
          emailVerified: !!account2.is_email_valid && !!account2.is_email_verified,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const kick = (options) => {
  return {
    id: "kick",
    name: "Kick",
    createAuthorizationURL({ state, scopes, redirectURI, codeVerifier }) {
      const _scopes = options.disableDefaultScope ? [] : ["user:read"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "kick",
        redirectURI,
        options,
        authorizationEndpoint: "https://id.kick.com/oauth/authorize",
        scopes: _scopes,
        codeVerifier,
        state
      });
    },
    async validateAuthorizationCode({ code: code2, redirectURI, codeVerifier }) {
      return validateAuthorizationCode({
        code: code2,
        redirectURI,
        options,
        tokenEndpoint: "https://id.kick.com/oauth/token",
        codeVerifier
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://id.kick.com/oauth/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data, error: error2 } = await betterFetch("https://api.kick.com/public/v1/users", {
        method: "GET",
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });
      if (error2) return null;
      const profile = data.data[0];
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.user_id,
          name: profile.name,
          email: profile.email,
          image: profile.profile_picture,
          emailVerified: false,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const line = (options) => {
  const authorizationEndpoint = "https://access.line.me/oauth2/v2.1/authorize";
  const tokenEndpoint = "https://api.line.me/oauth2/v2.1/token";
  const userInfoEndpoint = "https://api.line.me/oauth2/v2.1/userinfo";
  const verifyIdTokenEndpoint = "https://api.line.me/oauth2/v2.1/verify";
  return {
    id: "line",
    name: "LINE",
    async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, loginHint }) {
      const _scopes = options.disableDefaultScope ? [] : [
        "openid",
        "profile",
        "email"
      ];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return await createAuthorizationURL({
        id: "line",
        options,
        authorizationEndpoint,
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI,
        loginHint
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientSecret: options.clientSecret
        },
        tokenEndpoint
      });
    },
    async verifyIdToken(token, nonce) {
      if (options.disableIdTokenSignIn) return false;
      if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
      const body = new URLSearchParams();
      body.set("id_token", token);
      body.set("client_id", options.clientId);
      if (nonce) body.set("nonce", nonce);
      const { data, error: error2 } = await betterFetch(verifyIdTokenEndpoint, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body
      });
      if (error2 || !data) return false;
      if (data.aud !== options.clientId) return false;
      if (data.nonce && data.nonce !== nonce) return false;
      return true;
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      let profile = null;
      if (token.idToken) try {
        profile = decodeJwt(token.idToken);
      } catch {
      }
      if (!profile) {
        const { data } = await betterFetch(userInfoEndpoint, { headers: { authorization: `Bearer ${token.accessToken}` } });
        profile = data || null;
      }
      if (!profile) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      const id = profile.sub || profile.userId;
      const name = profile.name || profile.displayName;
      const image = profile.picture || profile.pictureUrl || void 0;
      return {
        user: {
          id,
          name,
          email: profile.email,
          image,
          emailVerified: false,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const linear = (options) => {
  const tokenEndpoint = "https://api.linear.app/oauth/token";
  return {
    id: "linear",
    name: "Linear",
    createAuthorizationURL({ state, scopes, loginHint, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["read"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "linear",
        options,
        authorizationEndpoint: "https://linear.app/oauth/authorize",
        scopes: _scopes,
        state,
        redirectURI,
        loginHint
      });
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://api.linear.app/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.accessToken}`
        },
        body: JSON.stringify({ query: `
							query {
								viewer {
									id
									name
									email
									avatarUrl
									active
									createdAt
									updatedAt
								}
							}
						` })
      });
      if (error2 || !profile?.data?.viewer) return null;
      const userData = profile.data.viewer;
      const userMap = await options.mapProfileToUser?.(userData);
      return {
        user: {
          id: profile.data.viewer.id,
          name: profile.data.viewer.name,
          email: profile.data.viewer.email,
          image: profile.data.viewer.avatarUrl,
          emailVerified: false,
          ...userMap
        },
        data: userData
      };
    },
    options
  };
};
const linkedin = (options) => {
  const authorizationEndpoint = "https://www.linkedin.com/oauth/v2/authorization";
  const tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";
  return {
    id: "linkedin",
    name: "Linkedin",
    createAuthorizationURL: async ({ state, scopes, redirectURI, loginHint }) => {
      const _scopes = options.disableDefaultScope ? [] : [
        "profile",
        "email",
        "openid"
      ];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return await createAuthorizationURL({
        id: "linkedin",
        options,
        authorizationEndpoint,
        scopes: _scopes,
        state,
        loginHint,
        redirectURI
      });
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      return await validateAuthorizationCode({
        code: code2,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://api.linkedin.com/v2/userinfo", {
        method: "GET",
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });
      if (error2) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          emailVerified: profile.email_verified || false,
          image: profile.picture,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const microsoft = (options) => {
  const tenant = options.tenantId || "common";
  const authority = options.authority || "https://login.microsoftonline.com";
  const authorizationEndpoint = `${authority}/${tenant}/oauth2/v2.0/authorize`;
  const tokenEndpoint = `${authority}/${tenant}/oauth2/v2.0/token`;
  return {
    id: "microsoft",
    name: "Microsoft EntraID",
    createAuthorizationURL(data) {
      const scopes = options.disableDefaultScope ? [] : [
        "openid",
        "profile",
        "email",
        "User.Read",
        "offline_access"
      ];
      if (options.scope) scopes.push(...options.scope);
      if (data.scopes) scopes.push(...data.scopes);
      return createAuthorizationURL({
        id: "microsoft",
        options,
        authorizationEndpoint,
        state: data.state,
        codeVerifier: data.codeVerifier,
        scopes,
        redirectURI: data.redirectURI,
        prompt: options.prompt,
        loginHint: data.loginHint
      });
    },
    validateAuthorizationCode({ code: code2, codeVerifier, redirectURI }) {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      if (!token.idToken) return null;
      const user2 = decodeJwt(token.idToken);
      const profilePhotoSize = options.profilePhotoSize || 48;
      await betterFetch(`https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`, {
        headers: { Authorization: `Bearer ${token.accessToken}` },
        async onResponse(context) {
          if (options.disableProfilePhoto || !context.response.ok) return;
          try {
            const pictureBuffer = await context.response.clone().arrayBuffer();
            user2.picture = `data:image/jpeg;base64, ${base64.encode(pictureBuffer)}`;
          } catch (e2) {
            logger.error(e2 && typeof e2 === "object" && "name" in e2 ? e2.name : "", e2);
          }
        }
      });
      const userMap = await options.mapProfileToUser?.(user2);
      const emailVerified = user2.email_verified !== void 0 ? user2.email_verified : user2.email && (user2.verified_primary_email?.includes(user2.email) || user2.verified_secondary_email?.includes(user2.email)) ? true : false;
      return {
        user: {
          id: user2.sub,
          name: user2.name,
          email: user2.email,
          image: user2.picture,
          emailVerified,
          ...userMap
        },
        data: user2
      };
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      const scopes = options.disableDefaultScope ? [] : [
        "openid",
        "profile",
        "email",
        "User.Read",
        "offline_access"
      ];
      if (options.scope) scopes.push(...options.scope);
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientSecret: options.clientSecret
        },
        extraParams: { scope: scopes.join(" ") },
        tokenEndpoint
      });
    },
    options
  };
};
const naver = (options) => {
  return {
    id: "naver",
    name: "Naver",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["profile", "email"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "naver",
        options,
        authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
        scopes: _scopes,
        state,
        redirectURI
      });
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        redirectURI,
        options,
        tokenEndpoint: "https://nid.naver.com/oauth2.0/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://nid.naver.com/oauth2.0/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://openapi.naver.com/v1/nid/me", { headers: { Authorization: `Bearer ${token.accessToken}` } });
      if (error2 || !profile || profile.resultcode !== "00") return null;
      const userMap = await options.mapProfileToUser?.(profile);
      const res = profile.response || {};
      return {
        user: {
          id: res.id,
          name: res.name || res.nickname,
          email: res.email,
          image: res.profile_image,
          emailVerified: false,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const notion = (options) => {
  const tokenEndpoint = "https://api.notion.com/v1/oauth/token";
  return {
    id: "notion",
    name: "Notion",
    createAuthorizationURL({ state, scopes, loginHint, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : [];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "notion",
        options,
        authorizationEndpoint: "https://api.notion.com/v1/oauth/authorize",
        scopes: _scopes,
        state,
        redirectURI,
        loginHint,
        additionalParams: { owner: "user" }
      });
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        redirectURI,
        options,
        tokenEndpoint,
        authentication: "basic"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://api.notion.com/v1/users/me", { headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Notion-Version": "2022-06-28"
      } });
      if (error2 || !profile) return null;
      const userProfile = profile.bot?.owner?.user;
      if (!userProfile) return null;
      const userMap = await options.mapProfileToUser?.(userProfile);
      return {
        user: {
          id: userProfile.id,
          name: userProfile.name || "Notion User",
          email: userProfile.person?.email || null,
          image: userProfile.avatar_url,
          emailVerified: false,
          ...userMap
        },
        data: userProfile
      };
    },
    options
  };
};
const paybin = (options) => {
  const issuer = options.issuer || "https://idp.paybin.io";
  const authorizationEndpoint = `${issuer}/oauth2/authorize`;
  const tokenEndpoint = `${issuer}/oauth2/token`;
  return {
    id: "paybin",
    name: "Paybin",
    async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, loginHint }) {
      if (!options.clientId || !options.clientSecret) {
        logger.error("Client Id and Client Secret is required for Paybin. Make sure to provide them in the options.");
        throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
      }
      if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Paybin");
      const _scopes = options.disableDefaultScope ? [] : [
        "openid",
        "email",
        "profile"
      ];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return await createAuthorizationURL({
        id: "paybin",
        options,
        authorizationEndpoint,
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI,
        prompt: options.prompt,
        loginHint
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      if (!token.idToken) return null;
      const user2 = decodeJwt(token.idToken);
      const userMap = await options.mapProfileToUser?.(user2);
      return {
        user: {
          id: user2.sub,
          name: user2.name || user2.preferred_username || (user2.email ? user2.email.split("@")[0] : "User") || "User",
          email: user2.email,
          image: user2.picture,
          emailVerified: user2.email_verified || false,
          ...userMap
        },
        data: user2
      };
    },
    options
  };
};
const paypal = (options) => {
  const isSandbox = (options.environment || "sandbox") === "sandbox";
  const authorizationEndpoint = isSandbox ? "https://www.sandbox.paypal.com/signin/authorize" : "https://www.paypal.com/signin/authorize";
  const tokenEndpoint = isSandbox ? "https://api-m.sandbox.paypal.com/v1/oauth2/token" : "https://api-m.paypal.com/v1/oauth2/token";
  const userInfoEndpoint = isSandbox ? "https://api-m.sandbox.paypal.com/v1/identity/oauth2/userinfo" : "https://api-m.paypal.com/v1/identity/oauth2/userinfo";
  return {
    id: "paypal",
    name: "PayPal",
    async createAuthorizationURL({ state, codeVerifier, redirectURI }) {
      if (!options.clientId || !options.clientSecret) {
        logger.error("Client Id and Client Secret is required for PayPal. Make sure to provide them in the options.");
        throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
      }
      return await createAuthorizationURL({
        id: "paypal",
        options,
        authorizationEndpoint,
        scopes: [],
        state,
        codeVerifier,
        redirectURI,
        prompt: options.prompt
      });
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      const credentials = base64.encode(`${options.clientId}:${options.clientSecret}`);
      try {
        const response = await betterFetch(tokenEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Basic ${credentials}`,
            Accept: "application/json",
            "Accept-Language": "en_US",
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code2,
            redirect_uri: redirectURI
          }).toString()
        });
        if (!response.data) throw new BetterAuthError("FAILED_TO_GET_ACCESS_TOKEN");
        const data = response.data;
        return {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          accessTokenExpiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1e3) : void 0,
          idToken: data.id_token
        };
      } catch (error2) {
        logger.error("PayPal token exchange failed:", error2);
        throw new BetterAuthError("FAILED_TO_GET_ACCESS_TOKEN");
      }
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      const credentials = base64.encode(`${options.clientId}:${options.clientSecret}`);
      try {
        const response = await betterFetch(tokenEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Basic ${credentials}`,
            Accept: "application/json",
            "Accept-Language": "en_US",
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken2
          }).toString()
        });
        if (!response.data) throw new BetterAuthError("FAILED_TO_REFRESH_ACCESS_TOKEN");
        const data = response.data;
        return {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          accessTokenExpiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1e3) : void 0
        };
      } catch (error2) {
        logger.error("PayPal token refresh failed:", error2);
        throw new BetterAuthError("FAILED_TO_REFRESH_ACCESS_TOKEN");
      }
    },
    async verifyIdToken(token, nonce) {
      if (options.disableIdTokenSignIn) return false;
      if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
      try {
        return !!decodeJwt(token).sub;
      } catch (error2) {
        logger.error("Failed to verify PayPal ID token:", error2);
        return false;
      }
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      if (!token.accessToken) {
        logger.error("Access token is required to fetch PayPal user info");
        return null;
      }
      try {
        const response = await betterFetch(`${userInfoEndpoint}?schema=paypalv1.1`, { headers: {
          Authorization: `Bearer ${token.accessToken}`,
          Accept: "application/json"
        } });
        if (!response.data) {
          logger.error("Failed to fetch user info from PayPal");
          return null;
        }
        const userInfo = response.data;
        const userMap = await options.mapProfileToUser?.(userInfo);
        return {
          user: {
            id: userInfo.user_id,
            name: userInfo.name,
            email: userInfo.email,
            image: userInfo.picture,
            emailVerified: userInfo.email_verified,
            ...userMap
          },
          data: userInfo
        };
      } catch (error2) {
        logger.error("Failed to fetch user info from PayPal:", error2);
        return null;
      }
    },
    options
  };
};
const polar = (options) => {
  return {
    id: "polar",
    name: "Polar",
    createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : [
        "openid",
        "profile",
        "email"
      ];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "polar",
        options,
        authorizationEndpoint: "https://polar.sh/oauth2/authorize",
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI,
        prompt: options.prompt
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint: "https://api.polar.sh/v1/oauth2/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://api.polar.sh/v1/oauth2/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://api.polar.sh/v1/oauth2/userinfo", { headers: { Authorization: `Bearer ${token.accessToken}` } });
      if (error2) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.public_name || profile.username,
          email: profile.email,
          image: profile.avatar_url,
          emailVerified: profile.email_verified ?? false,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const reddit = (options) => {
  return {
    id: "reddit",
    name: "Reddit",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["identity"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "reddit",
        options,
        authorizationEndpoint: "https://www.reddit.com/api/v1/authorize",
        scopes: _scopes,
        state,
        redirectURI,
        duration: options.duration
      });
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code2,
        redirect_uri: options.redirectURI || redirectURI
      });
      const { data, error: error2 } = await betterFetch("https://www.reddit.com/api/v1/access_token", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          accept: "text/plain",
          "user-agent": "better-auth",
          Authorization: `Basic ${base64.encode(`${options.clientId}:${options.clientSecret}`)}`
        },
        body: body.toString()
      });
      if (error2) throw error2;
      return getOAuth2Tokens(data);
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        authentication: "basic",
        tokenEndpoint: "https://www.reddit.com/api/v1/access_token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://oauth.reddit.com/api/v1/me", { headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "User-Agent": "better-auth"
      } });
      if (error2) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.oauth_client_id,
          emailVerified: profile.has_verified_email,
          image: profile.icon_img?.split("?")[0],
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const roblox = (options) => {
  return {
    id: "roblox",
    name: "Roblox",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["openid", "profile"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return new URL(`https://apis.roblox.com/oauth/v1/authorize?scope=${_scopes.join("+")}&response_type=code&client_id=${options.clientId}&redirect_uri=${encodeURIComponent(options.redirectURI || redirectURI)}&state=${state}&prompt=${options.prompt || "select_account consent"}`);
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        redirectURI: options.redirectURI || redirectURI,
        options,
        tokenEndpoint: "https://apis.roblox.com/oauth/v1/token",
        authentication: "post"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://apis.roblox.com/oauth/v1/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://apis.roblox.com/oauth/v1/userinfo", { headers: { authorization: `Bearer ${token.accessToken}` } });
      if (error2) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.sub,
          name: profile.nickname || profile.preferred_username || "",
          image: profile.picture,
          email: profile.preferred_username || null,
          emailVerified: false,
          ...userMap
        },
        data: { ...profile }
      };
    },
    options
  };
};
const salesforce = (options) => {
  const isSandbox = (options.environment ?? "production") === "sandbox";
  const authorizationEndpoint = options.loginUrl ? `https://${options.loginUrl}/services/oauth2/authorize` : isSandbox ? "https://test.salesforce.com/services/oauth2/authorize" : "https://login.salesforce.com/services/oauth2/authorize";
  const tokenEndpoint = options.loginUrl ? `https://${options.loginUrl}/services/oauth2/token` : isSandbox ? "https://test.salesforce.com/services/oauth2/token" : "https://login.salesforce.com/services/oauth2/token";
  const userInfoEndpoint = options.loginUrl ? `https://${options.loginUrl}/services/oauth2/userinfo` : isSandbox ? "https://test.salesforce.com/services/oauth2/userinfo" : "https://login.salesforce.com/services/oauth2/userinfo";
  return {
    id: "salesforce",
    name: "Salesforce",
    async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      if (!options.clientId || !options.clientSecret) {
        logger.error("Client Id and Client Secret are required for Salesforce. Make sure to provide them in the options.");
        throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
      }
      if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Salesforce");
      const _scopes = options.disableDefaultScope ? [] : [
        "openid",
        "email",
        "profile"
      ];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "salesforce",
        options,
        authorizationEndpoint,
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI: options.redirectURI || redirectURI
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI: options.redirectURI || redirectURI,
        options,
        tokenEndpoint
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientSecret: options.clientSecret
        },
        tokenEndpoint
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      try {
        const { data: user2 } = await betterFetch(userInfoEndpoint, { headers: { Authorization: `Bearer ${token.accessToken}` } });
        if (!user2) {
          logger.error("Failed to fetch user info from Salesforce");
          return null;
        }
        const userMap = await options.mapProfileToUser?.(user2);
        return {
          user: {
            id: user2.user_id,
            name: user2.name,
            email: user2.email,
            image: user2.photos?.picture || user2.photos?.thumbnail,
            emailVerified: user2.email_verified ?? false,
            ...userMap
          },
          data: user2
        };
      } catch (error2) {
        logger.error("Failed to fetch user info from Salesforce:", error2);
        return null;
      }
    },
    options
  };
};
const slack = (options) => {
  return {
    id: "slack",
    name: "Slack",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : [
        "openid",
        "profile",
        "email"
      ];
      if (scopes) _scopes.push(...scopes);
      if (options.scope) _scopes.push(...options.scope);
      const url = new URL("https://slack.com/openid/connect/authorize");
      url.searchParams.set("scope", _scopes.join(" "));
      url.searchParams.set("response_type", "code");
      url.searchParams.set("client_id", options.clientId);
      url.searchParams.set("redirect_uri", options.redirectURI || redirectURI);
      url.searchParams.set("state", state);
      return url;
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        redirectURI,
        options,
        tokenEndpoint: "https://slack.com/api/openid.connect.token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://slack.com/api/openid.connect.token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://slack.com/api/openid.connect.userInfo", { headers: { authorization: `Bearer ${token.accessToken}` } });
      if (error2) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile["https://slack.com/user_id"],
          name: profile.name || "",
          email: profile.email,
          emailVerified: profile.email_verified,
          image: profile.picture || profile["https://slack.com/user_image_512"],
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const spotify = (options) => {
  return {
    id: "spotify",
    name: "Spotify",
    createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["user-read-email"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "spotify",
        options,
        authorizationEndpoint: "https://accounts.spotify.com/authorize",
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint: "https://accounts.spotify.com/api/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://accounts.spotify.com/api/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });
      if (error2) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: profile.images[0]?.url,
          emailVerified: false,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const tiktok = (options) => {
  return {
    id: "tiktok",
    name: "TikTok",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["user.info.profile"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return new URL(`https://www.tiktok.com/v2/auth/authorize?scope=${_scopes.join(",")}&response_type=code&client_key=${options.clientKey}&redirect_uri=${encodeURIComponent(options.redirectURI || redirectURI)}&state=${state}`);
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        redirectURI: options.redirectURI || redirectURI,
        options: {
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://open.tiktokapis.com/v2/oauth/token/"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: { clientSecret: options.clientSecret },
        tokenEndpoint: "https://open.tiktokapis.com/v2/oauth/token/",
        authentication: "post",
        extraParams: { client_key: options.clientKey }
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch(`https://open.tiktokapis.com/v2/user/info/?fields=${[
        "open_id",
        "avatar_large_url",
        "display_name",
        "username"
      ].join(",")}`, { headers: { authorization: `Bearer ${token.accessToken}` } });
      if (error2) return null;
      return {
        user: {
          email: profile.data.user.email || profile.data.user.username,
          id: profile.data.user.open_id,
          name: profile.data.user.display_name || profile.data.user.username,
          image: profile.data.user.avatar_large_url,
          emailVerified: false
        },
        data: profile
      };
    },
    options
  };
};
const twitch = (options) => {
  return {
    id: "twitch",
    name: "Twitch",
    createAuthorizationURL({ state, scopes, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["user:read:email", "openid"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "twitch",
        redirectURI,
        options,
        authorizationEndpoint: "https://id.twitch.tv/oauth2/authorize",
        scopes: _scopes,
        state,
        claims: options.claims || [
          "email",
          "email_verified",
          "preferred_username",
          "picture"
        ]
      });
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        redirectURI,
        options,
        tokenEndpoint: "https://id.twitch.tv/oauth2/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://id.twitch.tv/oauth2/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const idToken = token.idToken;
      if (!idToken) {
        logger.error("No idToken found in token");
        return null;
      }
      const profile = decodeJwt(idToken);
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.sub,
          name: profile.preferred_username,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const twitter = (options) => {
  return {
    id: "twitter",
    name: "Twitter",
    createAuthorizationURL(data) {
      const _scopes = options.disableDefaultScope ? [] : [
        "users.read",
        "tweet.read",
        "offline.access",
        "users.email"
      ];
      if (options.scope) _scopes.push(...options.scope);
      if (data.scopes) _scopes.push(...data.scopes);
      return createAuthorizationURL({
        id: "twitter",
        options,
        authorizationEndpoint: "https://x.com/i/oauth2/authorize",
        scopes: _scopes,
        state: data.state,
        codeVerifier: data.codeVerifier,
        redirectURI: data.redirectURI
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        authentication: "basic",
        redirectURI,
        options,
        tokenEndpoint: "https://api.x.com/2/oauth2/token"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        authentication: "basic",
        tokenEndpoint: "https://api.x.com/2/oauth2/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: profileError } = await betterFetch("https://api.x.com/2/users/me?user.fields=profile_image_url", {
        method: "GET",
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });
      if (profileError) return null;
      const { data: emailData, error: emailError } = await betterFetch("https://api.x.com/2/users/me?user.fields=confirmed_email", {
        method: "GET",
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });
      let emailVerified = false;
      if (!emailError && emailData?.data?.confirmed_email) {
        profile.data.email = emailData.data.confirmed_email;
        emailVerified = true;
      }
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.data.id,
          name: profile.data.name,
          email: profile.data.email || profile.data.username || null,
          image: profile.data.profile_image_url,
          emailVerified,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const vercel = (options) => {
  return {
    id: "vercel",
    name: "Vercel",
    createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Vercel");
      let _scopes = void 0;
      if (options.scope !== void 0 || scopes !== void 0) {
        _scopes = [];
        if (options.scope) _scopes.push(...options.scope);
        if (scopes) _scopes.push(...scopes);
      }
      return createAuthorizationURL({
        id: "vercel",
        options,
        authorizationEndpoint: "https://vercel.com/oauth/authorize",
        scopes: _scopes,
        state,
        codeVerifier,
        redirectURI
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI,
        options,
        tokenEndpoint: "https://api.vercel.com/login/oauth/token"
      });
    },
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://api.vercel.com/login/oauth/userinfo", { headers: { Authorization: `Bearer ${token.accessToken}` } });
      if (error2 || !profile) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified ?? false,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const vk = (options) => {
  return {
    id: "vk",
    name: "VK",
    async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
      const _scopes = options.disableDefaultScope ? [] : ["email", "phone"];
      if (options.scope) _scopes.push(...options.scope);
      if (scopes) _scopes.push(...scopes);
      return createAuthorizationURL({
        id: "vk",
        options,
        authorizationEndpoint: "https://id.vk.com/authorize",
        scopes: _scopes,
        state,
        redirectURI,
        codeVerifier
      });
    },
    validateAuthorizationCode: async ({ code: code2, codeVerifier, redirectURI, deviceId }) => {
      return validateAuthorizationCode({
        code: code2,
        codeVerifier,
        redirectURI: options.redirectURI || redirectURI,
        options,
        deviceId,
        tokenEndpoint: "https://id.vk.com/oauth2/auth"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => {
      return refreshAccessToken({
        refreshToken: refreshToken2,
        options: {
          clientId: options.clientId,
          clientKey: options.clientKey,
          clientSecret: options.clientSecret
        },
        tokenEndpoint: "https://id.vk.com/oauth2/auth"
      });
    },
    async getUserInfo(data) {
      if (options.getUserInfo) return options.getUserInfo(data);
      if (!data.accessToken) return null;
      const formBody = new URLSearchParams({
        access_token: data.accessToken,
        client_id: options.clientId
      }).toString();
      const { data: profile, error: error2 } = await betterFetch("https://id.vk.com/oauth2/user_info", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody
      });
      if (error2) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      if (!profile.user.email && !userMap?.email) return null;
      return {
        user: {
          id: profile.user.user_id,
          first_name: profile.user.first_name,
          last_name: profile.user.last_name,
          email: profile.user.email,
          image: profile.user.avatar,
          emailVerified: false,
          birthday: profile.user.birthday,
          sex: profile.user.sex,
          name: `${profile.user.first_name} ${profile.user.last_name}`,
          ...userMap
        },
        data: profile
      };
    },
    options
  };
};
const zoom = (userOptions) => {
  const options = {
    pkce: true,
    ...userOptions
  };
  return {
    id: "zoom",
    name: "Zoom",
    createAuthorizationURL: async ({ state, redirectURI, codeVerifier }) => {
      const params = new URLSearchParams({
        response_type: "code",
        redirect_uri: options.redirectURI ? options.redirectURI : redirectURI,
        client_id: options.clientId,
        state
      });
      if (options.pkce) {
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        params.set("code_challenge_method", "S256");
        params.set("code_challenge", codeChallenge);
      }
      const url = new URL("https://zoom.us/oauth/authorize");
      url.search = params.toString();
      return url;
    },
    validateAuthorizationCode: async ({ code: code2, redirectURI, codeVerifier }) => {
      return validateAuthorizationCode({
        code: code2,
        redirectURI: options.redirectURI || redirectURI,
        codeVerifier,
        options,
        tokenEndpoint: "https://zoom.us/oauth/token",
        authentication: "post"
      });
    },
    refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken2) => refreshAccessToken({
      refreshToken: refreshToken2,
      options: {
        clientId: options.clientId,
        clientKey: options.clientKey,
        clientSecret: options.clientSecret
      },
      tokenEndpoint: "https://zoom.us/oauth/token"
    }),
    async getUserInfo(token) {
      if (options.getUserInfo) return options.getUserInfo(token);
      const { data: profile, error: error2 } = await betterFetch("https://api.zoom.us/v2/users/me", { headers: { authorization: `Bearer ${token.accessToken}` } });
      if (error2) return null;
      const userMap = await options.mapProfileToUser?.(profile);
      return {
        user: {
          id: profile.id,
          name: profile.display_name,
          image: profile.pic_url,
          email: profile.email,
          emailVerified: Boolean(profile.verified),
          ...userMap
        },
        data: { ...profile }
      };
    }
  };
};
const socialProviders = {
  apple,
  atlassian,
  cognito,
  discord,
  facebook,
  figma,
  github,
  microsoft,
  google,
  huggingface,
  slack,
  spotify,
  twitch,
  twitter,
  dropbox,
  kick,
  linear,
  linkedin,
  gitlab,
  tiktok,
  reddit,
  roblox,
  salesforce,
  vk,
  zoom,
  notion,
  kakao,
  naver,
  line,
  paybin,
  paypal,
  polar,
  vercel
};
const socialProviderList = Object.keys(socialProviders);
const SocialProviderListEnum = z$1.enum(socialProviderList).or(z$1.string());
const listUserAccounts = createAuthEndpoint("/list-accounts", {
  method: "GET",
  use: [sessionMiddleware],
  metadata: { openapi: {
    operationId: "listUserAccounts",
    description: "List all accounts linked to the user",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            providerId: { type: "string" },
            createdAt: {
              type: "string",
              format: "date-time"
            },
            updatedAt: {
              type: "string",
              format: "date-time"
            },
            accountId: { type: "string" },
            userId: { type: "string" },
            scopes: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: [
            "id",
            "providerId",
            "createdAt",
            "updatedAt",
            "accountId",
            "userId",
            "scopes"
          ]
        }
      } } }
    } }
  } }
}, async (c2) => {
  const session2 = c2.context.session;
  const accounts = await c2.context.internalAdapter.findAccounts(session2.user.id);
  return c2.json(accounts.map((a2) => {
    const { scope, ...parsed } = parseAccountOutput(c2.context.options, a2);
    return {
      ...parsed,
      scopes: scope?.split(",") || []
    };
  }));
});
const linkSocialAccount = createAuthEndpoint("/link-social", {
  method: "POST",
  requireHeaders: true,
  body: z$1.object({
    callbackURL: z$1.string().meta({ description: "The URL to redirect to after the user has signed in" }).optional(),
    provider: SocialProviderListEnum,
    idToken: z$1.object({
      token: z$1.string(),
      nonce: z$1.string().optional(),
      accessToken: z$1.string().optional(),
      refreshToken: z$1.string().optional(),
      scopes: z$1.array(z$1.string()).optional()
    }).optional(),
    requestSignUp: z$1.boolean().optional(),
    scopes: z$1.array(z$1.string()).meta({ description: "Additional scopes to request from the provider" }).optional(),
    errorCallbackURL: z$1.string().meta({ description: "The URL to redirect to if there is an error during the link process" }).optional(),
    disableRedirect: z$1.boolean().meta({ description: "Disable automatic redirection to the provider. Useful for handling the redirection yourself" }).optional(),
    additionalData: z$1.record(z$1.string(), z$1.any()).optional()
  }),
  use: [sessionMiddleware],
  metadata: { openapi: {
    description: "Link a social account to the user",
    operationId: "linkSocialAccount",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The authorization URL to redirect the user to"
          },
          redirect: {
            type: "boolean",
            description: "Indicates if the user should be redirected to the authorization URL"
          },
          status: { type: "boolean" }
        },
        required: ["redirect"]
      } } }
    } }
  } }
}, async (c2) => {
  const session2 = c2.context.session;
  const provider = c2.context.socialProviders.find((p2) => p2.id === c2.body.provider);
  if (!provider) {
    c2.context.logger.error("Provider not found. Make sure to add the provider in your auth config", { provider: c2.body.provider });
    throw new APIError("NOT_FOUND", { message: BASE_ERROR_CODES.PROVIDER_NOT_FOUND });
  }
  if (c2.body.idToken) {
    if (!provider.verifyIdToken) {
      c2.context.logger.error("Provider does not support id token verification", { provider: c2.body.provider });
      throw new APIError("NOT_FOUND", { message: BASE_ERROR_CODES.ID_TOKEN_NOT_SUPPORTED });
    }
    const { token, nonce } = c2.body.idToken;
    if (!await provider.verifyIdToken(token, nonce)) {
      c2.context.logger.error("Invalid id token", { provider: c2.body.provider });
      throw new APIError("UNAUTHORIZED", { message: BASE_ERROR_CODES.INVALID_TOKEN });
    }
    const linkingUserInfo = await provider.getUserInfo({
      idToken: token,
      accessToken: c2.body.idToken.accessToken,
      refreshToken: c2.body.idToken.refreshToken
    });
    if (!linkingUserInfo || !linkingUserInfo?.user) {
      c2.context.logger.error("Failed to get user info", { provider: c2.body.provider });
      throw new APIError("UNAUTHORIZED", { message: BASE_ERROR_CODES.FAILED_TO_GET_USER_INFO });
    }
    const linkingUserId = String(linkingUserInfo.user.id);
    if (!linkingUserInfo.user.email) {
      c2.context.logger.error("User email not found", { provider: c2.body.provider });
      throw new APIError("UNAUTHORIZED", { message: BASE_ERROR_CODES.USER_EMAIL_NOT_FOUND });
    }
    if ((await c2.context.internalAdapter.findAccounts(session2.user.id)).find((a2) => a2.providerId === provider.id && a2.accountId === linkingUserId)) return c2.json({
      url: "",
      status: true,
      redirect: false
    });
    if (!c2.context.options.account?.accountLinking?.trustedProviders?.includes(provider.id) && !linkingUserInfo.user.emailVerified || c2.context.options.account?.accountLinking?.enabled === false) throw new APIError("UNAUTHORIZED", { message: "Account not linked - linking not allowed" });
    if (linkingUserInfo.user.email !== session2.user.email && c2.context.options.account?.accountLinking?.allowDifferentEmails !== true) throw new APIError("UNAUTHORIZED", { message: "Account not linked - different emails not allowed" });
    try {
      await c2.context.internalAdapter.createAccount({
        userId: session2.user.id,
        providerId: provider.id,
        accountId: linkingUserId,
        accessToken: c2.body.idToken.accessToken,
        idToken: token,
        refreshToken: c2.body.idToken.refreshToken,
        scope: c2.body.idToken.scopes?.join(",")
      });
    } catch {
      throw new APIError("EXPECTATION_FAILED", { message: "Account not linked - unable to create account" });
    }
    if (c2.context.options.account?.accountLinking?.updateUserInfoOnLink === true) try {
      await c2.context.internalAdapter.updateUser(session2.user.id, {
        name: linkingUserInfo.user?.name,
        image: linkingUserInfo.user?.image
      });
    } catch (e2) {
      console.warn("Could not update user - " + e2.toString());
    }
    return c2.json({
      url: "",
      status: true,
      redirect: false
    });
  }
  const state = await generateState(c2, {
    userId: session2.user.id,
    email: session2.user.email
  }, c2.body.additionalData);
  const url = await provider.createAuthorizationURL({
    state: state.state,
    codeVerifier: state.codeVerifier,
    redirectURI: `${c2.context.baseURL}/callback/${provider.id}`,
    scopes: c2.body.scopes
  });
  if (!c2.body.disableRedirect) c2.setHeader("Location", url.toString());
  return c2.json({
    url: url.toString(),
    redirect: !c2.body.disableRedirect
  });
});
const unlinkAccount = createAuthEndpoint("/unlink-account", {
  method: "POST",
  body: z$1.object({
    providerId: z$1.string(),
    accountId: z$1.string().optional()
  }),
  use: [freshSessionMiddleware],
  metadata: { openapi: {
    description: "Unlink an account",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { status: { type: "boolean" } }
      } } }
    } }
  } }
}, async (ctx) => {
  const { providerId, accountId } = ctx.body;
  const accounts = await ctx.context.internalAdapter.findAccounts(ctx.context.session.user.id);
  if (accounts.length === 1 && !ctx.context.options.account?.accountLinking?.allowUnlinkingAll) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.FAILED_TO_UNLINK_LAST_ACCOUNT });
  const accountExist = accounts.find((account2) => accountId ? account2.accountId === accountId && account2.providerId === providerId : account2.providerId === providerId);
  if (!accountExist) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.ACCOUNT_NOT_FOUND });
  await ctx.context.internalAdapter.deleteAccount(accountExist.id);
  return ctx.json({ status: true });
});
const getAccessToken = createAuthEndpoint("/get-access-token", {
  method: "POST",
  body: z$1.object({
    providerId: z$1.string().meta({ description: "The provider ID for the OAuth provider" }),
    accountId: z$1.string().meta({ description: "The account ID associated with the refresh token" }).optional(),
    userId: z$1.string().meta({ description: "The user ID associated with the account" }).optional()
  }),
  metadata: { openapi: {
    description: "Get a valid access token, doing a refresh if needed",
    responses: {
      200: {
        description: "A Valid access token",
        content: { "application/json": { schema: {
          type: "object",
          properties: {
            tokenType: { type: "string" },
            idToken: { type: "string" },
            accessToken: { type: "string" },
            accessTokenExpiresAt: {
              type: "string",
              format: "date-time"
            }
          }
        } } }
      },
      400: { description: "Invalid refresh token or provider configuration" }
    }
  } }
}, async (ctx) => {
  const { providerId, accountId, userId } = ctx.body || {};
  const req = ctx.request;
  const session2 = await getSessionFromCtx(ctx);
  if (req && !session2) throw ctx.error("UNAUTHORIZED");
  const resolvedUserId = session2?.user?.id || userId;
  if (!resolvedUserId) throw ctx.error("UNAUTHORIZED");
  if (!ctx.context.socialProviders.find((p2) => p2.id === providerId)) throw new APIError("BAD_REQUEST", { message: `Provider ${providerId} is not supported.` });
  const accountData = await getAccountCookie(ctx);
  let account2 = void 0;
  if (accountData && providerId === accountData.providerId && (!accountId || accountData.id === accountId)) account2 = accountData;
  else account2 = (await ctx.context.internalAdapter.findAccounts(resolvedUserId)).find((acc) => accountId ? acc.id === accountId && acc.providerId === providerId : acc.providerId === providerId);
  if (!account2) throw new APIError("BAD_REQUEST", { message: "Account not found" });
  const provider = ctx.context.socialProviders.find((p2) => p2.id === providerId);
  if (!provider) throw new APIError("BAD_REQUEST", { message: `Provider ${providerId} not found.` });
  try {
    let newTokens = null;
    const accessTokenExpired = account2.accessTokenExpiresAt && new Date(account2.accessTokenExpiresAt).getTime() - Date.now() < 5e3;
    if (account2.refreshToken && accessTokenExpired && provider.refreshAccessToken) {
      const refreshToken$1 = await decryptOAuthToken(account2.refreshToken, ctx.context);
      newTokens = await provider.refreshAccessToken(refreshToken$1);
      const updatedData = {
        accessToken: await setTokenUtil(newTokens.accessToken, ctx.context),
        accessTokenExpiresAt: newTokens.accessTokenExpiresAt,
        refreshToken: await setTokenUtil(newTokens.refreshToken, ctx.context),
        refreshTokenExpiresAt: newTokens.refreshTokenExpiresAt
      };
      let updatedAccount = null;
      if (account2.id) updatedAccount = await ctx.context.internalAdapter.updateAccount(account2.id, updatedData);
      if (ctx.context.options.account?.storeAccountCookie) await setAccountCookie(ctx, {
        ...account2,
        ...updatedAccount ?? updatedData
      });
    }
    const accessTokenExpiresAt = (() => {
      if (newTokens?.accessTokenExpiresAt) {
        if (typeof newTokens.accessTokenExpiresAt === "string") return new Date(newTokens.accessTokenExpiresAt);
        return newTokens.accessTokenExpiresAt;
      }
      if (account2.accessTokenExpiresAt) {
        if (typeof account2.accessTokenExpiresAt === "string") return new Date(account2.accessTokenExpiresAt);
        return account2.accessTokenExpiresAt;
      }
    })();
    const tokens = {
      accessToken: newTokens?.accessToken ?? await decryptOAuthToken(account2.accessToken ?? "", ctx.context),
      accessTokenExpiresAt,
      scopes: account2.scope?.split(",") ?? [],
      idToken: newTokens?.idToken ?? account2.idToken ?? void 0
    };
    return ctx.json(tokens);
  } catch (error2) {
    throw new APIError("BAD_REQUEST", {
      message: "Failed to get a valid access token",
      cause: error2
    });
  }
});
const refreshToken = createAuthEndpoint("/refresh-token", {
  method: "POST",
  body: z$1.object({
    providerId: z$1.string().meta({ description: "The provider ID for the OAuth provider" }),
    accountId: z$1.string().meta({ description: "The account ID associated with the refresh token" }).optional(),
    userId: z$1.string().meta({ description: "The user ID associated with the account" }).optional()
  }),
  metadata: { openapi: {
    description: "Refresh the access token using a refresh token",
    responses: {
      200: {
        description: "Access token refreshed successfully",
        content: { "application/json": { schema: {
          type: "object",
          properties: {
            tokenType: { type: "string" },
            idToken: { type: "string" },
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
            accessTokenExpiresAt: {
              type: "string",
              format: "date-time"
            },
            refreshTokenExpiresAt: {
              type: "string",
              format: "date-time"
            }
          }
        } } }
      },
      400: { description: "Invalid refresh token or provider configuration" }
    }
  } }
}, async (ctx) => {
  const { providerId, accountId, userId } = ctx.body;
  const req = ctx.request;
  const session2 = await getSessionFromCtx(ctx);
  if (req && !session2) throw ctx.error("UNAUTHORIZED");
  const resolvedUserId = session2?.user?.id || userId;
  if (!resolvedUserId) throw new APIError("BAD_REQUEST", { message: `Either userId or session is required` });
  const provider = ctx.context.socialProviders.find((p2) => p2.id === providerId);
  if (!provider) throw new APIError("BAD_REQUEST", { message: `Provider ${providerId} not found.` });
  if (!provider.refreshAccessToken) throw new APIError("BAD_REQUEST", { message: `Provider ${providerId} does not support token refreshing.` });
  let account2 = void 0;
  const accountData = await getAccountCookie(ctx);
  if (accountData && (!providerId || providerId === accountData?.providerId)) account2 = accountData;
  else account2 = (await ctx.context.internalAdapter.findAccounts(resolvedUserId)).find((acc) => accountId ? acc.id === accountId && acc.providerId === providerId : acc.providerId === providerId);
  if (!account2) throw new APIError("BAD_REQUEST", { message: "Account not found" });
  let refreshToken$1 = void 0;
  if (accountData && providerId === accountData.providerId) refreshToken$1 = accountData.refreshToken ?? void 0;
  else refreshToken$1 = account2.refreshToken ?? void 0;
  if (!refreshToken$1) throw new APIError("BAD_REQUEST", { message: "Refresh token not found" });
  try {
    const decryptedRefreshToken = await decryptOAuthToken(refreshToken$1, ctx.context);
    const tokens = await provider.refreshAccessToken(decryptedRefreshToken);
    if (account2.id) {
      const updateData = {
        ...account2 || {},
        accessToken: await setTokenUtil(tokens.accessToken, ctx.context),
        refreshToken: await setTokenUtil(tokens.refreshToken, ctx.context),
        accessTokenExpiresAt: tokens.accessTokenExpiresAt,
        refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
        scope: tokens.scopes?.join(",") || account2.scope,
        idToken: tokens.idToken || account2.idToken
      };
      await ctx.context.internalAdapter.updateAccount(account2.id, updateData);
    }
    if (accountData && providerId === accountData.providerId && ctx.context.options.account?.storeAccountCookie) await setAccountCookie(ctx, {
      ...accountData,
      accessToken: await setTokenUtil(tokens.accessToken, ctx.context),
      refreshToken: await setTokenUtil(tokens.refreshToken, ctx.context),
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
      scope: tokens.scopes?.join(",") || accountData.scope,
      idToken: tokens.idToken || accountData.idToken
    });
    return ctx.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
      scope: tokens.scopes?.join(",") || account2.scope,
      idToken: tokens.idToken || account2.idToken,
      providerId: account2.providerId,
      accountId: account2.accountId
    });
  } catch (error2) {
    throw new APIError("BAD_REQUEST", {
      message: "Failed to refresh access token",
      cause: error2
    });
  }
});
const accountInfoQuerySchema = z$1.optional(z$1.object({ accountId: z$1.string().meta({ description: "The provider given account id for which to get the account info" }).optional() }));
const accountInfo = createAuthEndpoint("/account-info", {
  method: "GET",
  use: [sessionMiddleware],
  metadata: { openapi: {
    description: "Get the account info provided by the provider",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              image: { type: "string" },
              emailVerified: { type: "boolean" }
            },
            required: ["id", "emailVerified"]
          },
          data: {
            type: "object",
            properties: {},
            additionalProperties: true
          }
        },
        required: ["user", "data"],
        additionalProperties: false
      } } }
    } }
  } },
  query: accountInfoQuerySchema
}, async (ctx) => {
  const providedAccountId = ctx.query?.accountId;
  let account2 = void 0;
  if (!providedAccountId) {
    if (ctx.context.options.account?.storeAccountCookie) {
      const accountData = await getAccountCookie(ctx);
      if (accountData) account2 = accountData;
    }
  } else {
    const accountData = await ctx.context.internalAdapter.findAccount(providedAccountId);
    if (accountData) account2 = accountData;
  }
  if (!account2 || account2.userId !== ctx.context.session.user.id) throw new APIError("BAD_REQUEST", { message: "Account not found" });
  const provider = ctx.context.socialProviders.find((p2) => p2.id === account2.providerId);
  if (!provider) throw new APIError("INTERNAL_SERVER_ERROR", { message: `Provider account provider is ${account2.providerId} but it is not configured` });
  const tokens = await getAccessToken({
    ...ctx,
    method: "POST",
    body: {
      accountId: account2.id,
      providerId: account2.providerId
    },
    returnHeaders: false,
    returnStatus: false
  });
  if (!tokens.accessToken) throw new APIError("BAD_REQUEST", { message: "Access token not found" });
  const info2 = await provider.getUserInfo({
    ...tokens,
    accessToken: tokens.accessToken
  });
  return ctx.json(info2);
});
async function createEmailVerificationToken(secret, email, updateTo, expiresIn = 3600, extraPayload) {
  return await signJWT({
    email: email.toLowerCase(),
    updateTo,
    ...extraPayload
  }, secret, expiresIn);
}
async function sendVerificationEmailFn(ctx, user2) {
  if (!ctx.context.options.emailVerification?.sendVerificationEmail) {
    ctx.context.logger.error("Verification email isn't enabled.");
    throw new APIError("BAD_REQUEST", { message: "Verification email isn't enabled" });
  }
  const token = await createEmailVerificationToken(ctx.context.secret, user2.email, void 0, ctx.context.options.emailVerification?.expiresIn);
  const callbackURL = ctx.body.callbackURL ? encodeURIComponent(ctx.body.callbackURL) : encodeURIComponent("/");
  const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
  await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
    user: user2,
    url,
    token
  }, ctx.request));
}
const sendVerificationEmail = createAuthEndpoint("/send-verification-email", {
  method: "POST",
  operationId: "sendVerificationEmail",
  body: z$1.object({
    email: z$1.email().meta({ description: "The email to send the verification email to" }),
    callbackURL: z$1.string().meta({ description: "The URL to use for email verification callback" }).optional()
  }),
  metadata: { openapi: {
    operationId: "sendVerificationEmail",
    description: "Send a verification email to the user",
    requestBody: { content: { "application/json": { schema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "The email to send the verification email to",
          example: "user@example.com"
        },
        callbackURL: {
          type: "string",
          description: "The URL to use for email verification callback",
          example: "https://example.com/callback",
          nullable: true
        }
      },
      required: ["email"]
    } } } },
    responses: {
      "200": {
        description: "Success",
        content: { "application/json": { schema: {
          type: "object",
          properties: { status: {
            type: "boolean",
            description: "Indicates if the email was sent successfully",
            example: true
          } }
        } } }
      },
      "400": {
        description: "Bad Request",
        content: { "application/json": { schema: {
          type: "object",
          properties: { message: {
            type: "string",
            description: "Error message",
            example: "Verification email isn't enabled"
          } }
        } } }
      }
    }
  } }
}, async (ctx) => {
  if (!ctx.context.options.emailVerification?.sendVerificationEmail) {
    ctx.context.logger.error("Verification email isn't enabled.");
    throw new APIError("BAD_REQUEST", { message: "Verification email isn't enabled" });
  }
  const { email } = ctx.body;
  const session2 = await getSessionFromCtx(ctx);
  if (!session2) {
    const user2 = await ctx.context.internalAdapter.findUserByEmail(email);
    if (!user2) {
      await createEmailVerificationToken(ctx.context.secret, email, void 0, ctx.context.options.emailVerification?.expiresIn);
      return ctx.json({ status: true });
    }
    await sendVerificationEmailFn(ctx, user2.user);
    return ctx.json({ status: true });
  }
  if (session2?.user.email !== email) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.EMAIL_MISMATCH });
  if (session2?.user.emailVerified) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.EMAIL_ALREADY_VERIFIED });
  await sendVerificationEmailFn(ctx, session2.user);
  return ctx.json({ status: true });
});
const verifyEmail = createAuthEndpoint("/verify-email", {
  method: "GET",
  operationId: "verifyEmail",
  query: z$1.object({
    token: z$1.string().meta({ description: "The token to verify the email" }),
    callbackURL: z$1.string().meta({ description: "The URL to redirect to after email verification" }).optional()
  }),
  use: [originCheck((ctx) => ctx.query.callbackURL)],
  metadata: { openapi: {
    description: "Verify the email of the user",
    parameters: [{
      name: "token",
      in: "query",
      description: "The token to verify the email",
      required: true,
      schema: { type: "string" }
    }, {
      name: "callbackURL",
      in: "query",
      description: "The URL to redirect to after email verification",
      required: false,
      schema: { type: "string" }
    }],
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          user: {
            type: "object",
            $ref: "#/components/schemas/User"
          },
          status: {
            type: "boolean",
            description: "Indicates if the email was verified successfully"
          }
        },
        required: ["user", "status"]
      } } }
    } }
  } }
}, async (ctx) => {
  function redirectOnError(error2) {
    if (ctx.query.callbackURL) {
      if (ctx.query.callbackURL.includes("?")) throw ctx.redirect(`${ctx.query.callbackURL}&error=${error2}`);
      throw ctx.redirect(`${ctx.query.callbackURL}?error=${error2}`);
    }
    throw new APIError("UNAUTHORIZED", { message: error2 });
  }
  const { token } = ctx.query;
  let jwt;
  try {
    jwt = await jwtVerify(token, new TextEncoder().encode(ctx.context.secret), { algorithms: ["HS256"] });
  } catch (e2) {
    if (e2 instanceof JWTExpired) return redirectOnError("token_expired");
    return redirectOnError("invalid_token");
  }
  const parsed = z$1.object({
    email: z$1.email(),
    updateTo: z$1.string().optional(),
    requestType: z$1.string().optional()
  }).parse(jwt.payload);
  const user2 = await ctx.context.internalAdapter.findUserByEmail(parsed.email);
  if (!user2) return redirectOnError("user_not_found");
  if (parsed.updateTo) {
    const session2 = await getSessionFromCtx(ctx);
    if (session2 && session2.user.email !== parsed.email) return redirectOnError("unauthorized");
    switch (parsed.requestType) {
      case "change-email-confirmation": {
        const newToken = await createEmailVerificationToken(ctx.context.secret, parsed.email, parsed.updateTo, ctx.context.options.emailVerification?.expiresIn, { requestType: "change-email-verification" });
        const updateCallbackURL = ctx.query.callbackURL ? encodeURIComponent(ctx.query.callbackURL) : encodeURIComponent("/");
        const url = `${ctx.context.baseURL}/verify-email?token=${newToken}&callbackURL=${updateCallbackURL}`;
        if (ctx.context.options.emailVerification?.sendVerificationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
          user: {
            ...user2.user,
            email: parsed.updateTo
          },
          url,
          token: newToken
        }, ctx.request));
        if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
        return ctx.json({ status: true });
      }
      case "change-email-verification": {
        let activeSession = session2;
        if (!activeSession) {
          const newSession = await ctx.context.internalAdapter.createSession(user2.user.id);
          if (!newSession) throw new APIError("INTERNAL_SERVER_ERROR", { message: BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION });
          activeSession = {
            session: newSession,
            user: user2.user
          };
        }
        if (ctx.context.options.emailVerification?.onEmailVerification) await ctx.context.options.emailVerification.onEmailVerification(user2.user, ctx.request);
        const updatedUser$1 = await ctx.context.internalAdapter.updateUserByEmail(parsed.email, {
          email: parsed.updateTo,
          emailVerified: true
        });
        if (ctx.context.options.emailVerification?.afterEmailVerification) await ctx.context.options.emailVerification.afterEmailVerification(updatedUser$1, ctx.request);
        await setSessionCookie(ctx, {
          session: activeSession.session,
          user: {
            ...activeSession.user,
            email: parsed.updateTo,
            emailVerified: true
          }
        });
        if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
        return ctx.json({
          status: true,
          user: parseUserOutput(ctx.context.options, updatedUser$1)
        });
      }
      default: {
        let activeSession = session2;
        if (!activeSession) {
          const newSession = await ctx.context.internalAdapter.createSession(user2.user.id);
          if (!newSession) throw new APIError("INTERNAL_SERVER_ERROR", { message: BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION });
          activeSession = {
            session: newSession,
            user: user2.user
          };
        }
        const updatedUser$1 = await ctx.context.internalAdapter.updateUserByEmail(parsed.email, {
          email: parsed.updateTo,
          emailVerified: false
        });
        const newToken = await createEmailVerificationToken(ctx.context.secret, parsed.updateTo);
        const updateCallbackURL = ctx.query.callbackURL ? encodeURIComponent(ctx.query.callbackURL) : encodeURIComponent("/");
        if (ctx.context.options.emailVerification?.sendVerificationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
          user: updatedUser$1,
          url: `${ctx.context.baseURL}/verify-email?token=${newToken}&callbackURL=${updateCallbackURL}`,
          token: newToken
        }, ctx.request));
        await setSessionCookie(ctx, {
          session: activeSession.session,
          user: {
            ...activeSession.user,
            email: parsed.updateTo,
            emailVerified: false
          }
        });
        if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
        return ctx.json({
          status: true,
          user: parseUserOutput(ctx.context.options, updatedUser$1)
        });
      }
    }
  }
  if (user2.user.emailVerified) {
    if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
    return ctx.json({
      status: true,
      user: null
    });
  }
  if (ctx.context.options.emailVerification?.beforeEmailVerification) await ctx.context.options.emailVerification.beforeEmailVerification(user2.user, ctx.request);
  if (ctx.context.options.emailVerification?.onEmailVerification) await ctx.context.options.emailVerification.onEmailVerification(user2.user, ctx.request);
  const updatedUser = await ctx.context.internalAdapter.updateUserByEmail(parsed.email, { emailVerified: true });
  if (ctx.context.options.emailVerification?.afterEmailVerification) await ctx.context.options.emailVerification.afterEmailVerification(updatedUser, ctx.request);
  if (ctx.context.options.emailVerification?.autoSignInAfterVerification) {
    const currentSession = await getSessionFromCtx(ctx);
    if (!currentSession || currentSession.user.email !== parsed.email) {
      const session2 = await ctx.context.internalAdapter.createSession(user2.user.id);
      if (!session2) throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to create session" });
      await setSessionCookie(ctx, {
        session: session2,
        user: {
          ...user2.user,
          emailVerified: true
        }
      });
    } else await setSessionCookie(ctx, {
      session: currentSession.session,
      user: {
        ...currentSession.user,
        emailVerified: true
      }
    });
  }
  if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
  return ctx.json({
    status: true,
    user: null
  });
});
async function handleOAuthUserInfo(c2, opts) {
  const { userInfo, account: account2, callbackURL, disableSignUp, overrideUserInfo } = opts;
  const dbUser = await c2.context.internalAdapter.findOAuthUser(userInfo.email.toLowerCase(), account2.accountId, account2.providerId).catch((e2) => {
    logger.error("Better auth was unable to query your database.\nError: ", e2);
    const errorURL = c2.context.options.onAPIError?.errorURL || `${c2.context.baseURL}/error`;
    throw c2.redirect(`${errorURL}?error=internal_server_error`);
  });
  let user2 = dbUser?.user;
  const isRegister = !user2;
  if (dbUser) {
    const linkedAccount = dbUser.linkedAccount ?? dbUser.accounts.find((acc) => acc.providerId === account2.providerId && acc.accountId === account2.accountId);
    if (!linkedAccount) {
      const trustedProviders = c2.context.options.account?.accountLinking?.trustedProviders;
      if (!(opts.isTrustedProvider || trustedProviders?.includes(account2.providerId)) && !userInfo.emailVerified || c2.context.options.account?.accountLinking?.enabled === false) {
        if (isDevelopment()) logger.warn(`User already exist but account isn't linked to ${account2.providerId}. To read more about how account linking works in Better Auth see https://www.better-auth.com/docs/concepts/users-accounts#account-linking.`);
        return {
          error: "account not linked",
          data: null
        };
      }
      try {
        await c2.context.internalAdapter.linkAccount({
          providerId: account2.providerId,
          accountId: userInfo.id.toString(),
          userId: dbUser.user.id,
          accessToken: await setTokenUtil(account2.accessToken, c2.context),
          refreshToken: await setTokenUtil(account2.refreshToken, c2.context),
          idToken: account2.idToken,
          accessTokenExpiresAt: account2.accessTokenExpiresAt,
          refreshTokenExpiresAt: account2.refreshTokenExpiresAt,
          scope: account2.scope
        });
      } catch (e2) {
        logger.error("Unable to link account", e2);
        return {
          error: "unable to link account",
          data: null
        };
      }
      if (userInfo.emailVerified && !dbUser.user.emailVerified && userInfo.email.toLowerCase() === dbUser.user.email) await c2.context.internalAdapter.updateUser(dbUser.user.id, { emailVerified: true });
    } else {
      const freshTokens = c2.context.options.account?.updateAccountOnSignIn !== false ? Object.fromEntries(Object.entries({
        idToken: account2.idToken,
        accessToken: await setTokenUtil(account2.accessToken, c2.context),
        refreshToken: await setTokenUtil(account2.refreshToken, c2.context),
        accessTokenExpiresAt: account2.accessTokenExpiresAt,
        refreshTokenExpiresAt: account2.refreshTokenExpiresAt,
        scope: account2.scope
      }).filter(([_, value]) => value !== void 0)) : {};
      if (c2.context.options.account?.storeAccountCookie) await setAccountCookie(c2, {
        ...linkedAccount,
        ...freshTokens
      });
      if (Object.keys(freshTokens).length > 0) await c2.context.internalAdapter.updateAccount(linkedAccount.id, freshTokens);
      if (userInfo.emailVerified && !dbUser.user.emailVerified && userInfo.email.toLowerCase() === dbUser.user.email) await c2.context.internalAdapter.updateUser(dbUser.user.id, { emailVerified: true });
    }
    if (overrideUserInfo) {
      const { id: _, ...restUserInfo } = userInfo;
      user2 = await c2.context.internalAdapter.updateUser(dbUser.user.id, {
        ...restUserInfo,
        email: userInfo.email.toLowerCase(),
        emailVerified: userInfo.email.toLowerCase() === dbUser.user.email ? dbUser.user.emailVerified || userInfo.emailVerified : userInfo.emailVerified
      });
    }
  } else {
    if (disableSignUp) return {
      error: "signup disabled",
      data: null,
      isRegister: false
    };
    try {
      const { id: _, ...restUserInfo } = userInfo;
      const accountData = {
        accessToken: await setTokenUtil(account2.accessToken, c2.context),
        refreshToken: await setTokenUtil(account2.refreshToken, c2.context),
        idToken: account2.idToken,
        accessTokenExpiresAt: account2.accessTokenExpiresAt,
        refreshTokenExpiresAt: account2.refreshTokenExpiresAt,
        scope: account2.scope,
        providerId: account2.providerId,
        accountId: userInfo.id.toString()
      };
      const { user: createdUser, account: createdAccount } = await c2.context.internalAdapter.createOAuthUser({
        ...restUserInfo,
        email: userInfo.email.toLowerCase()
      }, accountData);
      user2 = createdUser;
      if (c2.context.options.account?.storeAccountCookie) await setAccountCookie(c2, createdAccount);
      if (!userInfo.emailVerified && user2 && c2.context.options.emailVerification?.sendOnSignUp && c2.context.options.emailVerification?.sendVerificationEmail) {
        const token = await createEmailVerificationToken(c2.context.secret, user2.email, void 0, c2.context.options.emailVerification?.expiresIn);
        const url = `${c2.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
        await c2.context.runInBackgroundOrAwait(c2.context.options.emailVerification.sendVerificationEmail({
          user: user2,
          url,
          token
        }, c2.request));
      }
    } catch (e2) {
      logger.error(e2);
      if (e2 instanceof APIError) return {
        error: e2.message,
        data: null,
        isRegister: false
      };
      return {
        error: "unable to create user",
        data: null,
        isRegister: false
      };
    }
  }
  if (!user2) return {
    error: "unable to create user",
    data: null,
    isRegister: false
  };
  const session2 = await c2.context.internalAdapter.createSession(user2.id);
  if (!session2) return {
    error: "unable to create session",
    data: null,
    isRegister: false
  };
  return {
    data: {
      session: session2,
      user: user2
    },
    error: null,
    isRegister
  };
}
const schema = z$1.object({
  code: z$1.string().optional(),
  error: z$1.string().optional(),
  device_id: z$1.string().optional(),
  error_description: z$1.string().optional(),
  state: z$1.string().optional(),
  user: z$1.string().optional()
});
const callbackOAuth = createAuthEndpoint("/callback/:id", {
  method: ["GET", "POST"],
  operationId: "handleOAuthCallback",
  body: schema.optional(),
  query: schema.optional(),
  metadata: {
    ...HIDE_METADATA,
    allowedMediaTypes: ["application/x-www-form-urlencoded", "application/json"]
  }
}, async (c2) => {
  let queryOrBody;
  const defaultErrorURL = c2.context.options.onAPIError?.errorURL || `${c2.context.baseURL}/error`;
  if (c2.method === "POST") {
    const postData = c2.body ? schema.parse(c2.body) : {};
    const queryData = c2.query ? schema.parse(c2.query) : {};
    const mergedData = schema.parse({
      ...postData,
      ...queryData
    });
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(mergedData)) if (value !== void 0 && value !== null) params.set(key, String(value));
    const redirectURL = `${c2.context.baseURL}/callback/${c2.params.id}?${params.toString()}`;
    throw c2.redirect(redirectURL);
  }
  try {
    if (c2.method === "GET") queryOrBody = schema.parse(c2.query);
    else if (c2.method === "POST") queryOrBody = schema.parse(c2.body);
    else throw new Error("Unsupported method");
  } catch (e2) {
    c2.context.logger.error("INVALID_CALLBACK_REQUEST", e2);
    throw c2.redirect(`${defaultErrorURL}?error=invalid_callback_request`);
  }
  const { code: code2, error: error2, state, error_description, device_id } = queryOrBody;
  if (!state) {
    c2.context.logger.error("State not found", error2);
    const url = `${defaultErrorURL}${defaultErrorURL.includes("?") ? "&" : "?"}state=state_not_found`;
    throw c2.redirect(url);
  }
  const { codeVerifier, callbackURL, link, errorURL, newUserURL, requestSignUp } = await parseState(c2);
  function redirectOnError(error$1, description) {
    const baseURL = errorURL ?? defaultErrorURL;
    const params = new URLSearchParams({ error: error$1 });
    if (description) params.set("error_description", description);
    const url = `${baseURL}${baseURL.includes("?") ? "&" : "?"}${params.toString()}`;
    throw c2.redirect(url);
  }
  if (error2) redirectOnError(error2, error_description);
  if (!code2) {
    c2.context.logger.error("Code not found");
    throw redirectOnError("no_code");
  }
  const provider = c2.context.socialProviders.find((p2) => p2.id === c2.params.id);
  if (!provider) {
    c2.context.logger.error("Oauth provider with id", c2.params.id, "not found");
    throw redirectOnError("oauth_provider_not_found");
  }
  let tokens;
  try {
    tokens = await provider.validateAuthorizationCode({
      code: code2,
      codeVerifier,
      deviceId: device_id,
      redirectURI: `${c2.context.baseURL}/callback/${provider.id}`
    });
  } catch (e2) {
    c2.context.logger.error("", e2);
    throw redirectOnError("invalid_code");
  }
  const userInfo = await provider.getUserInfo({
    ...tokens,
    user: c2.body?.user ? safeJSONParse(c2.body.user) : void 0
  }).then((res) => res?.user);
  if (!userInfo) {
    c2.context.logger.error("Unable to get user info");
    return redirectOnError("unable_to_get_user_info");
  }
  if (!callbackURL) {
    c2.context.logger.error("No callback URL found");
    throw redirectOnError("no_callback_url");
  }
  if (link) {
    if (!c2.context.options.account?.accountLinking?.trustedProviders?.includes(provider.id) && !userInfo.emailVerified || c2.context.options.account?.accountLinking?.enabled === false) {
      c2.context.logger.error("Unable to link account - untrusted provider");
      return redirectOnError("unable_to_link_account");
    }
    if (userInfo.email !== link.email && c2.context.options.account?.accountLinking?.allowDifferentEmails !== true) return redirectOnError("email_doesn't_match");
    const existingAccount = await c2.context.internalAdapter.findAccount(String(userInfo.id));
    if (existingAccount) {
      if (existingAccount.userId.toString() !== link.userId.toString()) return redirectOnError("account_already_linked_to_different_user");
      const updateData = Object.fromEntries(Object.entries({
        accessToken: await setTokenUtil(tokens.accessToken, c2.context),
        refreshToken: await setTokenUtil(tokens.refreshToken, c2.context),
        idToken: tokens.idToken,
        accessTokenExpiresAt: tokens.accessTokenExpiresAt,
        refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
        scope: tokens.scopes?.join(",")
      }).filter(([_, value]) => value !== void 0));
      await c2.context.internalAdapter.updateAccount(existingAccount.id, updateData);
    } else if (!await c2.context.internalAdapter.createAccount({
      userId: link.userId,
      providerId: provider.id,
      accountId: String(userInfo.id),
      ...tokens,
      accessToken: await setTokenUtil(tokens.accessToken, c2.context),
      refreshToken: await setTokenUtil(tokens.refreshToken, c2.context),
      scope: tokens.scopes?.join(",")
    })) return redirectOnError("unable_to_link_account");
    let toRedirectTo$1;
    try {
      toRedirectTo$1 = callbackURL.toString();
    } catch {
      toRedirectTo$1 = callbackURL;
    }
    throw c2.redirect(toRedirectTo$1);
  }
  if (!userInfo.email) {
    c2.context.logger.error("Provider did not return email. This could be due to misconfiguration in the provider settings.");
    return redirectOnError("email_not_found");
  }
  const accountData = {
    providerId: provider.id,
    accountId: String(userInfo.id),
    ...tokens,
    scope: tokens.scopes?.join(",")
  };
  const result = await handleOAuthUserInfo(c2, {
    userInfo: {
      ...userInfo,
      id: String(userInfo.id),
      email: userInfo.email,
      name: userInfo.name || userInfo.email
    },
    account: accountData,
    callbackURL,
    disableSignUp: provider.disableImplicitSignUp && !requestSignUp || provider.options?.disableSignUp,
    overrideUserInfo: provider.options?.overrideUserInfoOnSignIn
  });
  if (result.error) {
    c2.context.logger.error(result.error.split(" ").join("_"));
    return redirectOnError(result.error.split(" ").join("_"));
  }
  const { session: session2, user: user2 } = result.data;
  await setSessionCookie(c2, {
    session: session2,
    user: user2
  });
  let toRedirectTo;
  try {
    toRedirectTo = (result.isRegister ? newUserURL || callbackURL : callbackURL).toString();
  } catch {
    toRedirectTo = result.isRegister ? newUserURL || callbackURL : callbackURL;
  }
  throw c2.redirect(toRedirectTo);
});
function sanitize(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/&(?!amp;|lt;|gt;|quot;|#39;|#x[0-9a-fA-F]+;|#[0-9]+;)/g, "&amp;");
}
const html = (options, code2 = "Unknown", description = null) => {
  const custom = options.onAPIError?.customizeDefaultErrorPage;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Error</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        font-family: ${custom?.font?.defaultFamily || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"};
        background: ${custom?.colors?.background || "var(--background)"};
        color: var(--foreground);
        margin: 0;
      }
      :root,
      :host {
        --spacing: 0.25rem;
        --container-md: 28rem;
        --text-sm: ${custom?.size?.textSm || "0.875rem"};
        --text-sm--line-height: calc(1.25 / 0.875);
        --text-2xl: ${custom?.size?.text2xl || "1.5rem"};
        --text-2xl--line-height: calc(2 / 1.5);
        --text-4xl: ${custom?.size?.text4xl || "2.25rem"};
        --text-4xl--line-height: calc(2.5 / 2.25);
        --text-6xl: ${custom?.size?.text6xl || "3rem"};
        --text-6xl--line-height: 1;
        --font-weight-medium: 500;
        --font-weight-semibold: 600;
        --font-weight-bold: 700;
        --default-transition-duration: 150ms;
        --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        --radius: ${custom?.size?.radiusSm || "0.625rem"};
        --default-mono-font-family: ${custom?.font?.monoFamily || "var(--font-geist-mono)"};
        --primary: ${custom?.colors?.primary || "black"};
        --primary-foreground: ${custom?.colors?.primaryForeground || "white"};
        --background: ${custom?.colors?.background || "white"};
        --foreground: ${custom?.colors?.foreground || "oklch(0.271 0 0)"};
        --border: ${custom?.colors?.border || "oklch(0.89 0 0)"};
        --destructive: ${custom?.colors?.destructive || "oklch(0.55 0.15 25.723)"};
        --muted-foreground: ${custom?.colors?.mutedForeground || "oklch(0.545 0 0)"};
        --corner-border: ${custom?.colors?.cornerBorder || "#404040"};
      }

      button, .btn {
        cursor: pointer;
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        transition: all var(--default-transition-duration)
          var(--default-transition-timing-function);
      }
      button:hover, .btn:hover {
        opacity: 0.8;
      }

      @media (prefers-color-scheme: dark) {
        :root,
        :host {
          --primary: ${custom?.colors?.primary || "white"};
          --primary-foreground: ${custom?.colors?.primaryForeground || "black"};
          --background: ${custom?.colors?.background || "oklch(0.15 0 0)"};
          --foreground: ${custom?.colors?.foreground || "oklch(0.98 0 0)"};
          --border: ${custom?.colors?.border || "oklch(0.27 0 0)"};
          --destructive: ${custom?.colors?.destructive || "oklch(0.65 0.15 25.723)"};
          --muted-foreground: ${custom?.colors?.mutedForeground || "oklch(0.65 0 0)"};
          --corner-border: ${custom?.colors?.cornerBorder || "#a0a0a0"};
        }
      }
      @media (max-width: 640px) {
        :root, :host {
          --text-6xl: 2.5rem;
          --text-2xl: 1.25rem;
          --text-sm: 0.8125rem;
        }
      }
      @media (max-width: 480px) {
        :root, :host {
          --text-6xl: 2rem;
          --text-2xl: 1.125rem;
        }
      }
    </style>
  </head>
  <body style="width: 100vw; min-height: 100vh; overflow-x: hidden; overflow-y: auto;">
    <div
        style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            position: relative;
            width: 100%;
            min-height: 100vh;
            padding: 1rem;
        "
        >
${custom?.disableBackgroundGrid ? "" : `
      <div
        style="
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, ${custom?.colors?.gridColor || "var(--border)"} 1px, transparent 1px),
            linear-gradient(to bottom, ${custom?.colors?.gridColor || "var(--border)"} 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.6;
          pointer-events: none;
          width: 100vw;
          height: 100vh;
        "
      ></div>
      <div
        style="
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${custom?.colors?.background || "var(--background)"};
          mask-image: radial-gradient(ellipse at center, transparent 20%, black);
          -webkit-mask-image: radial-gradient(ellipse at center, transparent 20%, black);
          pointer-events: none;
        "
      ></div>
`}

<div
  style="
    position: relative;
    z-index: 10;
    border: 2px solid var(--border);
    background: ${custom?.colors?.cardBackground || "var(--background)"};
    padding: 1.5rem;
    max-width: 42rem;
    width: 100%;
  "
>
    ${custom?.disableCornerDecorations ? "" : `
        <!-- Corner decorations -->
        <div
          style="
            position: absolute;
            top: -2px;
            left: -2px;
            width: 2rem;
            height: 2rem;
            border-top: 4px solid var(--corner-border);
            border-left: 4px solid var(--corner-border);
          "
        ></div>
        <div
          style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 2rem;
            height: 2rem;
            border-top: 4px solid var(--corner-border);
            border-right: 4px solid var(--corner-border);
          "
        ></div>
  
        <div
          style="
            position: absolute;
            bottom: -2px;
            left: -2px;
            width: 2rem;
            height: 2rem;
            border-bottom: 4px solid var(--corner-border);
            border-left: 4px solid var(--corner-border);
          "
        ></div>
        <div
          style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 2rem;
            height: 2rem;
            border-bottom: 4px solid var(--corner-border);
            border-right: 4px solid var(--corner-border);
          "
        ></div>`}

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="margin-bottom: 1.5rem;">
            <div
              style="
                display: inline-block;
                border: 2px solid ${custom?.disableTitleBorder ? "transparent" : custom?.colors?.titleBorder || "var(--destructive)"};
                padding: 0.375rem 1rem;
              "
            >
              <h1
                style="
                  font-size: var(--text-6xl);
                  font-weight: var(--font-weight-semibold);
                  color: ${custom?.colors?.titleColor || "var(--foreground)"};
                  letter-spacing: -0.02em;
                  margin: 0;
                "
              >
                ERROR
              </h1>
            </div>
            <div
              style="
                height: 2px;
                background-color: var(--border);
                width: calc(100% + 3rem);
                margin-left: -1.5rem;
                margin-top: 1.5rem;
              "
            ></div>
          </div>

          <h2
            style="
              font-size: var(--text-2xl);
              font-weight: var(--font-weight-semibold);
              color: var(--foreground);
              margin: 0 0 1rem;
            "
          >
            Something went wrong
          </h2>

          <div
            style="
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                border: 2px solid var(--border);
                background-color: var(--muted);
                padding: 0.375rem 0.75rem;
                margin: 0 0 1rem;
                flex-wrap: wrap;
                justify-content: center;
            "
            >
            <span
                style="
                font-size: 0.75rem;
                color: var(--muted-foreground);
                font-weight: var(--font-weight-semibold);
                "
            >
                CODE:
            </span>
            <span
                style="
                font-size: var(--text-sm);
                font-family: var(--default-mono-font-family, monospace);
                color: var(--foreground);
                word-break: break-all;
                "
            >
                ${sanitize(code2)}
            </span>
            </div>

          <p
            style="
              color: var(--muted-foreground);
              max-width: 28rem;
              margin: 0 auto;
              font-size: var(--text-sm);
              line-height: 1.5;
              text-wrap: pretty;
            "
          >
            ${!description ? `We encountered an unexpected error. Please try again or return to the home page. If you're a developer, you can find more information about the error <a href='https://better-auth.com/docs/errors/${encodeURIComponent(code2)}' target='_blank' rel="noopener noreferrer" style='color: var(--foreground); text-decoration: underline;'>here</a>.` : description}
          </p>
        </div>

        <div
          style="
            display: flex;
            gap: 0.75rem;
            margin-top: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
          "
        >
          <a
            href="/"
            style="
              text-decoration: none;
            "
          >
            <div
              style="
                border: 2px solid var(--border);
                background: var(--primary);
                color: var(--primary-foreground);
                padding: 0.5rem 1rem;
                border-radius: 0;
                white-space: nowrap;
              "
              class="btn"
            >
              Go Home
            </div>
          </a>
          <a
            href="https://better-auth.com/docs/errors/${encodeURIComponent(code2)}?askai=${encodeURIComponent(`What does the error code ${code2} mean?`)}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              text-decoration: none;
            "
          >
            <div
              style="
                border: 2px solid var(--border);
                background: transparent;
                color: var(--foreground);
                padding: 0.5rem 1rem;
                border-radius: 0;
                white-space: nowrap;
              "
              class="btn"
            >
              Ask AI
            </div>
          </a>
        </div>
      </div>
    </div>
  </body>
</html>`;
};
const error = createAuthEndpoint("/error", {
  method: "GET",
  metadata: {
    ...HIDE_METADATA,
    openapi: {
      description: "Displays an error page",
      responses: { "200": {
        description: "Success",
        content: { "text/html": { schema: {
          type: "string",
          description: "The HTML content of the error page"
        } } }
      } }
    }
  }
}, async (c2) => {
  const url = new URL(c2.request?.url || "");
  const unsanitizedCode = url.searchParams.get("error") || "UNKNOWN";
  const unsanitizedDescription = url.searchParams.get("error_description") || null;
  const safeCode = /^[\'A-Za-z0-9_-]+$/.test(unsanitizedCode) ? unsanitizedCode : "UNKNOWN";
  const safeDescription = unsanitizedDescription ? sanitize(unsanitizedDescription) : null;
  const queryParams = new URLSearchParams();
  queryParams.set("error", safeCode);
  if (unsanitizedDescription) queryParams.set("error_description", unsanitizedDescription);
  const options = c2.context.options;
  const errorURL = options.onAPIError?.errorURL;
  if (errorURL) return new Response(null, {
    status: 302,
    headers: { Location: `${errorURL}${errorURL.includes("?") ? "&" : "?"}${queryParams.toString()}` }
  });
  if (isProduction && !options.onAPIError?.customizeDefaultErrorPage) return new Response(null, {
    status: 302,
    headers: { Location: `/?${queryParams.toString()}` }
  });
  return new Response(html(c2.context.options, safeCode, safeDescription), { headers: { "Content-Type": "text/html" } });
});
const ok = createAuthEndpoint("/ok", {
  method: "GET",
  metadata: {
    ...HIDE_METADATA,
    openapi: {
      description: "Check if the API is working",
      responses: { "200": {
        description: "API is working",
        content: { "application/json": { schema: {
          type: "object",
          properties: { ok: {
            type: "boolean",
            description: "Indicates if the API is working"
          } },
          required: ["ok"]
        } } }
      } }
    }
  }
}, async (ctx) => {
  return ctx.json({ ok: true });
});
async function validatePassword(ctx, data) {
  const credentialAccount = (await ctx.context.internalAdapter.findAccounts(data.userId))?.find((account2) => account2.providerId === "credential");
  const currentPassword = credentialAccount?.password;
  if (!credentialAccount || !currentPassword) return false;
  return await ctx.context.password.verify({
    hash: currentPassword,
    password: data.password
  });
}
async function checkPassword(userId, c2) {
  const credentialAccount = (await c2.context.internalAdapter.findAccounts(userId))?.find((account2) => account2.providerId === "credential");
  const currentPassword = credentialAccount?.password;
  if (!credentialAccount || !currentPassword || !c2.body.password) throw new APIError("BAD_REQUEST", { message: "No password credential found" });
  if (!await c2.context.password.verify({
    hash: currentPassword,
    password: c2.body.password
  })) throw new APIError("BAD_REQUEST", { message: "Invalid password" });
  return true;
}
function redirectError(ctx, callbackURL, query) {
  const url = callbackURL ? new URL(callbackURL, ctx.baseURL) : new URL(`${ctx.baseURL}/error`);
  if (query) Object.entries(query).forEach(([k2, v2]) => url.searchParams.set(k2, v2));
  return url.href;
}
function redirectCallback(ctx, callbackURL, query) {
  const url = new URL(callbackURL, ctx.baseURL);
  if (query) Object.entries(query).forEach(([k2, v2]) => url.searchParams.set(k2, v2));
  return url.href;
}
const requestPasswordReset = createAuthEndpoint("/request-password-reset", {
  method: "POST",
  body: z$1.object({
    email: z$1.email().meta({ description: "The email address of the user to send a password reset email to" }),
    redirectTo: z$1.string().meta({ description: "The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter `?error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?token=VALID_TOKEN" }).optional()
  }),
  metadata: { openapi: {
    operationId: "requestPasswordReset",
    description: "Send a password reset email to the user",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          status: { type: "boolean" },
          message: { type: "string" }
        }
      } } }
    } }
  } }
}, async (ctx) => {
  if (!ctx.context.options.emailAndPassword?.sendResetPassword) {
    ctx.context.logger.error("Reset password isn't enabled.Please pass an emailAndPassword.sendResetPassword function in your auth config!");
    throw new APIError("BAD_REQUEST", { message: "Reset password isn't enabled" });
  }
  const { email, redirectTo } = ctx.body;
  const user2 = await ctx.context.internalAdapter.findUserByEmail(email, { includeAccounts: true });
  if (!user2) {
    generateId$1(24);
    await ctx.context.internalAdapter.findVerificationValue("dummy-verification-token");
    ctx.context.logger.error("Reset Password: User not found", { email });
    return ctx.json({
      status: true,
      message: "If this email exists in our system, check your email for the reset link"
    });
  }
  const expiresAt = getDate(ctx.context.options.emailAndPassword.resetPasswordTokenExpiresIn || 3600 * 1, "sec");
  const verificationToken = generateId$1(24);
  await ctx.context.internalAdapter.createVerificationValue({
    value: user2.user.id,
    identifier: `reset-password:${verificationToken}`,
    expiresAt
  });
  const callbackURL = redirectTo ? encodeURIComponent(redirectTo) : "";
  const url = `${ctx.context.baseURL}/reset-password/${verificationToken}?callbackURL=${callbackURL}`;
  await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailAndPassword.sendResetPassword({
    user: user2.user,
    url,
    token: verificationToken
  }, ctx.request));
  return ctx.json({
    status: true,
    message: "If this email exists in our system, check your email for the reset link"
  });
});
const requestPasswordResetCallback = createAuthEndpoint("/reset-password/:token", {
  method: "GET",
  operationId: "forgetPasswordCallback",
  query: z$1.object({ callbackURL: z$1.string().meta({ description: "The URL to redirect the user to reset their password" }) }),
  use: [originCheck((ctx) => ctx.query.callbackURL)],
  metadata: { openapi: {
    operationId: "resetPasswordCallback",
    description: "Redirects the user to the callback URL with the token",
    parameters: [{
      name: "token",
      in: "path",
      required: true,
      description: "The token to reset the password",
      schema: { type: "string" }
    }, {
      name: "callbackURL",
      in: "query",
      required: true,
      description: "The URL to redirect the user to reset their password",
      schema: { type: "string" }
    }],
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { token: { type: "string" } }
      } } }
    } }
  } }
}, async (ctx) => {
  const { token } = ctx.params;
  const { callbackURL } = ctx.query;
  if (!token || !callbackURL) throw ctx.redirect(redirectError(ctx.context, callbackURL, { error: "INVALID_TOKEN" }));
  const verification2 = await ctx.context.internalAdapter.findVerificationValue(`reset-password:${token}`);
  if (!verification2 || verification2.expiresAt < /* @__PURE__ */ new Date()) throw ctx.redirect(redirectError(ctx.context, callbackURL, { error: "INVALID_TOKEN" }));
  throw ctx.redirect(redirectCallback(ctx.context, callbackURL, { token }));
});
const resetPassword = createAuthEndpoint("/reset-password", {
  method: "POST",
  operationId: "resetPassword",
  query: z$1.object({ token: z$1.string().optional() }).optional(),
  body: z$1.object({
    newPassword: z$1.string().meta({ description: "The new password to set" }),
    token: z$1.string().meta({ description: "The token to reset the password" }).optional()
  }),
  metadata: { openapi: {
    operationId: "resetPassword",
    description: "Reset the password for a user",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { status: { type: "boolean" } }
      } } }
    } }
  } }
}, async (ctx) => {
  const token = ctx.body.token || ctx.query?.token;
  if (!token) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.INVALID_TOKEN });
  const { newPassword } = ctx.body;
  const minLength = ctx.context.password?.config.minPasswordLength;
  const maxLength = ctx.context.password?.config.maxPasswordLength;
  if (newPassword.length < minLength) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.PASSWORD_TOO_SHORT });
  if (newPassword.length > maxLength) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.PASSWORD_TOO_LONG });
  const id = `reset-password:${token}`;
  const verification2 = await ctx.context.internalAdapter.findVerificationValue(id);
  if (!verification2 || verification2.expiresAt < /* @__PURE__ */ new Date()) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.INVALID_TOKEN });
  const userId = verification2.value;
  const hashedPassword = await ctx.context.password.hash(newPassword);
  if (!(await ctx.context.internalAdapter.findAccounts(userId)).find((ac) => ac.providerId === "credential")) await ctx.context.internalAdapter.createAccount({
    userId,
    providerId: "credential",
    password: hashedPassword,
    accountId: userId
  });
  else await ctx.context.internalAdapter.updatePassword(userId, hashedPassword);
  await ctx.context.internalAdapter.deleteVerificationValue(verification2.id);
  if (ctx.context.options.emailAndPassword?.onPasswordReset) {
    const user2 = await ctx.context.internalAdapter.findUserById(userId);
    if (user2) await ctx.context.options.emailAndPassword.onPasswordReset({ user: user2 }, ctx.request);
  }
  if (ctx.context.options.emailAndPassword?.revokeSessionsOnPasswordReset) await ctx.context.internalAdapter.deleteSessions(userId);
  return ctx.json({ status: true });
});
const verifyPassword = createAuthEndpoint("/verify-password", {
  method: "POST",
  body: z$1.object({ password: z$1.string().meta({ description: "The password to verify" }) }),
  metadata: {
    scope: "server",
    openapi: {
      operationId: "verifyPassword",
      description: "Verify the current user's password",
      responses: { "200": {
        description: "Success",
        content: { "application/json": { schema: {
          type: "object",
          properties: { status: { type: "boolean" } }
        } } }
      } }
    }
  },
  use: [sensitiveSessionMiddleware]
}, async (ctx) => {
  const { password } = ctx.body;
  const session2 = ctx.context.session;
  if (!await validatePassword(ctx, {
    password,
    userId: session2.user.id
  })) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.INVALID_PASSWORD });
  return ctx.json({ status: true });
});
const socialSignInBodySchema = z$1.object({
  callbackURL: z$1.string().meta({ description: "Callback URL to redirect to after the user has signed in" }).optional(),
  newUserCallbackURL: z$1.string().optional(),
  errorCallbackURL: z$1.string().meta({ description: "Callback URL to redirect to if an error happens" }).optional(),
  provider: SocialProviderListEnum,
  disableRedirect: z$1.boolean().meta({ description: "Disable automatic redirection to the provider. Useful for handling the redirection yourself" }).optional(),
  idToken: z$1.optional(z$1.object({
    token: z$1.string().meta({ description: "ID token from the provider" }),
    nonce: z$1.string().meta({ description: "Nonce used to generate the token" }).optional(),
    accessToken: z$1.string().meta({ description: "Access token from the provider" }).optional(),
    refreshToken: z$1.string().meta({ description: "Refresh token from the provider" }).optional(),
    expiresAt: z$1.number().meta({ description: "Expiry date of the token" }).optional()
  })),
  scopes: z$1.array(z$1.string()).meta({ description: "Array of scopes to request from the provider. This will override the default scopes passed." }).optional(),
  requestSignUp: z$1.boolean().meta({ description: "Explicitly request sign-up. Useful when disableImplicitSignUp is true for this provider" }).optional(),
  loginHint: z$1.string().meta({ description: "The login hint to use for the authorization code request" }).optional(),
  additionalData: z$1.record(z$1.string(), z$1.any()).optional().meta({ description: "Additional data to be passed through the OAuth flow" })
});
const signInSocial = () => createAuthEndpoint("/sign-in/social", {
  method: "POST",
  operationId: "socialSignIn",
  body: socialSignInBodySchema,
  metadata: {
    $Infer: {
      body: {},
      returned: {}
    },
    openapi: {
      description: "Sign in with a social provider",
      operationId: "socialSignIn",
      responses: { "200": {
        description: "Success - Returns either session details or redirect URL",
        content: { "application/json": { schema: {
          type: "object",
          description: "Session response when idToken is provided",
          properties: {
            token: { type: "string" },
            user: {
              type: "object",
              $ref: "#/components/schemas/User"
            },
            url: { type: "string" },
            redirect: {
              type: "boolean",
              enum: [false]
            }
          },
          required: [
            "redirect",
            "token",
            "user"
          ]
        } } }
      } }
    }
  }
}, async (c2) => {
  const provider = c2.context.socialProviders.find((p2) => p2.id === c2.body.provider);
  if (!provider) {
    c2.context.logger.error("Provider not found. Make sure to add the provider in your auth config", { provider: c2.body.provider });
    throw new APIError("NOT_FOUND", { message: BASE_ERROR_CODES.PROVIDER_NOT_FOUND });
  }
  if (c2.body.idToken) {
    if (!provider.verifyIdToken) {
      c2.context.logger.error("Provider does not support id token verification", { provider: c2.body.provider });
      throw new APIError("NOT_FOUND", { message: BASE_ERROR_CODES.ID_TOKEN_NOT_SUPPORTED });
    }
    const { token, nonce } = c2.body.idToken;
    if (!await provider.verifyIdToken(token, nonce)) {
      c2.context.logger.error("Invalid id token", { provider: c2.body.provider });
      throw new APIError("UNAUTHORIZED", { message: BASE_ERROR_CODES.INVALID_TOKEN });
    }
    const userInfo = await provider.getUserInfo({
      idToken: token,
      accessToken: c2.body.idToken.accessToken,
      refreshToken: c2.body.idToken.refreshToken
    });
    if (!userInfo || !userInfo?.user) {
      c2.context.logger.error("Failed to get user info", { provider: c2.body.provider });
      throw new APIError("UNAUTHORIZED", { message: BASE_ERROR_CODES.FAILED_TO_GET_USER_INFO });
    }
    if (!userInfo.user.email) {
      c2.context.logger.error("User email not found", { provider: c2.body.provider });
      throw new APIError("UNAUTHORIZED", { message: BASE_ERROR_CODES.USER_EMAIL_NOT_FOUND });
    }
    const data = await handleOAuthUserInfo(c2, {
      userInfo: {
        ...userInfo.user,
        email: userInfo.user.email,
        id: String(userInfo.user.id),
        name: userInfo.user.name || "",
        image: userInfo.user.image,
        emailVerified: userInfo.user.emailVerified || false
      },
      account: {
        providerId: provider.id,
        accountId: String(userInfo.user.id),
        accessToken: c2.body.idToken.accessToken
      },
      callbackURL: c2.body.callbackURL,
      disableSignUp: provider.disableImplicitSignUp && !c2.body.requestSignUp || provider.disableSignUp
    });
    if (data.error) throw new APIError("UNAUTHORIZED", { message: data.error });
    await setSessionCookie(c2, data.data);
    return c2.json({
      redirect: false,
      token: data.data.session.token,
      url: void 0,
      user: parseUserOutput(c2.context.options, data.data.user)
    });
  }
  const { codeVerifier, state } = await generateState(c2, void 0, c2.body.additionalData);
  const url = await provider.createAuthorizationURL({
    state,
    codeVerifier,
    redirectURI: `${c2.context.baseURL}/callback/${provider.id}`,
    scopes: c2.body.scopes,
    loginHint: c2.body.loginHint
  });
  if (!c2.body.disableRedirect) c2.setHeader("Location", url.toString());
  return c2.json({
    url: url.toString(),
    redirect: !c2.body.disableRedirect
  });
});
const signInEmail = () => createAuthEndpoint("/sign-in/email", {
  method: "POST",
  operationId: "signInEmail",
  use: [formCsrfMiddleware],
  body: z$1.object({
    email: z$1.string().meta({ description: "Email of the user" }),
    password: z$1.string().meta({ description: "Password of the user" }),
    callbackURL: z$1.string().meta({ description: "Callback URL to use as a redirect for email verification" }).optional(),
    rememberMe: z$1.boolean().meta({ description: "If this is false, the session will not be remembered. Default is `true`." }).default(true).optional()
  }),
  metadata: {
    allowedMediaTypes: ["application/x-www-form-urlencoded", "application/json"],
    $Infer: {
      body: {},
      returned: {}
    },
    openapi: {
      operationId: "signInEmail",
      description: "Sign in with email and password",
      responses: { "200": {
        description: "Success - Returns either session details or redirect URL",
        content: { "application/json": { schema: {
          type: "object",
          description: "Session response when idToken is provided",
          properties: {
            redirect: {
              type: "boolean",
              enum: [false]
            },
            token: {
              type: "string",
              description: "Session token"
            },
            url: {
              type: "string",
              nullable: true
            },
            user: {
              type: "object",
              $ref: "#/components/schemas/User"
            }
          },
          required: [
            "redirect",
            "token",
            "user"
          ]
        } } }
      } }
    }
  }
}, async (ctx) => {
  if (!ctx.context.options?.emailAndPassword?.enabled) {
    ctx.context.logger.error("Email and password is not enabled. Make sure to enable it in the options on you `auth.ts` file. Check `https://better-auth.com/docs/authentication/email-password` for more!");
    throw new APIError("BAD_REQUEST", { message: "Email and password is not enabled" });
  }
  const { email, password } = ctx.body;
  if (!z$1.email().safeParse(email).success) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.INVALID_EMAIL });
  const user2 = await ctx.context.internalAdapter.findUserByEmail(email, { includeAccounts: true });
  if (!user2) {
    await ctx.context.password.hash(password);
    ctx.context.logger.error("User not found", { email });
    throw new APIError("UNAUTHORIZED", { message: BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD });
  }
  const credentialAccount = user2.accounts.find((a2) => a2.providerId === "credential");
  if (!credentialAccount) {
    await ctx.context.password.hash(password);
    ctx.context.logger.error("Credential account not found", { email });
    throw new APIError("UNAUTHORIZED", { message: BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD });
  }
  const currentPassword = credentialAccount?.password;
  if (!currentPassword) {
    await ctx.context.password.hash(password);
    ctx.context.logger.error("Password not found", { email });
    throw new APIError("UNAUTHORIZED", { message: BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD });
  }
  if (!await ctx.context.password.verify({
    hash: currentPassword,
    password
  })) {
    ctx.context.logger.error("Invalid password");
    throw new APIError("UNAUTHORIZED", { message: BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD });
  }
  if (ctx.context.options?.emailAndPassword?.requireEmailVerification && !user2.user.emailVerified) {
    if (!ctx.context.options?.emailVerification?.sendVerificationEmail) throw new APIError("FORBIDDEN", { message: BASE_ERROR_CODES.EMAIL_NOT_VERIFIED });
    if (ctx.context.options?.emailVerification?.sendOnSignIn) {
      const token = await createEmailVerificationToken(ctx.context.secret, user2.user.email, void 0, ctx.context.options.emailVerification?.expiresIn);
      const callbackURL = ctx.body.callbackURL ? encodeURIComponent(ctx.body.callbackURL) : encodeURIComponent("/");
      const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
      await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
        user: user2.user,
        url,
        token
      }, ctx.request));
    }
    throw new APIError("FORBIDDEN", { message: BASE_ERROR_CODES.EMAIL_NOT_VERIFIED });
  }
  const session2 = await ctx.context.internalAdapter.createSession(user2.user.id, ctx.body.rememberMe === false);
  if (!session2) {
    ctx.context.logger.error("Failed to create session");
    throw new APIError("UNAUTHORIZED", { message: BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION });
  }
  await setSessionCookie(ctx, {
    session: session2,
    user: user2.user
  }, ctx.body.rememberMe === false);
  if (ctx.body.callbackURL) ctx.setHeader("Location", ctx.body.callbackURL);
  return ctx.json({
    redirect: !!ctx.body.callbackURL,
    token: session2.token,
    url: ctx.body.callbackURL,
    user: parseUserOutput(ctx.context.options, user2.user)
  });
});
const signOut = createAuthEndpoint("/sign-out", {
  method: "POST",
  operationId: "signOut",
  requireHeaders: true,
  metadata: { openapi: {
    operationId: "signOut",
    description: "Sign out the current user",
    responses: { "200": {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { success: { type: "boolean" } }
      } } }
    } }
  } }
}, async (ctx) => {
  const sessionCookieToken = await ctx.getSignedCookie(ctx.context.authCookies.sessionToken.name, ctx.context.secret);
  if (sessionCookieToken) try {
    await ctx.context.internalAdapter.deleteSession(sessionCookieToken);
  } catch (e2) {
    ctx.context.logger.error("Failed to delete session from database", e2);
  }
  deleteSessionCookie(ctx);
  return ctx.json({ success: true });
});
const signUpEmailBodySchema = z$1.object({
  name: z$1.string(),
  email: z$1.email(),
  password: z$1.string().nonempty(),
  image: z$1.string().optional(),
  callbackURL: z$1.string().optional(),
  rememberMe: z$1.boolean().optional()
}).and(z$1.record(z$1.string(), z$1.any()));
const signUpEmail = () => createAuthEndpoint("/sign-up/email", {
  method: "POST",
  operationId: "signUpWithEmailAndPassword",
  use: [formCsrfMiddleware],
  body: signUpEmailBodySchema,
  metadata: {
    allowedMediaTypes: ["application/x-www-form-urlencoded", "application/json"],
    $Infer: {
      body: {},
      returned: {}
    },
    openapi: {
      operationId: "signUpWithEmailAndPassword",
      description: "Sign up a user using email and password",
      requestBody: { content: { "application/json": { schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the user"
          },
          email: {
            type: "string",
            description: "The email of the user"
          },
          password: {
            type: "string",
            description: "The password of the user"
          },
          image: {
            type: "string",
            description: "The profile image URL of the user"
          },
          callbackURL: {
            type: "string",
            description: "The URL to use for email verification callback"
          },
          rememberMe: {
            type: "boolean",
            description: "If this is false, the session will not be remembered. Default is `true`."
          }
        },
        required: [
          "name",
          "email",
          "password"
        ]
      } } } },
      responses: {
        "200": {
          description: "Successfully created user",
          content: { "application/json": { schema: {
            type: "object",
            properties: {
              token: {
                type: "string",
                nullable: true,
                description: "Authentication token for the session"
              },
              user: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "The unique identifier of the user"
                  },
                  email: {
                    type: "string",
                    format: "email",
                    description: "The email address of the user"
                  },
                  name: {
                    type: "string",
                    description: "The name of the user"
                  },
                  image: {
                    type: "string",
                    format: "uri",
                    nullable: true,
                    description: "The profile image URL of the user"
                  },
                  emailVerified: {
                    type: "boolean",
                    description: "Whether the email has been verified"
                  },
                  createdAt: {
                    type: "string",
                    format: "date-time",
                    description: "When the user was created"
                  },
                  updatedAt: {
                    type: "string",
                    format: "date-time",
                    description: "When the user was last updated"
                  }
                },
                required: [
                  "id",
                  "email",
                  "name",
                  "emailVerified",
                  "createdAt",
                  "updatedAt"
                ]
              }
            },
            required: ["user"]
          } } }
        },
        "422": {
          description: "Unprocessable Entity. User already exists or failed to create user.",
          content: { "application/json": { schema: {
            type: "object",
            properties: { message: { type: "string" } }
          } } }
        }
      }
    }
  }
}, async (ctx) => {
  return runWithTransaction(ctx.context.adapter, async () => {
    if (!ctx.context.options.emailAndPassword?.enabled || ctx.context.options.emailAndPassword?.disableSignUp) throw new APIError("BAD_REQUEST", { message: "Email and password sign up is not enabled" });
    const body = ctx.body;
    const { name, email, password, image, callbackURL: _callbackURL, rememberMe, ...rest } = body;
    if (!z$1.email().safeParse(email).success) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.INVALID_EMAIL });
    if (!password || typeof password !== "string") throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.INVALID_PASSWORD });
    const minPasswordLength = ctx.context.password.config.minPasswordLength;
    if (password.length < minPasswordLength) {
      ctx.context.logger.error("Password is too short");
      throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.PASSWORD_TOO_SHORT });
    }
    const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
    if (password.length > maxPasswordLength) {
      ctx.context.logger.error("Password is too long");
      throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.PASSWORD_TOO_LONG });
    }
    if ((await ctx.context.internalAdapter.findUserByEmail(email))?.user) {
      ctx.context.logger.info(`Sign-up attempt for existing email: ${email}`);
      throw new APIError("UNPROCESSABLE_ENTITY", { message: BASE_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL });
    }
    const hash = await ctx.context.password.hash(password);
    let createdUser;
    try {
      const data = parseUserInput(ctx.context.options, rest, "create");
      createdUser = await ctx.context.internalAdapter.createUser({
        email: email.toLowerCase(),
        name,
        image,
        ...data,
        emailVerified: false
      });
      if (!createdUser) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.FAILED_TO_CREATE_USER });
    } catch (e2) {
      if (isDevelopment()) ctx.context.logger.error("Failed to create user", e2);
      if (e2 instanceof APIError) throw e2;
      ctx.context.logger?.error("Failed to create user", e2);
      throw new APIError("UNPROCESSABLE_ENTITY", { message: BASE_ERROR_CODES.FAILED_TO_CREATE_USER });
    }
    if (!createdUser) throw new APIError("UNPROCESSABLE_ENTITY", { message: BASE_ERROR_CODES.FAILED_TO_CREATE_USER });
    await ctx.context.internalAdapter.linkAccount({
      userId: createdUser.id,
      providerId: "credential",
      accountId: createdUser.id,
      password: hash
    });
    if (ctx.context.options.emailVerification?.sendOnSignUp || ctx.context.options.emailAndPassword.requireEmailVerification) {
      const token = await createEmailVerificationToken(ctx.context.secret, createdUser.email, void 0, ctx.context.options.emailVerification?.expiresIn);
      const callbackURL = body.callbackURL ? encodeURIComponent(body.callbackURL) : encodeURIComponent("/");
      const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
      if (ctx.context.options.emailVerification?.sendVerificationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
        user: createdUser,
        url,
        token
      }, ctx.request));
    }
    if (ctx.context.options.emailAndPassword.autoSignIn === false || ctx.context.options.emailAndPassword.requireEmailVerification) return ctx.json({
      token: null,
      user: parseUserOutput(ctx.context.options, createdUser)
    });
    const session2 = await ctx.context.internalAdapter.createSession(createdUser.id, rememberMe === false);
    if (!session2) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION });
    await setSessionCookie(ctx, {
      session: session2,
      user: createdUser
    }, rememberMe === false);
    return ctx.json({
      token: session2.token,
      user: parseUserOutput(ctx.context.options, createdUser)
    });
  });
});
const updateUserBodySchema = z$1.record(z$1.string().meta({ description: "Field name must be a string" }), z$1.any());
const updateUser = () => createAuthEndpoint("/update-user", {
  method: "POST",
  operationId: "updateUser",
  body: updateUserBodySchema,
  use: [sessionMiddleware],
  metadata: {
    $Infer: { body: {} },
    openapi: {
      operationId: "updateUser",
      description: "Update the current user",
      requestBody: { content: { "application/json": { schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the user"
          },
          image: {
            type: "string",
            description: "The image of the user",
            nullable: true
          }
        }
      } } } },
      responses: { "200": {
        description: "Success",
        content: { "application/json": { schema: {
          type: "object",
          properties: { user: {
            type: "object",
            $ref: "#/components/schemas/User"
          } }
        } } }
      } }
    }
  }
}, async (ctx) => {
  const body = ctx.body;
  if (typeof body !== "object" || Array.isArray(body)) throw new APIError("BAD_REQUEST", { message: "Body must be an object" });
  if (body.email) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.EMAIL_CAN_NOT_BE_UPDATED });
  const { name, image, ...rest } = body;
  const session2 = ctx.context.session;
  const additionalFields = parseUserInput(ctx.context.options, rest, "update");
  if (image === void 0 && name === void 0 && Object.keys(additionalFields).length === 0) throw new APIError("BAD_REQUEST", { message: "No fields to update" });
  const updatedUser = await ctx.context.internalAdapter.updateUser(session2.user.id, {
    name,
    image,
    ...additionalFields
  }) ?? {
    ...session2.user,
    ...name !== void 0 && { name },
    ...image !== void 0 && { image },
    ...additionalFields
  };
  await setSessionCookie(ctx, {
    session: session2.session,
    user: updatedUser
  });
  return ctx.json({ status: true });
});
const changePassword = createAuthEndpoint("/change-password", {
  method: "POST",
  operationId: "changePassword",
  body: z$1.object({
    newPassword: z$1.string().meta({ description: "The new password to set" }),
    currentPassword: z$1.string().meta({ description: "The current password is required" }),
    revokeOtherSessions: z$1.boolean().meta({ description: "Must be a boolean value" }).optional()
  }),
  use: [sensitiveSessionMiddleware],
  metadata: { openapi: {
    operationId: "changePassword",
    description: "Change the password of the user",
    responses: { "200": {
      description: "Password successfully changed",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          token: {
            type: "string",
            nullable: true,
            description: "New session token if other sessions were revoked"
          },
          user: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the user"
              },
              email: {
                type: "string",
                format: "email",
                description: "The email address of the user"
              },
              name: {
                type: "string",
                description: "The name of the user"
              },
              image: {
                type: "string",
                format: "uri",
                nullable: true,
                description: "The profile image URL of the user"
              },
              emailVerified: {
                type: "boolean",
                description: "Whether the email has been verified"
              },
              createdAt: {
                type: "string",
                format: "date-time",
                description: "When the user was created"
              },
              updatedAt: {
                type: "string",
                format: "date-time",
                description: "When the user was last updated"
              }
            },
            required: [
              "id",
              "email",
              "name",
              "emailVerified",
              "createdAt",
              "updatedAt"
            ]
          }
        },
        required: ["user"]
      } } }
    } }
  } }
}, async (ctx) => {
  const { newPassword, currentPassword, revokeOtherSessions: revokeOtherSessions2 } = ctx.body;
  const session2 = ctx.context.session;
  const minPasswordLength = ctx.context.password.config.minPasswordLength;
  if (newPassword.length < minPasswordLength) {
    ctx.context.logger.error("Password is too short");
    throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.PASSWORD_TOO_SHORT });
  }
  const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
  if (newPassword.length > maxPasswordLength) {
    ctx.context.logger.error("Password is too long");
    throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.PASSWORD_TOO_LONG });
  }
  const account2 = (await ctx.context.internalAdapter.findAccounts(session2.user.id)).find((account$1) => account$1.providerId === "credential" && account$1.password);
  if (!account2 || !account2.password) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.CREDENTIAL_ACCOUNT_NOT_FOUND });
  const passwordHash = await ctx.context.password.hash(newPassword);
  if (!await ctx.context.password.verify({
    hash: account2.password,
    password: currentPassword
  })) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.INVALID_PASSWORD });
  await ctx.context.internalAdapter.updateAccount(account2.id, { password: passwordHash });
  let token = null;
  if (revokeOtherSessions2) {
    await ctx.context.internalAdapter.deleteSessions(session2.user.id);
    const newSession = await ctx.context.internalAdapter.createSession(session2.user.id);
    if (!newSession) throw new APIError("INTERNAL_SERVER_ERROR", { message: BASE_ERROR_CODES.FAILED_TO_GET_SESSION });
    await setSessionCookie(ctx, {
      session: newSession,
      user: session2.user
    });
    token = newSession.token;
  }
  return ctx.json({
    token,
    user: parseUserOutput(ctx.context.options, session2.user)
  });
});
const setPassword = createAuthEndpoint({
  method: "POST",
  body: z$1.object({ newPassword: z$1.string().meta({ description: "The new password to set is required" }) }),
  use: [sensitiveSessionMiddleware]
}, async (ctx) => {
  const { newPassword } = ctx.body;
  const session2 = ctx.context.session;
  const minPasswordLength = ctx.context.password.config.minPasswordLength;
  if (newPassword.length < minPasswordLength) {
    ctx.context.logger.error("Password is too short");
    throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.PASSWORD_TOO_SHORT });
  }
  const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
  if (newPassword.length > maxPasswordLength) {
    ctx.context.logger.error("Password is too long");
    throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.PASSWORD_TOO_LONG });
  }
  const account2 = (await ctx.context.internalAdapter.findAccounts(session2.user.id)).find((account$1) => account$1.providerId === "credential" && account$1.password);
  const passwordHash = await ctx.context.password.hash(newPassword);
  if (!account2) {
    await ctx.context.internalAdapter.linkAccount({
      userId: session2.user.id,
      providerId: "credential",
      accountId: session2.user.id,
      password: passwordHash
    });
    return ctx.json({ status: true });
  }
  throw new APIError("BAD_REQUEST", { message: "user already has a password" });
});
const deleteUser = createAuthEndpoint("/delete-user", {
  method: "POST",
  use: [sensitiveSessionMiddleware],
  body: z$1.object({
    callbackURL: z$1.string().meta({ description: "The callback URL to redirect to after the user is deleted" }).optional(),
    password: z$1.string().meta({ description: "The password of the user is required to delete the user" }).optional(),
    token: z$1.string().meta({ description: "The token to delete the user is required" }).optional()
  }),
  metadata: { openapi: {
    operationId: "deleteUser",
    description: "Delete the user",
    requestBody: { content: { "application/json": { schema: {
      type: "object",
      properties: {
        callbackURL: {
          type: "string",
          description: "The callback URL to redirect to after the user is deleted"
        },
        password: {
          type: "string",
          description: "The user's password. Required if session is not fresh"
        },
        token: {
          type: "string",
          description: "The deletion verification token"
        }
      }
    } } } },
    responses: { "200": {
      description: "User deletion processed successfully",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Indicates if the operation was successful"
          },
          message: {
            type: "string",
            enum: ["User deleted", "Verification email sent"],
            description: "Status message of the deletion process"
          }
        },
        required: ["success", "message"]
      } } }
    } }
  } }
}, async (ctx) => {
  if (!ctx.context.options.user?.deleteUser?.enabled) {
    ctx.context.logger.error("Delete user is disabled. Enable it in the options");
    throw new APIError("NOT_FOUND");
  }
  const session2 = ctx.context.session;
  if (ctx.body.password) {
    const account2 = (await ctx.context.internalAdapter.findAccounts(session2.user.id)).find((account$1) => account$1.providerId === "credential" && account$1.password);
    if (!account2 || !account2.password) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.CREDENTIAL_ACCOUNT_NOT_FOUND });
    if (!await ctx.context.password.verify({
      hash: account2.password,
      password: ctx.body.password
    })) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.INVALID_PASSWORD });
  }
  if (ctx.body.token) {
    await deleteUserCallback({
      ...ctx,
      query: { token: ctx.body.token }
    });
    return ctx.json({
      success: true,
      message: "User deleted"
    });
  }
  if (ctx.context.options.user.deleteUser?.sendDeleteAccountVerification) {
    const token = generateRandomString(32, "0-9", "a-z");
    await ctx.context.internalAdapter.createVerificationValue({
      value: session2.user.id,
      identifier: `delete-account-${token}`,
      expiresAt: new Date(Date.now() + (ctx.context.options.user.deleteUser?.deleteTokenExpiresIn || 3600 * 24) * 1e3)
    });
    const url = `${ctx.context.baseURL}/delete-user/callback?token=${token}&callbackURL=${ctx.body.callbackURL || "/"}`;
    await ctx.context.runInBackgroundOrAwait(ctx.context.options.user.deleteUser.sendDeleteAccountVerification({
      user: session2.user,
      url,
      token
    }, ctx.request));
    return ctx.json({
      success: true,
      message: "Verification email sent"
    });
  }
  if (!ctx.body.password && ctx.context.sessionConfig.freshAge !== 0) {
    const currentAge = new Date(session2.session.createdAt).getTime();
    const freshAge = ctx.context.sessionConfig.freshAge * 1e3;
    if (Date.now() - currentAge > freshAge * 1e3) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.SESSION_EXPIRED });
  }
  const beforeDelete = ctx.context.options.user.deleteUser?.beforeDelete;
  if (beforeDelete) await beforeDelete(session2.user, ctx.request);
  await ctx.context.internalAdapter.deleteUser(session2.user.id);
  await ctx.context.internalAdapter.deleteSessions(session2.user.id);
  deleteSessionCookie(ctx);
  const afterDelete = ctx.context.options.user.deleteUser?.afterDelete;
  if (afterDelete) await afterDelete(session2.user, ctx.request);
  return ctx.json({
    success: true,
    message: "User deleted"
  });
});
const deleteUserCallback = createAuthEndpoint("/delete-user/callback", {
  method: "GET",
  query: z$1.object({
    token: z$1.string().meta({ description: "The token to verify the deletion request" }),
    callbackURL: z$1.string().meta({ description: "The URL to redirect to after deletion" }).optional()
  }),
  use: [originCheck((ctx) => ctx.query.callbackURL)],
  metadata: { openapi: {
    description: "Callback to complete user deletion with verification token",
    responses: { "200": {
      description: "User successfully deleted",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Indicates if the deletion was successful"
          },
          message: {
            type: "string",
            enum: ["User deleted"],
            description: "Confirmation message"
          }
        },
        required: ["success", "message"]
      } } }
    } }
  } }
}, async (ctx) => {
  if (!ctx.context.options.user?.deleteUser?.enabled) {
    ctx.context.logger.error("Delete user is disabled. Enable it in the options");
    throw new APIError("NOT_FOUND");
  }
  const session2 = await getSessionFromCtx(ctx);
  if (!session2) throw new APIError("NOT_FOUND", { message: BASE_ERROR_CODES.FAILED_TO_GET_USER_INFO });
  const token = await ctx.context.internalAdapter.findVerificationValue(`delete-account-${ctx.query.token}`);
  if (!token || token.expiresAt < /* @__PURE__ */ new Date()) throw new APIError("NOT_FOUND", { message: BASE_ERROR_CODES.INVALID_TOKEN });
  if (token.value !== session2.user.id) throw new APIError("NOT_FOUND", { message: BASE_ERROR_CODES.INVALID_TOKEN });
  const beforeDelete = ctx.context.options.user.deleteUser?.beforeDelete;
  if (beforeDelete) await beforeDelete(session2.user, ctx.request);
  await ctx.context.internalAdapter.deleteUser(session2.user.id);
  await ctx.context.internalAdapter.deleteSessions(session2.user.id);
  await ctx.context.internalAdapter.deleteAccounts(session2.user.id);
  await ctx.context.internalAdapter.deleteVerificationValue(token.id);
  deleteSessionCookie(ctx);
  const afterDelete = ctx.context.options.user.deleteUser?.afterDelete;
  if (afterDelete) await afterDelete(session2.user, ctx.request);
  if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL || "/");
  return ctx.json({
    success: true,
    message: "User deleted"
  });
});
const changeEmail = createAuthEndpoint("/change-email", {
  method: "POST",
  body: z$1.object({
    newEmail: z$1.email().meta({ description: "The new email address to set must be a valid email address" }),
    callbackURL: z$1.string().meta({ description: "The URL to redirect to after email verification" }).optional()
  }),
  use: [sensitiveSessionMiddleware],
  metadata: { openapi: {
    operationId: "changeEmail",
    responses: {
      "200": {
        description: "Email change request processed successfully",
        content: { "application/json": { schema: {
          type: "object",
          properties: {
            user: {
              type: "object",
              $ref: "#/components/schemas/User"
            },
            status: {
              type: "boolean",
              description: "Indicates if the request was successful"
            },
            message: {
              type: "string",
              enum: ["Email updated", "Verification email sent"],
              description: "Status message of the email change process",
              nullable: true
            }
          },
          required: ["status"]
        } } }
      },
      "422": {
        description: "Unprocessable Entity. Email already exists",
        content: { "application/json": { schema: {
          type: "object",
          properties: { message: { type: "string" } }
        } } }
      }
    }
  } }
}, async (ctx) => {
  if (!ctx.context.options.user?.changeEmail?.enabled) {
    ctx.context.logger.error("Change email is disabled.");
    throw new APIError("BAD_REQUEST", { message: "Change email is disabled" });
  }
  const newEmail = ctx.body.newEmail.toLowerCase();
  if (newEmail === ctx.context.session.user.email) {
    ctx.context.logger.error("Email is the same");
    throw new APIError("BAD_REQUEST", { message: "Email is the same" });
  }
  if (await ctx.context.internalAdapter.findUserByEmail(newEmail)) {
    ctx.context.logger.error("Email already exists");
    throw new APIError("UNPROCESSABLE_ENTITY", { message: BASE_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL });
  }
  if (ctx.context.session.user.emailVerified !== true && ctx.context.options.user.changeEmail.updateEmailWithoutVerification) {
    await ctx.context.internalAdapter.updateUserByEmail(ctx.context.session.user.email, { email: newEmail });
    await setSessionCookie(ctx, {
      session: ctx.context.session.session,
      user: {
        ...ctx.context.session.user,
        email: newEmail
      }
    });
    if (ctx.context.options.emailVerification?.sendVerificationEmail) {
      const token$1 = await createEmailVerificationToken(ctx.context.secret, newEmail, void 0, ctx.context.options.emailVerification?.expiresIn);
      const url$1 = `${ctx.context.baseURL}/verify-email?token=${token$1}&callbackURL=${ctx.body.callbackURL || "/"}`;
      await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
        user: {
          ...ctx.context.session.user,
          email: newEmail
        },
        url: url$1,
        token: token$1
      }, ctx.request));
    }
    return ctx.json({ status: true });
  }
  if (ctx.context.session.user.emailVerified && (ctx.context.options.user.changeEmail.sendChangeEmailConfirmation || ctx.context.options.user.changeEmail.sendChangeEmailVerification)) {
    const token$1 = await createEmailVerificationToken(ctx.context.secret, ctx.context.session.user.email, newEmail, ctx.context.options.emailVerification?.expiresIn, { requestType: "change-email-confirmation" });
    const url$1 = `${ctx.context.baseURL}/verify-email?token=${token$1}&callbackURL=${ctx.body.callbackURL || "/"}`;
    const sendFn = ctx.context.options.user.changeEmail.sendChangeEmailConfirmation || ctx.context.options.user.changeEmail.sendChangeEmailVerification;
    if (sendFn) await ctx.context.runInBackgroundOrAwait(sendFn({
      user: ctx.context.session.user,
      newEmail,
      url: url$1,
      token: token$1
    }, ctx.request));
    return ctx.json({ status: true });
  }
  if (!ctx.context.options.emailVerification?.sendVerificationEmail) {
    ctx.context.logger.error("Verification email isn't enabled.");
    throw new APIError("BAD_REQUEST", { message: "Verification email isn't enabled" });
  }
  const token = await createEmailVerificationToken(ctx.context.secret, ctx.context.session.user.email, newEmail, ctx.context.options.emailVerification?.expiresIn, { requestType: "change-email-verification" });
  const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${ctx.body.callbackURL || "/"}`;
  await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
    user: {
      ...ctx.context.session.user,
      email: newEmail
    },
    url,
    token
  }, ctx.request));
  return ctx.json({ status: true });
});
const defuReplaceArrays = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value)) {
    obj[key] = value;
    return true;
  }
});
const hooksSourceWeakMap = /* @__PURE__ */ new WeakMap();
function toAuthEndpoints(endpoints, ctx) {
  const api = {};
  for (const [key, endpoint] of Object.entries(endpoints)) {
    api[key] = async (context) => {
      const run = async () => {
        const authContext = await ctx;
        let internalContext = {
          ...context,
          context: {
            ...authContext,
            returned: void 0,
            responseHeaders: void 0,
            session: null
          },
          path: endpoint.path,
          headers: context?.headers ? new Headers(context?.headers) : void 0
        };
        return runWithEndpointContext(internalContext, async () => {
          const { beforeHooks, afterHooks } = getHooks(authContext);
          const before = await runBeforeHooks(internalContext, beforeHooks);
          if ("context" in before && before.context && typeof before.context === "object") {
            const { headers, ...rest } = before.context;
            if (headers) headers.forEach((value, key$1) => {
              internalContext.headers.set(key$1, value);
            });
            internalContext = defuReplaceArrays(rest, internalContext);
          } else if (before) return context?.asResponse ? toResponse(before, { headers: context?.headers }) : context?.returnHeaders ? {
            headers: context?.headers,
            response: before
          } : before;
          internalContext.asResponse = false;
          internalContext.returnHeaders = true;
          internalContext.returnStatus = true;
          const result = await runWithEndpointContext(internalContext, () => endpoint(internalContext)).catch((e2) => {
            if (e2 instanceof APIError)
              return {
                response: e2,
                status: e2.statusCode,
                headers: e2.headers ? new Headers(e2.headers) : null
              };
            throw e2;
          });
          if (result && result instanceof Response) return result;
          internalContext.context.returned = result.response;
          internalContext.context.responseHeaders = result.headers;
          const after = await runAfterHooks(internalContext, afterHooks);
          if (after.response) result.response = after.response;
          if (result.response instanceof APIError && shouldPublishLog(authContext.logger.level, "debug")) result.response.stack = result.response.errorStack;
          if (result.response instanceof APIError && !context?.asResponse) throw result.response;
          return context?.asResponse ? toResponse(result.response, {
            headers: result.headers,
            status: result.status
          }) : context?.returnHeaders ? context?.returnStatus ? {
            headers: result.headers,
            response: result.response,
            status: result.status
          } : {
            headers: result.headers,
            response: result.response
          } : context?.returnStatus ? {
            response: result.response,
            status: result.status
          } : result.response;
        });
      };
      if (await hasRequestState()) return run();
      else return runWithRequestState(/* @__PURE__ */ new WeakMap(), run);
    };
    api[key].path = endpoint.path;
    api[key].options = endpoint.options;
  }
  return api;
}
async function runBeforeHooks(context, hooks) {
  let modifiedContext = {};
  for (const hook of hooks) {
    let matched = false;
    try {
      matched = hook.matcher(context);
    } catch (error2) {
      const hookSource = hooksSourceWeakMap.get(hook.handler) ?? "unknown";
      context.context.logger.error(`An error occurred during ${hookSource} hook matcher execution:`, error2);
      throw new APIError("INTERNAL_SERVER_ERROR", { message: `An error occurred during hook matcher execution. Check the logs for more details.` });
    }
    if (matched) {
      const result = await hook.handler({
        ...context,
        returnHeaders: false
      }).catch((e2) => {
        if (e2 instanceof APIError && shouldPublishLog(context.context.logger.level, "debug")) e2.stack = e2.errorStack;
        throw e2;
      });
      if (result && typeof result === "object") {
        if ("context" in result && typeof result.context === "object") {
          const { headers, ...rest } = result.context;
          if (headers instanceof Headers) if (modifiedContext.headers) headers.forEach((value, key) => {
            modifiedContext.headers?.set(key, value);
          });
          else modifiedContext.headers = headers;
          modifiedContext = defuReplaceArrays(rest, modifiedContext);
          continue;
        }
        return result;
      }
    }
  }
  return { context: modifiedContext };
}
async function runAfterHooks(context, hooks) {
  for (const hook of hooks) if (hook.matcher(context)) {
    const result = await hook.handler(context).catch((e2) => {
      if (e2 instanceof APIError) {
        if (shouldPublishLog(context.context.logger.level, "debug")) e2.stack = e2.errorStack;
        return {
          response: e2,
          headers: e2.headers ? new Headers(e2.headers) : null
        };
      }
      throw e2;
    });
    if (result.headers) result.headers.forEach((value, key) => {
      if (!context.context.responseHeaders) context.context.responseHeaders = new Headers({ [key]: value });
      else if (key.toLowerCase() === "set-cookie") context.context.responseHeaders.append(key, value);
      else context.context.responseHeaders.set(key, value);
    });
    if (result.response) context.context.returned = result.response;
  }
  return {
    response: context.context.returned,
    headers: context.context.responseHeaders
  };
}
function getHooks(authContext) {
  const plugins = authContext.options.plugins || [];
  const beforeHooks = [];
  const afterHooks = [];
  const beforeHookHandler = authContext.options.hooks?.before;
  if (beforeHookHandler) {
    hooksSourceWeakMap.set(beforeHookHandler, "user");
    beforeHooks.push({
      matcher: () => true,
      handler: beforeHookHandler
    });
  }
  const afterHookHandler = authContext.options.hooks?.after;
  if (afterHookHandler) {
    hooksSourceWeakMap.set(afterHookHandler, "user");
    afterHooks.push({
      matcher: () => true,
      handler: afterHookHandler
    });
  }
  const pluginBeforeHooks = plugins.filter((plugin) => plugin.hooks?.before).map((plugin) => plugin.hooks?.before).flat();
  const pluginAfterHooks = plugins.filter((plugin) => plugin.hooks?.after).map((plugin) => plugin.hooks?.after).flat();
  if (pluginBeforeHooks.length) beforeHooks.push(...pluginBeforeHooks);
  if (pluginAfterHooks.length) afterHooks.push(...pluginAfterHooks);
  return {
    beforeHooks,
    afterHooks
  };
}
function checkEndpointConflicts(options, logger$1) {
  const endpointRegistry = /* @__PURE__ */ new Map();
  options.plugins?.forEach((plugin) => {
    if (plugin.endpoints) {
      for (const [key, endpoint] of Object.entries(plugin.endpoints)) if (endpoint && "path" in endpoint && typeof endpoint.path === "string") {
        const path = endpoint.path;
        let methods = [];
        if (endpoint.options && "method" in endpoint.options) {
          if (Array.isArray(endpoint.options.method)) methods = endpoint.options.method;
          else if (typeof endpoint.options.method === "string") methods = [endpoint.options.method];
        }
        if (methods.length === 0) methods = ["*"];
        if (!endpointRegistry.has(path)) endpointRegistry.set(path, []);
        endpointRegistry.get(path).push({
          pluginId: plugin.id,
          endpointKey: key,
          methods
        });
      }
    }
  });
  const conflicts = [];
  for (const [path, entries] of endpointRegistry.entries()) if (entries.length > 1) {
    const methodMap = /* @__PURE__ */ new Map();
    let hasConflict = false;
    for (const entry of entries) for (const method of entry.methods) {
      if (!methodMap.has(method)) methodMap.set(method, []);
      methodMap.get(method).push(entry.pluginId);
      if (methodMap.get(method).length > 1) hasConflict = true;
      if (method === "*" && entries.length > 1) hasConflict = true;
      else if (method !== "*" && methodMap.has("*")) hasConflict = true;
    }
    if (hasConflict) {
      const uniquePlugins = [...new Set(entries.map((e2) => e2.pluginId))];
      const conflictingMethods = [];
      for (const [method, plugins] of methodMap.entries()) if (plugins.length > 1 || method === "*" && entries.length > 1 || method !== "*" && methodMap.has("*")) conflictingMethods.push(method);
      conflicts.push({
        path,
        plugins: uniquePlugins,
        conflictingMethods
      });
    }
  }
  if (conflicts.length > 0) {
    const conflictMessages = conflicts.map((conflict) => `  - "${conflict.path}" [${conflict.conflictingMethods.join(", ")}] used by plugins: ${conflict.plugins.join(", ")}`).join("\n");
    logger$1.error(`Endpoint path conflicts detected! Multiple plugins are trying to use the same endpoint paths with conflicting HTTP methods:
${conflictMessages}

To resolve this, you can:
	1. Use only one of the conflicting plugins
	2. Configure the plugins to use different paths (if supported)
	3. Ensure plugins use different HTTP methods for the same path
`);
  }
}
function getEndpoints(ctx, options) {
  const pluginEndpoints = options.plugins?.reduce((acc, plugin) => {
    return {
      ...acc,
      ...plugin.endpoints
    };
  }, {}) ?? {};
  const middlewares = options.plugins?.map((plugin) => plugin.middlewares?.map((m2) => {
    const middleware = (async (context) => {
      const authContext = await ctx;
      return m2.middleware({
        ...context,
        context: {
          ...authContext,
          ...context.context
        }
      });
    });
    middleware.options = m2.middleware.options;
    return {
      path: m2.path,
      middleware
    };
  })).filter((plugin) => plugin !== void 0).flat() || [];
  return {
    api: toAuthEndpoints({
      signInSocial: signInSocial(),
      callbackOAuth,
      getSession: getSession(),
      signOut,
      signUpEmail: signUpEmail(),
      signInEmail: signInEmail(),
      resetPassword,
      verifyPassword,
      verifyEmail,
      sendVerificationEmail,
      changeEmail,
      changePassword,
      setPassword,
      updateUser: updateUser(),
      deleteUser,
      requestPasswordReset,
      requestPasswordResetCallback,
      listSessions: listSessions(),
      revokeSession,
      revokeSessions,
      revokeOtherSessions,
      linkSocialAccount,
      listUserAccounts,
      deleteUserCallback,
      unlinkAccount,
      refreshToken,
      getAccessToken,
      accountInfo,
      ...pluginEndpoints,
      ok,
      error
    }, ctx),
    middlewares
  };
}
const router = (ctx, options) => {
  const { api, middlewares } = getEndpoints(ctx, options);
  const basePath = new URL(ctx.baseURL).pathname;
  return createRouter$1(api, {
    routerContext: ctx,
    openapi: { disabled: true },
    basePath,
    routerMiddleware: [{
      path: "/**",
      middleware: originCheckMiddleware
    }, ...middlewares],
    allowedMediaTypes: ["application/json"],
    skipTrailingSlashes: options.advanced?.skipTrailingSlashes ?? false,
    async onRequest(req) {
      const disabledPaths = ctx.options.disabledPaths || [];
      const pathname = new URL(req.url).pathname.replace(/\/+$/, "") || "/";
      const normalizedPath = basePath === "/" ? pathname : pathname.startsWith(basePath) ? pathname.slice(basePath.length).replace(/\/+$/, "") || "/" : pathname;
      if (disabledPaths.includes(normalizedPath)) return new Response("Not Found", { status: 404 });
      let currentRequest = req;
      for (const plugin of ctx.options.plugins || []) if (plugin.onRequest) {
        const response = await plugin.onRequest(currentRequest, ctx);
        if (response && "response" in response) return response.response;
        if (response && "request" in response) currentRequest = response.request;
      }
      const rateLimitResponse2 = await onRequestRateLimit(currentRequest, ctx);
      if (rateLimitResponse2) return rateLimitResponse2;
      return currentRequest;
    },
    async onResponse(res) {
      for (const plugin of ctx.options.plugins || []) if (plugin.onResponse) {
        const response = await plugin.onResponse(res, ctx);
        if (response) return response.response;
      }
      return res;
    },
    onError(e2) {
      if (e2 instanceof APIError && e2.status === "FOUND") return;
      if (options.onAPIError?.throw) throw e2;
      if (options.onAPIError?.onError) {
        options.onAPIError.onError(e2, ctx);
        return;
      }
      const optLogLevel = options.logger?.level;
      const log = optLogLevel === "error" || optLogLevel === "warn" || optLogLevel === "debug" ? logger : void 0;
      if (options.logger?.disabled !== true) {
        if (e2 && typeof e2 === "object" && "message" in e2 && typeof e2.message === "string") {
          if (e2.message.includes("no column") || e2.message.includes("column") || e2.message.includes("relation") || e2.message.includes("table") || e2.message.includes("does not exist")) {
            ctx.logger?.error(e2.message);
            return;
          }
        }
        if (e2 instanceof APIError) {
          if (e2.status === "INTERNAL_SERVER_ERROR") ctx.logger.error(e2.status, e2);
          log?.error(e2.message);
        } else ctx.logger?.error(e2 && typeof e2 === "object" && "name" in e2 ? e2.name : "", e2);
      }
    }
  });
};
const DEFAULT_SECRET = "better-auth-secret-12345678901234567890";
function isPromise(obj) {
  return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}
async function runPluginInit(ctx) {
  let options = ctx.options;
  const plugins = options.plugins || [];
  let context = ctx;
  const dbHooks = [];
  for (const plugin of plugins) if (plugin.init) {
    const initPromise = plugin.init(context);
    let result;
    if (isPromise(initPromise)) result = await initPromise;
    else result = initPromise;
    if (typeof result === "object") {
      if (result.options) {
        const { databaseHooks, ...restOpts } = result.options;
        if (databaseHooks) dbHooks.push(databaseHooks);
        options = defu(options, restOpts);
      }
      if (result.context) context = {
        ...context,
        ...result.context
      };
    }
  }
  dbHooks.push(options.databaseHooks);
  context.internalAdapter = createInternalAdapter(context.adapter, {
    options,
    logger: context.logger,
    hooks: dbHooks.filter((u2) => u2 !== void 0),
    generateId: context.generateId
  });
  context.options = options;
  return { context };
}
function getInternalPlugins(options) {
  const plugins = [];
  if (options.advanced?.crossSubDomainCookies?.enabled) ;
  return plugins;
}
async function getTrustedOrigins(options, request2) {
  const baseURL = getBaseURL(options.baseURL, options.basePath);
  const trustedOrigins = baseURL ? [new URL(baseURL).origin] : [];
  if (options.trustedOrigins) {
    if (Array.isArray(options.trustedOrigins)) trustedOrigins.push(...options.trustedOrigins);
    if (typeof options.trustedOrigins === "function") {
      const validOrigins = await options.trustedOrigins(request2);
      trustedOrigins.push(...validOrigins);
    }
  }
  const envTrustedOrigins = env.BETTER_AUTH_TRUSTED_ORIGINS;
  if (envTrustedOrigins) trustedOrigins.push(...envTrustedOrigins.split(","));
  return trustedOrigins.filter((v2) => Boolean(v2));
}
function getTelemetryAuthConfig(options, context) {
  return {
    database: context?.database,
    adapter: context?.adapter,
    emailVerification: {
      sendVerificationEmail: !!options.emailVerification?.sendVerificationEmail,
      sendOnSignUp: !!options.emailVerification?.sendOnSignUp,
      sendOnSignIn: !!options.emailVerification?.sendOnSignIn,
      autoSignInAfterVerification: !!options.emailVerification?.autoSignInAfterVerification,
      expiresIn: options.emailVerification?.expiresIn,
      onEmailVerification: !!options.emailVerification?.onEmailVerification,
      afterEmailVerification: !!options.emailVerification?.afterEmailVerification
    },
    emailAndPassword: {
      enabled: !!options.emailAndPassword?.enabled,
      disableSignUp: !!options.emailAndPassword?.disableSignUp,
      requireEmailVerification: !!options.emailAndPassword?.requireEmailVerification,
      maxPasswordLength: options.emailAndPassword?.maxPasswordLength,
      minPasswordLength: options.emailAndPassword?.minPasswordLength,
      sendResetPassword: !!options.emailAndPassword?.sendResetPassword,
      resetPasswordTokenExpiresIn: options.emailAndPassword?.resetPasswordTokenExpiresIn,
      onPasswordReset: !!options.emailAndPassword?.onPasswordReset,
      password: {
        hash: !!options.emailAndPassword?.password?.hash,
        verify: !!options.emailAndPassword?.password?.verify
      },
      autoSignIn: !!options.emailAndPassword?.autoSignIn,
      revokeSessionsOnPasswordReset: !!options.emailAndPassword?.revokeSessionsOnPasswordReset
    },
    socialProviders: Object.keys(options.socialProviders || {}).map((p2) => {
      const provider = options.socialProviders?.[p2];
      if (!provider) return {};
      return {
        id: p2,
        mapProfileToUser: !!provider.mapProfileToUser,
        disableDefaultScope: !!provider.disableDefaultScope,
        disableIdTokenSignIn: !!provider.disableIdTokenSignIn,
        disableImplicitSignUp: provider.disableImplicitSignUp,
        disableSignUp: provider.disableSignUp,
        getUserInfo: !!provider.getUserInfo,
        overrideUserInfoOnSignIn: !!provider.overrideUserInfoOnSignIn,
        prompt: provider.prompt,
        verifyIdToken: !!provider.verifyIdToken,
        scope: provider.scope,
        refreshAccessToken: !!provider.refreshAccessToken
      };
    }),
    plugins: options.plugins?.map((p2) => p2.id.toString()),
    user: {
      modelName: options.user?.modelName,
      fields: options.user?.fields,
      additionalFields: options.user?.additionalFields,
      changeEmail: {
        enabled: options.user?.changeEmail?.enabled,
        sendChangeEmailVerification: !!options.user?.changeEmail?.sendChangeEmailVerification
      }
    },
    verification: {
      modelName: options.verification?.modelName,
      disableCleanup: options.verification?.disableCleanup,
      fields: options.verification?.fields
    },
    session: {
      modelName: options.session?.modelName,
      additionalFields: options.session?.additionalFields,
      cookieCache: {
        enabled: options.session?.cookieCache?.enabled,
        maxAge: options.session?.cookieCache?.maxAge,
        strategy: options.session?.cookieCache?.strategy
      },
      disableSessionRefresh: options.session?.disableSessionRefresh,
      expiresIn: options.session?.expiresIn,
      fields: options.session?.fields,
      freshAge: options.session?.freshAge,
      preserveSessionInDatabase: options.session?.preserveSessionInDatabase,
      storeSessionInDatabase: options.session?.storeSessionInDatabase,
      updateAge: options.session?.updateAge
    },
    account: {
      modelName: options.account?.modelName,
      fields: options.account?.fields,
      encryptOAuthTokens: options.account?.encryptOAuthTokens,
      updateAccountOnSignIn: options.account?.updateAccountOnSignIn,
      accountLinking: {
        enabled: options.account?.accountLinking?.enabled,
        trustedProviders: options.account?.accountLinking?.trustedProviders,
        updateUserInfoOnLink: options.account?.accountLinking?.updateUserInfoOnLink,
        allowUnlinkingAll: options.account?.accountLinking?.allowUnlinkingAll
      }
    },
    hooks: {
      after: !!options.hooks?.after,
      before: !!options.hooks?.before
    },
    secondaryStorage: !!options.secondaryStorage,
    advanced: {
      cookiePrefix: !!options.advanced?.cookiePrefix,
      cookies: !!options.advanced?.cookies,
      crossSubDomainCookies: {
        domain: !!options.advanced?.crossSubDomainCookies?.domain,
        enabled: options.advanced?.crossSubDomainCookies?.enabled,
        additionalCookies: options.advanced?.crossSubDomainCookies?.additionalCookies
      },
      database: {
        useNumberId: !!options.advanced?.database?.useNumberId || options.advanced?.database?.generateId === "serial",
        generateId: options.advanced?.database?.generateId,
        defaultFindManyLimit: options.advanced?.database?.defaultFindManyLimit
      },
      useSecureCookies: options.advanced?.useSecureCookies,
      ipAddress: {
        disableIpTracking: options.advanced?.ipAddress?.disableIpTracking,
        ipAddressHeaders: options.advanced?.ipAddress?.ipAddressHeaders
      },
      disableCSRFCheck: options.advanced?.disableCSRFCheck,
      cookieAttributes: {
        expires: options.advanced?.defaultCookieAttributes?.expires,
        secure: options.advanced?.defaultCookieAttributes?.secure,
        sameSite: options.advanced?.defaultCookieAttributes?.sameSite,
        domain: !!options.advanced?.defaultCookieAttributes?.domain,
        path: options.advanced?.defaultCookieAttributes?.path,
        httpOnly: options.advanced?.defaultCookieAttributes?.httpOnly
      }
    },
    trustedOrigins: options.trustedOrigins?.length,
    rateLimit: {
      storage: options.rateLimit?.storage,
      modelName: options.rateLimit?.modelName,
      window: options.rateLimit?.window,
      customStorage: !!options.rateLimit?.customStorage,
      enabled: options.rateLimit?.enabled,
      max: options.rateLimit?.max
    },
    onAPIError: {
      errorURL: options.onAPIError?.errorURL,
      onError: !!options.onAPIError?.onError,
      throw: options.onAPIError?.throw
    },
    logger: {
      disabled: options.logger?.disabled,
      level: options.logger?.level,
      log: !!options.logger?.log
    },
    databaseHooks: {
      user: {
        create: {
          after: !!options.databaseHooks?.user?.create?.after,
          before: !!options.databaseHooks?.user?.create?.before
        },
        update: {
          after: !!options.databaseHooks?.user?.update?.after,
          before: !!options.databaseHooks?.user?.update?.before
        }
      },
      session: {
        create: {
          after: !!options.databaseHooks?.session?.create?.after,
          before: !!options.databaseHooks?.session?.create?.before
        },
        update: {
          after: !!options.databaseHooks?.session?.update?.after,
          before: !!options.databaseHooks?.session?.update?.before
        }
      },
      account: {
        create: {
          after: !!options.databaseHooks?.account?.create?.after,
          before: !!options.databaseHooks?.account?.create?.before
        },
        update: {
          after: !!options.databaseHooks?.account?.update?.after,
          before: !!options.databaseHooks?.account?.update?.before
        }
      },
      verification: {
        create: {
          after: !!options.databaseHooks?.verification?.create?.after,
          before: !!options.databaseHooks?.verification?.create?.before
        },
        update: {
          after: !!options.databaseHooks?.verification?.update?.after,
          before: !!options.databaseHooks?.verification?.update?.before
        }
      }
    }
  };
}
let packageJSONCache;
async function readRootPackageJson() {
  if (packageJSONCache) return packageJSONCache;
  try {
    const cwd = typeof process !== "undefined" && typeof process.cwd === "function" ? process.cwd() : "";
    if (!cwd) return void 0;
    const importRuntime$1 = (m2) => Function("mm", "return import(mm)")(m2);
    const [{ default: fs }, { default: path }] = await Promise.all([importRuntime$1("fs/promises"), importRuntime$1("path")]);
    const raw = await fs.readFile(path.join(cwd, "package.json"), "utf-8");
    packageJSONCache = JSON.parse(raw);
    return packageJSONCache;
  } catch {
  }
}
async function getPackageVersion(pkg) {
  if (packageJSONCache) return packageJSONCache.dependencies?.[pkg] || packageJSONCache.devDependencies?.[pkg] || packageJSONCache.peerDependencies?.[pkg];
  try {
    const cwd = typeof process !== "undefined" && typeof process.cwd === "function" ? process.cwd() : "";
    if (!cwd) throw new Error("no-cwd");
    const importRuntime$1 = (m2) => Function("mm", "return import(mm)")(m2);
    const [{ default: fs }, { default: path }] = await Promise.all([importRuntime$1("fs/promises"), importRuntime$1("path")]);
    const pkgJsonPath = path.join(cwd, "node_modules", pkg, "package.json");
    const raw = await fs.readFile(pkgJsonPath, "utf-8");
    return JSON.parse(raw).version || await getVersionFromLocalPackageJson(pkg) || void 0;
  } catch {
  }
  return await getVersionFromLocalPackageJson(pkg);
}
async function getVersionFromLocalPackageJson(pkg) {
  const json = await readRootPackageJson();
  if (!json) return void 0;
  return {
    ...json.dependencies,
    ...json.devDependencies,
    ...json.peerDependencies
  }[pkg];
}
async function getNameFromLocalPackageJson() {
  return (await readRootPackageJson())?.name;
}
const DATABASES = {
  pg: "postgresql",
  mysql: "mysql",
  mariadb: "mariadb",
  sqlite3: "sqlite",
  "better-sqlite3": "sqlite",
  "@prisma/client": "prisma",
  mongoose: "mongodb",
  mongodb: "mongodb",
  "drizzle-orm": "drizzle"
};
async function detectDatabase() {
  for (const [pkg, name] of Object.entries(DATABASES)) {
    const version2 = await getPackageVersion(pkg);
    if (version2) return {
      name,
      version: version2
    };
  }
}
const FRAMEWORKS = {
  next: "next",
  nuxt: "nuxt",
  "@remix-run/server-runtime": "remix",
  astro: "astro",
  "@sveltejs/kit": "sveltekit",
  "solid-start": "solid-start",
  "tanstack-start": "tanstack-start",
  hono: "hono",
  express: "express",
  elysia: "elysia",
  expo: "expo"
};
async function detectFramework() {
  for (const [pkg, name] of Object.entries(FRAMEWORKS)) {
    const version2 = await getPackageVersion(pkg);
    if (version2) return {
      name,
      version: version2
    };
  }
}
function detectPackageManager() {
  const userAgent = env.npm_config_user_agent;
  if (!userAgent) return;
  const pmSpec = userAgent.split(" ")[0];
  const separatorPos = pmSpec.lastIndexOf("/");
  const name = pmSpec.substring(0, separatorPos);
  return {
    name: name === "npminstall" ? "cnpm" : name,
    version: pmSpec.substring(separatorPos + 1)
  };
}
const importRuntime = (m2) => {
  return Function("mm", "return import(mm)")(m2);
};
function getVendor() {
  const hasAny = (...keys) => keys.some((k2) => Boolean(env[k2]));
  if (hasAny("CF_PAGES", "CF_PAGES_URL", "CF_ACCOUNT_ID") || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers") return "cloudflare";
  if (hasAny("VERCEL", "VERCEL_URL", "VERCEL_ENV")) return "vercel";
  if (hasAny("NETLIFY", "NETLIFY_URL")) return "netlify";
  if (hasAny("RENDER", "RENDER_URL", "RENDER_INTERNAL_HOSTNAME", "RENDER_SERVICE_ID")) return "render";
  if (hasAny("AWS_LAMBDA_FUNCTION_NAME", "AWS_EXECUTION_ENV", "LAMBDA_TASK_ROOT")) return "aws";
  if (hasAny("GOOGLE_CLOUD_FUNCTION_NAME", "GOOGLE_CLOUD_PROJECT", "GCP_PROJECT", "K_SERVICE")) return "gcp";
  if (hasAny("AZURE_FUNCTION_NAME", "FUNCTIONS_WORKER_RUNTIME", "WEBSITE_INSTANCE_ID", "WEBSITE_SITE_NAME")) return "azure";
  if (hasAny("DENO_DEPLOYMENT_ID", "DENO_REGION")) return "deno-deploy";
  if (hasAny("FLY_APP_NAME", "FLY_REGION", "FLY_ALLOC_ID")) return "fly-io";
  if (hasAny("RAILWAY_STATIC_URL", "RAILWAY_ENVIRONMENT_NAME")) return "railway";
  if (hasAny("DYNO", "HEROKU_APP_NAME")) return "heroku";
  if (hasAny("DO_DEPLOYMENT_ID", "DO_APP_NAME", "DIGITALOCEAN")) return "digitalocean";
  if (hasAny("KOYEB", "KOYEB_DEPLOYMENT_ID", "KOYEB_APP_NAME")) return "koyeb";
  return null;
}
async function detectSystemInfo() {
  try {
    if (getVendor() === "cloudflare") return "cloudflare";
    const os = await importRuntime("os");
    const cpus = os.cpus();
    return {
      deploymentVendor: getVendor(),
      systemPlatform: os.platform(),
      systemRelease: os.release(),
      systemArchitecture: os.arch(),
      cpuCount: cpus.length,
      cpuModel: cpus.length ? cpus[0].model : null,
      cpuSpeed: cpus.length ? cpus[0].speed : null,
      memory: os.totalmem(),
      isWSL: await isWsl(),
      isDocker: await isDocker(),
      isTTY: typeof process !== "undefined" && process.stdout ? process.stdout.isTTY : null
    };
  } catch {
    return {
      systemPlatform: null,
      systemRelease: null,
      systemArchitecture: null,
      cpuCount: null,
      cpuModel: null,
      cpuSpeed: null,
      memory: null,
      isWSL: null,
      isDocker: null,
      isTTY: null
    };
  }
}
let isDockerCached;
async function hasDockerEnv() {
  if (getVendor() === "cloudflare") return false;
  try {
    (await importRuntime("fs")).statSync("/.dockerenv");
    return true;
  } catch {
    return false;
  }
}
async function hasDockerCGroup() {
  if (getVendor() === "cloudflare") return false;
  try {
    return (await importRuntime("fs")).readFileSync("/proc/self/cgroup", "utf8").includes("docker");
  } catch {
    return false;
  }
}
async function isDocker() {
  if (getVendor() === "cloudflare") return false;
  if (isDockerCached === void 0) isDockerCached = await hasDockerEnv() || await hasDockerCGroup();
  return isDockerCached;
}
async function isWsl() {
  try {
    if (getVendor() === "cloudflare") return false;
    if (typeof process === "undefined" || process?.platform !== "linux") return false;
    const fs = await importRuntime("fs");
    if ((await importRuntime("os")).release().toLowerCase().includes("microsoft")) {
      if (await isInsideContainer()) return false;
      return true;
    }
    return fs.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !await isInsideContainer() : false;
  } catch {
    return false;
  }
}
let isInsideContainerCached;
const hasContainerEnv = async () => {
  if (getVendor() === "cloudflare") return false;
  try {
    (await importRuntime("fs")).statSync("/run/.containerenv");
    return true;
  } catch {
    return false;
  }
};
async function isInsideContainer() {
  if (isInsideContainerCached === void 0) isInsideContainerCached = await hasContainerEnv() || await isDocker();
  return isInsideContainerCached;
}
function isCI() {
  return env.CI !== "false" && ("BUILD_ID" in env || "BUILD_NUMBER" in env || "CI" in env || "CI_APP_ID" in env || "CI_BUILD_ID" in env || "CI_BUILD_NUMBER" in env || "CI_NAME" in env || "CONTINUOUS_INTEGRATION" in env || "RUN_ID" in env);
}
function detectRuntime() {
  if (typeof Deno !== "undefined") return {
    name: "deno",
    version: Deno?.version?.deno ?? null
  };
  if (typeof Bun !== "undefined") return {
    name: "bun",
    version: Bun?.version ?? null
  };
  if (typeof process !== "undefined" && process?.versions?.node) return {
    name: "node",
    version: process.versions.node ?? null
  };
  return {
    name: "edge",
    version: null
  };
}
function detectEnvironment() {
  return getEnvVar("NODE_ENV") === "production" ? "production" : isCI() ? "ci" : isTest() ? "test" : "development";
}
async function hashToBase64(data) {
  const buffer = await createHash$1("SHA-256").digest(data);
  return base64.encode(buffer);
}
const generateId = (size) => {
  return createRandomStringGenerator("a-z", "A-Z", "0-9")(size);
};
let projectIdCached = null;
async function getProjectId(baseUrl) {
  if (projectIdCached) return projectIdCached;
  const projectName = await getNameFromLocalPackageJson();
  if (projectName) {
    projectIdCached = await hashToBase64(baseUrl ? baseUrl + projectName : projectName);
    return projectIdCached;
  }
  if (baseUrl) {
    projectIdCached = await hashToBase64(baseUrl);
    return projectIdCached;
  }
  projectIdCached = generateId(32);
  return projectIdCached;
}
async function createTelemetry(options, context) {
  const debugEnabled = options.telemetry?.debug || getBooleanEnvVar("BETTER_AUTH_TELEMETRY_DEBUG", false);
  const TELEMETRY_ENDPOINT = ENV.BETTER_AUTH_TELEMETRY_ENDPOINT;
  const track = async (event) => {
    if (context?.customTrack) await context.customTrack(event).catch(logger.error);
    else if (debugEnabled) logger.info("telemetry event", JSON.stringify(event, null, 2));
    else await betterFetch(TELEMETRY_ENDPOINT, {
      method: "POST",
      body: event
    }).catch(logger.error);
  };
  const isEnabled = async () => {
    const telemetryEnabled = options.telemetry?.enabled !== void 0 ? options.telemetry.enabled : false;
    return (getBooleanEnvVar("BETTER_AUTH_TELEMETRY", false) || telemetryEnabled) && (context?.skipTestCheck || !isTest());
  };
  const enabled = await isEnabled();
  let anonymousId;
  if (enabled) {
    anonymousId = await getProjectId(options.baseURL);
    track({
      type: "init",
      payload: {
        config: getTelemetryAuthConfig(options, context),
        runtime: detectRuntime(),
        database: await detectDatabase(),
        framework: await detectFramework(),
        environment: detectEnvironment(),
        systemInfo: await detectSystemInfo(),
        packageManager: detectPackageManager()
      },
      anonymousId
    });
  }
  return { publish: async (event) => {
    if (!enabled) return;
    if (!anonymousId) anonymousId = await getProjectId(options.baseURL);
    await track({
      type: event.type,
      payload: event.payload,
      anonymousId
    });
  } };
}
function estimateEntropy(str) {
  const unique = new Set(str).size;
  if (unique === 0) return 0;
  return Math.log2(Math.pow(unique, str.length));
}
function validateSecret(secret, logger$1) {
  const isDefaultSecret = secret === DEFAULT_SECRET;
  if (isTest()) return;
  if (isDefaultSecret && isProduction) throw new BetterAuthError("You are using the default secret. Please set `BETTER_AUTH_SECRET` in your environment variables or pass `secret` in your auth config.");
  if (secret.length < 32) logger$1.warn(`[better-auth] Warning: your BETTER_AUTH_SECRET should be at least 32 characters long for adequate security. Generate one with \`npx @better-auth/cli secret\` or \`openssl rand -base64 32\`.`);
  if (estimateEntropy(secret) < 120) logger$1.warn("[better-auth] Warning: your BETTER_AUTH_SECRET appears low-entropy. Use a randomly generated secret for production.");
}
async function createAuthContext(adapter, options, getDatabaseType) {
  if (!options.database) options = defu(options, {
    session: { cookieCache: {
      enabled: true,
      strategy: "jwe",
      refreshCache: true
    } },
    account: {
      storeStateStrategy: "cookie",
      storeAccountCookie: true
    }
  });
  const plugins = options.plugins || [];
  const internalPlugins = getInternalPlugins(options);
  const logger$1 = createLogger(options.logger);
  const baseURL = getBaseURL(options.baseURL, options.basePath);
  if (!baseURL) logger$1.warn(`[better-auth] Base URL could not be determined. Please set a valid base URL using the baseURL config option or the BETTER_AUTH_BASE_URL environment variable. Without this, callbacks and redirects may not work correctly.`);
  const secret = options.secret || env.BETTER_AUTH_SECRET || env.AUTH_SECRET || DEFAULT_SECRET;
  validateSecret(secret, logger$1);
  options = {
    ...options,
    secret,
    baseURL: baseURL ? new URL(baseURL).origin : "",
    basePath: options.basePath || "/api/auth",
    plugins: plugins.concat(internalPlugins)
  };
  checkEndpointConflicts(options, logger$1);
  const cookies = getCookies(options);
  const tables = getAuthTables(options);
  const providers = Object.entries(options.socialProviders || {}).map(([key, config2]) => {
    if (config2 == null) return null;
    if (config2.enabled === false) return null;
    if (!config2.clientId) logger$1.warn(`Social provider ${key} is missing clientId or clientSecret`);
    const provider = socialProviders[key](config2);
    provider.disableImplicitSignUp = config2.disableImplicitSignUp;
    return provider;
  }).filter((x2) => x2 !== null);
  const generateIdFunc = ({ model, size }) => {
    if (typeof options.advanced?.generateId === "function") return options.advanced.generateId({
      model,
      size
    });
    if (typeof options?.advanced?.database?.generateId === "function") return options.advanced.database.generateId({
      model,
      size
    });
    return generateId$1(size);
  };
  const { publish } = await createTelemetry(options, {
    adapter: adapter.id,
    database: typeof options.database === "function" ? "adapter" : getDatabaseType(options.database)
  });
  const initOrPromise = runPluginInit({
    appName: options.appName || "Better Auth",
    baseURL: baseURL || "",
    version: getBetterAuthVersion(),
    socialProviders: providers,
    options,
    oauthConfig: {
      storeStateStrategy: options.account?.storeStateStrategy || (options.database ? "database" : "cookie"),
      skipStateCookieCheck: !!options.account?.skipStateCookieCheck
    },
    tables,
    trustedOrigins: await getTrustedOrigins(options),
    isTrustedOrigin(url, settings) {
      return this.trustedOrigins.some((origin) => matchesOriginPattern(url, origin, settings));
    },
    sessionConfig: {
      updateAge: options.session?.updateAge !== void 0 ? options.session.updateAge : 1440 * 60,
      expiresIn: options.session?.expiresIn || 3600 * 24 * 7,
      freshAge: options.session?.freshAge === void 0 ? 3600 * 24 : options.session.freshAge,
      cookieRefreshCache: (() => {
        const refreshCache = options.session?.cookieCache?.refreshCache;
        const maxAge = options.session?.cookieCache?.maxAge || 300;
        if ((!!options.database || !!options.secondaryStorage) && refreshCache) {
          logger$1.warn("[better-auth] `session.cookieCache.refreshCache` is enabled while `database` or `secondaryStorage` is configured. `refreshCache` is meant for stateless (DB-less) setups. Disabling `refreshCache` — remove it from your config to silence this warning.");
          return false;
        }
        if (refreshCache === false || refreshCache === void 0) return false;
        if (refreshCache === true) return {
          enabled: true,
          updateAge: Math.floor(maxAge * 0.2)
        };
        return {
          enabled: true,
          updateAge: refreshCache.updateAge !== void 0 ? refreshCache.updateAge : Math.floor(maxAge * 0.2)
        };
      })()
    },
    secret,
    rateLimit: {
      ...options.rateLimit,
      enabled: options.rateLimit?.enabled ?? isProduction,
      window: options.rateLimit?.window || 10,
      max: options.rateLimit?.max || 100,
      storage: options.rateLimit?.storage || (options.secondaryStorage ? "secondary-storage" : "memory")
    },
    authCookies: cookies,
    logger: logger$1,
    generateId: generateIdFunc,
    session: null,
    secondaryStorage: options.secondaryStorage,
    password: {
      hash: options.emailAndPassword?.password?.hash || hashPassword,
      verify: options.emailAndPassword?.password?.verify || verifyPassword$1,
      config: {
        minPasswordLength: options.emailAndPassword?.minPasswordLength || 8,
        maxPasswordLength: options.emailAndPassword?.maxPasswordLength || 128
      },
      checkPassword
    },
    setNewSession(session2) {
      this.newSession = session2;
    },
    newSession: null,
    adapter,
    internalAdapter: createInternalAdapter(adapter, {
      options,
      logger: logger$1,
      hooks: options.databaseHooks ? [options.databaseHooks] : []
    }),
    createAuthCookie: createCookieGetter(options),
    async runMigrations() {
      throw new BetterAuthError("runMigrations will be set by the specific init implementation");
    },
    publishTelemetry: publish,
    skipCSRFCheck: !!options.advanced?.disableCSRFCheck,
    skipOriginCheck: options.advanced?.disableOriginCheck !== void 0 ? options.advanced.disableOriginCheck : isTest() ? true : false,
    runInBackground: options.advanced?.backgroundTasks?.handler ?? ((p2) => {
      p2.catch(() => {
      });
    }),
    async runInBackgroundOrAwait(promise) {
      try {
        if (options.advanced?.backgroundTasks?.handler) {
          if (promise instanceof Promise) options.advanced.backgroundTasks.handler(promise.catch((e2) => {
            logger$1.error("Failed to run background task:", e2);
          }));
        } else await promise;
      } catch (e2) {
        logger$1.error("Failed to run background task:", e2);
      }
    },
    getPlugin: (id) => options.plugins.find((p2) => p2.id === id) ?? null
  });
  let context;
  if (isPromise(initOrPromise)) ({ context } = await initOrPromise);
  else ({ context } = initOrPromise);
  if (typeof context.options.emailVerification?.onEmailVerification === "function") context.options.emailVerification.onEmailVerification = deprecate(context.options.emailVerification.onEmailVerification, "Use `afterEmailVerification` instead. This will be removed in 1.5", context.logger);
  return context;
}
const init = async (options) => {
  const adapter = await getAdapter(options);
  const getDatabaseType = (database) => getKyselyDatabaseType(database) || "unknown";
  const ctx = await createAuthContext(adapter, options, getDatabaseType);
  ctx.runMigrations = async function() {
    if (!options.database || "updateMany" in options.database) throw new BetterAuthError("Database is not provided or it's an adapter. Migrations are only supported with a database instance.");
    const { runMigrations } = await getMigrations(options);
    await runMigrations();
  };
  return ctx;
};
const createBetterAuth = (options, initFn) => {
  const authContext = initFn(options);
  const { api } = getEndpoints(authContext, options);
  return {
    handler: async (request2) => {
      const ctx = await authContext;
      const basePath = ctx.options.basePath || "/api/auth";
      if (!ctx.options.baseURL) {
        const baseURL = getBaseURL(void 0, basePath, request2, void 0, ctx.options.advanced?.trustedProxyHeaders);
        if (baseURL) {
          ctx.baseURL = baseURL;
          ctx.options.baseURL = getOrigin(ctx.baseURL) || void 0;
        } else throw new BetterAuthError("Could not get base URL from request. Please provide a valid base URL.");
      }
      ctx.trustedOrigins = await getTrustedOrigins(ctx.options, request2);
      const { handler } = router(ctx, options);
      return runWithAdapter(ctx.adapter, () => handler(request2));
    },
    api,
    options,
    $context: authContext,
    $ERROR_CODES: {
      ...options.plugins?.reduce((acc, plugin) => {
        if (plugin.$ERROR_CODES) return {
          ...acc,
          ...plugin.$ERROR_CODES
        };
        return acc;
      }, {}),
      ...BASE_ERROR_CODES
    }
  };
};
const betterAuth = (options) => {
  return createBetterAuth(options, init);
};
const drizzleAdapter = (db2, config2) => {
  let lazyOptions = null;
  const createCustomAdapter = (db$1) => ({ getFieldName, options }) => {
    function getSchema2(model) {
      const schema2 = config2.schema || db$1._.fullSchema;
      if (!schema2) throw new BetterAuthError("Drizzle adapter failed to initialize. Schema not found. Please provide a schema object in the adapter options object.");
      const schemaModel = schema2[model];
      if (!schemaModel) throw new BetterAuthError(`[# Drizzle Adapter]: The model "${model}" was not found in the schema object. Please pass the schema directly to the adapter options.`);
      return schemaModel;
    }
    const withReturning = async (model, builder, data, where) => {
      if (config2.provider !== "mysql") return (await builder.returning())[0];
      await builder.execute();
      const schemaModel = getSchema2(model);
      const builderVal = builder.config?.values;
      if (where?.length) {
        const clause = convertWhereClause(where.map((w2) => {
          if (data[w2.field] !== void 0) return {
            ...w2,
            value: data[w2.field]
          };
          return w2;
        }), model);
        return (await db$1.select().from(schemaModel).where(...clause))[0];
      } else if (builderVal && builderVal[0]?.id?.value) {
        let tId = builderVal[0]?.id?.value;
        if (!tId) tId = (await db$1.select({ id: sql`LAST_INSERT_ID()` }).from(schemaModel).orderBy(desc(schemaModel.id)).limit(1))[0].id;
        return (await db$1.select().from(schemaModel).where(eq(schemaModel.id, tId)).limit(1).execute())[0];
      } else if (data.id) return (await db$1.select().from(schemaModel).where(eq(schemaModel.id, data.id)).limit(1).execute())[0];
      else {
        if (!("id" in schemaModel)) throw new BetterAuthError(`The model "${model}" does not have an "id" field. Please use the "id" field as your primary key.`);
        return (await db$1.select().from(schemaModel).orderBy(desc(schemaModel.id)).limit(1).execute())[0];
      }
    };
    function convertWhereClause(where, model) {
      const schemaModel = getSchema2(model);
      if (!where) return [];
      if (where.length === 1) {
        const w2 = where[0];
        if (!w2) return [];
        const field = getFieldName({
          model,
          field: w2.field
        });
        if (!schemaModel[field]) throw new BetterAuthError(`The field "${w2.field}" does not exist in the schema for the model "${model}". Please update your schema.`);
        if (w2.operator === "in") {
          if (!Array.isArray(w2.value)) throw new BetterAuthError(`The value for the field "${w2.field}" must be an array when using the "in" operator.`);
          return [inArray(schemaModel[field], w2.value)];
        }
        if (w2.operator === "not_in") {
          if (!Array.isArray(w2.value)) throw new BetterAuthError(`The value for the field "${w2.field}" must be an array when using the "not_in" operator.`);
          return [notInArray(schemaModel[field], w2.value)];
        }
        if (w2.operator === "contains") return [like(schemaModel[field], `%${w2.value}%`)];
        if (w2.operator === "starts_with") return [like(schemaModel[field], `${w2.value}%`)];
        if (w2.operator === "ends_with") return [like(schemaModel[field], `%${w2.value}`)];
        if (w2.operator === "lt") return [lt(schemaModel[field], w2.value)];
        if (w2.operator === "lte") return [lte(schemaModel[field], w2.value)];
        if (w2.operator === "ne") return [ne(schemaModel[field], w2.value)];
        if (w2.operator === "gt") return [gt(schemaModel[field], w2.value)];
        if (w2.operator === "gte") return [gte(schemaModel[field], w2.value)];
        return [eq(schemaModel[field], w2.value)];
      }
      const andGroup = where.filter((w2) => w2.connector === "AND" || !w2.connector);
      const orGroup = where.filter((w2) => w2.connector === "OR");
      const andClause = and(...andGroup.map((w2) => {
        const field = getFieldName({
          model,
          field: w2.field
        });
        if (w2.operator === "in") {
          if (!Array.isArray(w2.value)) throw new BetterAuthError(`The value for the field "${w2.field}" must be an array when using the "in" operator.`);
          return inArray(schemaModel[field], w2.value);
        }
        if (w2.operator === "not_in") {
          if (!Array.isArray(w2.value)) throw new BetterAuthError(`The value for the field "${w2.field}" must be an array when using the "not_in" operator.`);
          return notInArray(schemaModel[field], w2.value);
        }
        if (w2.operator === "contains") return like(schemaModel[field], `%${w2.value}%`);
        if (w2.operator === "starts_with") return like(schemaModel[field], `${w2.value}%`);
        if (w2.operator === "ends_with") return like(schemaModel[field], `%${w2.value}`);
        if (w2.operator === "lt") return lt(schemaModel[field], w2.value);
        if (w2.operator === "lte") return lte(schemaModel[field], w2.value);
        if (w2.operator === "gt") return gt(schemaModel[field], w2.value);
        if (w2.operator === "gte") return gte(schemaModel[field], w2.value);
        if (w2.operator === "ne") return ne(schemaModel[field], w2.value);
        return eq(schemaModel[field], w2.value);
      }));
      const orClause = or(...orGroup.map((w2) => {
        const field = getFieldName({
          model,
          field: w2.field
        });
        if (w2.operator === "in") {
          if (!Array.isArray(w2.value)) throw new BetterAuthError(`The value for the field "${w2.field}" must be an array when using the "in" operator.`);
          return inArray(schemaModel[field], w2.value);
        }
        if (w2.operator === "not_in") {
          if (!Array.isArray(w2.value)) throw new BetterAuthError(`The value for the field "${w2.field}" must be an array when using the "not_in" operator.`);
          return notInArray(schemaModel[field], w2.value);
        }
        if (w2.operator === "contains") return like(schemaModel[field], `%${w2.value}%`);
        if (w2.operator === "starts_with") return like(schemaModel[field], `${w2.value}%`);
        if (w2.operator === "ends_with") return like(schemaModel[field], `%${w2.value}`);
        if (w2.operator === "lt") return lt(schemaModel[field], w2.value);
        if (w2.operator === "lte") return lte(schemaModel[field], w2.value);
        if (w2.operator === "gt") return gt(schemaModel[field], w2.value);
        if (w2.operator === "gte") return gte(schemaModel[field], w2.value);
        if (w2.operator === "ne") return ne(schemaModel[field], w2.value);
        return eq(schemaModel[field], w2.value);
      }));
      const clause = [];
      if (andGroup.length) clause.push(andClause);
      if (orGroup.length) clause.push(orClause);
      return clause;
    }
    function checkMissingFields(schema2, model, values) {
      if (!schema2) throw new BetterAuthError("Drizzle adapter failed to initialize. Drizzle Schema not found. Please provide a schema object in the adapter options object.");
      for (const key in values) if (!schema2[key]) throw new BetterAuthError(`The field "${key}" does not exist in the "${model}" Drizzle schema. Please update your drizzle schema or re-generate using "npx @better-auth/cli@latest generate".`);
    }
    return {
      async create({ model, data: values }) {
        const schemaModel = getSchema2(model);
        checkMissingFields(schemaModel, model, values);
        return await withReturning(model, db$1.insert(schemaModel).values(values), values);
      },
      async findOne({ model, where, join: join2 }) {
        const schemaModel = getSchema2(model);
        const clause = convertWhereClause(where, model);
        if (options.experimental?.joins) if (!db$1.query || !db$1.query[model]) {
          logger.error(`[# Drizzle Adapter]: The model "${model}" was not found in the query object. Please update your Drizzle schema to include relations or re-generate using "npx @better-auth/cli@latest generate".`);
          logger.info("Falling back to regular query");
        } else {
          let includes;
          const pluralJoinResults = [];
          if (join2) {
            includes = {};
            const joinEntries = Object.entries(join2);
            for (const [model$1, joinAttr] of joinEntries) {
              const limit = joinAttr.limit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
              const isUnique = joinAttr.relation === "one-to-one";
              const pluralSuffix = isUnique || config2.usePlural ? "" : "s";
              includes[`${model$1}${pluralSuffix}`] = isUnique ? true : { limit };
              if (!isUnique) pluralJoinResults.push(`${model$1}${pluralSuffix}`);
            }
          }
          const res$1 = await db$1.query[model].findFirst({
            where: clause[0],
            with: includes
          });
          if (res$1) for (const pluralJoinResult of pluralJoinResults) {
            const singularKey = !config2.usePlural ? pluralJoinResult.slice(0, -1) : pluralJoinResult;
            res$1[singularKey] = res$1[pluralJoinResult];
            if (pluralJoinResult !== singularKey) delete res$1[pluralJoinResult];
          }
          return res$1;
        }
        const res = await db$1.select().from(schemaModel).where(...clause);
        if (!res.length) return null;
        return res[0];
      },
      async findMany({ model, where, sortBy, limit, offset, join: join2 }) {
        const schemaModel = getSchema2(model);
        const clause = where ? convertWhereClause(where, model) : [];
        const sortFn = sortBy?.direction === "desc" ? desc : asc;
        if (options.experimental?.joins) if (!db$1.query[model]) {
          logger.error(`[# Drizzle Adapter]: The model "${model}" was not found in the query object. Please update your Drizzle schema to include relations or re-generate using "npx @better-auth/cli@latest generate".`);
          logger.info("Falling back to regular query");
        } else {
          let includes;
          const pluralJoinResults = [];
          if (join2) {
            includes = {};
            const joinEntries = Object.entries(join2);
            for (const [model$1, joinAttr] of joinEntries) {
              const isUnique = joinAttr.relation === "one-to-one";
              const limit$1 = joinAttr.limit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
              const pluralSuffix = isUnique || config2.usePlural ? "" : "s";
              includes[`${model$1}${pluralSuffix}`] = isUnique ? true : { limit: limit$1 };
              if (!isUnique) pluralJoinResults.push(`${model$1}${pluralSuffix}`);
            }
          }
          let orderBy = void 0;
          if (sortBy?.field) orderBy = [sortFn(schemaModel[getFieldName({
            model,
            field: sortBy?.field
          })])];
          const res = await db$1.query[model].findMany({
            where: clause[0],
            with: includes,
            limit: limit ?? 100,
            offset: offset ?? 0,
            orderBy
          });
          if (res) for (const item of res) for (const pluralJoinResult of pluralJoinResults) {
            const singularKey = !config2.usePlural ? pluralJoinResult.slice(0, -1) : pluralJoinResult;
            if (singularKey === pluralJoinResult) continue;
            item[singularKey] = item[pluralJoinResult];
            delete item[pluralJoinResult];
          }
          return res;
        }
        let builder = db$1.select().from(schemaModel);
        const effectiveLimit = limit;
        const effectiveOffset = offset;
        if (typeof effectiveLimit !== "undefined") builder = builder.limit(effectiveLimit);
        if (typeof effectiveOffset !== "undefined") builder = builder.offset(effectiveOffset);
        if (sortBy?.field) builder = builder.orderBy(sortFn(schemaModel[getFieldName({
          model,
          field: sortBy?.field
        })]));
        return await builder.where(...clause);
      },
      async count({ model, where }) {
        const schemaModel = getSchema2(model);
        const clause = where ? convertWhereClause(where, model) : [];
        return (await db$1.select({ count: count() }).from(schemaModel).where(...clause))[0].count;
      },
      async update({ model, where, update: values }) {
        const schemaModel = getSchema2(model);
        const clause = convertWhereClause(where, model);
        return await withReturning(model, db$1.update(schemaModel).set(values).where(...clause), values, where);
      },
      async updateMany({ model, where, update: values }) {
        const schemaModel = getSchema2(model);
        const clause = convertWhereClause(where, model);
        return await db$1.update(schemaModel).set(values).where(...clause);
      },
      async delete({ model, where }) {
        const schemaModel = getSchema2(model);
        const clause = convertWhereClause(where, model);
        return await db$1.delete(schemaModel).where(...clause);
      },
      async deleteMany({ model, where }) {
        const schemaModel = getSchema2(model);
        const clause = convertWhereClause(where, model);
        const res = await db$1.delete(schemaModel).where(...clause);
        let count$1 = 0;
        if (res && "rowCount" in res) count$1 = res.rowCount;
        else if (Array.isArray(res)) count$1 = res.length;
        else if (res && ("affectedRows" in res || "rowsAffected" in res || "changes" in res)) count$1 = res.affectedRows ?? res.rowsAffected ?? res.changes;
        if (typeof count$1 !== "number") logger.error("[Drizzle Adapter] The result of the deleteMany operation is not a number. This is likely a bug in the adapter. Please report this issue to the Better Auth team.", {
          res,
          model,
          where
        });
        return count$1;
      },
      options: config2
    };
  };
  let adapterOptions = null;
  adapterOptions = {
    config: {
      adapterId: "drizzle",
      adapterName: "Drizzle Adapter",
      usePlural: config2.usePlural ?? false,
      debugLogs: config2.debugLogs ?? false,
      supportsUUIDs: config2.provider === "pg" ? true : false,
      supportsJSON: config2.provider === "pg" ? true : false,
      supportsArrays: config2.provider === "pg" ? true : false,
      transaction: config2.transaction ?? false ? (cb) => db2.transaction((tx) => {
        return cb(createAdapterFactory({
          config: adapterOptions.config,
          adapter: createCustomAdapter(tx)
        })(lazyOptions));
      }) : false
    },
    adapter: createCustomAdapter(db2)
  };
  const adapter = createAdapterFactory(adapterOptions);
  return (options) => {
    lazyOptions = options;
    return adapter(options);
  };
};
const tanstackStartCookies = () => {
  return {
    id: "tanstack-start-cookies",
    hooks: { after: [{
      matcher(ctx) {
        return true;
      },
      handler: createAuthMiddleware(async (ctx) => {
        const returned = ctx.context.responseHeaders;
        if ("_flag" in ctx && ctx._flag === "router") return;
        if (returned instanceof Headers) {
          const setCookies = returned?.get("set-cookie");
          if (!setCookies) return;
          const parsed = parseSetCookieHeader(setCookies);
          const { setCookie: setCookie2 } = await Promise.resolve().then(function() {
            return serverDkMexlIi;
          });
          parsed.forEach((value, key) => {
            if (!key) return;
            const opts = {
              sameSite: value.samesite,
              secure: value.secure,
              maxAge: value["max-age"],
              httpOnly: value.httponly,
              domain: value.domain,
              path: value.path
            };
            try {
              setCookie2(key, decodeURIComponent(value.value), opts);
            } catch {
            }
          });
          return;
        }
      })
    }] }
  };
};
const getEndpointResponse = async (ctx) => {
  const returned = ctx.context.returned;
  if (!returned) return null;
  if (returned instanceof Response) {
    if (returned.status !== 200) return null;
    return await returned.clone().json();
  }
  if (returned instanceof APIError) return null;
  return returned;
};
createAuthMiddleware(async (ctx) => {
  const session2 = await getSessionFromCtx(ctx);
  if (!session2) throw new APIError("UNAUTHORIZED");
  return { session: session2 };
});
z$1.object({
  userId: z$1.coerce.string().meta({ description: "The user id" }),
  role: z$1.union([z$1.string().meta({ description: "The role to set. `admin` or `user` by default" }), z$1.array(z$1.string().meta({ description: "The roles to set. `admin` or `user` by default" }))]).meta({ description: "The role to set, this can be a string or an array of strings. Eg: `admin` or `[admin, user]`" })
});
z$1.object({ id: z$1.string().meta({ description: "The id of the User" }) });
z$1.object({
  email: z$1.string().meta({ description: "The email of the user" }),
  password: z$1.string().optional().meta({ description: "The password of the user. If not provided, the user will be created without a credential account (useful for magic link or social login only users)." }),
  name: z$1.string().meta({ description: "The name of the user" }),
  role: z$1.union([z$1.string().meta({ description: "The role of the user" }), z$1.array(z$1.string().meta({ description: "The roles of user" }))]).optional().meta({ description: `A string or array of strings representing the roles to apply to the new user. Eg: "user"` }),
  data: z$1.record(z$1.string(), z$1.any()).optional().meta({ description: "Extra fields for the user. Including custom additional fields." })
});
z$1.object({
  userId: z$1.coerce.string().meta({ description: "The user id" }),
  data: z$1.record(z$1.any(), z$1.any()).meta({ description: "The user data to update" })
});
z$1.object({
  searchValue: z$1.string().optional().meta({ description: 'The value to search for. Eg: "some name"' }),
  searchField: z$1.enum(["email", "name"]).meta({ description: 'The field to search in, defaults to email. Can be `email` or `name`. Eg: "name"' }).optional(),
  searchOperator: z$1.enum([
    "contains",
    "starts_with",
    "ends_with"
  ]).meta({ description: 'The operator to use for the search. Can be `contains`, `starts_with` or `ends_with`. Eg: "contains"' }).optional(),
  limit: z$1.string().meta({ description: "The number of users to return" }).or(z$1.number()).optional(),
  offset: z$1.string().meta({ description: "The offset to start from" }).or(z$1.number()).optional(),
  sortBy: z$1.string().meta({ description: "The field to sort by" }).optional(),
  sortDirection: z$1.enum(["asc", "desc"]).meta({ description: "The direction to sort by" }).optional(),
  filterField: z$1.string().meta({ description: "The field to filter by" }).optional(),
  filterValue: z$1.string().meta({ description: "The value to filter by" }).or(z$1.number()).or(z$1.boolean()).optional(),
  filterOperator: z$1.enum([
    "eq",
    "ne",
    "lt",
    "lte",
    "gt",
    "gte",
    "contains"
  ]).meta({ description: "The operator to use for the filter" }).optional()
});
z$1.object({ userId: z$1.coerce.string().meta({ description: "The user id" }) });
z$1.object({ userId: z$1.coerce.string().meta({ description: "The user id" }) });
z$1.object({
  userId: z$1.coerce.string().meta({ description: "The user id" }),
  banReason: z$1.string().meta({ description: "The reason for the ban" }).optional(),
  banExpiresIn: z$1.number().meta({ description: "The number of seconds until the ban expires" }).optional()
});
z$1.object({ userId: z$1.coerce.string().meta({ description: "The user id" }) });
z$1.object({ sessionToken: z$1.string().meta({ description: "The session token" }) });
z$1.object({ userId: z$1.coerce.string().meta({ description: "The user id" }) });
z$1.object({ userId: z$1.coerce.string().meta({ description: "The user id" }) });
z$1.object({
  newPassword: z$1.string().nonempty("newPassword cannot be empty").meta({ description: "The new password" }),
  userId: z$1.coerce.string().nonempty("userId cannot be empty").meta({ description: "The user id" })
});
z$1.object({
  userId: z$1.coerce.string().optional().meta({ description: `The user id. Eg: "user-id"` }),
  role: z$1.string().optional().meta({ description: `The role to check permission for. Eg: "admin"` })
}).and(z$1.union([z$1.object({
  permission: z$1.record(z$1.string(), z$1.array(z$1.string())),
  permissions: z$1.undefined()
}), z$1.object({
  permission: z$1.undefined(),
  permissions: z$1.record(z$1.string(), z$1.array(z$1.string()))
})]));
z$1.object({
  key: z$1.string().meta({ description: "The key to verify" }),
  permissions: z$1.record(z$1.string(), z$1.array(z$1.string())).meta({ description: "The permissions to verify." }).optional()
});
z$1.object({
  name: z$1.string().meta({ description: "Name of the Api Key" }).optional(),
  expiresIn: z$1.number().meta({ description: "Expiration time of the Api Key in seconds" }).min(1).optional().nullable().default(null),
  userId: z$1.coerce.string().meta({ description: 'User Id of the user that the Api Key belongs to. server-only. Eg: "user-id"' }).optional(),
  prefix: z$1.string().meta({ description: "Prefix of the Api Key" }).regex(/^[a-zA-Z0-9_-]+$/, { message: "Invalid prefix format, must be alphanumeric and contain only underscores and hyphens." }).optional(),
  remaining: z$1.number().meta({ description: "Remaining number of requests. Server side only" }).min(0).optional().nullable().default(null),
  metadata: z$1.any().optional(),
  refillAmount: z$1.number().meta({ description: "Amount to refill the remaining count of the Api Key. server-only. Eg: 100" }).min(1).optional(),
  refillInterval: z$1.number().meta({ description: "Interval to refill the Api Key in milliseconds. server-only. Eg: 1000" }).optional(),
  rateLimitTimeWindow: z$1.number().meta({ description: "The duration in milliseconds where each request is counted. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. server-only. Eg: 1000" }).optional(),
  rateLimitMax: z$1.number().meta({ description: "Maximum amount of requests allowed within a window. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. server-only. Eg: 100" }).optional(),
  rateLimitEnabled: z$1.boolean().meta({ description: "Whether the key has rate limiting enabled. server-only. Eg: true" }).optional(),
  permissions: z$1.record(z$1.string(), z$1.array(z$1.string())).meta({ description: "Permissions of the Api Key." }).optional()
});
z$1.object({ keyId: z$1.string().meta({ description: "The id of the Api Key" }) });
z$1.object({ id: z$1.string().meta({ description: "The id of the Api Key" }) });
z$1.object({
  keyId: z$1.string().meta({ description: "The id of the Api Key" }),
  userId: z$1.coerce.string().meta({ description: 'The id of the user which the api key belongs to. server-only. Eg: "some-user-id"' }).optional(),
  name: z$1.string().meta({ description: "The name of the key" }).optional(),
  enabled: z$1.boolean().meta({ description: "Whether the Api Key is enabled or not" }).optional(),
  remaining: z$1.number().meta({ description: "The number of remaining requests" }).min(1).optional(),
  refillAmount: z$1.number().meta({ description: "The refill amount" }).optional(),
  refillInterval: z$1.number().meta({ description: "The refill interval" }).optional(),
  metadata: z$1.any().optional(),
  expiresIn: z$1.number().meta({ description: "Expiration time of the Api Key in seconds" }).min(1).optional().nullable(),
  rateLimitEnabled: z$1.boolean().meta({ description: "Whether the key has rate limiting enabled." }).optional(),
  rateLimitTimeWindow: z$1.number().meta({ description: "The duration in milliseconds where each request is counted. server-only. Eg: 1000" }).optional(),
  rateLimitMax: z$1.number().meta({ description: "Maximum amount of requests allowed within a window. Once the `maxRequests` is reached, the request will be rejected until the `timeWindow` has passed, at which point the `timeWindow` will be reset. server-only. Eg: 100" }).optional(),
  permissions: z$1.record(z$1.string(), z$1.array(z$1.string())).meta({ description: "Update the permissions on the API Key. server-only." }).optional().nullable()
});
z$1.optional(z$1.object({
  disableCookieCache: z$1.boolean().meta({ description: "Disable cookie cache and fetch session from database" }).or(z$1.string().transform((v2) => v2 === "true")).optional(),
  disableRefresh: z$1.boolean().meta({ description: "Disable session refresh. Useful for checking session status, without updating the session" }).optional()
}));
const DEVICE_AUTHORIZATION_ERROR_CODES = defineErrorCodes({
  INVALID_DEVICE_CODE: "Invalid device code",
  EXPIRED_DEVICE_CODE: "Device code has expired",
  EXPIRED_USER_CODE: "User code has expired",
  AUTHORIZATION_PENDING: "Authorization pending",
  ACCESS_DENIED: "Access denied",
  INVALID_USER_CODE: "Invalid user code",
  DEVICE_CODE_ALREADY_PROCESSED: "Device code already processed",
  POLLING_TOO_FREQUENTLY: "Polling too frequently",
  USER_NOT_FOUND: "User not found",
  FAILED_TO_CREATE_SESSION: "Failed to create session",
  INVALID_DEVICE_CODE_STATUS: "Invalid device code status",
  AUTHENTICATION_REQUIRED: "Authentication required"
});
z$1.object({
  client_id: z$1.string().meta({ description: "The client ID of the application" }),
  scope: z$1.string().meta({ description: "Space-separated list of scopes" }).optional()
});
z$1.object({
  error: z$1.enum(["invalid_request", "invalid_client"]).meta({ description: "Error code" }),
  error_description: z$1.string().meta({ description: "Detailed error description" })
});
z$1.object({
  grant_type: z$1.literal("urn:ietf:params:oauth:grant-type:device_code").meta({ description: "The grant type for device flow" }),
  device_code: z$1.string().meta({ description: "The device verification code" }),
  client_id: z$1.string().meta({ description: "The client ID of the application" })
});
z$1.object({
  error: z$1.enum([
    "authorization_pending",
    "slow_down",
    "expired_token",
    "access_denied",
    "invalid_request",
    "invalid_grant"
  ]).meta({ description: "Error code" }),
  error_description: z$1.string().meta({ description: "Detailed error description" })
});
createAuthEndpoint("/device", {
  method: "GET",
  query: z$1.object({ user_code: z$1.string().meta({ description: "The user code to verify" }) }),
  error: z$1.object({
    error: z$1.enum(["invalid_request"]).meta({ description: "Error code" }),
    error_description: z$1.string().meta({ description: "Detailed error description" })
  }),
  metadata: { openapi: {
    description: "Verify user code and get device authorization status",
    responses: { 200: {
      description: "Device authorization status",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          user_code: {
            type: "string",
            description: "The user code to verify"
          },
          status: {
            type: "string",
            enum: [
              "pending",
              "approved",
              "denied"
            ],
            description: "Current status of the device authorization"
          }
        }
      } } }
    } }
  } }
}, async (ctx) => {
  const { user_code } = ctx.query;
  const cleanUserCode = user_code.replace(/-/g, "");
  const deviceCodeRecord = await ctx.context.adapter.findOne({
    model: "deviceCode",
    where: [{
      field: "userCode",
      value: cleanUserCode
    }]
  });
  if (!deviceCodeRecord) throw new APIError("BAD_REQUEST", {
    error: "invalid_request",
    error_description: DEVICE_AUTHORIZATION_ERROR_CODES.INVALID_USER_CODE
  });
  if (deviceCodeRecord.expiresAt < /* @__PURE__ */ new Date()) throw new APIError("BAD_REQUEST", {
    error: "expired_token",
    error_description: DEVICE_AUTHORIZATION_ERROR_CODES.EXPIRED_USER_CODE
  });
  return ctx.json({
    user_code,
    status: deviceCodeRecord.status
  });
});
createAuthEndpoint("/device/approve", {
  method: "POST",
  body: z$1.object({ userCode: z$1.string().meta({ description: "The user code to approve" }) }),
  error: z$1.object({
    error: z$1.enum([
      "invalid_request",
      "expired_token",
      "device_code_already_processed"
    ]).meta({ description: "Error code" }),
    error_description: z$1.string().meta({ description: "Detailed error description" })
  }),
  requireHeaders: true,
  metadata: { openapi: {
    description: "Approve device authorization",
    responses: { 200: {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { success: { type: "boolean" } }
      } } }
    } }
  } }
}, async (ctx) => {
  const session2 = await getSessionFromCtx(ctx);
  if (!session2) throw new APIError("UNAUTHORIZED", {
    error: "unauthorized",
    error_description: DEVICE_AUTHORIZATION_ERROR_CODES.AUTHENTICATION_REQUIRED
  });
  const { userCode } = ctx.body;
  const cleanUserCode = userCode.replace(/-/g, "");
  const deviceCodeRecord = await ctx.context.adapter.findOne({
    model: "deviceCode",
    where: [{
      field: "userCode",
      value: cleanUserCode
    }]
  });
  if (!deviceCodeRecord) throw new APIError("BAD_REQUEST", {
    error: "invalid_request",
    error_description: DEVICE_AUTHORIZATION_ERROR_CODES.INVALID_USER_CODE
  });
  if (deviceCodeRecord.expiresAt < /* @__PURE__ */ new Date()) throw new APIError("BAD_REQUEST", {
    error: "expired_token",
    error_description: DEVICE_AUTHORIZATION_ERROR_CODES.EXPIRED_USER_CODE
  });
  if (deviceCodeRecord.status !== "pending") throw new APIError("BAD_REQUEST", {
    error: "invalid_request",
    error_description: DEVICE_AUTHORIZATION_ERROR_CODES.DEVICE_CODE_ALREADY_PROCESSED
  });
  await ctx.context.adapter.update({
    model: "deviceCode",
    where: [{
      field: "id",
      value: deviceCodeRecord.id
    }],
    update: {
      status: "approved",
      userId: session2.user.id
    }
  });
  return ctx.json({ success: true });
});
createAuthEndpoint("/device/deny", {
  method: "POST",
  body: z$1.object({ userCode: z$1.string().meta({ description: "The user code to deny" }) }),
  error: z$1.object({
    error: z$1.enum(["invalid_request", "expired_token"]).meta({ description: "Error code" }),
    error_description: z$1.string().meta({ description: "Detailed error description" })
  }),
  metadata: { openapi: {
    description: "Deny device authorization",
    responses: { 200: {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { success: { type: "boolean" } }
      } } }
    } }
  } }
}, async (ctx) => {
  const { userCode } = ctx.body;
  const cleanUserCode = userCode.replace(/-/g, "");
  const deviceCodeRecord = await ctx.context.adapter.findOne({
    model: "deviceCode",
    where: [{
      field: "userCode",
      value: cleanUserCode
    }]
  });
  if (!deviceCodeRecord) throw new APIError("BAD_REQUEST", {
    error: "invalid_request",
    error_description: DEVICE_AUTHORIZATION_ERROR_CODES.INVALID_USER_CODE
  });
  if (deviceCodeRecord.expiresAt < /* @__PURE__ */ new Date()) throw new APIError("BAD_REQUEST", {
    error: "expired_token",
    error_description: DEVICE_AUTHORIZATION_ERROR_CODES.EXPIRED_USER_CODE
  });
  if (deviceCodeRecord.status !== "pending") throw new APIError("BAD_REQUEST", {
    error: "invalid_request",
    error_description: DEVICE_AUTHORIZATION_ERROR_CODES.DEVICE_CODE_ALREADY_PROCESSED
  });
  await ctx.context.adapter.update({
    model: "deviceCode",
    where: [{
      field: "id",
      value: deviceCodeRecord.id
    }],
    update: { status: "denied" }
  });
  return ctx.json({ success: true });
});
z$1.object({
  id: z$1.string(),
  deviceCode: z$1.string(),
  userCode: z$1.string(),
  userId: z$1.string().optional(),
  expiresAt: z$1.date(),
  status: z$1.string(),
  lastPolledAt: z$1.date().optional(),
  pollingInterval: z$1.number().optional(),
  clientId: z$1.string().optional(),
  scope: z$1.string().optional()
});
const timeStringSchema = z$1.custom((val) => {
  if (typeof val !== "string") return false;
  try {
    ms(val);
    return true;
  } catch {
    return false;
  }
}, { message: "Invalid time string format. Use formats like '30m', '5s', '1h', etc." });
z$1.object({
  expiresIn: timeStringSchema.default("30m").describe("Time in seconds until the device code expires. Use formats like '30m', '5s', '1h', etc."),
  interval: timeStringSchema.default("5s").describe("Time in seconds between polling attempts. Use formats like '30m', '5s', '1h', etc."),
  deviceCodeLength: z$1.number().int().positive().default(40).describe("Length of the device code to be generated. Default is 40 characters."),
  userCodeLength: z$1.number().int().positive().default(8).describe("Length of the user code to be generated. Default is 8 characters."),
  generateDeviceCode: z$1.custom((val) => typeof val === "function", { message: "generateDeviceCode must be a function that returns a string or a promise that resolves to a string." }).optional().describe("Function to generate a device code. If not provided, a default random string generator will be used."),
  generateUserCode: z$1.custom((val) => typeof val === "function", { message: "generateUserCode must be a function that returns a string or a promise that resolves to a string." }).optional().describe("Function to generate a user code. If not provided, a default random string generator will be used."),
  validateClient: z$1.custom((val) => typeof val === "function", { message: "validateClient must be a function that returns a boolean or a promise that resolves to a boolean." }).optional().describe("Function to validate the client ID. If not provided, no validation will be performed."),
  onDeviceAuthRequest: z$1.custom((val) => typeof val === "function", { message: "onDeviceAuthRequest must be a function that returns void or a promise that resolves to void." }).optional().describe("Function to handle device authorization requests. If not provided, no additional actions will be taken."),
  verificationUri: z$1.string().optional().describe("The URI where users verify their device code. Can be an absolute URL (https://example.com/device) or relative path (/custom-path). This will be returned as verification_uri in the device code response. If not provided, defaults to /device."),
  schema: z$1.custom(() => true)
});
const defaultKeyHasher = async (otp) => {
  const hash = await createHash$1("SHA-256").digest(new TextEncoder().encode(otp));
  return base64Url.encode(new Uint8Array(hash), { padding: false });
};
function splitAtLastColon(input) {
  const idx = input.lastIndexOf(":");
  if (idx === -1) return [input, ""];
  return [input.slice(0, idx), input.slice(idx + 1)];
}
async function storeOTP(ctx, opts, otp) {
  if (opts.storeOTP === "encrypted") return await symmetricEncrypt({
    key: ctx.context.secret,
    data: otp
  });
  if (opts.storeOTP === "hashed") return await defaultKeyHasher(otp);
  if (typeof opts.storeOTP === "object" && "hash" in opts.storeOTP) return await opts.storeOTP.hash(otp);
  if (typeof opts.storeOTP === "object" && "encrypt" in opts.storeOTP) return await opts.storeOTP.encrypt(otp);
  return otp;
}
async function verifyStoredOTP(ctx, opts, storedOtp, otp) {
  if (opts.storeOTP === "encrypted") return constantTimeEqual(await symmetricDecrypt({
    key: ctx.context.secret,
    data: storedOtp
  }), otp);
  if (opts.storeOTP === "hashed") return constantTimeEqual(await defaultKeyHasher(otp), storedOtp);
  if (typeof opts.storeOTP === "object" && "hash" in opts.storeOTP) return constantTimeEqual(await opts.storeOTP.hash(otp), storedOtp);
  if (typeof opts.storeOTP === "object" && "decrypt" in opts.storeOTP) return constantTimeEqual(await opts.storeOTP.decrypt(storedOtp), otp);
  return constantTimeEqual(otp, storedOtp);
}
const types = [
  "email-verification",
  "sign-in",
  "forget-password"
];
const ERROR_CODES = defineErrorCodes({
  OTP_EXPIRED: "OTP expired",
  INVALID_OTP: "Invalid OTP",
  TOO_MANY_ATTEMPTS: "Too many attempts"
});
const sendVerificationOTPBodySchema = z$1.object({
  email: z$1.string({}).meta({ description: "Email address to send the OTP" }),
  type: z$1.enum(types).meta({ description: "Type of the OTP" })
});
const sendVerificationOTP$1 = (opts) => createAuthEndpoint("/email-otp/send-verification-otp", {
  method: "POST",
  body: sendVerificationOTPBodySchema,
  metadata: { openapi: {
    operationId: "sendEmailVerificationOTP",
    description: "Send a verification OTP to an email",
    responses: { 200: {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { success: { type: "boolean" } }
      } } }
    } }
  } }
}, async (ctx) => {
  if (!opts?.sendVerificationOTP) {
    ctx.context.logger.error("send email verification is not implemented");
    throw new APIError("BAD_REQUEST", { message: "send email verification is not implemented" });
  }
  const email = ctx.body.email.toLowerCase();
  if (!z$1.email().safeParse(email).success) throw ctx.error("BAD_REQUEST", { message: BASE_ERROR_CODES.INVALID_EMAIL });
  const otp = opts.generateOTP({
    email,
    type: ctx.body.type
  }, ctx) || defaultOTPGenerator$1(opts);
  const storedOTP = await storeOTP(ctx, opts, otp);
  await ctx.context.internalAdapter.createVerificationValue({
    value: `${storedOTP}:0`,
    identifier: `${ctx.body.type}-otp-${email}`,
    expiresAt: getDate(opts.expiresIn, "sec")
  }).catch(async (error2) => {
    await ctx.context.internalAdapter.deleteVerificationByIdentifier(`${ctx.body.type}-otp-${email}`);
    await ctx.context.internalAdapter.createVerificationValue({
      value: `${storedOTP}:0`,
      identifier: `${ctx.body.type}-otp-${email}`,
      expiresAt: getDate(opts.expiresIn, "sec")
    });
  });
  if (!await ctx.context.internalAdapter.findUserByEmail(email)) if (ctx.body.type === "sign-in" && !opts.disableSignUp) ;
  else {
    await ctx.context.internalAdapter.deleteVerificationByIdentifier(`${ctx.body.type}-otp-${email}`);
    return ctx.json({ success: true });
  }
  await ctx.context.runInBackgroundOrAwait(opts.sendVerificationOTP({
    email,
    otp,
    type: ctx.body.type
  }, ctx));
  return ctx.json({ success: true });
});
const createVerificationOTPBodySchema = z$1.object({
  email: z$1.string({}).meta({ description: "Email address to send the OTP" }),
  type: z$1.enum(types).meta({
    required: true,
    description: "Type of the OTP"
  })
});
const createVerificationOTP = (opts) => createAuthEndpoint({
  method: "POST",
  body: createVerificationOTPBodySchema,
  metadata: { openapi: {
    operationId: "createEmailVerificationOTP",
    description: "Create a verification OTP for an email",
    responses: { 200: {
      description: "Success",
      content: { "application/json": { schema: { type: "string" } } }
    } }
  } }
}, async (ctx) => {
  const email = ctx.body.email.toLowerCase();
  const otp = opts.generateOTP({
    email,
    type: ctx.body.type
  }, ctx) || defaultOTPGenerator$1(opts);
  const storedOTP = await storeOTP(ctx, opts, otp);
  await ctx.context.internalAdapter.createVerificationValue({
    value: `${storedOTP}:0`,
    identifier: `${ctx.body.type}-otp-${email}`,
    expiresAt: getDate(opts.expiresIn, "sec")
  });
  return otp;
});
const getVerificationOTPBodySchema = z$1.object({
  email: z$1.string({}).meta({ description: "Email address the OTP was sent to" }),
  type: z$1.enum(types).meta({
    required: true,
    description: "Type of the OTP"
  })
});
const getVerificationOTP = (opts) => createAuthEndpoint({
  method: "GET",
  query: getVerificationOTPBodySchema,
  metadata: { openapi: {
    operationId: "getEmailVerificationOTP",
    description: "Get a verification OTP for an email",
    responses: { "200": {
      description: "OTP retrieved successfully or not found/expired",
      content: { "application/json": { schema: {
        type: "object",
        properties: { otp: {
          type: "string",
          nullable: true,
          description: "The stored OTP, or null if not found or expired"
        } },
        required: ["otp"]
      } } }
    } }
  } }
}, async (ctx) => {
  const email = ctx.query.email.toLowerCase();
  const verificationValue = await ctx.context.internalAdapter.findVerificationValue(`${ctx.query.type}-otp-${email}`);
  if (!verificationValue || verificationValue.expiresAt < /* @__PURE__ */ new Date()) return ctx.json({ otp: null });
  if (opts.storeOTP === "hashed" || typeof opts.storeOTP === "object" && "hash" in opts.storeOTP) throw new APIError("BAD_REQUEST", { message: "OTP is hashed, cannot return the plain text OTP" });
  const [storedOtp, _attempts] = splitAtLastColon(verificationValue.value);
  let otp = storedOtp;
  if (opts.storeOTP === "encrypted") otp = await symmetricDecrypt({
    key: ctx.context.secret,
    data: storedOtp
  });
  if (typeof opts.storeOTP === "object" && "decrypt" in opts.storeOTP) otp = await opts.storeOTP.decrypt(storedOtp);
  return ctx.json({ otp });
});
const checkVerificationOTPBodySchema = z$1.object({
  email: z$1.string().meta({ description: "Email address the OTP was sent to" }),
  type: z$1.enum(types).meta({
    required: true,
    description: "Type of the OTP"
  }),
  otp: z$1.string().meta({
    required: true,
    description: "OTP to verify"
  })
});
const checkVerificationOTP = (opts) => createAuthEndpoint("/email-otp/check-verification-otp", {
  method: "POST",
  body: checkVerificationOTPBodySchema,
  metadata: { openapi: {
    operationId: "verifyEmailWithOTP",
    description: "Verify an email with an OTP",
    responses: { 200: {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { success: { type: "boolean" } }
      } } }
    } }
  } }
}, async (ctx) => {
  const email = ctx.body.email.toLowerCase();
  if (!z$1.email().safeParse(email).success) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.INVALID_EMAIL });
  if (!await ctx.context.internalAdapter.findUserByEmail(email)) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.USER_NOT_FOUND });
  const verificationValue = await ctx.context.internalAdapter.findVerificationValue(`${ctx.body.type}-otp-${email}`);
  if (!verificationValue) throw new APIError("BAD_REQUEST", { message: ERROR_CODES.INVALID_OTP });
  if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
    await ctx.context.internalAdapter.deleteVerificationValue(verificationValue.id);
    throw new APIError("BAD_REQUEST", { message: ERROR_CODES.OTP_EXPIRED });
  }
  const [otpValue, attempts] = splitAtLastColon(verificationValue.value);
  const allowedAttempts = opts?.allowedAttempts || 3;
  if (attempts && parseInt(attempts) >= allowedAttempts) {
    await ctx.context.internalAdapter.deleteVerificationValue(verificationValue.id);
    throw new APIError("FORBIDDEN", { message: ERROR_CODES.TOO_MANY_ATTEMPTS });
  }
  if (!await verifyStoredOTP(ctx, opts, otpValue, ctx.body.otp)) {
    await ctx.context.internalAdapter.updateVerificationValue(verificationValue.id, { value: `${otpValue}:${parseInt(attempts || "0") + 1}` });
    throw new APIError("BAD_REQUEST", { message: ERROR_CODES.INVALID_OTP });
  }
  return ctx.json({ success: true });
});
const verifyEmailOTPBodySchema = z$1.object({
  email: z$1.string({}).meta({ description: "Email address to verify" }),
  otp: z$1.string().meta({
    required: true,
    description: "OTP to verify"
  })
});
const verifyEmailOTP = (opts) => createAuthEndpoint("/email-otp/verify-email", {
  method: "POST",
  body: verifyEmailOTPBodySchema,
  metadata: { openapi: {
    description: "Verify email with OTP",
    responses: { 200: {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          status: {
            type: "boolean",
            description: "Indicates if the verification was successful",
            enum: [true]
          },
          token: {
            type: "string",
            nullable: true,
            description: "Session token if autoSignInAfterVerification is enabled, otherwise null"
          },
          user: { $ref: "#/components/schemas/User" }
        },
        required: [
          "status",
          "token",
          "user"
        ]
      } } }
    } }
  } }
}, async (ctx) => {
  const email = ctx.body.email.toLowerCase();
  if (!z$1.email().safeParse(email).success) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.INVALID_EMAIL });
  const verificationValue = await ctx.context.internalAdapter.findVerificationValue(`email-verification-otp-${email}`);
  if (!verificationValue) throw new APIError("BAD_REQUEST", { message: ERROR_CODES.INVALID_OTP });
  if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) throw new APIError("BAD_REQUEST", { message: ERROR_CODES.OTP_EXPIRED });
  const [otpValue, attempts] = splitAtLastColon(verificationValue.value);
  const allowedAttempts = opts?.allowedAttempts || 3;
  if (attempts && parseInt(attempts) >= allowedAttempts) {
    await ctx.context.internalAdapter.deleteVerificationValue(verificationValue.id);
    throw new APIError("FORBIDDEN", { message: ERROR_CODES.TOO_MANY_ATTEMPTS });
  }
  if (!await verifyStoredOTP(ctx, opts, otpValue, ctx.body.otp)) {
    await ctx.context.internalAdapter.updateVerificationValue(verificationValue.id, { value: `${otpValue}:${parseInt(attempts || "0") + 1}` });
    throw new APIError("BAD_REQUEST", { message: ERROR_CODES.INVALID_OTP });
  }
  await ctx.context.internalAdapter.deleteVerificationValue(verificationValue.id);
  const user2 = await ctx.context.internalAdapter.findUserByEmail(email);
  if (!user2)
    throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.USER_NOT_FOUND });
  if (ctx.context.options.emailVerification?.beforeEmailVerification) await ctx.context.options.emailVerification.beforeEmailVerification(user2.user, ctx.request);
  const updatedUser = await ctx.context.internalAdapter.updateUser(user2.user.id, {
    email,
    emailVerified: true
  });
  if (ctx.context.options.emailVerification?.onEmailVerification) await ctx.context.options.emailVerification.onEmailVerification(updatedUser, ctx.request);
  await ctx.context.options.emailVerification?.afterEmailVerification?.(updatedUser, ctx.request);
  if (ctx.context.options.emailVerification?.autoSignInAfterVerification) {
    const session2 = await ctx.context.internalAdapter.createSession(updatedUser.id);
    await setSessionCookie(ctx, {
      session: session2,
      user: updatedUser
    });
    return ctx.json({
      status: true,
      token: session2.token,
      user: parseUserOutput(ctx.context.options, updatedUser)
    });
  }
  const currentSession = await getSessionFromCtx(ctx);
  if (currentSession && updatedUser.emailVerified) {
    const dontRememberMeCookie = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
    await setCookieCache(ctx, {
      session: currentSession.session,
      user: {
        ...currentSession.user,
        emailVerified: true
      }
    }, !!dontRememberMeCookie);
  }
  return ctx.json({
    status: true,
    token: null,
    user: parseUserOutput(ctx.context.options, updatedUser)
  });
});
const signInEmailOTPBodySchema = z$1.object({
  email: z$1.string({}).meta({ description: "Email address to sign in" }),
  otp: z$1.string().meta({
    required: true,
    description: "OTP sent to the email"
  })
});
const signInEmailOTP = (opts) => createAuthEndpoint("/sign-in/email-otp", {
  method: "POST",
  body: signInEmailOTPBodySchema,
  metadata: { openapi: {
    operationId: "signInWithEmailOTP",
    description: "Sign in with email and OTP",
    responses: { 200: {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          token: {
            type: "string",
            description: "Session token for the authenticated session"
          },
          user: { $ref: "#/components/schemas/User" }
        },
        required: ["token", "user"]
      } } }
    } }
  } }
}, async (ctx) => {
  const email = ctx.body.email.toLowerCase();
  const verificationValue = await ctx.context.internalAdapter.findVerificationValue(`sign-in-otp-${email}`);
  if (!verificationValue) throw new APIError("BAD_REQUEST", { message: ERROR_CODES.INVALID_OTP });
  if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) throw new APIError("BAD_REQUEST", { message: ERROR_CODES.OTP_EXPIRED });
  const [otpValue, attempts] = splitAtLastColon(verificationValue.value);
  const allowedAttempts = opts?.allowedAttempts || 3;
  if (attempts && parseInt(attempts) >= allowedAttempts) {
    await ctx.context.internalAdapter.deleteVerificationValue(verificationValue.id);
    throw new APIError("FORBIDDEN", { message: ERROR_CODES.TOO_MANY_ATTEMPTS });
  }
  if (!await verifyStoredOTP(ctx, opts, otpValue, ctx.body.otp)) {
    await ctx.context.internalAdapter.updateVerificationValue(verificationValue.id, { value: `${otpValue}:${parseInt(attempts || "0") + 1}` });
    throw new APIError("BAD_REQUEST", { message: ERROR_CODES.INVALID_OTP });
  }
  await ctx.context.internalAdapter.deleteVerificationValue(verificationValue.id);
  const user2 = await ctx.context.internalAdapter.findUserByEmail(email);
  if (!user2) {
    if (opts.disableSignUp) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.USER_NOT_FOUND });
    const newUser = await ctx.context.internalAdapter.createUser({
      email,
      emailVerified: true,
      name: ""
    });
    const session$1 = await ctx.context.internalAdapter.createSession(newUser.id);
    await setSessionCookie(ctx, {
      session: session$1,
      user: newUser
    });
    return ctx.json({
      token: session$1.token,
      user: parseUserOutput(ctx.context.options, newUser)
    });
  }
  if (!user2.user.emailVerified) await ctx.context.internalAdapter.updateUser(user2.user.id, { emailVerified: true });
  const session2 = await ctx.context.internalAdapter.createSession(user2.user.id);
  await setSessionCookie(ctx, {
    session: session2,
    user: user2.user
  });
  return ctx.json({
    token: session2.token,
    user: parseUserOutput(ctx.context.options, user2.user)
  });
});
const forgetPasswordEmailOTPBodySchema = z$1.object({ email: z$1.string().meta({ description: "Email address to send the OTP" }) });
const forgetPasswordEmailOTP = (opts) => createAuthEndpoint("/forget-password/email-otp", {
  method: "POST",
  body: forgetPasswordEmailOTPBodySchema,
  metadata: { openapi: {
    operationId: "forgetPasswordWithEmailOTP",
    description: "Forget password with email and OTP",
    responses: { 200: {
      description: "Success",
      content: { "application/json": { schema: {
        type: "object",
        properties: { success: {
          type: "boolean",
          description: "Indicates if the OTP was sent successfully"
        } }
      } } }
    } }
  } }
}, async (ctx) => {
  const email = ctx.body.email;
  const otp = opts.generateOTP({
    email,
    type: "forget-password"
  }, ctx) || defaultOTPGenerator$1(opts);
  const storedOTP = await storeOTP(ctx, opts, otp);
  await ctx.context.internalAdapter.createVerificationValue({
    value: `${storedOTP}:0`,
    identifier: `forget-password-otp-${email}`,
    expiresAt: getDate(opts.expiresIn, "sec")
  });
  if (!await ctx.context.internalAdapter.findUserByEmail(email)) {
    await ctx.context.internalAdapter.deleteVerificationByIdentifier(`forget-password-otp-${email}`);
    return ctx.json({ success: true });
  }
  await ctx.context.runInBackgroundOrAwait(opts.sendVerificationOTP({
    email,
    otp,
    type: "forget-password"
  }, ctx));
  return ctx.json({ success: true });
});
const resetPasswordEmailOTPBodySchema = z$1.object({
  email: z$1.string().meta({ description: "Email address to reset the password" }),
  otp: z$1.string().meta({ description: "OTP sent to the email" }),
  password: z$1.string().meta({ description: "New password" })
});
const resetPasswordEmailOTP = (opts) => createAuthEndpoint("/email-otp/reset-password", {
  method: "POST",
  body: resetPasswordEmailOTPBodySchema,
  metadata: { openapi: {
    operationId: "resetPasswordWithEmailOTP",
    description: "Reset password with email and OTP",
    responses: { 200: {
      description: "Success",
      contnt: { "application/json": { schema: {
        type: "object",
        properties: { success: { type: "boolean" } }
      } } }
    } }
  } }
}, async (ctx) => {
  const email = ctx.body.email;
  const verificationValue = await ctx.context.internalAdapter.findVerificationValue(`forget-password-otp-${email}`);
  if (!verificationValue) throw new APIError("BAD_REQUEST", { message: ERROR_CODES.INVALID_OTP });
  if (verificationValue.expiresAt < /* @__PURE__ */ new Date()) {
    await ctx.context.internalAdapter.deleteVerificationValue(verificationValue.id);
    throw new APIError("BAD_REQUEST", { message: ERROR_CODES.OTP_EXPIRED });
  }
  const [otpValue, attempts] = splitAtLastColon(verificationValue.value);
  const allowedAttempts = opts?.allowedAttempts || 3;
  if (attempts && parseInt(attempts) >= allowedAttempts) {
    await ctx.context.internalAdapter.deleteVerificationValue(verificationValue.id);
    throw new APIError("FORBIDDEN", { message: ERROR_CODES.TOO_MANY_ATTEMPTS });
  }
  if (!await verifyStoredOTP(ctx, opts, otpValue, ctx.body.otp)) {
    await ctx.context.internalAdapter.updateVerificationValue(verificationValue.id, { value: `${otpValue}:${parseInt(attempts || "0") + 1}` });
    throw new APIError("BAD_REQUEST", { message: ERROR_CODES.INVALID_OTP });
  }
  await ctx.context.internalAdapter.deleteVerificationValue(verificationValue.id);
  const user2 = await ctx.context.internalAdapter.findUserByEmail(email, { includeAccounts: true });
  if (!user2) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.USER_NOT_FOUND });
  const minPasswordLength = ctx.context.password.config.minPasswordLength;
  if (ctx.body.password.length < minPasswordLength) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.PASSWORD_TOO_SHORT });
  const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
  if (ctx.body.password.length > maxPasswordLength) throw new APIError("BAD_REQUEST", { message: BASE_ERROR_CODES.PASSWORD_TOO_LONG });
  const passwordHash = await ctx.context.password.hash(ctx.body.password);
  if (!user2.accounts?.find((account2) => account2.providerId === "credential")) await ctx.context.internalAdapter.createAccount({
    userId: user2.user.id,
    providerId: "credential",
    accountId: user2.user.id,
    password: passwordHash
  });
  else await ctx.context.internalAdapter.updatePassword(user2.user.id, passwordHash);
  if (ctx.context.options.emailAndPassword?.onPasswordReset) await ctx.context.options.emailAndPassword.onPasswordReset({ user: user2.user }, ctx.request);
  if (!user2.user.emailVerified) await ctx.context.internalAdapter.updateUser(user2.user.id, { emailVerified: true });
  if (ctx.context.options.emailAndPassword?.revokeSessionsOnPasswordReset) await ctx.context.internalAdapter.deleteSessions(user2.user.id);
  return ctx.json({ success: true });
});
const defaultOTPGenerator$1 = (options) => generateRandomString(options.otpLength ?? 6, "0-9");
const defaultOTPGenerator = (options) => generateRandomString(options.otpLength ?? 6, "0-9");
const emailOTP = (options) => {
  const opts = {
    expiresIn: 300,
    generateOTP: () => defaultOTPGenerator(options),
    storeOTP: "plain",
    ...options
  };
  const sendVerificationOTPAction = sendVerificationOTP$1(opts);
  return {
    id: "email-otp",
    init(ctx) {
      if (!opts.overrideDefaultEmailVerification) return;
      return { options: { emailVerification: { async sendVerificationEmail(data, request2) {
        await ctx.runInBackgroundOrAwait(sendVerificationOTPAction({
          context: ctx,
          request: request2,
          body: {
            email: data.user.email,
            type: "email-verification"
          },
          ctx
        }));
      } } } };
    },
    endpoints: {
      sendVerificationOTP: sendVerificationOTPAction,
      createVerificationOTP: createVerificationOTP(opts),
      getVerificationOTP: getVerificationOTP(opts),
      checkVerificationOTP: checkVerificationOTP(opts),
      verifyEmailOTP: verifyEmailOTP(opts),
      signInEmailOTP: signInEmailOTP(opts),
      forgetPasswordEmailOTP: forgetPasswordEmailOTP(opts),
      resetPasswordEmailOTP: resetPasswordEmailOTP(opts)
    },
    hooks: { after: [{
      matcher(context) {
        return !!(context.path?.startsWith("/sign-up") && opts.sendVerificationOnSignUp && !opts.overrideDefaultEmailVerification);
      },
      handler: createAuthMiddleware(async (ctx) => {
        const email = (await getEndpointResponse(ctx))?.user.email;
        if (email) {
          const otp = opts.generateOTP({
            email,
            type: ctx.body.type
          }, ctx) || defaultOTPGenerator(opts);
          const storedOTP = await storeOTP(ctx, opts, otp);
          await ctx.context.internalAdapter.createVerificationValue({
            value: `${storedOTP}:0`,
            identifier: `email-verification-otp-${email}`,
            expiresAt: getDate(opts.expiresIn, "sec")
          });
          await ctx.context.runInBackgroundOrAwait(options.sendVerificationOTP({
            email,
            otp,
            type: "email-verification"
          }, ctx));
        }
      })
    }] },
    $ERROR_CODES: ERROR_CODES,
    rateLimit: [
      {
        pathMatcher(path) {
          return path === "/email-otp/send-verification-otp";
        },
        window: 60,
        max: 3
      },
      {
        pathMatcher(path) {
          return path === "/email-otp/check-verification-otp";
        },
        window: 60,
        max: 3
      },
      {
        pathMatcher(path) {
          return path === "/email-otp/verify-email";
        },
        window: 60,
        max: 3
      },
      {
        pathMatcher(path) {
          return path === "/sign-in/email-otp";
        },
        window: 60,
        max: 3
      }
    ],
    options
  };
};
z$1.object({
  providerId: z$1.string().meta({ description: "The provider ID for the OAuth provider" }),
  callbackURL: z$1.string().meta({ description: "The URL to redirect to after sign in" }).optional(),
  errorCallbackURL: z$1.string().meta({ description: "The URL to redirect to if an error occurs" }).optional(),
  newUserCallbackURL: z$1.string().meta({ description: 'The URL to redirect to after login if the user is new. Eg: "/welcome"' }).optional(),
  disableRedirect: z$1.boolean().meta({ description: "Disable redirect" }).optional(),
  scopes: z$1.array(z$1.string()).meta({ description: "Scopes to be passed to the provider authorization request." }).optional(),
  requestSignUp: z$1.boolean().meta({ description: "Explicitly request sign-up. Useful when disableImplicitSignUp is true for this provider. Eg: false" }).optional(),
  additionalData: z$1.record(z$1.string(), z$1.any()).optional()
});
z$1.object({
  code: z$1.string().meta({ description: "The OAuth2 code" }).optional(),
  error: z$1.string().meta({ description: "The error message, if any" }).optional(),
  error_description: z$1.string().meta({ description: "The error description, if any" }).optional(),
  state: z$1.string().meta({ description: "The state parameter from the OAuth2 request" }).optional()
});
z$1.object({
  providerId: z$1.string(),
  callbackURL: z$1.string(),
  scopes: z$1.array(z$1.string()).meta({ description: "Additional scopes to request when linking the account" }).optional(),
  errorCallbackURL: z$1.string().meta({ description: "The URL to redirect to if there is an error during the link process" }).optional()
});
z$1.object({
  payload: z$1.record(z$1.string(), z$1.any()),
  overrideOptions: z$1.record(z$1.string(), z$1.any()).optional()
});
z$1.object({
  token: z$1.string(),
  issuer: z$1.string().optional()
});
z$1.object({
  email: z$1.email().meta({ description: "Email address to send the magic link" }),
  name: z$1.string().meta({ description: 'User display name. Only used if the user is registering for the first time. Eg: "my-name"' }).optional(),
  callbackURL: z$1.string().meta({ description: "URL to redirect after magic link verification" }).optional(),
  newUserCallbackURL: z$1.string().meta({ description: "URL to redirect after new user signup. Only used if the user is registering for the first time." }).optional(),
  errorCallbackURL: z$1.string().meta({ description: "URL to redirect after error." }).optional()
});
z$1.object({
  token: z$1.string().meta({ description: "Verification token" }),
  callbackURL: z$1.string().meta({ description: 'URL to redirect after magic link verification, if not provided the user will be redirected to the root URL. Eg: "/dashboard"' }).optional(),
  errorCallbackURL: z$1.string().meta({ description: "URL to redirect after error." }).optional(),
  newUserCallbackURL: z$1.string().meta({ description: "URL to redirect after new user signup. Only used if the user is registering for the first time." }).optional()
});
z$1.object({
  clientId: z$1.string(),
  clientSecret: z$1.string().optional(),
  type: z$1.enum([
    "web",
    "native",
    "user-agent-based",
    "public"
  ]),
  name: z$1.string(),
  icon: z$1.string().optional(),
  metadata: z$1.string().optional(),
  disabled: z$1.boolean().optional().default(false),
  redirectUrls: z$1.string(),
  userId: z$1.string().optional(),
  createdAt: z$1.date(),
  updatedAt: z$1.date()
});
z$1.object({
  accept: z$1.boolean(),
  consent_code: z$1.string().optional().nullish()
});
z$1.record(z$1.any(), z$1.any());
z$1.object({
  redirect_uris: z$1.array(z$1.string()).meta({ description: 'A list of redirect URIs. Eg: ["https://client.example.com/callback"]' }),
  token_endpoint_auth_method: z$1.enum([
    "none",
    "client_secret_basic",
    "client_secret_post"
  ]).meta({ description: 'The authentication method for the token endpoint. Eg: "client_secret_basic"' }).default("client_secret_basic").optional(),
  grant_types: z$1.array(z$1.enum([
    "authorization_code",
    "implicit",
    "password",
    "client_credentials",
    "refresh_token",
    "urn:ietf:params:oauth:grant-type:jwt-bearer",
    "urn:ietf:params:oauth:grant-type:saml2-bearer"
  ])).meta({ description: 'The grant types supported by the application. Eg: ["authorization_code"]' }).default(["authorization_code"]).optional(),
  response_types: z$1.array(z$1.enum(["code", "token"])).meta({ description: 'The response types supported by the application. Eg: ["code"]' }).default(["code"]).optional(),
  client_name: z$1.string().meta({ description: 'The name of the application. Eg: "My App"' }).optional(),
  client_uri: z$1.string().meta({ description: 'The URI of the application. Eg: "https://client.example.com"' }).optional(),
  logo_uri: z$1.string().meta({ description: 'The URI of the application logo. Eg: "https://client.example.com/logo.png"' }).optional(),
  scope: z$1.string().meta({ description: 'The scopes supported by the application. Separated by spaces. Eg: "profile email"' }).optional(),
  contacts: z$1.array(z$1.string()).meta({ description: 'The contact information for the application. Eg: ["admin@example.com"]' }).optional(),
  tos_uri: z$1.string().meta({ description: 'The URI of the application terms of service. Eg: "https://client.example.com/tos"' }).optional(),
  policy_uri: z$1.string().meta({ description: 'The URI of the application privacy policy. Eg: "https://client.example.com/policy"' }).optional(),
  jwks_uri: z$1.string().meta({ description: 'The URI of the application JWKS. Eg: "https://client.example.com/jwks"' }).optional(),
  jwks: z$1.record(z$1.any(), z$1.any()).meta({ description: 'The JWKS of the application. Eg: {"keys": [{"kty": "RSA", "alg": "RS256", "use": "sig", "n": "...", "e": "..."}]}' }).optional(),
  metadata: z$1.record(z$1.any(), z$1.any()).meta({ description: 'The metadata of the application. Eg: {"key": "value"}' }).optional(),
  software_id: z$1.string().meta({ description: 'The software ID of the application. Eg: "my-software"' }).optional(),
  software_version: z$1.string().meta({ description: 'The software version of the application. Eg: "1.0.0"' }).optional(),
  software_statement: z$1.string().meta({ description: "The software statement of the application." }).optional()
});
z$1.object({
  redirect_uris: z$1.array(z$1.string()),
  token_endpoint_auth_method: z$1.enum([
    "none",
    "client_secret_basic",
    "client_secret_post"
  ]).default("client_secret_basic").optional(),
  grant_types: z$1.array(z$1.enum([
    "authorization_code",
    "implicit",
    "password",
    "client_credentials",
    "refresh_token",
    "urn:ietf:params:oauth:grant-type:jwt-bearer",
    "urn:ietf:params:oauth:grant-type:saml2-bearer"
  ])).default(["authorization_code"]).optional(),
  response_types: z$1.array(z$1.enum(["code", "token"])).default(["code"]).optional(),
  client_name: z$1.string().optional(),
  client_uri: z$1.string().optional(),
  logo_uri: z$1.string().optional(),
  scope: z$1.string().optional(),
  contacts: z$1.array(z$1.string()).optional(),
  tos_uri: z$1.string().optional(),
  policy_uri: z$1.string().optional(),
  jwks_uri: z$1.string().optional(),
  jwks: z$1.record(z$1.string(), z$1.any()).optional(),
  metadata: z$1.record(z$1.any(), z$1.any()).optional(),
  software_id: z$1.string().optional(),
  software_version: z$1.string().optional(),
  software_statement: z$1.string().optional()
});
z$1.record(z$1.any(), z$1.any());
z$1.object({ sessionToken: z$1.string().meta({ description: "The session token to set as active" }) });
z$1.object({ sessionToken: z$1.string().meta({ description: "The session token to revoke" }) });
z$1.object({
  callbackURL: z$1.string().meta({ description: "The URL to redirect to after the proxy" }),
  cookies: z$1.string().meta({ description: "The cookies to set after the proxy" })
});
z$1.object({ idToken: z$1.string().meta({ description: "Google ID token, which the client obtains from the One Tap API" }) });
z$1.object({ token: z$1.string().meta({ description: 'The token to verify. Eg: "some-token"' }) });
const allowedType = /* @__PURE__ */ new Set([
  "string",
  "number",
  "boolean",
  "array",
  "object"
]);
function getTypeFromZodType(zodType) {
  if (zodType instanceof z$1.ZodDefault) return getTypeFromZodType(zodType.unwrap());
  const type = zodType.type;
  return allowedType.has(type) ? type : "string";
}
function getFieldSchema(field) {
  const schema2 = {
    type: field.type === "date" ? "string" : field.type,
    ...field.type === "date" && { format: "date-time" }
  };
  if (field.defaultValue !== void 0) schema2.default = typeof field.defaultValue === "function" ? "Generated at runtime" : field.defaultValue;
  if (field.input === false) schema2.readOnly = true;
  return schema2;
}
function getParameters(options) {
  const parameters = [];
  if (options.metadata?.openapi?.parameters) {
    parameters.push(...options.metadata.openapi.parameters);
    return parameters;
  }
  if (options.query instanceof z$1.ZodObject) Object.entries(options.query.shape).forEach(([key, value]) => {
    if (value instanceof z$1.ZodType) parameters.push({
      name: key,
      in: "query",
      schema: {
        ...processZodType(value),
        ..."minLength" in value && value.minLength ? { minLength: value.minLength } : {}
      }
    });
  });
  return parameters;
}
function getRequestBody(options) {
  if (options.metadata?.openapi?.requestBody) return options.metadata.openapi.requestBody;
  if (!options.body) return void 0;
  if (options.body instanceof z$1.ZodObject || options.body instanceof z$1.ZodOptional) {
    const shape = options.body.shape;
    if (!shape) return void 0;
    const properties = {};
    const required = [];
    Object.entries(shape).forEach(([key, value]) => {
      if (value instanceof z$1.ZodType) {
        properties[key] = processZodType(value);
        if (!(value instanceof z$1.ZodOptional)) required.push(key);
      }
    });
    return {
      required: options.body instanceof z$1.ZodOptional ? false : options.body ? true : false,
      content: { "application/json": { schema: {
        type: "object",
        properties,
        required
      } } }
    };
  }
}
function processZodType(zodType) {
  if (zodType instanceof z$1.ZodOptional) {
    const innerSchema = processZodType(zodType.unwrap());
    if (innerSchema.type) {
      const type = Array.isArray(innerSchema.type) ? innerSchema.type : [innerSchema.type];
      return {
        ...innerSchema,
        type: Array.from(/* @__PURE__ */ new Set([...type, "null"]))
      };
    }
    return { anyOf: [innerSchema, { type: "null" }] };
  }
  if (zodType instanceof z$1.ZodDefault) {
    const innerSchema = processZodType(zodType.unwrap());
    const defaultValueDef = zodType._def.defaultValue;
    const defaultValue = typeof defaultValueDef === "function" ? defaultValueDef() : defaultValueDef;
    return {
      ...innerSchema,
      default: defaultValue
    };
  }
  if (zodType instanceof z$1.ZodObject) {
    const shape = zodType.shape;
    if (shape) {
      const properties = {};
      const required = [];
      Object.entries(shape).forEach(([key, value]) => {
        if (value instanceof z$1.ZodType) {
          properties[key] = processZodType(value);
          if (!(value instanceof z$1.ZodOptional)) required.push(key);
        }
      });
      return {
        type: "object",
        properties,
        ...required.length > 0 ? { required } : {},
        description: zodType.description
      };
    }
  }
  return {
    type: getTypeFromZodType(zodType),
    description: zodType.description
  };
}
function getResponse(responses) {
  return {
    "400": {
      content: { "application/json": { schema: {
        type: "object",
        properties: { message: { type: "string" } },
        required: ["message"]
      } } },
      description: "Bad Request. Usually due to missing parameters, or invalid parameters."
    },
    "401": {
      content: { "application/json": { schema: {
        type: "object",
        properties: { message: { type: "string" } },
        required: ["message"]
      } } },
      description: "Unauthorized. Due to missing or invalid authentication."
    },
    "403": {
      content: { "application/json": { schema: {
        type: "object",
        properties: { message: { type: "string" } }
      } } },
      description: "Forbidden. You do not have permission to access this resource or to perform this action."
    },
    "404": {
      content: { "application/json": { schema: {
        type: "object",
        properties: { message: { type: "string" } }
      } } },
      description: "Not Found. The requested resource was not found."
    },
    "429": {
      content: { "application/json": { schema: {
        type: "object",
        properties: { message: { type: "string" } }
      } } },
      description: "Too Many Requests. You have exceeded the rate limit. Try again later."
    },
    "500": {
      content: { "application/json": { schema: {
        type: "object",
        properties: { message: { type: "string" } }
      } } },
      description: "Internal Server Error. This is a problem with the server that you cannot fix."
    },
    ...responses
  };
}
function toOpenApiPath(path) {
  return path.split("/").map((part) => part.startsWith(":") ? `{${part.slice(1)}}` : part).join("/");
}
async function generator(ctx, options) {
  const baseEndpoints = getEndpoints(ctx, {
    ...options,
    plugins: []
  });
  const tables = (0, db_exports.getAuthTables)({
    ...options,
    session: {
      ...options.session,
      storeSessionInDatabase: true
    }
  });
  const components = { schemas: { ...Object.entries(tables).reduce((acc, [key, value]) => {
    const modelName = key.charAt(0).toUpperCase() + key.slice(1);
    const fields = value.fields;
    const required = [];
    const properties = { id: { type: "string" } };
    Object.entries(fields).forEach(([fieldKey, fieldValue]) => {
      if (!fieldValue) return;
      properties[fieldKey] = getFieldSchema(fieldValue);
      if (fieldValue.required && fieldValue.input !== false) required.push(fieldKey);
    });
    Object.entries(properties).forEach(([key$1, prop]) => {
      const field = value.fields[key$1];
      if (field && field.type === "date" && prop.type === "string") prop.format = "date-time";
    });
    acc[modelName] = {
      type: "object",
      properties,
      required
    };
    return acc;
  }, {}) } };
  const paths2 = {};
  Object.entries(baseEndpoints.api).forEach(([_, value]) => {
    if (!value.path || ctx.options.disabledPaths?.includes(value.path)) return;
    const options$1 = value.options;
    if (options$1.metadata?.SERVER_ONLY) return;
    const path = toOpenApiPath(value.path);
    if (options$1.method === "GET" || options$1.method === "DELETE") paths2[path] = {
      ...paths2[path],
      [options$1.method.toLowerCase()]: {
        tags: ["Default", ...options$1.metadata?.openapi?.tags || []],
        description: options$1.metadata?.openapi?.description,
        operationId: options$1.metadata?.openapi?.operationId,
        security: [{ bearerAuth: [] }],
        parameters: getParameters(options$1),
        responses: getResponse(options$1.metadata?.openapi?.responses)
      }
    };
    if (options$1.method === "POST" || options$1.method === "PATCH" || options$1.method === "PUT") {
      const body = getRequestBody(options$1);
      paths2[path] = {
        ...paths2[path],
        [options$1.method.toLowerCase()]: {
          tags: ["Default", ...options$1.metadata?.openapi?.tags || []],
          description: options$1.metadata?.openapi?.description,
          operationId: options$1.metadata?.openapi?.operationId,
          security: [{ bearerAuth: [] }],
          parameters: getParameters(options$1),
          ...body ? { requestBody: body } : { requestBody: { content: { "application/json": { schema: {
            type: "object",
            properties: {}
          } } } } },
          responses: getResponse(options$1.metadata?.openapi?.responses)
        }
      };
    }
  });
  for (const plugin of options.plugins || []) {
    if (plugin.id === "open-api") continue;
    const pluginEndpoints = getEndpoints(ctx, {
      ...options,
      plugins: [plugin]
    });
    const api = Object.keys(pluginEndpoints.api).map((key) => {
      if (baseEndpoints.api[key] === void 0) return pluginEndpoints.api[key];
      return null;
    }).filter((x2) => x2 !== null);
    Object.entries(api).forEach(([key, value]) => {
      if (!value.path || ctx.options.disabledPaths?.includes(value.path)) return;
      const options$1 = value.options;
      if (options$1.metadata?.SERVER_ONLY) return;
      const path = toOpenApiPath(value.path);
      if (options$1.method === "GET" || options$1.method === "DELETE") paths2[path] = {
        ...paths2[path],
        [options$1.method.toLowerCase()]: {
          tags: options$1.metadata?.openapi?.tags || [plugin.id.charAt(0).toUpperCase() + plugin.id.slice(1)],
          description: options$1.metadata?.openapi?.description,
          operationId: options$1.metadata?.openapi?.operationId,
          security: [{ bearerAuth: [] }],
          parameters: getParameters(options$1),
          responses: getResponse(options$1.metadata?.openapi?.responses)
        }
      };
      if (options$1.method === "POST" || options$1.method === "PATCH" || options$1.method === "PUT") paths2[path] = {
        ...paths2[path],
        [options$1.method.toLowerCase()]: {
          tags: options$1.metadata?.openapi?.tags || [plugin.id.charAt(0).toUpperCase() + plugin.id.slice(1)],
          description: options$1.metadata?.openapi?.description,
          operationId: options$1.metadata?.openapi?.operationId,
          security: [{ bearerAuth: [] }],
          parameters: getParameters(options$1),
          requestBody: getRequestBody(options$1),
          responses: getResponse(options$1.metadata?.openapi?.responses)
        }
      };
    });
  }
  return {
    openapi: "3.1.1",
    info: {
      title: "Better Auth",
      description: "API Reference for your Better Auth Instance",
      version: "1.1.0"
    },
    components: {
      ...components,
      securitySchemes: {
        apiKeyCookie: {
          type: "apiKey",
          in: "cookie",
          name: "apiKeyCookie",
          description: "API Key authentication via cookie"
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "Bearer token authentication"
        }
      }
    },
    security: [{
      apiKeyCookie: [],
      bearerAuth: []
    }],
    servers: [{ url: ctx.baseURL }],
    tags: [{
      name: "Default",
      description: "Default endpoints that are included with Better Auth by default. These endpoints are not part of any plugin."
    }],
    paths: paths2
  };
}
const logo$1 = `<svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="75" height="75" fill="url(#pattern0_21_12)"/>
<defs>
<pattern id="pattern0_21_12" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_21_12" transform="scale(0.00094697)"/>
</pattern>
<image id="image0_21_12" width="1056" height="1056" xlink:href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBARXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAEIKADAAQAAAABAAAEIAAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+ICKElDQ19QUk9GSUxFAAEBAAACGGFwcGwEAAAAbW50clJHQiBYWVogB+YAAQABAAAAAAAAYWNzcEFQUEwAAAAAQVBQTAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1hcHBs7P2jjjiFR8NttL1PetoYLwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKZGVzYwAAAPwAAAAwY3BydAAAASwAAABQd3RwdAAAAXwAAAAUclhZWgAAAZAAAAAUZ1hZWgAAAaQAAAAUYlhZWgAAAbgAAAAUclRSQwAAAcwAAAAgY2hhZAAAAewAAAAsYlRSQwAAAcwAAAAgZ1RSQwAAAcwAAAAgbWx1YwAAAAAAAAABAAAADGVuVVMAAAAUAAAAHABEAGkAcwBwAGwAYQB5ACAAUAAzbWx1YwAAAAAAAAABAAAADGVuVVMAAAA0AAAAHABDAG8AcAB5AHIAaQBnAGgAdAAgAEEAcABwAGwAZQAgAEkAbgBjAC4ALAAgADIAMAAyADJYWVogAAAAAAAA9tUAAQAAAADTLFhZWiAAAAAAAACD3wAAPb////+7WFlaIAAAAAAAAEq/AACxNwAACrlYWVogAAAAAAAAKDgAABELAADIuXBhcmEAAAAAAAMAAAACZmYAAPKnAAANWQAAE9AAAApbc2YzMgAAAAAAAQxCAAAF3v//8yYAAAeTAAD9kP//+6L///2jAAAD3AAAwG7/wAARCAQgBCADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwACAgICAgIDAgIDBAMDAwQFBAQEBAUHBQUFBQUHCAcHBwcHBwgICAgICAgICgoKCgoKCwsLCwsNDQ0NDQ0NDQ0N/9sAQwECAgIDAwMGAwMGDQkHCQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0N/90ABABC/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Q/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/0f38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9L9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//T/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/1P38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9X9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//W/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/1/38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9D9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//R/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/0v38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9P9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//U/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/1f38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9b9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//X/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/0P38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9H9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//S/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/0/38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9T9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//V/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/1v38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK/Ln/gq38a/in8Dvgp4T8R/CfxFdeG9SvvFMdlcXFoELyW5srqQxnzEcY3op4Gciv1Gr8Z/+C2X/JvXgj/sc4v/AE33lAH4z/8ADwv9tD/oq2tf9823/wAZo/4eF/tof9FW1r/vm2/+M18Z0UAfZn/Dwv8AbQ/6KtrX/fNt/wDGaP8Ah4X+2h/0VbWv++bb/wCM18Z0UAfZn/Dwv9tD/oq2tf8AfNt/8Zo/4eF/tof9FW1r/vm2/wDjNfGdFAH2Z/w8L/bQ/wCira1/3zbf/GaP+Hhf7aH/AEVbWv8Avm2/+M18Z0UAfZn/AA8L/bQ/6KtrX/fNt/8AGaP+Hhf7aH/RVta/75tv/jNfGdFAH2Z/w8L/AG0P+ira1/3zbf8Axmj/AIeF/tof9FW1r/vm2/8AjNfGdFAH63/sVftq/tTfEb9qb4deCfG3xF1TVtD1bVGgvbKdYBHPGIJW2ttiVsblB4I6V/UbX8Z//BPT/k9D4U/9hpv/AEmmr+zCgAooooAKKKKACiiigAooooAKKKKACiiigD+M/wD4eF/tof8ARVta/wC+bb/4zR/w8L/bQ/6KtrX/AHzbf/Ga+M6KAPsz/h4X+2h/0VbWv++bb/4zR/w8L/bQ/wCira1/3zbf/Ga+M6KAPsz/AIeF/tof9FW1r/vm2/8AjNH/AA8L/bQ/6KtrX/fNt/8AGa+M6KAPsz/h4X+2h/0VbWv++bb/AOM0f8PC/wBtD/oq2tf9823/AMZr4zooA+zP+Hhf7aH/AEVbWv8Avm2/+M0f8PC/20P+ira1/wB823/xmvjOigD7M/4eF/tof9FW1r/vm2/+M0f8PC/20P8Aoq2tf9823/xmvjOigD7M/wCHhf7aH/RVta/75tv/AIzR/wAPC/20P+ira1/3zbf/ABmvjOigD7M/4eF/tof9FW1r/vm2/wDjNH/Dwv8AbQ/6KtrX/fNt/wDGa+M6KAPsz/h4X+2h/wBFW1r/AL5tv/jNH/Dwv9tD/oq2tf8AfNt/8Zr4zooA+zP+Hhf7aH/RVta/75tv/jNH/Dwv9tD/AKKtrX/fNt/8Zr4zooA+zP8Ah4X+2h/0VbWv++bb/wCM0f8ADwv9tD/oq2tf9823/wAZr4zooA+zP+Hhf7aH/RVta/75tv8A4zR/w8L/AG0P+ira1/3zbf8AxmvjOigD7M/4eF/tof8ARVta/wC+bb/4zR/w8L/bQ/6KtrX/AHzbf/Ga+M6KAP6tv+CUnxr+Kfxx+CnizxH8WPEV14k1Kx8UyWVvcXYQPHbiytZBGPLRBje7HkZya/Uavxn/AOCJv/JvXjf/ALHOX/032dfsxQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf//X/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr8Z/+C2X/JvXgj/sc4v/AE33lfsxX4z/APBbL/k3rwR/2OcX/pvvKAP5m6KKKACiiigAooooAKKKKACiiigAooooA+zP+Cen/J6Hwp/7DTf+k01f2YV/Gf8A8E9P+T0PhT/2Gm/9Jpq/swoAKKKKACiiigAooooAKKKKACiiigAooooA/gDooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/pk/4Im/8m9eN/8Asc5f/TfZ1+zFfjP/AMETf+TevG//AGOcv/pvs6/ZigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9D9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvxn/4LZf8m9eCP+xzi/8ATfeV+zFfjP8A8Fsv+TevBH/Y5xf+m+8oA/mbooooAKKKKACiiigAooooAKKKKACiiigD7M/4J6f8nofCn/sNN/6TTV/ZhX8Z/wDwT0/5PQ+FP/Yab/0mmr+zCgAooooAKKKKACiiigAooooAKKKKACiiigD+AOiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD+mT/gib/yb143/wCxzl/9N9nX7MV+M/8AwRN/5N68b/8AY5y/+m+zr9mKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0f38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK/Gf/gtl/yb14I/7HOL/wBN95X7MV+M/wDwWy/5N68Ef9jnF/6b7ygD+ZuiiigAooooAKKKKACiiigAooooAKKKKAPsz/gnp/yeh8Kf+w03/pNNX9mFfxn/APBPT/k9D4U/9hpv/Saav7MKACiiigAooooAKKKKACiiigAooooAKKKKAP4A6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP6ZP+CJv/JvXjf/ALHOX/032dfsxX4z/wDBE3/k3rxv/wBjnL/6b7Ov2YoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/S/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr8Z/+C2X/JvXgj/sc4v/AE33lfsxX4z/APBbL/k3rwR/2OcX/pvvKAP5m6KKKACiiigAooooAKKKKACiiigAooooA+zP+Cen/J6Hwp/7DTf+k01f2YV/Gf8A8E9P+T0PhT/2Gm/9Jpq/swoAKKKKACiiigAooooAKKKKACiiigAooooA/gDooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/pk/4Im/8m9eN/8Asc5f/TfZ1+zFfjP/AMETf+TevG//AGOcv/pvs6/ZigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9P9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvxn/4LZf8m9eCP+xzi/8ATfeV+zFfjP8A8Fsv+TevBH/Y5xf+m+8oA/mbooooAKKKKACiiigAooooAKKKKACiiigD7M/4J6f8nofCn/sNN/6TTV/ZhX8Z/wDwT0/5PQ+FP/Yab/0mmr+zCgAooooAKKKKACiiigAooooAKKKKACiiigD+AOiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD+mT/gib/yb143/wCxzl/9N9nX7MV+M/8AwRN/5N68b/8AY5y/+m+zr9mKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1P38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK/Gf/gtl/yb14I/7HOL/wBN95X7MV+M/wDwWy/5N68Ef9jnF/6b7ygD+ZuiiigAooooAKKKKACiiigAooooAKKKKAPsz/gnp/yeh8Kf+w03/pNNX9mFfwq/BT4r638Dvin4d+LHhy0tb7UvDd0bu3t70ObeRzG0eJBGyPjDnowOa/Ub/h9l+0L/ANCR4M/79ah/8m0Af0yUV/M3/wAPsv2hf+hI8Gf9+tQ/+TaP+H2X7Qv/AEJHgz/v1qH/AMm0Af0yUV/M3/w+y/aF/wChI8Gf9+tQ/wDk2j/h9l+0L/0JHgz/AL9ah/8AJtAH9MlFfzN/8Psv2hf+hI8Gf9+tQ/8Ak2j/AIfZftC/9CR4M/79ah/8m0Af0yUV/M3/AMPsv2hf+hI8Gf8AfrUP/k2j/h9l+0L/ANCR4M/79ah/8m0Af0yUV/M3/wAPsv2hf+hI8Gf9+tQ/+TaP+H2X7Qv/AEJHgz/v1qH/AMm0Af0yUV/M3/w+y/aF/wChI8Gf9+tQ/wDk2j/h9l+0L/0JHgz/AL9ah/8AJtAH4z0V/TJ/w5N/Z6/6Hfxn/wB/dP8A/kKj/hyb+z1/0O/jP/v7p/8A8hUAfzN0V/TJ/wAOTf2ev+h38Z/9/dP/APkKj/hyb+z1/wBDv4z/AO/un/8AyFQB/M3RX9Mn/Dk39nr/AKHfxn/390//AOQqP+HJv7PX/Q7+M/8Av7p//wAhUAfzN0V/TJ/w5N/Z6/6Hfxn/AN/dP/8AkKj/AIcm/s9f9Dv4z/7+6f8A/IVAH8zdFf0yf8OTf2ev+h38Z/8Af3T/AP5Co/4cm/s9f9Dv4z/7+6f/APIVAH8zdFf0yf8ADk39nr/od/Gf/f3T/wD5Co/4cm/s9f8AQ7+M/wDv7p//AMhUAfzN0V/TJ/w5N/Z6/wCh38Z/9/dP/wDkKvwV/ag+FGifA74++M/hP4cu7q+03w3fi0t7i9KG4kQxRyZkMaomcueigYoA8FooooAKKKKACiiigAooooAKKKKACiiigD+mT/gib/yb143/AOxzl/8ATfZ1+zFfjP8A8ETf+TevG/8A2Ocv/pvs6/ZigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9X9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvxn/4LZf8m9eCP+xzi/8ATfeV+zFfjP8A8Fsv+TevBH/Y5xf+m+8oA/mbooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/v8ooooAKKKKACiiigAooooAKKKKACiiigAr+M//goX/wAnofFb/sNL/wCk0Nf2YV/Gf/wUL/5PQ+K3/YaX/wBJoaAPjOiiigAooooAKKKKACiiigAooooAKKKKAP6ZP+CJv/JvXjf/ALHOX/032dfsxX4z/wDBE3/k3rxv/wBjnL/6b7Ov2YoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/W/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr8Z/+C2X/JvXgj/sc4v/AE33lfsxX4z/APBbL/k3rwR/2OcX/pvvKAP5m6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP7/KKKKACiiigAooooAKKKKACiiigAooooAK/jP/4KF/8AJ6HxW/7DS/8ApNDX9mFfxn/8FC/+T0Pit/2Gl/8ASaGgD4zooooAKKKKACiiigAooooAKKKKACiiigD+mT/gib/yb143/wCxzl/9N9nX7MV+M/8AwRN/5N68b/8AY5y/+m+zr9mKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1/38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK/Gf/gtl/yb14I/7HOL/wBN95X7MV+M/wDwWy/5N68Ef9jnF/6b7ygD+ZuiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD+/yiiigAooooAKKKKACiiigAooooAKKKKACv4z/+Chf/ACeh8Vv+w0v/AKTQ1/ZhX8Z//BQv/k9D4rf9hpf/AEmhoA+M6KKKACiiigAooooAKKKKACiiigAooooA/pk/4Im/8m9eN/8Asc5f/TfZ1+zFfjP/AMETf+TevG//AGOcv/pvs6/ZigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9D9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvxn/4LZf8m9eCP+xzi/8ATfeV+zFfjP8A8Fsv+TevBH/Y5xf+m+8oA/mbooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/v8ooooAKKKKACiiigAooooAKKKKACiiigAr+M//goX/wAnofFb/sNL/wCk0Nf2YV/Gf/wUL/5PQ+K3/YaX/wBJoaAPjOiiigAooooAKKKKACiiigAooooAKKKKAP6ZP+CJv/JvXjf/ALHOX/032dfsxX4z/wDBE3/k3rxv/wBjnL/6b7Ov2YoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/R/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr8Z/+C2X/JvXgj/sc4v/AE33lfsxX4z/APBbL/k3rwR/2OcX/pvvKAP5m6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP7/KKKKACiiigAooooAKKKKACiiigAooooAK/jP/4KF/8AJ6HxW/7DS/8ApNDX9mFfxn/8FC/+T0Pit/2Gl/8ASaGgD4zooooAKKKKACiiigAooooAKKKKACiiigD+mT/gib/yb143/wCxzl/9N9nX7MV+M/8AwRN/5N68b/8AY5y/+m+zr9mKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0v38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK/Gf/gtl/yb14I/7HOL/wBN95X7MV+M/wDwWy/5N68Ef9jnF/6b7ygD+ZuiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD+/yiiigAooooAKKKKACiiigAooooAKKKKACv4z/+Chf/ACeh8Vv+w0v/AKTQ1/ZhX8Z//BQv/k9D4rf9hpf/AEmhoA+M6KKKACiiigAooooAKKKKACiiigAooooA/pk/4Im/8m9eN/8Asc5f/TfZ1+zFfjP/AMETf+TevG//AGOcv/pvs6/ZigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9P9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvxn/4LZf8m9eCP+xzi/8ATfeV+zFfjP8A8Fsv+TevBH/Y5xf+m+8oA/mbooooAKKKKACiiigAooooAKKKKACiiigD1L4KfCjW/jj8U/Dvwn8OXdrY6l4kujaW9xelxbxuI2kzIY1d8YQ9FJzX6jf8OTf2hf8Aod/Bn/f3UP8A5Cr4z/4J6f8AJ6Hwp/7DTf8ApNNX9mFAH8zf/Dk39oX/AKHfwZ/391D/AOQqP+HJv7Qv/Q7+DP8Av7qH/wAhV/TJRQB/M3/w5N/aF/6HfwZ/391D/wCQqP8Ahyb+0L/0O/gz/v7qH/yFX9MlFAH8zf8Aw5N/aF/6HfwZ/wB/dQ/+QqP+HJv7Qv8A0O/gz/v7qH/yFX9MlFAH8zf/AA5N/aF/6HfwZ/391D/5Co/4cm/tC/8AQ7+DP+/uof8AyFX9MlFAH8zf/Dk39oX/AKHfwZ/391D/AOQqP+HJv7Qv/Q7+DP8Av7qH/wAhV/TJRQB/M3/w5N/aF/6HfwZ/391D/wCQqP8Ahyb+0L/0O/gz/v7qH/yFX9MlFAH4z/8AD7L9nr/oSPGf/frT/wD5No/4fZfs9f8AQkeM/wDv1p//AMm1/M3RQB/TJ/w+y/Z6/wChI8Z/9+tP/wDk2j/h9l+z1/0JHjP/AL9af/8AJtfzN0UAf0yf8Psv2ev+hI8Z/wDfrT//AJNo/wCH2X7PX/QkeM/+/Wn/APybX8zdFAH9Mn/D7L9nr/oSPGf/AH60/wD+TaP+H2X7PX/QkeM/+/Wn/wDybX8zdFAH9Mn/AA+y/Z6/6Ejxn/360/8A+TaP+H2X7PX/AEJHjP8A79af/wDJtfzN0UAf0yf8Psv2ev8AoSPGf/frT/8A5No/4fZfs9f9CR4z/wC/Wn//ACbX8zdFAH9Mn/D7L9nr/oSPGf8A360//wCTa/BX9qD4r6J8cfj74z+LHhy0urHTfEl+Lu3t70ILiNBFHHiQRs6Zyh6MRivBaKACiiigAooooAKKKKACiiigAooooAKKKKAP6ZP+CJv/ACb143/7HOX/ANN9nX7MV+M//BE3/k3rxv8A9jnL/wCm+zr9mKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//U/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr8Z/+C2X/JvXgj/sc4v/AE33lfsxX4z/APBbL/k3rwR/2OcX/pvvKAP5m6KKKACiiigAooooAKKKKACiiigAooooA+zP+Cen/J6Hwp/7DTf+k01f2YV/Gf8A8E9P+T0PhT/2Gm/9Jpq/swoAKKKKACiiigAooooAKKKKACiiigAooooA/gDooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/pk/4Im/8m9eN/8Asc5f/TfZ1+zFfjP/AMETf+TevG//AGOcv/pvs6/ZigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9X9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvxn/4LZf8m9eCP+xzi/8ATfeV+zFfjP8A8Fsv+TevBH/Y5xf+m+8oA/mbooooAKKKKACiiigAooooAKKKKACiiigD7M/4J6f8nofCn/sNN/6TTV/ZhX8Z/wDwT0/5PQ+FP/Yab/0mmr+zCgAooooAKKKKACiiigAooooAKKKKACiiigD+AOiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD+mT/gib/yb143/wCxzl/9N9nX7MV+M/8AwRN/5N68b/8AY5y/+m+zr9mKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1v38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK/Gf/gtl/yb14I/7HOL/wBN95X7MV+M/wDwWy/5N68Ef9jnF/6b7ygD+ZuiiigAooooAKKKKACiiigAooooAKKKKAPsz/gnp/yeh8Kf+w03/pNNX9mFfxn/APBPT/k9D4U/9hpv/Saav7MKACiiigAooooAKKKKACiiigAooooAKKKKAP4A6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP6ZP+CJv/JvXjf/ALHOX/032dfsxX4z/wDBE3/k3rxv/wBjnL/6b7Ov2YoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/X/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr8Z/+C2X/JvXgj/sc4v/AE33lfsxX4z/APBbL/k3rwR/2OcX/pvvKAP5m6KKKACiiigAooooAKKKKACiiigAooooA+zP+Cen/J6Hwp/7DTf+k01f2YV/Gf8A8E9P+T0PhT/2Gm/9Jpq/swoAKKKKACiiigAooooAKKKKACiiigAooooA/gDooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/pk/4Im/8m9eN/8Asc5f/TfZ1+zFfjP/AMETf+TevG//AGOcv/pvs6/ZigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9D9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvxn/4LZf8m9eCP+xzi/8ATfeV+zFfjP8A8Fsv+TevBH/Y5xf+m+8oA/mbooooAKKKKACiiigAooooAKKKKACiiigD7M/4J6f8nofCn/sNN/6TTV/ZhX8Z/wDwT0/5PQ+FP/Yab/0mmr+zCgAooooAKKKKACiiigAooooAKKKKACiiigD+AOiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD+mT/gib/yb143/wCxzl/9N9nX7MV+M/8AwRN/5N68b/8AY5y/+m+zr9mKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0f38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK/Gf/gtl/yb14I/7HOL/wBN95X7MV+XP/BVv4KfFP44/BTwn4c+E/h268SalY+KY724t7QoHjtxZXUZkPmOgxvdRwc5NAH8pNFfZn/DvT9tD/olOtf99W3/AMeo/wCHen7aH/RKda/76tv/AI9QB8Z0V9mf8O9P20P+iU61/wB9W3/x6j/h3p+2h/0SnWv++rb/AOPUAfGdFfZn/DvT9tD/AKJTrX/fVt/8eo/4d6ftof8ARKda/wC+rb/49QB8Z0V9mf8ADvT9tD/olOtf99W3/wAeo/4d6ftof9Ep1r/vq2/+PUAfGdFfZn/DvT9tD/olOtf99W3/AMeo/wCHen7aH/RKda/76tv/AI9QB8Z0V9mf8O9P20P+iU61/wB9W3/x6j/h3p+2h/0SnWv++rb/AOPUAH/BPT/k9D4U/wDYab/0mmr+zCv5cv2Kv2Kv2pvhz+1N8OvG3jb4dappOh6TqjT3t7O0BjgjMEq7m2ys2NzAcA9a/qNoAKKKKACiiigAooooAKKKKACiiigAooooA/gDor7M/wCHen7aH/RKda/76tv/AI9R/wAO9P20P+iU61/31bf/AB6gD4zor7M/4d6ftof9Ep1r/vq2/wDj1H/DvT9tD/olOtf99W3/AMeoA+M6K+zP+Hen7aH/AESnWv8Avq2/+PUf8O9P20P+iU61/wB9W3/x6gD4zor7M/4d6ftof9Ep1r/vq2/+PUf8O9P20P8AolOtf99W3/x6gD4zor7M/wCHen7aH/RKda/76tv/AI9R/wAO9P20P+iU61/31bf/AB6gD4zor7M/4d6ftof9Ep1r/vq2/wDj1H/DvT9tD/olOtf99W3/AMeoA+M6K+zP+Hen7aH/AESnWv8Avq2/+PUf8O9P20P+iU61/wB9W3/x6gD4zor7M/4d6ftof9Ep1r/vq2/+PUf8O9P20P8AolOtf99W3/x6gD4zor7M/wCHen7aH/RKda/76tv/AI9R/wAO9P20P+iU61/31bf/AB6gD4zor7M/4d6ftof9Ep1r/vq2/wDj1H/DvT9tD/olOtf99W3/AMeoA+M6K+zP+Hen7aH/AESnWv8Avq2/+PUf8O9P20P+iU61/wB9W3/x6gD4zor7M/4d6ftof9Ep1r/vq2/+PUf8O9P20P8AolOtf99W3/x6gD4zor7M/wCHen7aH/RKda/76tv/AI9R/wAO9P20P+iU61/31bf/AB6gD9mP+CJv/JvXjf8A7HOX/wBN9nX7MV+XP/BKT4KfFP4HfBTxZ4c+LHh268N6lfeKZL23t7soXktzZWsYkHlu4xvRhyc5FfqNQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/9L9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//T/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/1P38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9X9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//W/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/1/38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9D9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//R/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/0v38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9P9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//U/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/1f38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9b9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//X/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/0P38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9H9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//S/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/0/38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9T9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//V/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/1v38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9f9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Q/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q=="/>
</defs>
</svg>
`;
const getHTML = (apiReference, theme, nonce) => {
  const nonceAttr = "";
  return `<!doctype html>
<html>
  <head>
    <title>Scalar API Reference</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script
      id="api-reference"
      type="application/json">
    ${JSON.stringify(apiReference)}
    <\/script>
	 <script ${nonceAttr}>
      var configuration = {
	  	favicon: "data:image/svg+xml;utf8,${encodeURIComponent(logo$1)}",
	   	theme: "${"default"}",
        metaData: {
			title: "Better Auth API",
			description: "API Reference for your Better Auth Instance",
		}
      }

      document.getElementById('api-reference').dataset.configuration =
        JSON.stringify(configuration)
    <\/script>
	  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference" ${nonceAttr}><\/script>
  </body>
</html>`;
};
const openAPI = (options) => {
  const path = "/reference";
  return {
    id: "open-api",
    endpoints: {
      generateOpenAPISchema: createAuthEndpoint("/open-api/generate-schema", { method: "GET" }, async (ctx) => {
        const schema2 = await generator(ctx.context, ctx.context.options);
        return ctx.json(schema2);
      }),
      openAPIReference: createAuthEndpoint(path, {
        method: "GET",
        metadata: HIDE_METADATA
      }, async (ctx) => {
        const schema2 = await generator(ctx.context, ctx.context.options);
        return new Response(getHTML(schema2), { headers: { "Content-Type": "text/html" } });
      })
    },
    options
  };
};
createAuthMiddleware(async () => {
  return {};
});
createAuthMiddleware({ use: [sessionMiddleware] }, async (ctx) => {
  return { session: ctx.context.session };
});
z$1.object({
  organizationId: z$1.string().optional().meta({ description: "The id of the organization to create the role in. If not provided, the user's active organization will be used." }),
  role: z$1.string().meta({ description: "The name of the role to create" }),
  permission: z$1.record(z$1.string(), z$1.array(z$1.string())).meta({ description: "The permission to assign to the role" })
});
z$1.object({ organizationId: z$1.string().optional().meta({ description: "The id of the organization to create the role in. If not provided, the user's active organization will be used." }) }).and(z$1.union([z$1.object({ roleName: z$1.string().nonempty().meta({ description: "The name of the role to delete" }) }), z$1.object({ roleId: z$1.string().nonempty().meta({ description: "The id of the role to delete" }) })]));
z$1.object({ organizationId: z$1.string().optional().meta({ description: "The id of the organization to list roles for. If not provided, the user's active organization will be used." }) }).optional();
z$1.object({ organizationId: z$1.string().optional().meta({ description: "The id of the organization to read a role for. If not provided, the user's active organization will be used." }) }).and(z$1.union([z$1.object({ roleName: z$1.string().nonempty().meta({ description: "The name of the role to read" }) }), z$1.object({ roleId: z$1.string().nonempty().meta({ description: "The id of the role to read" }) })])).optional();
z$1.union([z$1.object({ roleName: z$1.string().nonempty().meta({ description: "The name of the role to update" }) }), z$1.object({ roleId: z$1.string().nonempty().meta({ description: "The id of the role to update" }) })]);
z$1.object({
  email: z$1.string().meta({ description: "The email address of the user to invite" }),
  role: z$1.union([z$1.string().meta({ description: "The role to assign to the user" }), z$1.array(z$1.string().meta({ description: "The roles to assign to the user" }))]).meta({ description: 'The role(s) to assign to the user. It can be `admin`, `member`, owner. Eg: "member"' }),
  organizationId: z$1.string().meta({ description: "The organization ID to invite the user to" }).optional(),
  resend: z$1.boolean().meta({ description: "Resend the invitation email, if the user is already invited. Eg: true" }).optional(),
  teamId: z$1.union([z$1.string().meta({ description: "The team ID to invite the user to" }).optional(), z$1.array(z$1.string()).meta({ description: "The team IDs to invite the user to" }).optional()])
});
z$1.object({ invitationId: z$1.string().meta({ description: "The ID of the invitation to accept" }) });
z$1.object({ invitationId: z$1.string().meta({ description: "The ID of the invitation to reject" }) });
z$1.object({ invitationId: z$1.string().meta({ description: "The ID of the invitation to cancel" }) });
z$1.object({ id: z$1.string().meta({ description: "The ID of the invitation to get" }) });
z$1.object({ organizationId: z$1.string().meta({ description: "The ID of the organization to list invitations for" }).optional() }).optional();
z$1.object({
  userId: z$1.coerce.string().meta({ description: 'The user Id which represents the user to be added as a member. If `null` is provided, then it\'s expected to provide session headers. Eg: "user-id"' }),
  role: z$1.union([z$1.string(), z$1.array(z$1.string())]).meta({ description: 'The role(s) to assign to the new member. Eg: ["admin", "sale"]' }),
  organizationId: z$1.string().meta({ description: `An optional organization ID to pass. If not provided, will default to the user's active organization. Eg: "org-id"` }).optional(),
  teamId: z$1.string().meta({ description: 'An optional team ID to add the member to. Eg: "team-id"' }).optional()
});
z$1.object({
  memberIdOrEmail: z$1.string().meta({ description: "The ID or email of the member to remove" }),
  organizationId: z$1.string().meta({ description: 'The ID of the organization to remove the member from. If not provided, the active organization will be used. Eg: "org-id"' }).optional()
});
z$1.object({
  role: z$1.union([z$1.string(), z$1.array(z$1.string())]).meta({ description: 'The new role to be applied. This can be a string or array of strings representing the roles. Eg: ["admin", "sale"]' }),
  memberId: z$1.string().meta({ description: 'The member id to apply the role update to. Eg: "member-id"' }),
  organizationId: z$1.string().meta({ description: 'An optional organization ID which the member is a part of to apply the role update. If not provided, you must provide session headers to get the active organization. Eg: "organization-id"' }).optional()
});
z$1.object({ organizationId: z$1.string().meta({ description: 'The organization Id for the member to leave. Eg: "organization-id"' }) });
z$1.object({
  userId: z$1.string().meta({ description: "The user ID to get the role for. If not provided, will default to the current user's" }).optional(),
  organizationId: z$1.string().meta({ description: `The organization ID to list members for. If not provided, will default to the user's active organization. Eg: "organization-id"` }).optional(),
  organizationSlug: z$1.string().meta({ description: `The organization slug to list members for. If not provided, will default to the user's active organization. Eg: "organization-slug"` }).optional()
}).optional();
z$1.object({
  name: z$1.string().min(1).meta({ description: "The name of the organization" }),
  slug: z$1.string().min(1).meta({ description: "The slug of the organization" }),
  userId: z$1.coerce.string().meta({ description: 'The user id of the organization creator. If not provided, the current user will be used. Should only be used by admins or when called by the server. server-only. Eg: "user-id"' }).optional(),
  logo: z$1.string().meta({ description: "The logo of the organization" }).optional(),
  metadata: z$1.record(z$1.string(), z$1.any()).meta({ description: "The metadata of the organization" }).optional(),
  keepCurrentActiveOrganization: z$1.boolean().meta({ description: "Whether to keep the current active organization active after creating a new one. Eg: true" }).optional()
});
z$1.object({ slug: z$1.string().meta({ description: 'The organization slug to check. Eg: "my-org"' }) });
z$1.object({
  name: z$1.string().min(1).meta({ description: "The name of the organization" }).optional(),
  slug: z$1.string().min(1).meta({ description: "The slug of the organization" }).optional(),
  logo: z$1.string().meta({ description: "The logo of the organization" }).optional(),
  metadata: z$1.record(z$1.string(), z$1.any()).meta({ description: "The metadata of the organization" }).optional()
});
z$1.object({ organizationId: z$1.string().meta({ description: "The organization id to delete" }) });
z$1.optional(z$1.object({
  organizationId: z$1.string().meta({ description: "The organization id to get" }).optional(),
  organizationSlug: z$1.string().meta({ description: "The organization slug to get" }).optional(),
  membersLimit: z$1.number().or(z$1.string().transform((val) => parseInt(val))).meta({ description: "The limit of members to get. By default, it uses the membershipLimit option which defaults to 100." }).optional()
}));
z$1.object({
  organizationId: z$1.string().meta({ description: 'The organization id to set as active. It can be null to unset the active organization. Eg: "org-id"' }).nullable().optional(),
  organizationSlug: z$1.string().meta({ description: 'The organization slug to set as active. It can be null to unset the active organization if organizationId is not provided. Eg: "org-slug"' }).optional()
});
const roleSchema = z$1.string();
const invitationStatus = z$1.enum([
  "pending",
  "accepted",
  "rejected",
  "canceled"
]).default("pending");
z$1.object({
  id: z$1.string().default(generateId$1),
  name: z$1.string(),
  slug: z$1.string(),
  logo: z$1.string().nullish().optional(),
  metadata: z$1.record(z$1.string(), z$1.unknown()).or(z$1.string().transform((v2) => JSON.parse(v2))).optional(),
  createdAt: z$1.date()
});
z$1.object({
  id: z$1.string().default(generateId$1),
  organizationId: z$1.string(),
  userId: z$1.coerce.string(),
  role: roleSchema,
  createdAt: z$1.date().default(() => /* @__PURE__ */ new Date())
});
z$1.object({
  id: z$1.string().default(generateId$1),
  organizationId: z$1.string(),
  email: z$1.string(),
  role: roleSchema,
  status: invitationStatus,
  teamId: z$1.string().nullish(),
  inviterId: z$1.string(),
  expiresAt: z$1.date(),
  createdAt: z$1.date().default(() => /* @__PURE__ */ new Date())
});
z$1.object({
  id: z$1.string().default(generateId$1),
  name: z$1.string().min(1),
  organizationId: z$1.string(),
  createdAt: z$1.date(),
  updatedAt: z$1.date().optional()
});
z$1.object({
  id: z$1.string().default(generateId$1),
  teamId: z$1.string(),
  userId: z$1.string(),
  createdAt: z$1.date().default(() => /* @__PURE__ */ new Date())
});
z$1.object({
  id: z$1.string().default(generateId$1),
  organizationId: z$1.string(),
  role: z$1.string(),
  permission: z$1.record(z$1.string(), z$1.array(z$1.string())),
  createdAt: z$1.date().default(() => /* @__PURE__ */ new Date()),
  updatedAt: z$1.date().optional()
});
const defaultRoles = [
  "admin",
  "member",
  "owner"
];
z$1.union([z$1.enum(defaultRoles), z$1.array(z$1.enum(defaultRoles))]);
z$1.object({
  name: z$1.string().meta({ description: 'The name of the team. Eg: "my-team"' }),
  organizationId: z$1.string().meta({ description: 'The organization ID which the team will be created in. Defaults to the active organization. Eg: "organization-id"' }).optional()
});
z$1.object({
  teamId: z$1.string().meta({ description: `The team ID of the team to remove. Eg: "team-id"` }),
  organizationId: z$1.string().meta({ description: `The organization ID which the team falls under. If not provided, it will default to the user's active organization. Eg: "organization-id"` }).optional()
});
z$1.optional(z$1.object({ organizationId: z$1.string().meta({ description: `The organization ID which the teams are under to list. Defaults to the users active organization. Eg: "organization-id"` }).optional() }));
z$1.object({ teamId: z$1.string().meta({ description: "The team id to set as active. It can be null to unset the active team" }).nullable().optional() });
z$1.optional(z$1.object({ teamId: z$1.string().optional().meta({ description: "The team whose members we should return. If this is not provided the members of the current active team get returned." }) }));
z$1.object({
  teamId: z$1.string().meta({ description: "The team the user should be a member of." }),
  userId: z$1.coerce.string().meta({ description: "The user Id which represents the user to be added as a member." })
});
z$1.object({
  teamId: z$1.string().meta({ description: "The team the user should be removed from." }),
  userId: z$1.coerce.string().meta({ description: "The user which should be removed from the team." })
});
z$1.object({ organizationId: z$1.string().optional() }).and(z$1.union([z$1.object({
  permission: z$1.record(z$1.string(), z$1.array(z$1.string())),
  permissions: z$1.undefined()
}), z$1.object({
  permission: z$1.undefined(),
  permissions: z$1.record(z$1.string(), z$1.array(z$1.string()))
})]));
z$1.object({
  phoneNumber: z$1.string().meta({ description: 'Phone number to sign in. Eg: "+1234567890"' }),
  password: z$1.string().meta({ description: "Password to use for sign in." }),
  rememberMe: z$1.boolean().meta({ description: "Remember the session. Eg: true" }).optional()
});
z$1.object({ phoneNumber: z$1.string().meta({ description: 'Phone number to send OTP. Eg: "+1234567890"' }) });
z$1.object({
  phoneNumber: z$1.string().meta({ description: 'Phone number to verify. Eg: "+1234567890"' }),
  code: z$1.string().meta({ description: 'OTP code. Eg: "123456"' }),
  disableSession: z$1.boolean().meta({ description: "Disable session creation after verification. Eg: false" }).optional(),
  updatePhoneNumber: z$1.boolean().meta({ description: "Check if there is a session and update the phone number. Eg: true" }).optional()
});
z$1.object({ phoneNumber: z$1.string() });
z$1.object({
  otp: z$1.string().meta({ description: 'The one time password to reset the password. Eg: "123456"' }),
  phoneNumber: z$1.string().meta({ description: 'The phone number to the account which intends to reset the password for. Eg: "+1234567890"' }),
  newPassword: z$1.string().meta({ description: `The new password. Eg: "new-and-secure-password"` })
});
z$1.object({
  walletAddress: z$1.string().regex(/^0[xX][a-fA-F0-9]{40}$/i).length(42),
  chainId: z$1.number().int().positive().max(2147483647).optional().default(1)
});
z$1.object({
  code: z$1.string().meta({ description: `A backup code to verify. Eg: "123456"` }),
  disableSession: z$1.boolean().meta({ description: "If true, the session cookie will not be set." }).optional(),
  trustDevice: z$1.boolean().meta({ description: "If true, the device will be trusted for 30 days. It'll be refreshed on every sign in request within this time. Eg: true" }).optional()
});
z$1.object({ userId: z$1.coerce.string().meta({ description: `The user ID to view all backup codes. Eg: "user-id"` }) });
z$1.object({ password: z$1.string().meta({ description: "The users password." }) });
z$1.object({
  code: z$1.string().meta({ description: 'The otp code to verify. Eg: "012345"' }),
  trustDevice: z$1.boolean().optional().meta({ description: "If true, the device will be trusted for 30 days. It'll be refreshed on every sign in request within this time. Eg: true" })
});
z$1.object({ trustDevice: z$1.boolean().optional().meta({ description: "If true, the device will be trusted for 30 days. It'll be refreshed on every sign in request within this time. Eg: true" }) }).optional();
z$1.object({ secret: z$1.string().meta({ description: "The secret to generate the TOTP code" }) });
z$1.object({ password: z$1.string().meta({ description: "User password" }) });
z$1.object({
  code: z$1.string().meta({ description: 'The otp code to verify. Eg: "012345"' }),
  trustDevice: z$1.boolean().meta({ description: "If true, the device will be trusted for 30 days. It'll be refreshed on every sign in request within this time. Eg: true" }).optional()
});
z$1.object({
  password: z$1.string().meta({ description: "User password" }),
  issuer: z$1.string().meta({ description: "Custom issuer for the TOTP URI" }).optional()
});
z$1.object({ password: z$1.string().meta({ description: "User password" }) });
z$1.object({
  username: z$1.string().meta({ description: "The username of the user" }),
  password: z$1.string().meta({ description: "The password of the user" }),
  rememberMe: z$1.boolean().meta({ description: "Remember the user session" }).optional(),
  callbackURL: z$1.string().meta({ description: "The URL to redirect to after email verification" }).optional()
});
z$1.object({ username: z$1.string().meta({ description: "The username to check" }) });
neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: Resource.Database.url });
const db = drizzle({ client: pool });
const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
  workspaceId: text("workspace_id"),
  workspaceName: text("workspace_name"),
  role: text("role"),
  plan: text("plan"),
  product: text("product")
});
const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
  },
  (table) => [index$1("session_userId_idx").on(table.userId)]
);
const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
  },
  (table) => [index$1("account_userId_idx").on(table.userId)]
);
const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    // 3 next custom fields for location tracking
    ipAddress: text("ip_address"),
    city: text("city"),
    country: text("country"),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
  },
  (table) => [index$1("verification_identifier_idx").on(table.identifier)]
);
const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account)
}));
const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id]
  })
}));
const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id]
  })
}));
const AuthSchema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification
}, Symbol.toStringTag, { value: "Module" }));
function extractIPAddress(headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    console.log(`x-forwarded-for header: ${forwardedFor}`);
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    console.log(`x-real-ip header: ${realIp}`);
    return realIp.trim();
  }
  return "unknown";
}
function isPrivateIP(ip) {
  if (ip === "unknown" || ip === "127.0.0.1" || ip === "localhost") {
    return true;
  }
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^::1$/,
    /^fc00:/
  ];
  return privateRanges.some((range) => range.test(ip));
}
async function getLocationFromIP(ip) {
  if (isPrivateIP(ip)) {
    console.log(`Skipping geolocation for private IP: ${ip}`);
    return null;
  }
  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,city,country`,
      {
        signal: AbortSignal.timeout(3e3)
        // 3 second timeout
      }
    );
    if (!response.ok) {
      console.error(`Geolocation API error: ${response.status}`);
      return null;
    }
    const data = await response.json();
    if (data.status === "fail") {
      console.error(`Geolocation lookup failed: ${data.message}`);
      return null;
    }
    if (data.status === "success" && data.city && data.country) {
      return {
        city: data.city,
        country: data.country
      };
    }
    return null;
  } catch (error2) {
    console.error("Geolocation lookup error:", error2);
    return null;
  }
}
class FormattedType {
  type;
  constructor(type) {
    this.type = type;
  }
  toBody() {
    switch (this.type) {
      case "sign-in":
        return "sign in";
      case "email-verification":
        return "sign up";
      case "forget-password":
        return "reset your password";
      default:
        return "access your account";
    }
  }
  toHyphenated() {
    switch (this.type) {
      case "sign-in":
        return "sign-in";
      case "email-verification":
        return "sign-up";
      case "forget-password":
        return "forget password";
      default:
        return "access account";
    }
  }
  toUpperCaseHyphenated() {
    switch (this.type) {
      case "sign-in":
        return "Sign-In";
      case "email-verification":
        return "Sign-Up";
      case "forget-password":
        return "Forget Password";
      default:
        return "Access Account";
    }
  }
}
const VerifyEmail = ({
  type,
  validationCode,
  location
}) => {
  const formattedType = new FormattedType(type);
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("style", { children: `
                    @media only screen and (max-width: 600px) {
                        .border-container {
                            padding: 2rem !important;
                            margin: 2.5rem auto !important;
                            max-width: 300px !important;
                        }
                         .container {
                        }
                        .heading {
                            font-size: 18px !important;
                            padding: 12px 0 !important;
                        }
                        .paragraph {
                            font-size: 11px !important;
                            margin: 15px 0 !important;
                        }
                        .footer-text {
                            font-size: 8px !important;
                            line-height: 14px !important;

                        }
                        .footer-link {
                            font-size: 8px !important;
                        }
                        .hr {
                            margin: 30px 0 !important;
                        }
                        .code-container {
                            width: 150px !important;
                        }
                        .code {
                            font-size: 18px !important;
                            letter-spacing: 8px !important;
                            line-height: 36px !important;
                            padding: 6px 0 !important;
                        }
                        .logo {
                            height: 20px !important;
                        }
                    }
                ` }) }),
    /* @__PURE__ */ jsxs(Preview, { children: [
      validationCode,
      " - Structa",
      " ",
      formattedType.toUpperCaseHyphenated(),
      " Verification"
    ] }),
    /* @__PURE__ */ jsx(Body, { style: main, children: /* @__PURE__ */ jsx(Container, { style: borderContainer, className: "border-container", children: /* @__PURE__ */ jsxs(Container, { style: container, children: [
      /* @__PURE__ */ jsx(
        Img,
        {
          src: "https://app.structa.so/logo/outline/logo-light-sm.svg",
          alt: "Structa Logo",
          style: logo,
          className: "logo"
        }
      ),
      /* @__PURE__ */ jsxs(Heading, { style: heading, className: "heading", children: [
        "Verify your email to ",
        formattedType.toBody(),
        " to",
        " ",
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: "Structa" })
      ] }),
      /* @__PURE__ */ jsxs(Text, { style: paragraph, className: "paragraph", children: [
        location ? /* @__PURE__ */ jsxs(Fragment, { children: [
          "We have received a ",
          formattedType.toBody(),
          " ",
          "attempt from",
          " ",
          /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600 }, children: [
            location.city,
            ", ",
            location.country
          ] }),
          "."
        ] }) : `We have received a ${formattedType.toHyphenated()} attempt.`,
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("br", {}),
        "To complete the ",
        formattedType.toHyphenated(),
        " ",
        "process; enter the 6-digit code in the original window:"
      ] }),
      /* @__PURE__ */ jsx("div", { style: { padding: "10px 0" }, children: /* @__PURE__ */ jsx(
        Section,
        {
          style: codeContainer,
          className: "code-container",
          children: /* @__PURE__ */ jsx(Text, { style: code, className: "code", children: validationCode })
        }
      ) }),
      /* @__PURE__ */ jsx(Hr, { style: hr, className: "hr" }),
      /* @__PURE__ */ jsxs(Text, { style: footerText, className: "footer-text", children: [
        "If you didn't attempt to ",
        formattedType.toBody(),
        " ",
        "but received this email, or if the location doesn't match, please ignore this email. Don't share or forward the 6-digit code with anyone. You are receiving this email because you signed up to",
        " ",
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "https://structa.so",
            style: footerTextLink,
            className: "footer-link",
            children: "Structa"
          }
        ),
        "."
      ] })
    ] }) }) })
  ] });
};
VerifyEmail.PreviewProps = {
  type: "sign-in",
  validationCode: "561829",
  location: { city: "London", country: "United Kingdom" }
};
const logo = {
  width: "auto",
  height: 24
};
const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
};
const container = {
  margin: "0 auto",
  maxWidth: "560px"
};
const borderContainer = {
  border: "1px solid #dfe1e4",
  borderRadius: "8px",
  padding: "4rem",
  margin: "4rem auto"
};
const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#091717",
  padding: "17px 0"
};
const paragraph = {
  margin: "15px 0",
  fontSize: "14px",
  lineHeight: "1.4",
  color: "#091717"
};
const footerText = {
  fontSize: "12px",
  color: "#737373"
};
const footerTextLink = {
  fontSize: "12px",
  fontWeight: 500,
  color: "#737373",
  textDecoration: "underline",
  textDecorationColor: "#737373",
  textUnderlineOffset: "4px"
};
const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 42px"
};
const codeContainer = {
  background: "#F5F5F5",
  borderRadius: "8px",
  verticalAlign: "center",
  width: "180px"
};
const code = {
  color: "#091717",
  display: "inline-block",
  fontFamily: "Menlo, Monaco, 'HelveticaNeue-Bold', monospace",
  fontSize: "24px",
  fontWeight: 700,
  letterSpacing: "10px",
  lineHeight: "40px",
  margin: "0 auto",
  padding: "8px 0",
  width: "100%",
  textAlign: "center"
};
const ses = new SESv2Client();
async function sendVerificationOTP({ email, otp, type }) {
  console.log("Sending code: ", otp, "to email: ", email, "for type: ", type);
  const sender = "Structa <auth@" + Resource.Email.sender + ">";
  let location = null;
  try {
    const verificationRecords = await db.select().from(verification).where(eq(verification.identifier, `sign-in-otp-${email}`)).orderBy(desc(verification.createdAt)).limit(1);
    if (verificationRecords[0]?.city && verificationRecords[0]?.country) {
      location = {
        city: verificationRecords[0].city,
        country: verificationRecords[0].country
      };
      console.log(
        `Email location enrichment: ${location.city}, ${location.country}`
      );
    }
  } catch (error2) {
    console.warn("Failed to fetch verification location:", error2);
  }
  let emailHTML;
  let subject;
  if (type === "sign-in") {
    emailHTML = await render(
      VerifyEmail({ type, validationCode: otp, location }),
      {
        pretty: true
      }
    );
    subject = `${otp} - Structa Sign-in Verification`;
  } else if (type === "email-verification") {
    emailHTML = await render(
      VerifyEmail({ type, validationCode: otp, location }),
      {
        pretty: true
      }
    );
    subject = `${otp} - Structa Sign-up Verification`;
  } else if (type === "forget-password") {
    throw new Error(`Unsupported OTP type: ${type}`);
  } else {
    throw new Error(`Unsupported OTP type: ${type}`);
  }
  const emailParams = {
    FromEmailAddress: sender,
    Destination: {
      ToAddresses: [email]
    },
    Content: {
      Simple: {
        Subject: {
          Data: subject
        },
        Body: {
          Html: {
            Data: emailHTML
          }
        }
      }
    }
  };
  await ses.send(new SendEmailCommand(emailParams));
}
const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: AuthSchema
  }),
  baseURL: `${Resource.Domain.platform}/auth`,
  secret: Resource.BetterAuthSecret.value,
  socialProviders: {
    google: {
      clientId: Resource.GoogleOAuthClientId.value,
      clientSecret: Resource.GoogleOAuthClientSecret.value,
      accessType: "offline",
      prompt: "select_account consent"
    }
  },
  advanced: {
    cookiePrefix: Resource.Stage.cookiePrefix,
    crossSubDomainCookies: {
      enabled: Resource.App.stage !== "local"
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true
    }
  },
  user: {
    additionalFields: {
      workspaceId: {
        type: "string",
        input: false
      },
      workspaceName: {
        type: "string",
        input: false
      },
      role: {
        type: "string",
        input: false
      },
      plan: {
        type: "string",
        input: false
      },
      product: {
        type: "string",
        input: false
      }
    }
  },
  databaseHooks: {
    verification: {
      create: {
        before: async (verification2, ctx) => {
          let ip = ctx && ctx.request?.headers ? extractIPAddress(ctx.request.headers) : "unknown";
          console.log(`Verification request from IP: ${ip}`);
          let city = null;
          let country = null;
          try {
            const location = await getLocationFromIP(ip);
            if (location) {
              city = location.city;
              country = location.country;
              console.log(`Location resolved: ${city}, ${country}`);
            }
          } catch (error2) {
            console.error("Failed to resolve location:", error2);
          }
          return {
            data: {
              ...verification2,
              ipAddress: ip,
              city,
              country
            }
          };
        }
      }
    }
  },
  plugins: [
    openAPI(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendVerificationOTP({ email, otp, type });
      }
    }),
    {
      id: "verification-location",
      schema: {
        verification: {
          fields: {
            id: {
              type: "string",
              required: true
            },
            identifier: {
              type: "string",
              required: true
            },
            value: {
              type: "string",
              required: true
            },
            expiresAt: {
              type: "date",
              required: true
            },
            createdAt: {
              type: "date",
              required: true
            },
            updatedAt: {
              type: "date",
              required: true
            },
            ipAddress: {
              type: "string",
              required: false
            },
            city: {
              type: "string",
              required: false
            },
            country: {
              type: "string",
              required: false
            }
          }
        }
      }
    },
    tanstackStartCookies()
  ]
});
const authMiddleware = createMiddleware$1().server(
  async ({ next, request: request2 }) => {
    const session2 = await auth.api.getSession({
      headers: request2.headers
    });
    if (!session2) {
      throw redirect({ to: "/login" });
    }
    return await next({
      context: { session: session2.session, user: session2.user }
    });
  }
);
const loginMiddleware = createMiddleware$1().server(
  async ({ next, request: request2 }) => {
    const session2 = await auth.api.getSession({
      headers: request2.headers
    });
    if (session2) {
      throw redirect({ to: "/app" });
    }
    return await next({
      context: { session: null, user: null }
    });
  }
);
const serverDkMexlIi = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  HEADERS,
  StartServer,
  attachRouterServerSsrUtils,
  createStartHandler,
  defaultStreamHandler,
  getResponse: getResponse$2,
  requestHandler,
  setCookie
});
export {
  getAwsRegionExtensionConfiguration as $,
  normalizeProvider as A,
  getSmithyContext as B,
  CredentialsProviderError as C,
  resolveEndpoint as D,
  EndpointCache as E,
  awsEndpointFunctions as F,
  customEndpointFunctions as G,
  HttpRequest as H,
  IniSectionType as I,
  fromUtf8 as J,
  NoOpLogger as K,
  emitWarningIfUnsupportedVersion as L,
  resolveDefaultsModeConfig as M,
  NodeHttpHandler as N,
  Hash as O,
  ProviderError as P,
  createDefaultUserAgentProvider as Q,
  calculateBodyLength as R,
  NODE_APP_ID_CONFIG_OPTIONS as S,
  NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS as T,
  NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS as U,
  NODE_RETRY_MODE_CONFIG_OPTIONS as V,
  DEFAULT_RETRY_MODE as W,
  NODE_REGION_CONFIG_FILE_OPTIONS as X,
  NODE_REGION_CONFIG_OPTIONS as Y,
  NODE_MAX_ATTEMPT_CONFIG_OPTIONS as Z,
  loadConfigsForDefaultMode as _,
  authMiddleware as a,
  getDefaultExtensionConfiguration as a0,
  getHttpHandlerExtensionConfiguration as a1,
  resolveAwsRegionExtensionConfiguration as a2,
  resolveDefaultRuntimeConfig as a3,
  resolveHttpHandlerRuntimeConfig as a4,
  Client as a5,
  resolveUserAgentConfig as a6,
  resolveRetryConfig as a7,
  resolveRegionConfig as a8,
  resolveEndpointConfig as a9,
  resolveHostHeaderConfig as aa,
  getUserAgentPlugin as ab,
  getRetryPlugin as ac,
  getContentLengthPlugin as ad,
  getHostHeaderPlugin as ae,
  getLoggerPlugin as af,
  getRecursionDetectionPlugin as ag,
  ServiceException as ah,
  Command as ai,
  getEndpointPlugin as aj,
  index as ak,
  logger as b,
  createAdapterFactory as c,
  createKyselyAdapter as d,
  getBaseURL as e,
  fileIntercept as f,
  getKyselyDatabaseType as g,
  defu as h,
  loadSharedConfigFiles as i,
  getHomeDir as j,
  getProfileName as k,
  loginMiddleware as l,
  fromBase64 as m,
  toHex as n,
  toUtf8 as o,
  fromArrayBuffer as p,
  auth as q,
  chain as r,
  streamCollector as s,
  toBase64 as t,
  readFile as u,
  parseUrl as v,
  loadConfig as w,
  CONFIG_PREFIX_SEPARATOR as x,
  getConfigFilepath as y,
  parseIni as z
};
