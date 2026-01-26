import { g as getHostHeaderPlugin, r as resolveHostHeaderConfig } from "./middleware-host-header.mjs";
import { g as getContentLengthPlugin } from "../@smithy/middleware-content-length.mjs";
import { a as awsEndpointFunctions } from "./util-endpoints.mjs";
import { E as EndpointCache, r as resolveEndpoint, c as customEndpointFunctions } from "../@smithy/util-endpoints.mjs";
import { r as resolveAwsSdkSigV4Config, a as resolveAwsSdkSigV4AConfig, A as AwsRestJsonProtocol, b as AwsSdkSigV4Signer, c as AwsSdkSigV4ASigner, e as emitWarningIfUnsupportedVersion$1, N as NODE_SIGV4A_CONFIG_OPTIONS, d as NODE_AUTH_SCHEME_PREFERENCE_OPTIONS } from "./core.mjs";
import { S as SignatureV4MultiRegion } from "./signature-v4-multi-region.mjs";
import { r as resolveParams, a as resolveEndpointConfig, g as getEndpointPlugin } from "../@smithy/middleware-endpoint.mjs";
import { n as normalizeProvider, g as getSmithyContext } from "../@smithy/util-middleware.mjs";
import { H as Hash } from "../@smithy/hash-node.mjs";
import { p as parseUrl } from "../@smithy/url-parser.mjs";
import { t as toUtf8, f as fromUtf8 } from "../@smithy/util-utf8.mjs";
import { N as NoOpLogger, e as emitWarningIfUnsupportedVersion, l as loadConfigsForDefaultMode, a as getDefaultExtensionConfiguration, r as resolveDefaultRuntimeConfig, C as Client, S as ServiceException, b as Command } from "../@smithy/smithy-client.mjs";
import { t as toBase64, f as fromBase64 } from "../@smithy/util-base64.mjs";
import { r as resolveDefaultsModeConfig } from "../@smithy/util-defaults-mode-node.mjs";
import { d as defaultProvider } from "./credential-provider-node.mjs";
import { c as calculateBodyLength } from "../@smithy/util-body-length-node.mjs";
import { s as streamCollector, N as NodeHttpHandler } from "../@smithy/node-http-handler.mjs";
import { c as createDefaultUserAgentProvider, N as NODE_APP_ID_CONFIG_OPTIONS } from "./util-user-agent-node.mjs";
import { N as NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, a as NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, b as NODE_REGION_CONFIG_FILE_OPTIONS, c as NODE_REGION_CONFIG_OPTIONS, r as resolveRegionConfig } from "../@smithy/config-resolver.mjs";
import { N as NODE_RETRY_MODE_CONFIG_OPTIONS, a as NODE_MAX_ATTEMPT_CONFIG_OPTIONS, r as resolveRetryConfig, g as getRetryPlugin } from "../@smithy/middleware-retry.mjs";
import { l as loadConfig } from "../@smithy/node-config-provider.mjs";
import { a as DEFAULT_RETRY_MODE } from "../@smithy/util-retry.mjs";
import { g as getAwsRegionExtensionConfiguration, r as resolveAwsRegionExtensionConfiguration } from "./region-config-resolver.mjs";
import { g as getHttpHandlerExtensionConfiguration, r as resolveHttpHandlerRuntimeConfig } from "../@smithy/protocol-http.mjs";
import { r as resolveUserAgentConfig, g as getUserAgentPlugin } from "./middleware-user-agent.mjs";
import { o as getSchemaSerdePlugin, q as getHttpAuthSchemeEndpointRuleSetPlugin, r as getHttpSigningPlugin, D as DefaultIdentityProviderConfig, T as TypeRegistry } from "../@smithy/core.mjs";
import { g as getLoggerPlugin } from "./middleware-logger.mjs";
import { g as getRecursionDetectionPlugin } from "./middleware-recursion-detection.mjs";
const z = "required", A = "type", B = "fn", C = "argv", D = "ref";
const a = false, b = true, c = "isSet", d = "booleanEquals", e = "endpoint", f = "tree", g = "error", h = { [z]: false, [A]: "string" }, i = { [z]: true, "default": false, [A]: "boolean" }, j = { [D]: "EndpointId" }, k = { [B]: c, [C]: [{ [D]: "Region" }] }, l = { [B]: "aws.partition", [C]: [{ [D]: "Region" }], "assign": "PartitionResult" }, m = { [D]: "UseFIPS" }, n = { [D]: "Endpoint" }, o = { "authSchemes": [{ "name": "sigv4a", "signingName": "ses", "signingRegionSet": ["*"] }] }, p = {}, q = { [B]: d, [C]: [{ [D]: "UseDualStack" }, true] }, r = { [B]: d, [C]: [true, { [B]: "getAttr", [C]: [{ [D]: "PartitionResult" }, "supportsDualStack"] }] }, s = { [g]: "DualStack is enabled but this partition does not support DualStack", [A]: g }, t = { [B]: d, [C]: [m, true] }, u = { [B]: "getAttr", [C]: [{ [D]: "PartitionResult" }, "supportsFIPS"] }, v = [{ [B]: c, [C]: [n] }], w = [q], x = [r], y = [t];
const _data = { parameters: { Region: h, UseDualStack: i, UseFIPS: i, Endpoint: h, EndpointId: h }, rules: [{ conditions: [{ [B]: c, [C]: [j] }, k, l], rules: [{ conditions: [{ [B]: "isValidHostLabel", [C]: [j, b] }], rules: [{ conditions: [{ [B]: d, [C]: [m, a] }], rules: [{ conditions: v, endpoint: { url: n, properties: o, headers: p }, [A]: e }, { conditions: w, rules: [{ conditions: x, rules: [{ endpoint: { url: "https://{EndpointId}.endpoints.email.global.{PartitionResult#dualStackDnsSuffix}", properties: o, headers: p }, [A]: e }], [A]: f }, s], [A]: f }, { endpoint: { url: "https://{EndpointId}.endpoints.email.{PartitionResult#dnsSuffix}", properties: o, headers: p }, [A]: e }], [A]: f }, { error: "Invalid Configuration: FIPS is not supported with multi-region endpoints", [A]: g }], [A]: f }, { error: "EndpointId must be a valid host label", [A]: g }], [A]: f }, { conditions: v, rules: [{ conditions: y, error: "Invalid Configuration: FIPS and custom endpoint are not supported", [A]: g }, { conditions: w, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", [A]: g }, { endpoint: { url: n, properties: p, headers: p }, [A]: e }], [A]: f }, { conditions: [k], rules: [{ conditions: [l], rules: [{ conditions: [t, q], rules: [{ conditions: [{ [B]: d, [C]: [b, u] }, r], rules: [{ endpoint: { url: "https://email-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: p, headers: p }, [A]: e }], [A]: f }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", [A]: g }], [A]: f }, { conditions: y, rules: [{ conditions: [{ [B]: d, [C]: [u, b] }], rules: [{ endpoint: { url: "https://email-fips.{Region}.{PartitionResult#dnsSuffix}", properties: p, headers: p }, [A]: e }], [A]: f }, { error: "FIPS is enabled but this partition does not support FIPS", [A]: g }], [A]: f }, { conditions: w, rules: [{ conditions: x, rules: [{ endpoint: { url: "https://email.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: p, headers: p }, [A]: e }], [A]: f }, s], [A]: f }, { endpoint: { url: "https://email.{Region}.{PartitionResult#dnsSuffix}", properties: p, headers: p }, [A]: e }], [A]: f }], [A]: f }, { error: "Invalid Configuration: Missing Region", [A]: g }] };
const ruleSet = _data;
const cache = new EndpointCache({
  size: 50,
  params: ["Endpoint", "EndpointId", "Region", "UseDualStack", "UseFIPS"]
});
const defaultEndpointResolver = (endpointParams, context = {}) => {
  return cache.get(endpointParams, () => resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  }));
};
customEndpointFunctions.aws = awsEndpointFunctions;
const createEndpointRuleSetHttpAuthSchemeParametersProvider = (defaultHttpAuthSchemeParametersProvider) => async (config, context, input) => {
  if (!input) {
    throw new Error("Could not find `input` for `defaultEndpointRuleSetHttpAuthSchemeParametersProvider`");
  }
  const defaultParameters = await defaultHttpAuthSchemeParametersProvider(config, context, input);
  const instructionsFn = getSmithyContext(context)?.commandInstance?.constructor?.getEndpointParameterInstructions;
  if (!instructionsFn) {
    throw new Error(`getEndpointParameterInstructions() is not defined on '${context.commandName}'`);
  }
  const endpointParameters = await resolveParams(input, { getEndpointParameterInstructions: instructionsFn }, config);
  return Object.assign(defaultParameters, endpointParameters);
};
const _defaultSESv2HttpAuthSchemeParametersProvider = async (config, context, input) => {
  return {
    operation: getSmithyContext(context).operation,
    region: await normalizeProvider(config.region)() || (() => {
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
    propertiesExtractor: (config, context) => ({
      signingProperties: {
        config,
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
    propertiesExtractor: (config, context) => ({
      signingProperties: {
        config,
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
const resolveHttpAuthSchemeConfig = (config) => {
  const config_0 = resolveAwsSdkSigV4Config(config);
  const config_1 = resolveAwsSdkSigV4AConfig(config_0);
  return Object.assign(config_1, {
    authSchemePreference: normalizeProvider(config.authSchemePreference ?? [])
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
const version = "3.975.0";
const packageInfo = {
  version
};
const getRuntimeConfig$1 = (config) => {
  return {
    apiVersion: "2019-09-27",
    base64Decoder: config?.base64Decoder ?? fromBase64,
    base64Encoder: config?.base64Encoder ?? toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    extensions: config?.extensions ?? [],
    httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSESv2HttpAuthSchemeProvider,
    httpAuthSchemes: config?.httpAuthSchemes ?? [
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
    logger: config?.logger ?? new NoOpLogger(),
    protocol: config?.protocol ?? AwsRestJsonProtocol,
    protocolSettings: config?.protocolSettings ?? {
      defaultNamespace: "com.amazonaws.sesv2",
      version: "2019-09-27",
      serviceTarget: "SimpleEmailService_v2"
    },
    serviceId: config?.serviceId ?? "SESv2",
    signerConstructor: config?.signerConstructor ?? SignatureV4MultiRegion,
    urlParser: config?.urlParser ?? parseUrl,
    utf8Decoder: config?.utf8Decoder ?? fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? toUtf8
  };
};
const getRuntimeConfig = (config) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig$1(config);
  emitWarningIfUnsupportedVersion$1(process.version);
  const loaderConfig = {
    profile: config?.profile,
    logger: clientSharedValues.logger
  };
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    authSchemePreference: config?.authSchemePreference ?? loadConfig(NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    credentialDefaultProvider: config?.credentialDefaultProvider ?? defaultProvider,
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: packageInfo.version }),
    maxAttempts: config?.maxAttempts ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config),
    region: config?.region ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, { ...NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
    requestHandler: NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
    retryMode: config?.retryMode ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }, config),
    sha256: config?.sha256 ?? Hash.bind(null, "sha256"),
    sigv4aSigningRegionSet: config?.sigv4aSigningRegionSet ?? loadConfig(NODE_SIGV4A_CONFIG_OPTIONS, loaderConfig),
    streamCollector: config?.streamCollector ?? streamCollector,
    useDualstackEndpoint: config?.useDualstackEndpoint ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    useFipsEndpoint: config?.useFipsEndpoint ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    userAgentAppId: config?.userAgentAppId ?? loadConfig(NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
  };
};
const getHttpAuthExtensionConfiguration = (runtimeConfig) => {
  const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
  let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
  let _credentials = runtimeConfig.credentials;
  return {
    setHttpAuthScheme(httpAuthScheme) {
      const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
      if (index === -1) {
        _httpAuthSchemes.push(httpAuthScheme);
      } else {
        _httpAuthSchemes.splice(index, 1, httpAuthScheme);
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
const resolveHttpAuthRuntimeConfig = (config) => {
  return {
    httpAuthSchemes: config.httpAuthSchemes(),
    httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
    credentials: config.credentials()
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
      identityProviderConfigProvider: async (config) => new DefaultIdentityProviderConfig({
        "aws.auth#sigv4": config.credentials,
        "aws.auth#sigv4a": config.credentials
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
}).m(function(Command2, cs, config, o2) {
  return [getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("SimpleEmailService_v2", "SendEmail", {}).n("SESv2Client", "SendEmailCommand").sc(SendEmail$).build() {
}
export {
  SESv2Client as S,
  SendEmailCommand as a
};
