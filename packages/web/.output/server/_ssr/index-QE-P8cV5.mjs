import { c as createAdapterFactory, d as logger } from "./auth-DOoiRHTa.mjs";
import "../_chunks/_libs/@tanstack/router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_chunks/_libs/@better-auth/utils.mjs";
import "../_libs/zod.mjs";
import "../_chunks/_libs/@noble/hashes.mjs";
import "../_chunks/_libs/@noble/ciphers.mjs";
import "../_chunks/_libs/@better-fetch/fetch.mjs";
import "../_libs/jose.mjs";
import "node:crypto";
import "node:util";
import "node:buffer";
import "node:http";
import "node:https";
import "node:events";
import "../_libs/defu.mjs";
import "../_libs/rou3.mjs";
import "../_chunks/_libs/@neondatabase/serverless.mjs";
import "../_chunks/_libs/ws.mjs";
import "../_chunks/_libs/react.mjs";
import "events";
import "https";
import "http";
import "net";
import "tls";
import "crypto";
import "stream";
import "url";
import "zlib";
import "buffer";
import "../_libs/sst.mjs";
import "process";
import "fs";
import "../_libs/drizzle-orm.mjs";
import "../_chunks/_libs/@aws-sdk/client-sesv2.mjs";
import "../_chunks/_libs/@aws-sdk/middleware-host-header.mjs";
import "../_chunks/_libs/@smithy/protocol-http.mjs";
import "../_chunks/_libs/@smithy/middleware-content-length.mjs";
import "../_chunks/_libs/@aws-sdk/util-endpoints.mjs";
import "../_chunks/_libs/@smithy/util-endpoints.mjs";
import "../_chunks/_libs/@smithy/types.mjs";
import "../_chunks/_libs/@aws-sdk/core.mjs";
import "../_chunks/_libs/@smithy/property-provider.mjs";
import "../_chunks/_libs/@smithy/core.mjs";
import "../_chunks/_libs/@smithy/util-middleware.mjs";
import "../_chunks/_libs/@smithy/util-stream.mjs";
import "../_chunks/_libs/@smithy/util-base64.mjs";
import "../_chunks/_libs/@smithy/util-buffer-from.mjs";
import "../_chunks/_libs/@smithy/is-array-buffer.mjs";
import "../_chunks/_libs/@smithy/util-utf8.mjs";
import "../_chunks/_libs/@smithy/util-hex-encoding.mjs";
import "../_chunks/_libs/@smithy/fetch-http-handler.mjs";
import "../_chunks/_libs/@smithy/node-http-handler.mjs";
import "../_chunks/_libs/@smithy/querystring-builder.mjs";
import "../_chunks/_libs/@smithy/util-uri-escape.mjs";
import "../_chunks/_libs/@smithy/uuid.mjs";
import "../_chunks/_libs/@smithy/signature-v4.mjs";
import "../_chunks/_libs/@smithy/smithy-client.mjs";
import "../_chunks/_libs/@smithy/middleware-stack.mjs";
import "../_chunks/_libs/@aws-sdk/xml-builder.mjs";
import "../_libs/fast-xml-parser.mjs";
import "../_libs/strnum.mjs";
import "../_chunks/_libs/@aws-sdk/signature-v4-multi-region.mjs";
import "../_chunks/_libs/@aws-sdk/middleware-sdk-s3.mjs";
import "../_chunks/_libs/@smithy/middleware-endpoint.mjs";
import "../_chunks/_libs/@smithy/middleware-serde.mjs";
import "../_chunks/_libs/@smithy/shared-ini-file-loader.mjs";
import "path";
import "fs/promises";
import "os";
import "node:fs/promises";
import "../_chunks/_libs/@smithy/node-config-provider.mjs";
import "../_chunks/_libs/@smithy/url-parser.mjs";
import "../_chunks/_libs/@smithy/querystring-parser.mjs";
import "../_chunks/_libs/@smithy/hash-node.mjs";
import "../_chunks/_libs/@smithy/util-defaults-mode-node.mjs";
import "../_chunks/_libs/@smithy/config-resolver.mjs";
import "../_chunks/_libs/@smithy/util-config-provider.mjs";
import "../_chunks/_libs/@aws-sdk/credential-provider-node.mjs";
import "../_chunks/_libs/@aws-sdk/credential-provider-env.mjs";
import "../_chunks/_libs/@smithy/util-body-length-node.mjs";
import "node:fs";
import "../_chunks/_libs/@aws-sdk/util-user-agent-node.mjs";
import "../_chunks/_libs/@aws-sdk/middleware-user-agent.mjs";
import "../_chunks/_libs/@smithy/middleware-retry.mjs";
import "../_chunks/_libs/@smithy/util-retry.mjs";
import "../_chunks/_libs/@smithy/service-error-classification.mjs";
import "../_chunks/_libs/@aws-sdk/region-config-resolver.mjs";
import "../_chunks/_libs/@aws-sdk/middleware-logger.mjs";
import "../_chunks/_libs/@aws-sdk/middleware-recursion-detection.mjs";
import "../_chunks/_libs/@aws/lambda-invoke-store.mjs";
import "../_chunks/_libs/@react-email/render.mjs";
import "../_libs/prettier.mjs";
import "../_libs/html-to-text.mjs";
import "../_chunks/_libs/@selderee/plugin-htmlparser2.mjs";
import "../_libs/selderee.mjs";
import "../_libs/parseley.mjs";
import "../_libs/leac.mjs";
import "../_libs/peberminta.mjs";
import "../_libs/domhandler.mjs";
import "../_libs/domelementtype.mjs";
import "../_libs/htmlparser2.mjs";
import "../_libs/entities.mjs";
import "../_libs/deepmerge.mjs";
import "../_libs/dom-serializer.mjs";
import "../_libs/kysely.mjs";
import "../_chunks/_libs/@react-email/html.mjs";
import "../_chunks/_libs/@react-email/head.mjs";
import "../_chunks/_libs/@react-email/preview.mjs";
import "../_chunks/_libs/@react-email/body.mjs";
import "../_chunks/_libs/@react-email/container.mjs";
import "../_chunks/_libs/@react-email/img.mjs";
import "../_chunks/_libs/@react-email/heading.mjs";
import "../_chunks/_libs/@react-email/text.mjs";
import "../_chunks/_libs/@react-email/section.mjs";
import "../_chunks/_libs/@react-email/hr.mjs";
import "../_chunks/_libs/@react-email/link.mjs";
const memoryAdapter = (db, config) => {
  let lazyOptions = null;
  const adapterCreator = createAdapterFactory({
    config: {
      adapterId: "memory",
      adapterName: "Memory Adapter",
      usePlural: false,
      debugLogs: config?.debugLogs || false,
      supportsArrays: true,
      customTransformInput(props) {
        if ((props.options.advanced?.database?.useNumberId || props.options.advanced?.database?.generateId === "serial") && props.field === "id" && props.action === "create") return db[props.model].length + 1;
        return props.data;
      },
      transaction: async (cb) => {
        const clone = structuredClone(db);
        try {
          return await cb(adapterCreator(lazyOptions));
        } catch (error) {
          Object.keys(db).forEach((key) => {
            db[key] = clone[key];
          });
          throw error;
        }
      }
    },
    adapter: ({ getFieldName, options, getModelName }) => {
      const applySortToRecords = (records, sortBy, model) => {
        if (!sortBy) return records;
        return records.sort((a, b) => {
          const field = getFieldName({
            model,
            field: sortBy.field
          });
          const aValue = a[field];
          const bValue = b[field];
          let comparison = 0;
          if (aValue == null && bValue == null) comparison = 0;
          else if (aValue == null) comparison = -1;
          else if (bValue == null) comparison = 1;
          else if (typeof aValue === "string" && typeof bValue === "string") comparison = aValue.localeCompare(bValue);
          else if (aValue instanceof Date && bValue instanceof Date) comparison = aValue.getTime() - bValue.getTime();
          else if (typeof aValue === "number" && typeof bValue === "number") comparison = aValue - bValue;
          else if (typeof aValue === "boolean" && typeof bValue === "boolean") comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
          else comparison = String(aValue).localeCompare(String(bValue));
          return sortBy.direction === "asc" ? comparison : -comparison;
        });
      };
      function convertWhereClause(where, model, join) {
        const execute = (where$1, model$1) => {
          const table = db[model$1];
          if (!table) {
            logger.error(`[MemoryAdapter] Model ${model$1} not found in the DB`, Object.keys(db));
            throw new Error(`Model ${model$1} not found`);
          }
          const evalClause = (record, clause) => {
            const { field, value, operator } = clause;
            switch (operator) {
              case "in":
                if (!Array.isArray(value)) throw new Error("Value must be an array");
                return value.includes(record[field]);
              case "not_in":
                if (!Array.isArray(value)) throw new Error("Value must be an array");
                return !value.includes(record[field]);
              case "contains":
                return record[field].includes(value);
              case "starts_with":
                return record[field].startsWith(value);
              case "ends_with":
                return record[field].endsWith(value);
              case "ne":
                return record[field] !== value;
              case "gt":
                return value != null && Boolean(record[field] > value);
              case "gte":
                return value != null && Boolean(record[field] >= value);
              case "lt":
                return value != null && Boolean(record[field] < value);
              case "lte":
                return value != null && Boolean(record[field] <= value);
              default:
                return record[field] === value;
            }
          };
          return table.filter((record) => {
            if (!where$1.length || where$1.length === 0) return true;
            let result = evalClause(record, where$1[0]);
            for (const clause of where$1) {
              const clauseResult = evalClause(record, clause);
              if (clause.connector === "OR") result = result || clauseResult;
              else result = result && clauseResult;
            }
            return result;
          });
        };
        if (!join) return execute(where, model);
        const baseRecords = execute(where, model);
        const grouped = /* @__PURE__ */ new Map();
        const seenIds = /* @__PURE__ */ new Map();
        for (const baseRecord of baseRecords) {
          const baseId = String(baseRecord.id);
          if (!grouped.has(baseId)) {
            const nested = { ...baseRecord };
            for (const [joinModel, joinAttr] of Object.entries(join)) {
              const joinModelName = getModelName(joinModel);
              if (joinAttr.relation === "one-to-one") nested[joinModelName] = null;
              else {
                nested[joinModelName] = [];
                seenIds.set(`${baseId}-${joinModel}`, /* @__PURE__ */ new Set());
              }
            }
            grouped.set(baseId, nested);
          }
          const nestedEntry = grouped.get(baseId);
          for (const [joinModel, joinAttr] of Object.entries(join)) {
            const joinModelName = getModelName(joinModel);
            const joinTable = db[joinModelName];
            if (!joinTable) {
              logger.error(`[MemoryAdapter] JoinOption model ${joinModelName} not found in the DB`, Object.keys(db));
              throw new Error(`JoinOption model ${joinModelName} not found`);
            }
            const matchingRecords = joinTable.filter((joinRecord) => joinRecord[joinAttr.on.to] === baseRecord[joinAttr.on.from]);
            if (joinAttr.relation === "one-to-one") nestedEntry[joinModelName] = matchingRecords[0] || null;
            else {
              const seenSet = seenIds.get(`${baseId}-${joinModel}`);
              const limit = joinAttr.limit ?? 100;
              let count = 0;
              for (const matchingRecord of matchingRecords) {
                if (count >= limit) break;
                if (!seenSet.has(matchingRecord.id)) {
                  nestedEntry[joinModelName].push(matchingRecord);
                  seenSet.add(matchingRecord.id);
                  count++;
                }
              }
            }
          }
        }
        return Array.from(grouped.values());
      }
      return {
        create: async ({ model, data }) => {
          if (options.advanced?.database?.useNumberId || options.advanced?.database?.generateId === "serial") data.id = db[getModelName(model)].length + 1;
          if (!db[model]) db[model] = [];
          db[model].push(data);
          return data;
        },
        findOne: async ({ model, where, join }) => {
          const res = convertWhereClause(where, model, join);
          if (join) {
            const resArray = res;
            if (!resArray.length) return null;
            return resArray[0];
          }
          return res[0] || null;
        },
        findMany: async ({ model, where, sortBy, limit, offset, join }) => {
          const res = convertWhereClause(where || [], model, join);
          if (join) {
            const resArray = res;
            if (!resArray.length) return [];
            applySortToRecords(resArray, sortBy, model);
            let paginatedRecords = resArray;
            if (offset !== void 0) paginatedRecords = paginatedRecords.slice(offset);
            if (limit !== void 0) paginatedRecords = paginatedRecords.slice(0, limit);
            return paginatedRecords;
          }
          let table = applySortToRecords(res, sortBy, model);
          if (offset !== void 0) table = table.slice(offset);
          if (limit !== void 0) table = table.slice(0, limit);
          return table || [];
        },
        count: async ({ model, where }) => {
          if (where) return convertWhereClause(where, model).length;
          return db[model].length;
        },
        update: async ({ model, where, update }) => {
          const res = convertWhereClause(where, model);
          res.forEach((record) => {
            Object.assign(record, update);
          });
          return res[0] || null;
        },
        delete: async ({ model, where }) => {
          const table = db[model];
          const res = convertWhereClause(where, model);
          db[model] = table.filter((record) => !res.includes(record));
        },
        deleteMany: async ({ model, where }) => {
          const table = db[model];
          const res = convertWhereClause(where, model);
          let count = 0;
          db[model] = table.filter((record) => {
            if (res.includes(record)) {
              count++;
              return false;
            }
            return !res.includes(record);
          });
          return count;
        },
        updateMany({ model, where, update }) {
          const res = convertWhereClause(where, model);
          res.forEach((record) => {
            Object.assign(record, update);
          });
          return res[0] || null;
        }
      };
    }
  });
  return (options) => {
    lazyOptions = options;
    return adapterCreator(options);
  };
};
export {
  memoryAdapter
};
