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

// src/modules/prehandlers/mutation-handlers/add-model.ts
var add_model_exports = {};
__export(add_model_exports, {
  addModel: () => addModel
});
module.exports = __toCommonJS(add_model_exports);
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
var PrismaQlSchemaHelper = class {
  parsedSchema;
  constructor(parsedSchema) {
    this.parsedSchema = parsedSchema;
  }
  getModels(names) {
    const models = this.parsedSchema.list.filter((item) => item.type === "model");
    if (names?.length) {
      return models.filter((model) => names.includes(model.name));
    }
    return models;
  }
  getModelByName(name) {
    return this.getModels().find((model) => model.name === name);
  }
  getFieldByName(modelName, fieldName) {
    const model = this.getModelByName(modelName);
    if (!model) return void 0;
    return model.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
  }
  getFields(modelName) {
    const model = this.getModelByName(modelName);
    if (!model) return [];
    return model.properties.filter((prop) => prop.type === "field");
  }
  getIdFieldTypeModel(modelName) {
    const model = this.getModelByName(modelName);
    if (!model) return void 0;
    const idField = model.properties.find((prop) => prop.type === "field" && prop?.attributes?.some((attr) => attr.name === "id"));
    return idField?.fieldType;
  }
  getEnums() {
    return this.parsedSchema.list.filter((item) => item.type === "enum");
  }
  getEnumByName(name) {
    return this.getEnums().find((enumItem) => enumItem.name === name);
  }
  getEnumRelations(enumName) {
    const models = this.getModels();
    return models.filter((model) => {
      return model.properties.some((prop) => {
        return prop.type === "field" && prop.fieldType === enumName;
      });
    }).map((model) => {
      const field = model.properties.find((prop) => {
        return prop.type === "field" && prop.fieldType === enumName;
      });
      return {
        model,
        field
      };
    });
  }
  getRelations() {
    return this.getModels().flatMap((model) => model.properties).filter((prop) => prop.type === "field" && prop.fieldType === "relation");
  }
  getGenerators() {
    return this.parsedSchema.list.filter((item) => item.type === "generator");
  }
  getModelRelations(modelName) {
    const model = this.getModelByName(modelName);
    if (!model) return [];
    return model.properties.filter(
      (prop) => prop.type === "field" && prop.fieldType === "relation"
    );
  }
};
var useHelper = (schema) => {
  return new PrismaQlSchemaHelper("type" in schema ? schema : schema.ast);
};

// src/modules/prehandlers/mutation-handlers/add-model.ts
var addModel = (prismaState, data) => {
  const { args, prismaBlock, options } = data;
  const response = handlerResponse(data);
  const modelName = (args?.models || [])[0];
  if (!modelName) {
    return response.error("Model name is required. Example: ADD MODEL -> [ModelName] ({id String @id})");
  }
  try {
    let fixUniqueKeyValues = function(keyValues, prop) {
      if (!keyValues) return null;
      if (!keyValues.fields) return keyValues;
      const fields = filterFields(keyValues.fields?.args || [], prop);
      if (fields.length) {
        return {
          ...keyValues,
          fields: { type: "array", args: fields }
        };
      } else {
        return null;
      }
    };
    const builder = prismaState.builder;
    const prevModel = builder.findByType("model", { name: modelName });
    if (prevModel) {
      return response.error(`Model ${modelName} already exists`);
    }
    if (!prismaBlock) {
      return response.error("No fields provided. Please provide a valid block in ({...}) containing a valid Prisma field description.");
    }
    let parsed;
    const defaultFields = options?.empty ? "" : "createdAt DateTime @default(now())\nupdatedAt DateTime @updatedAt()\n deletedAt DateTime?";
    const sourceModel = `model ${modelName} {
        ${defaultFields}
        ${prismaBlock || "id Int @id"}
        }`;
    try {
      parsed = (0, import_prisma_ast.getSchema)(sourceModel);
    } catch (error) {
      return response.error(`Invalid block provided. Error parsing model: ${error.message}`);
    }
    const model = useHelper(parsed).getModelByName(modelName);
    if (!model) {
      return response.error(`Model ${modelName} already exists`);
    }
    const modelBuilder = builder.model(modelName);
    const idField = model.properties.find((prop) => prop.type === "field" && prop?.attributes?.some((attr) => attr.name === "id"));
    if (!idField) {
      modelBuilder.field("id", "Int").attribute("id");
    }
    const addedFieldNames = /* @__PURE__ */ new Set();
    for (const prop of model.properties) {
      if (prop.type !== "field") {
        continue;
      }
      const field = prop;
      const fieldData = parseFieldForBuilder(prop);
      if (!fieldData) {
        continue;
      }
      if (fieldData) {
        let fieldBuilder = modelBuilder.field(field.name, fieldData.fieldType);
        addedFieldNames.add(field.name);
        for (const attr of fieldData.attributes) {
          fieldBuilder = fieldBuilder.attribute(attr.name, attr.args);
        }
      }
    }
    const filterFieldsFor = ["unique", "index", "id"];
    const filterFields = (fields, prop) => {
      if (!filterFieldsFor.includes(prop)) {
        return fields;
      }
      return fields.filter((field) => {
        return addedFieldNames.has(field);
      });
    };
    const blockAttributesMap = /* @__PURE__ */ new Map();
    for (const prop of model.properties) {
      if (prop.type === "attribute" && prop.args) {
        let arrayArgs = [];
        let keyValueArgs = {};
        for (const arg of prop.args) {
          const { value, type } = arg;
          if (type == "attributeArgument") {
            if ("string" == typeof value) {
              modelBuilder.blockAttribute(prop.name, value);
            } else if ("object" == typeof value) {
              const val = value;
              if (val.type === "array") {
                const result = filterFields(val.args, prop.name);
                if (result.length) {
                  modelBuilder.blockAttribute(prop.name, result);
                }
              } else if (val.type === "keyValue") {
                keyValueArgs[val.key] = val.value;
              }
            }
          }
        }
        if (arrayArgs.length || Object.keys(keyValueArgs).length) {
          if (blockAttributesMap.has(prop.name)) {
            const existing = blockAttributesMap.get(prop.name);
            existing.args = [.../* @__PURE__ */ new Set([...existing.args || [], ...arrayArgs])];
            existing.keyValues = { ...existing.keyValues, ...keyValueArgs };
          } else {
            blockAttributesMap.set(prop.name, { args: arrayArgs, keyValues: keyValueArgs });
          }
        }
      }
    }
    for (const [name, { keyValues, args: args2 }] of blockAttributesMap.entries()) {
      if (keyValues && args2?.length && Object.keys(keyValues).length) {
        const fields = filterFields(args2, name);
        if (fields.length) {
          modelBuilder.blockAttribute(name, {
            ...keyValues,
            fields: { type: "array", args: args2 }
          });
        } else {
          modelBuilder.blockAttribute(name, keyValues);
        }
      } else if (args2?.length) {
        modelBuilder.blockAttribute(name, args2);
      } else if (keyValues && Object.keys(keyValues).length) {
        const output = fixUniqueKeyValues(keyValues, name);
        if (output) {
          modelBuilder.blockAttribute(name, output);
        }
      }
    }
    return response.result(`Model ${modelName} added successfully`);
  } catch (error) {
    return response.error(`Error adding model: ${error.message}`);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addModel
});
