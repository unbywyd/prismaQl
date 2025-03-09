var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/modules/prehandlers/mutation-handlers/update-db.ts
var update_db_exports = {};
__export(update_db_exports, {
  normalizeQuotes: () => normalizeQuotes,
  updateDB: () => updateDB
});
module.exports = __toCommonJS(update_db_exports);

// src/modules/handler-registries/handler-registry.ts
var handlerResponse = (dsl) => {
  return {
    error: (error) => {
      return { dsl, error };
    },
    result: (result) => {
      return {
        dsl,
        result
      };
    }
  };
};

// src/modules/prehandlers/mutation-handlers/update-db.ts
function normalizeQuotes(input) {
  return input.replace(/^[\'"]+/, "").replace(/[\'"]+$/, "");
}
var updateDB = (prismaState, data) => {
  const { options } = data;
  const response = handlerResponse(data);
  if (!options?.provider && !options?.url) {
    return response.error("No provider or url provided. Example: 'UPDATE DB (->[url='sqlite://prisma.db' provider='sqlite']);'");
  }
  const builder = prismaState.builder;
  const prev = builder.findByType("datasource", {
    name: "db"
  });
  if (!prev) {
    return response.error("No datasource found");
  }
  const provider = (options.provider ? `"${options.provider}"` : null) || prev?.assignments?.find((a) => a.key == "provider")?.value;
  let prevUrl = options.url?.toString() || prev?.assignments?.find((a) => a.key == "url")?.value;
  if (typeof prevUrl == "object" && prevUrl.name == "env") {
    prevUrl = {
      env: normalizeQuotes(prevUrl.params[0])
    };
  }
  builder.datasource(provider, prevUrl || {
    env: "DATABASE_URL"
  });
  return response.result(`DB updated successfully`);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  normalizeQuotes,
  updateDB
});
