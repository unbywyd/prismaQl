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

// src/modules/utils/model-primary-fields.ts
var model_primary_fields_exports = {};
__export(model_primary_fields_exports, {
  extractModelSummary: () => extractModelSummary
});
module.exports = __toCommonJS(model_primary_fields_exports);
function extractModelSummary(model, relations) {
  const fields = model?.properties?.filter(
    (prop) => prop.type === "field" && (prop?.attributes?.some((attr) => attr.name === "unique") === true || prop?.attributes?.some((attr) => attr.name === "id") === true)
  ) || [];
  return fields.map((field) => {
    const isId = field?.attributes?.some((attr) => attr.name === "id") || false;
    const isUnique = field?.attributes?.some((attr) => attr.name === "unique") || false;
    let relation;
    let fieldType = field.fieldType;
    relations.find((rel) => {
      if (rel.modelName === model.name) {
        if (rel.fieldName === field.name || rel.foreignKey === field.name) {
          relation = rel;
          fieldType = `${rel.relatedModel}.id`;
        }
      }
    });
    if (isId) {
      const defAttr = field?.attributes?.find((attr) => attr.name === "default")?.args[0]?.value;
      if (defAttr?.type === "function") {
        fieldType = defAttr.name;
      }
    }
    return {
      name: field.name,
      type: fieldType,
      isId,
      isUnique,
      isRelation: !!relation
    };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extractModelSummary
});
