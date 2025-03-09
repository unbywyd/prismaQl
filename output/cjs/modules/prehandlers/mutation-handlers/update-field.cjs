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

// src/modules/prehandlers/mutation-handlers/update-field.ts
var update_field_exports = {};
__export(update_field_exports, {
  updateField: () => updateField
});
module.exports = __toCommonJS(update_field_exports);
var import_prisma_ast = require("@mrleebo/prisma-ast");

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

// src/modules/utils/schema-helper.ts
function parseFieldForBuilder(prop) {
  if (prop.type !== "field") return null;
  const { name, fieldType, array, optional, attributes } = prop;
  if (typeof name !== "string" || typeof fieldType !== "string") return null;
  if (attributes?.some((attr) => attr.name === "relation")) return null;
  let prismaFieldType = fieldType;
  if (optional) prismaFieldType += "?";
  if (array) prismaFieldType += "[]";
  const parsedAttributes = [];
  for (const attr of attributes || []) {
    let attrArgs = attr.args?.map((arg) => arg.value) || [];
    parsedAttributes.push({ name: attr.name, args: attrArgs });
  }
  return {
    name,
    fieldType: prismaFieldType,
    attributes: parsedAttributes,
    sourceType: fieldType
  };
}

// src/modules/prehandlers/mutation-handlers/update-field.ts
var updateField = (prismaState, data) => {
  const response = handlerResponse(data);
  const { args } = data;
  const fieldName = args?.fields?.[0];
  if (!fieldName) {
    return response.error("No field name provided. Usage: UPDATE FIELD ->[FieldName] IN [ModelName] ({String @default('test')})");
  }
  const modelName = args?.models?.[0];
  if (!modelName) {
    return response.error("No model name provided. Usage: UPDATE FIELD [FieldName] IN -> [ModelName] ({String @default('test')})");
  }
  const model = prismaState.builder.findByType("model", { name: modelName });
  if (!model) {
    return response.error(`Model ${modelName} not found`);
  }
  if (!data.prismaBlock) {
    return response.error("No field block provided. Example: 'UPDATE FIELD FieldName IN ModelName ->[({String @default('test')})];'");
  }
  const prevField = model.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
  if (!prevField) {
    return response.error(`Field ${fieldName} does not exist in model ${modelName}`);
  }
  let parsed;
  const sourceField = `model Test {
        ${fieldName} ${data.prismaBlock}
    }`;
  try {
    parsed = (0, import_prisma_ast.getSchema)(sourceField);
  } catch (error) {
    return response.error("There is likely an issue with the block. The block should contain Prisma field attributes including the type, but without the field name. Example: 'String @default('test')'");
  }
  const testModel = parsed.list[0];
  const newField = testModel.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
  if (!newField) {
    return response.error("Invalid field. Please refer to the documentation and ensure the field block is correct. Example: 'UPDATE FIELD [FieldName] IN [ModelName] -> ({String?});'");
  }
  const fieldData = parseFieldForBuilder(newField);
  if (!fieldData) {
    return response.error("Invalid field. Please refer to the documentation and ensure the field block is correct. Example: 'UPDATE FIELD [FieldName] IN [ModelName] -> ({String?});'");
  }
  const modelBuilder = prismaState.builder.model(model.name);
  if (fieldData) {
    modelBuilder.removeField(fieldName);
    const fieldBuilder = modelBuilder.field(fieldData.name, fieldData.fieldType);
    for (const attr of fieldData.attributes) {
      fieldBuilder.attribute(attr.name, attr.args);
    }
  }
  return response.result(`Field ${fieldName} added to model ${modelName}`);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateField
});
