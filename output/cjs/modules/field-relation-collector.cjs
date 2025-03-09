var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/modules/field-relation-collector.ts
var field_relation_collector_exports = {};
__export(field_relation_collector_exports, {
  PrismaQlRelationCollector: () => PrismaQlRelationCollector,
  getManyToManyModelName: () => getManyToManyModelName,
  getManyToManyTableName: () => getManyToManyTableName
});
module.exports = __toCommonJS(field_relation_collector_exports);
var import_internals = __toESM(require("@prisma/internals"), 1);
var import_pluralize = __toESM(require("pluralize"), 1);

// node_modules/change-case/dist/index.cjs
var SPLIT_LOWER_UPPER_RE = new RegExp("([\\p{Ll}\\d])(\\p{Lu})", "gu");
var SPLIT_UPPER_UPPER_RE = new RegExp("(\\p{Lu})([\\p{Lu}][\\p{Ll}])", "gu");
var SPLIT_SEPARATE_NUMBER_RE = new RegExp("(\\d)\\p{Ll}|(\\p{L})\\d", "u");
var DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu;
var SPLIT_REPLACE_VALUE = "$1\0$2";
var DEFAULT_PREFIX_SUFFIX_CHARACTERS = "";
function split(value) {
  let result = value.trim();
  result = result.replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE).replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE);
  result = result.replace(DEFAULT_STRIP_REGEXP, "\0");
  let start = 0;
  let end = result.length;
  while (result.charAt(start) === "\0")
    start++;
  if (start === end)
    return [];
  while (result.charAt(end - 1) === "\0")
    end--;
  return result.slice(start, end).split(/\0/g);
}
function splitSeparateNumbers(value) {
  const words = split(value);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const match = SPLIT_SEPARATE_NUMBER_RE.exec(word);
    if (match) {
      const offset = match.index + (match[1] ?? match[2]).length;
      words.splice(i, 1, word.slice(0, offset), word.slice(offset));
    }
  }
  return words;
}
function pascalCase(input, options) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  const transform = options?.mergeAmbiguousCharacters ? capitalCaseTransformFactory(lower, upper) : pascalCaseTransformFactory(lower, upper);
  return prefix + words.map(transform).join(options?.delimiter ?? "") + suffix;
}
function lowerFactory(locale) {
  return locale === false ? (input) => input.toLowerCase() : (input) => input.toLocaleLowerCase(locale);
}
function upperFactory(locale) {
  return locale === false ? (input) => input.toUpperCase() : (input) => input.toLocaleUpperCase(locale);
}
function capitalCaseTransformFactory(lower, upper) {
  return (word) => `${upper(word[0])}${lower(word.slice(1))}`;
}
function pascalCaseTransformFactory(lower, upper) {
  return (word, index) => {
    const char0 = word[0];
    const initial = index > 0 && char0 >= "0" && char0 <= "9" ? "_" + char0 : upper(char0);
    return initial + lower(word.slice(1));
  };
}
function splitPrefixSuffix(input, options = {}) {
  const splitFn = options.split ?? (options.separateNumbers ? splitSeparateNumbers : split);
  const prefixCharacters = options.prefixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  const suffixCharacters = options.suffixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  let prefixIndex = 0;
  let suffixIndex = input.length;
  while (prefixIndex < input.length) {
    const char = input.charAt(prefixIndex);
    if (!prefixCharacters.includes(char))
      break;
    prefixIndex++;
  }
  while (suffixIndex > prefixIndex) {
    const index = suffixIndex - 1;
    const char = input.charAt(index);
    if (!suffixCharacters.includes(char))
      break;
    suffixIndex = index;
  }
  return [
    input.slice(0, prefixIndex),
    splitFn(input.slice(prefixIndex, suffixIndex)),
    input.slice(suffixIndex)
  ];
}

// src/modules/field-relation-collector.ts
var { getDMMF } = import_internals.default;
var PrismaQlRelationCollector = class {
  constructor(models = []) {
    this.models = models;
  }
  relations = [];
  getRelations() {
    return this.relations;
  }
  async setModels(models) {
    this.relations = [];
    this.models = models;
    await this.parsePrismaSchema();
    return this.relations;
  }
  getRelation(modelName, fieldName) {
    return this.relations.find((r) => r.modelName === modelName && r.fieldName === fieldName) || null;
  }
  /**
  * Function to detect one-to-one relationships in Prisma DMMF models.
  * It now detects **both** sides of the relationship (forward & reverse).
  */
  detectOneToOneRelations(models) {
    const relations = [];
    const joinTables = models.filter((model) => {
      const relationFields = model.fields.filter((f) => f.kind === "object" && !f.isList);
      const scalarFields = model.fields.filter((f) => f.kind === "scalar");
      if (relationFields.length !== 2) return false;
      return model.primaryKey?.fields?.every(
        (f) => scalarFields.some((sf) => sf.name === f)
      );
    }).map((m) => m.name);
    for (const model of models) {
      if (joinTables.includes(model.name)) continue;
      for (const field of model.fields) {
        if (field.kind !== "object" || field.isList) {
          continue;
        }
        if (!field.relationFromFields || field.relationFromFields.length === 0) {
          continue;
        }
        let isUniqueRelation = false;
        let foreignKeys = [];
        const relationFromFields = field.relationFromFields;
        if (relationFromFields.length === 1) {
          const fkField = model.fields.find((f) => f.name === relationFromFields[0]);
          if (fkField?.isUnique || model.primaryKey?.fields.includes(fkField?.name)) {
            isUniqueRelation = true;
            foreignKeys.push(fkField?.name);
          }
        } else {
          const isCompositePrimaryKey = model.primaryKey?.fields.every((f) => relationFromFields.includes(f));
          const isCompositeUnique = model.uniqueIndexes?.some(
            (idx) => idx.fields.length === relationFromFields.length && idx.fields.every((f) => relationFromFields.includes(f))
          );
          if (isCompositePrimaryKey || isCompositeUnique) {
            isUniqueRelation = true;
            foreignKeys = [...relationFromFields];
          }
        }
        if (!isUniqueRelation) {
          continue;
        }
        const relatedModel = models.find((m) => m.name === field.type);
        if (!relatedModel) {
          continue;
        }
        const inverseField = relatedModel.fields.find(
          (f) => f.relationName === field.relationName && f.name !== field.name
        );
        const referenceKeys = field.relationToFields || [];
        const existingRelation = relations.find(
          (r) => r.modelName === model.name && r.relatedModel === relatedModel.name && r.fieldName === field.name
        );
        if (existingRelation) {
          continue;
        }
        relations.push({
          type: "1:1",
          fieldName: field.name,
          modelName: model.name,
          relatedModel: relatedModel.name,
          relationName: field.relationName,
          foreignKey: foreignKeys.join(", "),
          referenceKey: referenceKeys.join(", "),
          inverseField: inverseField?.name,
          relationDirection: "forward",
          constraints: [...foreignKeys]
        });
        if (inverseField) {
          relations.push({
            type: "1:1",
            fieldName: inverseField.name,
            modelName: relatedModel.name,
            relatedModel: model.name,
            relationName: field.relationName,
            foreignKey: void 0,
            referenceKey: void 0,
            inverseField: field.name,
            relationDirection: "backward",
            constraints: [...referenceKeys]
          });
        }
      }
    }
    return relations;
  }
  detectOneToManyRelations(models) {
    const relations = [];
    for (const model of models) {
      for (const field of model.fields) {
        if (field.kind !== "object" || !field.isList) {
          continue;
        }
        const relatedModel = models.find((m) => m.name === field.type);
        if (!relatedModel) continue;
        const inverseField = relatedModel.fields.find(
          (f) => f.relationName === field.relationName && !f.isList
        );
        if (!inverseField) continue;
        if (!inverseField.relationFromFields || inverseField.relationFromFields.length === 0) {
          continue;
        }
        const fk = inverseField.relationFromFields.join(", ");
        const rk = inverseField.relationToFields && inverseField.relationToFields.length > 0 ? inverseField.relationToFields.join(", ") : void 0;
        const existingRelation = relations.find(
          (r) => r.modelName === model.name && r.relatedModel === relatedModel.name && r.fieldName === field.name && r.relationName === field.relationName
        );
        if (existingRelation) {
          continue;
        }
        relations.push({
          type: "1:M",
          fieldName: inverseField.name,
          // The field that holds the FK
          modelName: relatedModel.name,
          relatedModel: model.name,
          relationName: field.relationName,
          // Track relationName!
          foreignKey: fk,
          referenceKey: rk,
          inverseField: field.name,
          relationDirection: "forward",
          constraints: [...inverseField.relationFromFields]
        });
        relations.push({
          type: "1:M",
          fieldName: field.name,
          modelName: model.name,
          relatedModel: relatedModel.name,
          relationName: field.relationName,
          // Track relationName!
          foreignKey: void 0,
          referenceKey: void 0,
          inverseField: inverseField.name,
          relationDirection: "backward",
          constraints: [...inverseField.relationFromFields]
        });
      }
    }
    return relations;
  }
  getManyToManyTableName(modelA, modelB, relationName) {
    return getManyToManyTableName(modelA, modelB, relationName);
  }
  detectManyToManyRelations(models) {
    const relations = [];
    const seenRelations = /* @__PURE__ */ new Set();
    for (const model of models) {
      for (const field of model.fields) {
        if (field.kind !== "object" || !field.isList) {
          continue;
        }
        const relatedModel = models.find((m) => m.name === field.type);
        if (!relatedModel) continue;
        const inverseFields = relatedModel.fields.filter(
          (f) => f.relationName === field.relationName && f.isList
        );
        if (inverseFields.length === 0) continue;
        const hasExplicitForeignKey = models.some(
          (m) => m.fields.some(
            (f) => f.relationName === field.relationName && (f.relationFromFields || []).length > 0
          )
        );
        if (hasExplicitForeignKey) {
          continue;
        }
        for (const inverseField of inverseFields) {
          if (field.name === inverseField.name) {
            continue;
          }
          const relationKey = [model.name, relatedModel.name, field.relationName].sort().join("|");
          if (seenRelations.has(relationKey)) {
            continue;
          }
          seenRelations.add(relationKey);
          const isExplicit = models.some(
            (m) => m.fields.some((f) => f.relationName === field.relationName && (f.relationFromFields || []).length > 0)
          );
          const tableName = this.getManyToManyTableName(model.name, relatedModel.name, isExplicit ? field.relationName : void 0);
          relations.push({
            type: "M:N",
            fieldName: field.name,
            modelName: model.name,
            relatedModel: relatedModel.name,
            relationName: field.relationName,
            foreignKey: void 0,
            referenceKey: void 0,
            inverseField: inverseField.name,
            relationDirection: "bidirectional",
            relationTable: tableName,
            // Prisma implicit table naming convention
            constraints: []
          });
          if (inverseField.name) {
            relations.push({
              type: "M:N",
              fieldName: inverseField.name,
              modelName: relatedModel.name,
              relatedModel: model.name,
              relationName: field.relationName,
              foreignKey: void 0,
              referenceKey: void 0,
              inverseField: field.name,
              relationDirection: "bidirectional",
              relationTable: tableName,
              // Prisma implicit table naming convention
              constraints: []
            });
          }
        }
      }
    }
    return relations;
  }
  detectExplicitManyToManyRelations(models) {
    const relations = [];
    for (const model of models) {
      const relationFields = model.fields.filter((f) => f.kind === "object" && !f.isList);
      const scalarFields = model.fields.filter((f) => f.kind === "scalar");
      if (relationFields.length !== 2) {
        continue;
      }
      const [relation1, relation2] = relationFields;
      if (!relation1.relationFromFields?.length || !relation2.relationFromFields?.length) {
        continue;
      }
      const model1 = models.find((m) => m.name === relation1.type);
      const model2 = models.find((m) => m.name === relation2.type);
      if (!model1 || !model2) {
        continue;
      }
      const compositePK = model.primaryKey?.fields?.every(
        (f) => scalarFields.some((sf) => sf.name === f)
      );
      if (!compositePK) {
        continue;
      }
      relations.push({
        type: "M:N",
        fieldName: (0, import_pluralize.default)(model1.name),
        // Example: "posts"
        modelName: model1.name,
        relatedModel: model2.name,
        relationName: relation1.relationName,
        foreignKey: relation1.relationFromFields.join(", "),
        referenceKey: relation1.relationToFields?.join(", "),
        inverseField: (0, import_pluralize.default)(model2.name.toLowerCase()),
        // Example: "categories"
        relationDirection: "bidirectional",
        relationTable: model.name,
        // The join table
        constraints: [...relation1.relationFromFields, ...relation2.relationFromFields]
      });
      relations.push({
        type: "M:N",
        fieldName: (0, import_pluralize.default)(model2.name),
        modelName: model2.name,
        relatedModel: model1.name,
        relationName: relation2.relationName,
        foreignKey: relation2.relationFromFields.join(", "),
        referenceKey: relation2.relationToFields?.join(", "),
        inverseField: (0, import_pluralize.default)(model1.name.toLowerCase()),
        relationDirection: "bidirectional",
        relationTable: model.name,
        // The join table
        constraints: [...relation1.relationFromFields, ...relation2.relationFromFields]
      });
      relations.push({
        type: "M:N",
        fieldName: void 0,
        modelName: model.name,
        relatedModel: `${model1.name}, ${model2.name}`,
        relationName: `${relation1.relationName}, ${relation2.relationName}`,
        foreignKey: `${relation1.relationFromFields.join(", ")}, ${relation2.relationFromFields.join(", ")}`,
        referenceKey: `${relation1.relationToFields?.join(", ")}, ${relation2.relationToFields?.join(", ")}`,
        inverseField: `${(0, import_pluralize.default)(model1.name)}, ${(0, import_pluralize.default)(model2.name)}`,
        relationDirection: "bidirectional",
        relationTable: model.name,
        constraints: [...relation1.relationFromFields, ...relation2.relationFromFields]
      });
    }
    return relations;
  }
  deduplicateRelations(relations) {
    const seen = /* @__PURE__ */ new Set();
    const result = [];
    for (const r of relations) {
      const key = [
        r.type,
        r.modelName,
        r.relatedModel,
        r.fieldName,
        r.relationName,
        r.foreignKey || "",
        r.referenceKey || "",
        r.inverseField || "",
        r.relationTable || "",
        r.relationDirection || "",
        (r.constraints || []).join(",")
      ].join("|");
      if (!seen.has(key)) {
        seen.add(key);
        result.push(r);
      }
    }
    return result;
  }
  async collectRelations(models) {
    const explicitM2MRelations = this.detectExplicitManyToManyRelations(models);
    const explicitJoinTableNames = new Set(
      explicitM2MRelations.filter((r) => r.modelName === r.relationTable).map((r) => r.modelName)
    );
    const implicitM2MRelations = this.detectManyToManyRelations(models);
    const modelsForOneX = models.filter((m) => !explicitJoinTableNames.has(m.name));
    const oneToOneRelations = this.detectOneToOneRelations(modelsForOneX);
    const oneToManyRelations = this.detectOneToManyRelations(modelsForOneX);
    let relations = [
      ...explicitM2MRelations,
      ...implicitM2MRelations,
      ...oneToOneRelations,
      ...oneToManyRelations
    ];
    relations = this.deduplicateRelations(relations);
    return relations;
  }
  async parsePrismaSchema(schema) {
    const dmmf = schema ? await getDMMF({ datamodel: schema }) : null;
    const models = dmmf ? dmmf.datamodel.models : this.models;
    const relations = this.collectRelations(models);
    this.relations = await relations;
  }
};
var getManyToManyTableName = (modelA, modelB, relationName) => {
  if (relationName) return relationName;
  const [first, second] = [modelA, modelB].sort();
  return `_${pascalCase(first)}To${pascalCase(second)}`;
};
var getManyToManyModelName = (modelA, modelB, relationName) => {
  if (relationName) return relationName;
  const [first, second] = [modelA, modelB].sort();
  return `${pascalCase(first)}To${pascalCase(second)}`;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaQlRelationCollector,
  getManyToManyModelName,
  getManyToManyTableName
});
