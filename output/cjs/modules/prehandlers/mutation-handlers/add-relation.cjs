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

// src/modules/prehandlers/mutation-handlers/add-relation.ts
var add_relation_exports = {};
__export(add_relation_exports, {
  addRelation: () => addRelation
});
module.exports = __toCommonJS(add_relation_exports);

// src/modules/field-relation-collector.ts
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
function camelCase(input, options) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  const transform = options?.mergeAmbiguousCharacters ? capitalCaseTransformFactory(lower, upper) : pascalCaseTransformFactory(lower, upper);
  return prefix + words.map((word, index) => {
    if (index === 0)
      return lower(word);
    return transform(word, index);
  }).join(options?.delimiter ?? "") + suffix;
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

// src/modules/prehandlers/mutation-handlers/add-relation.ts
var import_pluralize2 = __toESM(require("pluralize"), 1);

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

// src/modules/prehandlers/mutation-handlers/add-relation.ts
var addRelation = (prismaState, data) => {
  const { args, options } = data;
  const response = handlerResponse(data);
  const type = options?.type;
  const models = args?.models;
  if (!models || models.length !== 2) {
    return response.error("Two models are required for relation. Example: ADD RELATION ->[ModelA] AND ->[ModelB] (type=1:1)");
  }
  if (!type) {
    return response.error("Relation type is required. Valid types are: '1:1', '1:M', 'M:N'. Example: ADD RELATION ModelA AND ModelB (type=1:1)");
  }
  const [modelA, modelB] = models;
  const { builder } = prismaState;
  const modelARef = builder.findByType("model", { name: modelA });
  const modelBRef = builder.findByType("model", { name: modelB });
  if (!modelARef) {
    return response.error(`Model ${modelA} not found, please add it first`);
  }
  if (!modelBRef) {
    return response.error(`Model ${modelB} not found, please add it first`);
  }
  const optional = options?.required === false || options?.required === void 0;
  const pivotTable = options?.pivotTable && options?.pivotTable === true ? getManyToManyModelName(modelA, modelB) : options?.pivotTable || null;
  const sourceRelationName = options?.relationName || getManyToManyTableName(modelA, modelB);
  const relationName = `"${sourceRelationName}"`;
  const pivotModelName = pivotTable ? pascalCase(pivotTable) : null;
  const isSelfRelation = modelA === modelB;
  const fk = (modelName) => {
    return camelCase(`${modelName}Id`);
  };
  const selfPrefix = (modelName, asFk = false) => {
    return isSelfRelation ? camelCase(modelName + "By" + (asFk ? "Id" : "")) : camelCase(modelName + (asFk ? "Id" : ""));
  };
  if (options?.fkHolder && options?.fkHolder !== modelA && options?.fkHolder !== modelB) {
    return response.error(`Model ${options.fkHolder} not found, please add it first`);
  }
  const makeOptional = (str) => {
    return str + "?";
  };
  const isOptional = (str) => {
    return str + (optional ? "?" : "");
  };
  const helper = useHelper(prismaState);
  if (type == "1:1") {
    if (!pivotTable) {
      const aModelName = options?.fkHolder || modelBRef.name;
      const bModelName = aModelName === modelA ? modelB : modelA;
      const idFieldModelB = helper.getIdFieldTypeModel(bModelName) || "String";
      const fkKey = fk(bModelName);
      const refModelKey = selfPrefix(bModelName);
      builder.model(aModelName).field(fkKey, isOptional(idFieldModelB)).attribute("unique").field(refModelKey, isOptional(bModelName)).attribute("relation", [relationName, `fields: [${fkKey}]`, `references: [id]`]);
      builder.model(bModelName).field(camelCase(aModelName), makeOptional(aModelName)).attribute("relation", [relationName]);
      return response.result(`One-to-One relation added between ${modelA} and ${modelB}`);
    } else {
      const fkA = selfPrefix(modelA, true);
      const fkB = fk(modelB);
      const pivotOnly = options?.pivotOnly;
      const idFieldModelA = helper.getIdFieldTypeModel(modelA) || "String";
      const idFieldModelB = helper.getIdFieldTypeModel(modelB) || "String";
      if (!pivotOnly) {
        builder.model(pivotModelName).field("createdAt", "DateTime").attribute("default", ["now()"]).field(fkA, idFieldModelA).attribute("unique").field(fkB, idFieldModelB).blockAttribute("id", [fkA, fkB]).field(modelA.toLowerCase(), modelA).attribute("relation", [
          relationName,
          `fields: [${fkA}]`,
          `references: [id]`
        ]);
        builder.model(modelA).field(camelCase(modelB), `${pivotModelName}?`).attribute("relation", [relationName]);
      } else {
        builder.model(pivotModelName).field(fkA, idFieldModelA).attribute("unique").field(fkB, idFieldModelB).field("createdAt", "DateTime").attribute("default", ["now()"]).blockAttribute("id", [fkA, fkB]);
      }
      return response.result(`One-to-One relation (with pivot table) added between ${modelA} and ${modelB}`);
    }
  } else if (type == "1:M") {
    if (!pivotTable) {
      const required = options?.required;
      const aModelName = options?.fkHolder || modelA;
      const bModelName = aModelName === modelA ? modelB : modelA;
      const idFieldModelB = helper.getIdFieldTypeModel(bModelName) || "String";
      const fkKey = fk(bModelName);
      const refModelKey = selfPrefix(bModelName);
      const fkFieldName = options?.fkName || fkKey;
      const pluralName = options?.pluralName || import_pluralize2.default.plural(camelCase(aModelName));
      const refFieldName = options?.refName || refModelKey;
      builder.model(aModelName).field(fkFieldName, !required ? isOptional(idFieldModelB) : idFieldModelB).field(refFieldName, !required ? isOptional(bModelName) : bModelName).attribute("relation", [relationName, `fields: [${fkFieldName}]`, `references: [id]`]);
      builder.model(bModelName).field(pluralName, aModelName + "[]").attribute("relation", [relationName]);
      return response.result(`One-to-Many relation added between ${modelA} and ${modelB}`);
    } else {
      const fkA = selfPrefix(modelA, true);
      const fkB = selfPrefix(modelB, true);
      const idFieldModelA = helper.getIdFieldTypeModel(modelA) || "String";
      const idFieldModelB = helper.getIdFieldTypeModel(modelB) || "String";
      builder.model(pivotModelName).field("createdAt", "DateTime").attribute("default", ["now()"]).field(fkA, idFieldModelA).attribute("unique").field(fkB, idFieldModelB).attribute("unique").blockAttribute("id", [fkA, fkB]).field(modelA.toLowerCase(), modelA).attribute("relation", [
        relationName,
        `fields: [${fkA}]`,
        `references: [id]`
      ]);
      builder.model(modelA).field(import_pluralize2.default.plural(camelCase(modelB)), `${pivotModelName}[]`).attribute("relation", [relationName]);
      return response.result(`One-to-Many relation (with pivot table) added between ${modelA} and ${modelB}`);
    }
  }
  if (type == "M:N") {
    if (!pivotTable) {
      const toKey = import_pluralize2.default.plural(camelCase(modelB));
      const fromKey = import_pluralize2.default.plural(selfPrefix(modelA));
      builder.model(modelA).field(toKey, `${modelB}[]`).attribute("relation", [relationName]);
      builder.model(modelB).field(fromKey, `${modelA}[]`).attribute("relation", [relationName]);
      return response.result(`Many-to-Many relation (without pivot table) added between ${modelA} and ${modelB}`);
    } else {
      const customSelfPrefix = (str) => {
        return isSelfRelation ? str + "By" : str;
      };
      const toPluralKey = import_pluralize2.default.plural(camelCase(modelB));
      const fromPluralKey = import_pluralize2.default.plural(selfPrefix(modelA));
      const aModelBuilder = builder.model(modelA).field(toPluralKey, `${pivotModelName}[]`).attribute("relation", [relationName]);
      const bModelBuilder = isSelfRelation ? aModelBuilder : builder.model(modelB);
      bModelBuilder.field(fromPluralKey, `${pivotModelName}[]`).attribute("relation", [`"${customSelfPrefix(sourceRelationName)}"`]);
      const fkA = selfPrefix(modelA, true);
      const fkB = fk(modelB);
      const toKey = camelCase(modelB);
      const fromKey = selfPrefix(modelA);
      const idFieldModelA = helper.getIdFieldTypeModel(modelA) || "String";
      const idFieldModelB = helper.getIdFieldTypeModel(modelB) || "String";
      builder.model(pivotModelName).field(fkA, idFieldModelA).field(fkB, idFieldModelB).field("createdAt", "DateTime").attribute("default", ["now()"]).field(fromKey, modelA).attribute("relation", [
        `"${customSelfPrefix(sourceRelationName)}"`,
        `fields: [${fkA}]`,
        `references: [id]`,
        `onDelete: Cascade`
      ]).field(toKey, modelB).attribute("relation", [
        relationName,
        `fields: [${fkB}]`,
        `references: [id]`,
        `onDelete: Cascade`
      ]).blockAttribute("id", [fkA, fkB]);
    }
    return response.result(`Many-to-Many relation (with pivot table) added for ${modelA} and ${modelB}`);
  }
  return response.error("Not implemented");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addRelation
});
