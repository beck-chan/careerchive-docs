export type OpenApiSecurityRequirement = Record<string, string[]>;

export type OpenApiOperation = {
  operationId?: string;
  tags?: string[];
  summary?: string;
  description?: string;
  security?: OpenApiSecurityRequirement[];
};

export type OpenApiSpec = {
  openapi?: string;
  swagger?: string;
  info?: { title?: string; version?: string; description?: string };
  host?: string;
  basePath?: string;
  schemes?: string[];
  servers?: { url: string; description?: string }[];
  tags?: { name: string; description?: string }[];
  security?: OpenApiSecurityRequirement[];
  paths?: Record<
    string,
    Record<string, OpenApiOperation | undefined> | undefined
  >;
  components?: {
    schemas?: Record<string, unknown>;
    securitySchemes?: Record<string, unknown> & {
      apikey?: {
        type: "apiKey";
        in: "header";
        name: string;
        description?: string;
      };
    };
  };
};

const HTTP_METHODS = new Set([
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
]);

const API_KEY_SECURITY: OpenApiSecurityRequirement[] = [{ apikey: [] }];

export function applyOperationSecurity(paths: OpenApiSpec["paths"]) {
  if (!paths) {
    return;
  }

  for (const methods of Object.values(paths)) {
    if (!methods) {
      continue;
    }
    for (const [method, operation] of Object.entries(methods)) {
      if (!HTTP_METHODS.has(method.toLowerCase()) || !operation) {
        continue;
      }
      operation.security = API_KEY_SECURITY;
    }
  }
}
