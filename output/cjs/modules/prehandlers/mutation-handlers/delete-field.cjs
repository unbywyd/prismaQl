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

// src/modules/prehandlers/mutation-handlers/delete-field.ts
var delete_field_exports = {};
__export(delete_field_exports, {
  deleteField: () => deleteField
});
module.exports = __toCommonJS(delete_field_exports);

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

// src/modules/prehandlers/mutation-handlers/delete-field.ts
var deleteField = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  if (!args?.fields || !args.fields.length) {
    return response.error("No field name provided. Example: DELETE FIELD ->[FieldName] IN ->[ModelName]");
  }
  const modelName = args?.models?.[0];
  if (!modelName) {
    return response.error("No model name provided. Example: DELETE FIELD FieldName IN ->[ModelName]");
  }
  const fieldName = args.fields[0];
  try {
    const builder = prismaState.builder;
    const prevModel = builder.findByType("model", { name: modelName });
    if (!prevModel) {
      return response.error(`Model ${modelName} does not exist`);
    }
    if (!prevModel.properties.find((prop) => prop.type === "field" && prop.name === fieldName)) {
      return response.error(`Field ${fieldName} does not exist in model ${modelName}`);
    }
    const model = builder.model(modelName);
    model.removeField(fieldName);
    return response.result(`Field ${modelName} deleted successfully`);
  } catch (error) {
    return response.error(`Error deleting field: ${error.message}`);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteField
});
