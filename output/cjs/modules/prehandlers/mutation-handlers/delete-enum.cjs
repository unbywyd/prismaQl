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

// src/modules/prehandlers/mutation-handlers/delete-enum.ts
var delete_enum_exports = {};
__export(delete_enum_exports, {
  deleteEnum: () => deleteEnum
});
module.exports = __toCommonJS(delete_enum_exports);

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

// src/modules/prehandlers/mutation-handlers/delete-enum.ts
var deleteEnum = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  const enumName = args?.enums?.[0];
  if (!enumName) {
    return response.error("No enum name provided. Usage: DELETE ENUM ->[EnumName];");
  }
  try {
    const builder = prismaState.builder;
    const prevEnum = builder.findByType("enum", { name: enumName });
    if (!prevEnum) {
      return response.error(`Enum ${enumName} does not exist`);
    }
    builder.drop(enumName);
    return response.result(`Enum ${enumName} deleted successfully`);
  } catch (error) {
    return response.error(`Error deleting enum: ${error.message}`);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteEnum
});
