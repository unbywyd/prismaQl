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

// src/modules/handler-registries/query-handler-registry.ts
var query_handler_registry_exports = {};
__export(query_handler_registry_exports, {
  PrismaQlQueryHandlerRegistry: () => PrismaQlQueryHandlerRegistry
});
module.exports = __toCommonJS(query_handler_registry_exports);

// src/modules/handler-registries/handler-registry.ts
var PrismaQlHandlerRegistry = class {
  handlers = {};
  constructor(initialHandlers) {
    if (initialHandlers) {
      this.handlers = { ...initialHandlers };
    }
  }
  register(action, command, handler) {
    this.handlers[action + "_" + command] = handler;
  }
  execute(action, command, prismaState, dsl) {
    const handler = this.handlers[action + "_" + command];
    if (!handler) {
      throw new Error(`Handler for command "${command}" not found.`);
    }
    return handler(prismaState, dsl);
  }
};

// src/modules/handler-registries/query-handler-registry.ts
var PrismaQlQueryHandlerRegistry = class extends PrismaQlHandlerRegistry {
  constructor(initialHandlers) {
    super(initialHandlers);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaQlQueryHandlerRegistry
});
