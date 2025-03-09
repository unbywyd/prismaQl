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

// src/modules/prehandlers/mutation-handlers/delete-generator.ts
var delete_generator_exports = {};
__export(delete_generator_exports, {
  deleteGenerator: () => deleteGenerator
});
module.exports = __toCommonJS(delete_generator_exports);

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

// src/modules/prehandlers/mutation-handlers/delete-generator.ts
var deleteGenerator = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  const builder = prismaState.builder;
  const generatorName = args?.generators?.[0];
  if (!generatorName) {
    return response.error("No generator name provided. Example: 'ADD GENERATOR ->[GeneratorName];'");
  }
  const prevGenerator = builder.findByType("generator", { name: generatorName });
  if (!prevGenerator) {
    return response.error(`Generator ${generatorName} does not exist`);
  }
  builder.drop(prevGenerator.name);
  return response.result(`Generator ${generatorName} dropped`);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteGenerator
});
