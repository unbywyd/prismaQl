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

// src/modules/prehandlers/mutation-handlers/add-generator.ts
var add_generator_exports = {};
__export(add_generator_exports, {
  addGenerator: () => addGenerator
});
module.exports = __toCommonJS(add_generator_exports);

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

// src/modules/prehandlers/mutation-handlers/add-generator.ts
var import_prisma_ast = require("@mrleebo/prisma-ast");
var addGenerator = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  const builder = prismaState.builder;
  const generatorName = args?.generators?.[0];
  if (!generatorName) {
    return response.error("No generator name provided. Example: 'ADD GENERATOR ->[GeneratorName] ({key: value});'");
  }
  const prismaBlock = data.prismaBlock;
  if (!prismaBlock) {
    return response.error("No generator block provided. Example: 'ADD GENERATOR GeneratorName ->[({key: value})];'");
  }
  const prevGenerator = builder.findByType("generator", { name: generatorName });
  if (prevGenerator) {
    return response.error(`Generator ${generatorName} already exists`);
  }
  let parsed;
  const sourceModel = `generator ${generatorName} {
        ${prismaBlock}
    }`;
  try {
    parsed = (0, import_prisma_ast.getSchema)(sourceModel);
  } catch (error) {
    return response.error(`Invalid block provided. Error parsing model: ${error.message}`);
  }
  const schema = prismaState.builder.getSchema();
  const newGenerator = parsed.list[0];
  schema.list.push(newGenerator);
  return response.result(`Generator ${generatorName} added successfully!`);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addGenerator
});
