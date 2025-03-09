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

// src/modules/prehandlers/json-handlers/get-enums.ts
var get_enums_exports = {};
__export(get_enums_exports, {
  getJsonEnums: () => getJsonEnums
});
module.exports = __toCommonJS(get_enums_exports);

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

// src/modules/prehandlers/json-handlers/get-enums.ts
var getJsonEnums = (prismaState, data) => {
  const response = handlerResponse(data);
  const helper = useHelper(prismaState);
  let enums = helper.getEnums();
  const onlyEnums = data.args?.enums || [];
  if (onlyEnums.length && !onlyEnums.includes("*")) {
    enums = enums.filter((e) => onlyEnums.includes(e.name));
  }
  if (!enums.length) {
    return response.result({
      total: 0,
      enums: []
    });
  }
  const totalEnums = enums.length;
  const list = [];
  enums.forEach((e) => {
    list.push({
      name: e.name,
      options: e.enumerators?.filter((e2) => e2.type == "enumerator").map((en) => en.name) || []
    });
  });
  return response.result({
    total: totalEnums,
    enums: list
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getJsonEnums
});
