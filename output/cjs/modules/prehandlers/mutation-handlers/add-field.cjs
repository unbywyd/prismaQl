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

// src/modules/prehandlers/mutation-handlers/add-field.ts
var add_field_exports = {};
__export(add_field_exports, {
  addField: () => addField
});
module.exports = __toCommonJS(add_field_exports);
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

// src/modules/prehandlers/mutation-handlers/add-field.ts
var addField = (prismaState, data) => {
  const response = handlerResponse(data);
  const { args } = data;
  if (!args?.fields || !args.fields.length) {
    return response.error("No fields provided. Example: 'ADD FIELD -> [FieldName] TO [ModelName] ({String @default('123')})'");
  }
  if (!args?.models || !args.models.length) {
    return response.error("No model name provided. Example: 'ADD FIELD [FieldName] TO -> [ModelName] ({String @default('123')})'");
  }
  const modelName = args.models[0];
  const model = prismaState.builder.findByType("model", { name: modelName });
  if (!model) {
    return response.error(`Model ${modelName} not found. Please ensure the model name is correct.`);
  }
  const fieldName = args.fields[0];
  if (!data.prismaBlock) {
    return response.error("No field type provided. Example: 'ADD FIELD [FieldName] TO [ModelName] -> ({String @default('123')})'");
  }
  const prevField = model.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
  if (prevField) {
    return response.error(`Field ${fieldName} already exists in model ${modelName}`);
  }
  const sourceField = `model Test {
        ${fieldName}  ${data.prismaBlock}
    }`;
  let parsed;
  try {
    parsed = (0, import_prisma_ast.getSchema)(sourceField);
  } catch (error) {
    return response.error(`Error parsing field: ${error.message}`);
  }
  if (!parsed.list.length) {
    return response.error("No models found in the schema. Ensure the field block is correct and includes Prisma field attributes, including the type, but without the field name. Example: 'ADD FIELD [FieldName] TO [ModelName] -> ({String @default('123')})'");
  }
  const testModel = parsed.list[0];
  const field = testModel.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
  if (!field) {
    return response.error("Invalid field. Please refer to the documentation and ensure the field block is correct. Example: 'ADD FIELD [FieldName] TO [ModelName] -> ({String?});'");
  }
  const fieldData = parseFieldForBuilder(field);
  if (!fieldData) {
    return response.error("Invalid field. Please refer to the documentation and ensure the field block is correct. Example: 'ADD FIELD [FieldName] TO [ModelName] -> ({String?});'");
  }
  const modelBuilder = prismaState.builder.model(model.name);
  if (fieldData) {
    const fieldBuilder = modelBuilder.field(fieldData.name, fieldData.fieldType);
    for (const attr of fieldData.attributes) {
      fieldBuilder.attribute(attr.name, attr.args);
    }
  }
  return response.result(`Field ${fieldName} added to model ${modelName}`);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addField
});
