var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/modules/dsl.ts
var DSL_PATTERN = /^([A-Z]+)(?:\s+([A-Z_]+))?(?:\s+([\w\s,*]+))?(?:\s*\(\{([\s\S]*?)\}\))?(?:\s*\(([^)]*?)\))?$/i;
var ACTION_COMMAND_MAP = {
  GET: ["MODELS", "MODEL", "ENUM_RELATIONS", "FIELDS", "RELATIONS", "ENUMS", "MODELS_LIST"],
  ADD: ["MODEL", "FIELD", "RELATION", "ENUM"],
  DELETE: ["MODEL", "FIELD", "RELATION", "ENUM"],
  UPDATE: ["FIELD", "ENUM"],
  PRINT: [],
  VALIDATE: []
};
var PrismaQlDslParser = class {
  constructor(argsProcessors) {
    this.argsProcessors = argsProcessors;
  }
  customCommands = {};
  actionTypeMap = {
    GET: "query",
    ADD: "mutation",
    DELETE: "mutation",
    UPDATE: "mutation",
    PRINT: "query",
    VALIDATE: "query"
  };
  registerCommand(action, command, type) {
    if (!this.customCommands[action]) {
      this.customCommands[action] = [];
    }
    this.customCommands[action].push(command);
    this.actionTypeMap[action] = type;
  }
  getCommands() {
    return {
      ...ACTION_COMMAND_MAP,
      ...this.customCommands
    };
  }
  parseCommand(input) {
    const trimmed = input.trim();
    if (!trimmed.endsWith(";")) {
      throw new Error("DSL command must end with a semicolon.");
    }
    const raw = trimmed.slice(0, -1).trim();
    const match = raw.match(DSL_PATTERN);
    if (!match) {
      throw new Error(`Unable to parse DSL line: "${raw}"`);
    }
    const actionStr = match[1].toUpperCase();
    const commandStr = match[2]?.toUpperCase();
    const argsStr = match[3]?.trim() || void 0;
    let prismaBlockStr = match[4]?.trim() || void 0;
    if (prismaBlockStr) {
      prismaBlockStr = prismaBlockStr.replace(/'/g, '"');
      prismaBlockStr = prismaBlockStr.replace(/'/g, '"');
      prismaBlockStr = prismaBlockStr.replace(/\\n/g, "\n");
      prismaBlockStr = prismaBlockStr.replace(/\|/g, "\n");
    }
    const optionsStr = match[5]?.trim() || void 0;
    if (!(actionStr in ACTION_COMMAND_MAP) && !(actionStr in this.customCommands)) {
      throw new Error(`Unsupported action "${actionStr}". Supported actions: ${Object.keys(ACTION_COMMAND_MAP).join(", ")}`);
    }
    let finalCommand;
    const actionKey = actionStr;
    const commands = this.getCommands();
    const availableCommands = commands[actionKey] || [];
    if (commandStr) {
      if (!availableCommands.includes(commandStr)) {
        throw new Error(`Invalid command "${commandStr}" for action "${actionStr}". Supported: ${availableCommands.join(", ")}`);
      }
      finalCommand = commandStr;
    }
    const parsedOptions = optionsStr ? this.parseParams(optionsStr) : void 0;
    const baseArgs = this.parseArgs(argsStr);
    const argsProcessor = this.argsProcessors[actionStr][finalCommand || "default"];
    const finalArgs = argsProcessor ? argsProcessor(baseArgs, argsStr) : baseArgs;
    return {
      action: actionStr,
      command: finalCommand,
      args: finalArgs,
      options: parsedOptions,
      prismaBlock: prismaBlockStr,
      raw: input,
      type: this.actionTypeMap[actionStr]
    };
  }
  parseParams(input) {
    const result = {};
    const tokens = input.split(",").map((t) => t.trim()).filter(Boolean);
    for (const token of tokens) {
      const eqIndex = token.indexOf("=");
      if (eqIndex > 0) {
        const key = token.slice(0, eqIndex).trim();
        let valueStr = token.slice(eqIndex + 1).trim();
        if (/^\d+$/.test(valueStr)) {
          result[key] = parseInt(valueStr, 10);
        }
        if (valueStr === "true") {
          result[key] = true;
        } else if (valueStr === "false") {
          result[key] = false;
        } else {
          result[key] = valueStr;
        }
        if (valueStr.includes(",")) {
          result[key] = valueStr.split(",").map((v) => v.trim());
        } else {
          try {
            result[key] = JSON.parse(valueStr);
          } catch (e) {
            result[key] = valueStr;
          }
        }
      } else {
        const flag = token.trim();
        result[flag] = true;
      }
    }
    return result;
  }
  parseArgs(argsStr) {
    const args = {};
    if (!argsStr) return args;
    const tokens = argsStr.split(",").map((t) => t.trim()).filter(Boolean);
    for (const token of tokens) {
      args.models = args.models || [];
      args.models.push(token);
    }
    return args;
  }
  detectActionType(source) {
    const DSL_ACTION_PATTERN = /^([A-Z]+)/i;
    const match = source.match(DSL_ACTION_PATTERN);
    if (!match) return null;
    const actionStr = match[1].toUpperCase();
    return this.actionTypeMap[actionStr] || null;
  }
  isValid(source) {
    try {
      this.parseCommand(source);
      return true;
    } catch (e) {
      return e;
    }
  }
};
var basePrismaQlAgsProcessor = {
  GET: {
    default: (parsedArgs) => parsedArgs,
    MODEL: (parsedArgs, rawArgs) => {
      if (rawArgs?.includes("IN")) {
        return { models: [rawArgs.split("IN")[1].trim()] };
      }
      return parsedArgs;
    },
    MODELS: (_, rawArgs) => {
      return { models: rawArgs ? rawArgs.split(",").map((m) => m.trim()) : [] };
    },
    RELATIONS: (_, rawArgs) => {
      return { models: rawArgs ? rawArgs.split(",").map((r) => r.trim()) : [] };
    },
    FIELDS: (parsedArgs, rawArgs) => {
      const [fieldsStr, modelName] = rawArgs?.split("IN") || [];
      if (!fieldsStr || !modelName) return parsedArgs;
      return { models: [modelName.trim()], fields: fieldsStr.split(",").map((f) => f.trim()) };
    },
    ENUMS: (_, rawArgs) => {
      return { enums: rawArgs ? rawArgs.split(",").map((e) => e.trim()) : [] };
    },
    ENUM_RELATIONS: (_, rawArgs) => {
      return { enums: rawArgs ? rawArgs.split(",").map((e) => e.trim()) : [] };
    }
  },
  ADD: {
    default: (parsedArgs) => parsedArgs,
    MODEL: (_, rawArgs) => {
      return { models: rawArgs ? rawArgs.split(",").map((m) => m.trim()) : [] };
    },
    ENUM: (_, rawArgs) => {
      return { enums: rawArgs ? rawArgs.split(",").map((e) => e.trim()) : [] };
    },
    FIELD: (parsedArgs, rawArgs) => {
      const [fieldName, modelName] = rawArgs?.split("TO") || [];
      if (!fieldName || !modelName) return parsedArgs;
      return { models: [modelName.trim()], fields: [fieldName.trim()] };
    },
    RELATION: (parsedArgs, rawArgs) => {
      const [fromModel, toModel] = rawArgs?.split("TO") || [];
      if (!fromModel || !toModel) return parsedArgs;
      return { models: [fromModel.trim(), toModel.trim()] };
    }
  },
  DELETE: {
    default: (parsedArgs) => parsedArgs,
    MODEL: (_, rawArgs) => {
      return { models: rawArgs ? rawArgs.split(",").map((m) => m.trim()) : [] };
    },
    ENUM: (_, rawArgs) => {
      return { enums: rawArgs ? rawArgs.split(",").map((e) => e.trim()) : [] };
    },
    FIELD: (parsedArgs, rawArgs) => {
      const [fieldName, modelName] = rawArgs?.split("IN") || [];
      if (!fieldName || !modelName) return parsedArgs;
      return { models: [modelName.trim()], fields: [fieldName.trim()] };
    },
    RELATION: (_, rawArgs) => {
      return { models: rawArgs ? rawArgs.split(",").map((e) => e.trim()) : [] };
    }
  },
  UPDATE: {
    default: (parsedArgs) => parsedArgs,
    FIELD: (parsedArgs, rawArgs) => {
      const [fieldName, modelName, prismaBlock] = rawArgs?.split("IN") || [];
      if (!fieldName || !modelName) return parsedArgs;
      return {
        models: [modelName.trim()],
        fields: [fieldName.trim()],
        prismaBlock: prismaBlock?.trim()
      };
    },
    ENUM: (_, rawArgs) => {
      return { enums: rawArgs ? rawArgs.split(",").map((e) => e.trim()) : [] };
    }
  },
  PRINT: {
    default: (parsedArgs) => parsedArgs
  },
  VALIDATE: {
    default: (parsedArgs) => parsedArgs
  }
};
var prismaQlParser = new PrismaQlDslParser(basePrismaQlAgsProcessor);

// src/modules/prisma-schema-loader.ts
import fs2 from "fs";
import fsx from "fs-extra";
import path2 from "path";
import { getSchema, createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";

// src/modules/utils/prisma-validation.ts
import pkg from "@prisma/internals";
var { getDMMF } = pkg;
async function validatePrismaSchema(schema) {
  try {
    await getDMMF({ datamodel: schema });
    return true;
  } catch (error) {
    return error;
  }
}

// src/modules/utils/load-prisma-schema.ts
import fs from "fs";
import path from "path";
var loadPrismaSchema = async (inputPath) => {
  const cwd = process.cwd();
  let schemaPath = null;
  if (inputPath) {
    const resolvedPath = path.isAbsolute(inputPath) ? inputPath : path.resolve(cwd, inputPath);
    if (fs.existsSync(resolvedPath)) {
      const stat = fs.statSync(resolvedPath);
      if (stat.isDirectory()) {
        const possibleSchemaPaths = [
          path.join(resolvedPath, "prisma", "schema.prisma"),
          path.join(resolvedPath, "schema.prisma")
        ];
        schemaPath = possibleSchemaPaths.find(fs.existsSync) || null;
      } else if (stat.isFile()) {
        schemaPath = resolvedPath;
      }
    }
    if (!schemaPath) {
      throw new Error(`\u274C Path "${inputPath}" does not point to a valid Prisma schema file or directory.`);
    }
  } else {
    const possibleSchemaPaths = [
      path.join(cwd, "prisma", "schema.prisma"),
      path.join(cwd, "schema.prisma")
    ];
    schemaPath = possibleSchemaPaths.find(fs.existsSync) || null;
  }
  if (!schemaPath) {
    throw new Error(`\u274C Prisma schema file not found. Please ensure that the schema.prisma file exists in the "prisma" directory or provide a valid path.`);
  }
  const schemaContent = await fs.promises.readFile(schemaPath, "utf-8");
  if (!/^\s*(generator|datasource|client)\b/m.test(schemaContent)) {
    throw new Error(`\u274C The file at "${schemaPath}" does not appear to be a valid Prisma schema.`);
  }
  return { schema: schemaContent, path: schemaPath };
};

// src/modules/prisma-schema-loader.ts
import pkg2 from "@prisma/internals";
import { PrismaHighlighter } from "prismalux";
import chalk from "chalk";
var { getDMMF: getDMMF2 } = pkg2;
var HighlightPrismaSchema = new PrismaHighlighter();
var PrismaQlSchemaLoader = class {
  constructor(relationCollector, options = {}) {
    this.relationCollector = relationCollector;
    this.options = options;
    if (options.backupPath) {
      this.backupPath = options.backupPath;
    }
  }
  lastValidatedSchema = null;
  prismaState = null;
  backupPath = null;
  async rebase() {
    const schema = this.prismaState?.builder.print({ sort: true });
    const parsedSchema = getSchema(schema);
    const builder = createPrismaSchemaBuilder(schema);
    this.setPrismaState({ schemaPath: this.prismaState?.schemaPath, schema, ast: parsedSchema, builder, relations: this.relationCollector.getRelations() });
    await this.collectRelations();
  }
  getSchemaPath() {
    return this.prismaState?.schemaPath;
  }
  setPrismaState(newState) {
    this.prismaState = newState;
  }
  async loadFromFile(filePath, forceReload = false) {
    if (this.prismaState && !forceReload) {
      return this.prismaState;
    }
    const { schema, path: path3 } = await loadPrismaSchema(filePath);
    return this.prepareSchema(schema, path3);
  }
  async collectRelations() {
    const prismaSchema = this.prismaState?.schema || "";
    const dmmf = await getDMMF2({ datamodel: prismaSchema });
    const models = dmmf.datamodel.models;
    return this.relationCollector.setModels(models);
  }
  async prepareSchema(sourcePrismaSchema, schemaPath) {
    const isValid = await this.isValid(sourcePrismaSchema);
    if (isValid instanceof Error) {
      throw isValid;
    }
    const parsedSchema = getSchema(sourcePrismaSchema);
    const builder = createPrismaSchemaBuilder(sourcePrismaSchema);
    this.setPrismaState({ schemaPath: schemaPath || "", schema: sourcePrismaSchema, ast: parsedSchema, builder, relations: this.relationCollector.getRelations() });
    await this.collectRelations();
    return this.prismaState;
  }
  loadFromText(sourcePrismaSchema) {
    return this.prepareSchema(sourcePrismaSchema);
  }
  async getState() {
    if (!this.prismaState) {
      await this.loadFromFile();
    }
    const relations = this.relationCollector.getRelations();
    return {
      ...this.prismaState || {},
      relations
    };
  }
  clonePrismaState() {
    if (!this.prismaState) {
      throw new Error("No schema loaded.");
    }
    const { schema: sourcePrismaSchema, schemaPath } = this.prismaState;
    const cloneBuilder = createPrismaSchemaBuilder(sourcePrismaSchema);
    const parsedSchema = getSchema(sourcePrismaSchema);
    return { schemaPath, schema: sourcePrismaSchema, ast: parsedSchema, builder: cloneBuilder, relations: this.relationCollector.getRelations() };
  }
  async save(commits, sourcePath) {
    if (!this.prismaState) {
      throw new Error("No schema loaded to save. Please load a schema first.");
    }
    const messages = Array.isArray(commits) ? commits : [commits];
    console.log(`\u{1F504} Saving schema with ${messages.length} commit(s):`);
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const commitNumber = i + 1;
      console.log(chalk.grey(`Commit ${commitNumber}:`), chalk.cyanBright(message));
    }
    let outputPath = sourcePath;
    if (sourcePath && !path2.isAbsolute(sourcePath)) {
      outputPath = path2.join(process.cwd(), sourcePath);
    }
    if (!this.prismaState?.schemaPath && !outputPath) {
      throw new Error("Cannot save schema without a path, please provide a path!");
    }
    try {
      this.check();
    } catch (e) {
      throw new Error("Cannot save invalid schema. Please fix the schema before saving.");
    }
    const finalPath = outputPath || this.prismaState.schemaPath;
    if (!finalPath) {
      throw new Error("Cannot save schema without a path, please provide a path!");
    }
    if (fs2.existsSync(finalPath)) {
      const backupDir = this.backupPath ? this.backupPath : path2.join(path2.dirname(finalPath), ".prisma", "backups");
      fsx.ensureDirSync(backupDir);
      const backupPath = path2.join(backupDir, `${path2.basename(finalPath)}_${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.bak.prisma`);
      fsx.copyFileSync(finalPath, backupPath);
    }
    const updatedsourcePrismaSchema = this.prismaState.builder.print({ sort: true });
    fs2.writeFileSync(finalPath, updatedsourcePrismaSchema, "utf-8");
    console.log(chalk.greenBright(`\u2705 Schema saved successfully to ${finalPath}`));
    console.log(chalk.grey(`\u{1F4C5} Timestamp: ${(/* @__PURE__ */ new Date()).toLocaleString()}`));
  }
  print() {
    if (!this.prismaState) {
      return "No schema loaded.";
    }
    return HighlightPrismaSchema.highlight(this.prismaState.builder.print({ sort: true }));
  }
  async isValid(sourceSchema) {
    if (!sourceSchema && !this.prismaState) {
      throw new Error("No schema loaded.");
    }
    const sourcePrismaSchema = sourceSchema || this.prismaState?.builder.print({ sort: true });
    if (!sourcePrismaSchema) {
      return new Error("No schema content provided.");
    }
    if (this.lastValidatedSchema === sourcePrismaSchema) {
      return true;
    }
    const validation = await validatePrismaSchema(sourcePrismaSchema);
    if (validation === true) {
      this.lastValidatedSchema = sourcePrismaSchema;
    } else {
      this.lastValidatedSchema = null;
    }
    return validation;
  }
  check() {
    if (!this.prismaState) {
      throw new Error("No schema loaded.");
    }
    this.isValid();
  }
};

// src/modules/field-relation-collector.ts
import pkg3 from "@prisma/internals";
import pluralize from "pluralize";
import { pascalCase } from "change-case";
var { getDMMF: getDMMF3 } = pkg3;
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
        fieldName: pluralize(model1.name),
        // Example: "posts"
        modelName: model1.name,
        relatedModel: model2.name,
        relationName: relation1.relationName,
        foreignKey: relation1.relationFromFields.join(", "),
        referenceKey: relation1.relationToFields?.join(", "),
        inverseField: pluralize(model2.name.toLowerCase()),
        // Example: "categories"
        relationDirection: "bidirectional",
        relationTable: model.name,
        // The join table
        constraints: [...relation1.relationFromFields, ...relation2.relationFromFields]
      });
      relations.push({
        type: "M:N",
        fieldName: pluralize(model2.name),
        modelName: model2.name,
        relatedModel: model1.name,
        relationName: relation2.relationName,
        foreignKey: relation2.relationFromFields.join(", "),
        referenceKey: relation2.relationToFields?.join(", "),
        inverseField: pluralize(model1.name.toLowerCase()),
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
        inverseField: `${pluralize(model1.name)}, ${pluralize(model2.name)}`,
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
    const dmmf = schema ? await getDMMF3({ datamodel: schema }) : null;
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

// src/modules/field-relation-logger.ts
import treeify from "treeify";
import chalk2 from "chalk";
import boxen from "boxen";
import pkg4 from "@prisma/internals";
import fs3 from "fs";
var { getDMMF: getDMMF4 } = pkg4;
var collector = new PrismaQlRelationCollector();
var PrismaQlFieldRelationLogger = class {
  relations;
  setRelations(relations) {
    this.relations = relations;
  }
  constructor(relations) {
    if (relations) {
      this.setRelations(relations);
    }
  }
  buildJsonModelTrees(rootModel, relations, maxDepth, depth = 0, visitedModels = /* @__PURE__ */ new Set()) {
    if (depth > maxDepth || visitedModels.has(rootModel)) {
      return { trees: [], models: /* @__PURE__ */ new Set(), relations: /* @__PURE__ */ new Set() };
    }
    visitedModels.add(rootModel);
    let trees = [];
    let models = /* @__PURE__ */ new Set();
    let relationsSet = /* @__PURE__ */ new Set();
    const modelRelations = relations.filter((rel) => rel.modelName === rootModel);
    let relationNodes = [];
    for (const relation of modelRelations) {
      const isSelfRelation = relation.modelName === relation.relatedModel;
      const isList = (relation.type === "1:M" || relation.type === "M:N") && !relation.foreignKey;
      let relationNode = {
        relatedModel: relation.relatedModel,
        field: relation.fieldName || relation.modelName,
        type: relation.type,
        alias: relation.fieldName || relation.relationName,
        foreignKey: relation.foreignKey,
        referenceKey: relation.referenceKey,
        relationTable: relation.relationTable,
        inverseField: relation.inverseField,
        constraints: relation.constraints || [],
        isSelfRelation,
        isList
      };
      models.add(rootModel);
      models.add(relation.relatedModel);
      relationsSet.add(`${rootModel} -> ${relation.relatedModel}`);
      const subTree = this.buildJsonModelTrees(relation.relatedModel, relations, maxDepth, depth + 1, visitedModels);
      if (subTree.trees.length > 0) {
        relationNode.subTree = subTree.trees[0];
      }
      relationNodes.push(relationNode);
    }
    trees.push({ model: rootModel, relations: relationNodes });
    return { trees, models, relations: relationsSet };
  }
  buildModelTrees(rootModel, relations, maxDepth, depth = 0, visitedModels = /* @__PURE__ */ new Set()) {
    if (depth > maxDepth || visitedModels.has(rootModel)) return { trees: [], models: /* @__PURE__ */ new Set(), relations: /* @__PURE__ */ new Set() };
    visitedModels.add(rootModel);
    let trees = [];
    let models = /* @__PURE__ */ new Set();
    let relationsSet = /* @__PURE__ */ new Set();
    const modelRelations = relations.filter((rel) => rel.modelName === rootModel);
    let table = {};
    for (const relation of modelRelations) {
      const relationType = relation.type;
      const name = relation.fieldName || relation.modelName;
      const relationAlias = `(as ${relation.fieldName || relation.relationName})`;
      const isSelfRelation = relation.modelName === relation.relatedModel;
      const selfRelationIcon = isSelfRelation ? chalk2.yellow("\u{1F501}") : "";
      let keyInfo = chalk2.gray("[-]");
      if (relation.foreignKey) {
        const direction = relation.relationDirection === "backward" ? "\u2190" : "\u2192";
        keyInfo = `[FK: ${chalk2.blue(relation.foreignKey)} ${direction} ${chalk2.green(relation.referenceKey || "id")}]`;
      } else if (relation.relationTable) {
        keyInfo = `[M:N via ${chalk2.yellow(relation.relationTable)}]`;
      }
      if (relation.relationTable && relation.relationTable !== relation.modelName) {
        if (!table[relation.relationTable]) {
          table[relation.relationTable] = {};
        }
        table[relation.relationTable][`\u2192 ${chalk2.yellow(relation.modelName)}:${chalk2.cyan(relation.fieldName)} [FK: ${chalk2.blue(relation.foreignKey || "?")} \u2192 ${chalk2.green(relation.referenceKey || "?")}]`] = {};
        table[relation.relationTable][`\u2192 ${chalk2.yellow(relation.relatedModel)}:${chalk2.cyan(relation.inverseField)} [FK: ${chalk2.blue(relation.foreignKey || "?")} \u2192 ${chalk2.green(relation.referenceKey || "?")}]`] = {};
      }
      const constraints = relation?.constraints?.length ? `Constraints: ${chalk2.magenta(relation.constraints.join(", "))}` : "";
      const isList = (relationType === "1:M" || relationType === "M:N") && !relation?.foreignKey;
      let relationLabel = `\u2192 ${chalk2.yellow(relation.relatedModel + (isList ? "[]" : ""))}:${chalk2.cyan(name)} ${relationAlias} ${chalk2.red(relationType)} ${keyInfo} ${constraints} ${selfRelationIcon}`;
      if (!table[relationLabel]) {
        table[relationLabel] = {};
      }
      models.add(rootModel);
      models.add(relation.relatedModel);
      relationsSet.add(`${rootModel} -> ${relation.relatedModel}`);
    }
    trees.push({ [chalk2.bold(rootModel)]: table });
    for (const relation of modelRelations) {
      const subTree = this.buildModelTrees(relation.relatedModel, relations, maxDepth, depth + 1, visitedModels);
      trees = trees.concat(subTree.trees);
      subTree.models.forEach((m) => models.add(m));
      subTree.relations.forEach((r) => relationsSet.add(r));
    }
    return { trees, models, relations: relationsSet };
  }
  getRelationStatistics(modelName, maxDepth = 1) {
    if (!this.relations?.length) {
      throw new Error("No relations found. Please run relation-collector first and use the setRelations method to set the relations.");
    }
    let relatedModels = /* @__PURE__ */ new Set();
    let relationCount = 0;
    const exploreRelations = (currentModel, depth) => {
      if (depth > maxDepth || relatedModels.has(currentModel)) return;
      relatedModels.add(currentModel);
      for (const rel of this.relations.filter((r) => r.modelName === currentModel)) {
        relationCount++;
        exploreRelations(rel.relatedModel, depth + 1);
      }
    };
    exploreRelations(modelName, 1);
    return {
      uniqueModels: relatedModels.size,
      // Number of unique models
      totalRelations: relationCount,
      // Total number of relations
      maxDepth
      // Depth passed from outside
    };
  }
  collectRelationStatistics(models, relations, rootModel, maxDepth) {
    const directRelations = rootModel ? [...relations].filter((r) => r.startsWith(rootModel)) : [...relations];
    return {
      uniqueModels: models.size,
      totalRelations: relations.size,
      directRelations: directRelations.length,
      maxDepth
    };
  }
  async parseSchemaAndSetRelations(schema) {
    const dmmf = await getDMMF4({ datamodel: schema });
    const models = dmmf.datamodel.models;
    this.setRelations(await collector.setModels(models));
    return this.relations;
  }
  async provideRelationsFromBuilder(builder) {
    const schema = builder.print({ sort: true });
    return this.parseSchemaAndSetRelations(schema);
  }
  async provideRelationsFromSchema(schema) {
    return this.parseSchemaAndSetRelations(schema);
  }
  async privideRelationByPrismaPath(prismaPath) {
    const prismaSchemaContent = fs3.readFileSync(prismaPath, "utf-8");
    return this.parseSchemaAndSetRelations(prismaSchemaContent);
  }
  generateRelationTreeLog(rootModel, maxDepth = 1, relations) {
    if (relations?.length) {
      this.setRelations(relations);
    }
    if (!this.relations?.length) {
      throw new Error("No relations found.");
    }
    const { models, relations: rels, trees } = this.buildModelTrees(rootModel, this.relations, maxDepth);
    const stats = this.collectRelationStatistics(models, rels, rootModel, maxDepth);
    let output = `${chalk2.green.bold("\u{1F4CA} Relation Tree Statistics")}
`;
    output += `${chalk2.yellow("Model:")} ${chalk2.bold(rootModel)}
`;
    output += `${chalk2.cyan("Max Depth:")} ${chalk2.bold(maxDepth)}
`;
    output += `${chalk2.blue("Related Models:")} ${chalk2.bold(stats.uniqueModels)}
`;
    output += `${chalk2.magenta("Total Relations:")} ${chalk2.bold(stats.totalRelations)}
`;
    output += `${chalk2.redBright("Direct Relations:")} ${chalk2.bold(stats.directRelations)}
`;
    let treeOutput = "";
    for (const tree of trees) {
      treeOutput += treeify.asTree(tree, true, true) + "\n";
    }
    const results = [...rels.values()].filter((el) => {
      return el.startsWith(rootModel) || el.endsWith(rootModel);
    }).map((r) => chalk2.gray(r)).join("\n");
    const relsList = `${chalk2.white.bold("\u{1F517} Direct Relations")}
${results}`;
    return boxen(output.trim() + "\n" + treeOutput.trim() + `

${relsList}`, {
      padding: 1,
      borderColor: "green",
      borderStyle: "round"
    });
  }
};
var getRelationStatistics = (relations, modelName, maxDepth = 1) => {
  let relatedModels = /* @__PURE__ */ new Set();
  let relationCount = 0;
  const exploreRelations = (currentModel, depth) => {
    if (depth > maxDepth || relatedModels.has(currentModel)) return;
    relatedModels.add(currentModel);
    for (const rel of relations.filter((r) => r.modelName === currentModel)) {
      relationCount++;
      exploreRelations(rel.relatedModel, depth + 1);
    }
  };
  exploreRelations(modelName, 1);
  return {
    uniqueModels: relatedModels.size,
    // Number of unique models
    totalRelations: relationCount,
    // Total number of relations
    maxDepth
    // Depth passed from outside
  };
};

// src/modules/prisma-ql-provider.ts
import chalk3 from "chalk";

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
var PrismaQlHandlerRegistry = class {
  handlers = {};
  constructor(initialHandlers) {
    if (initialHandlers) {
      this.handlers = { ...initialHandlers };
    }
  }
  register(action, command, handler) {
    this.handlers[action + "_" + command] = handler;
  }
  execute(action, command, prismaState, dsl) {
    const handler = this.handlers[action + "_" + command];
    if (!handler) {
      throw new Error(`Handler for command "${command}" not found.`);
    }
    return handler(prismaState, dsl);
  }
};

// src/modules/prisma-ql-provider.ts
import { PrismaHighlighter as PrismaHighlighter2 } from "prismalux";
var highlightPrismaSchema = new PrismaHighlighter2();
var PrismaQlProvider = class {
  queryHandler;
  mutationHandler;
  loader;
  mutationState = [];
  constructor(config) {
    this.queryHandler = config.queryHandler;
    this.mutationHandler = config.mutationHandler;
    this.loader = config.loader;
  }
  async multiApply(commands, options = {}) {
    const commandsArray = Array.isArray(commands) ? commands : commands.split(";").map((c) => c.trim()).filter((c) => c.length > 0).map((c) => c + ";");
    const responses = [];
    for (const command of commandsArray) {
      try {
        const result = await this.apply(command);
        if (result?.response?.error) {
          throw new Error("string" === typeof result.response.error ? result.response.error : "Error applying command");
        }
        responses.push(result);
      } catch (e) {
        console.log(chalk3.red(`Error processing command: ${e.message}`));
        throw e;
      }
    }
    const hasMutations = responses.some((r) => r.parsedCommand.type === "mutation");
    if (options.confirm && options.save && hasMutations && !options.dryRun) {
      const confirmed = await options.confirm(highlightPrismaSchema.highlight(this.loader.print()));
      if (confirmed) {
        await this.save();
      }
    }
    return responses.map((r) => r.response);
  }
  async apply(input, options) {
    const parsedCommand = "string" === typeof input ? this.parseCommand(input) : input;
    if (parsedCommand.type === "query") {
      return {
        parsedCommand,
        response: await this.query(parsedCommand)
      };
    }
    if (parsedCommand.type === "mutation") {
      return {
        parsedCommand,
        response: await this.mutation(parsedCommand, options)
      };
    }
    throw new Error(`Invalid command type: expected "query" or "mutation", got "${parsedCommand.type}"`);
  }
  async query(input) {
    const parsedCommand = "string" === typeof input ? this.parseCommand(input) : input;
    if (parsedCommand.type !== "query") {
      throw new Error(`Invalid command type: expected "query", got "${parsedCommand.type}"`);
    }
    if (!parsedCommand.command) {
      const isPrint = parsedCommand.action === "PRINT";
      const isValidate = parsedCommand.action === "VALIDATE";
      if (!isPrint && !isValidate) {
        throw new Error(`Invalid command: command is required`);
      }
      if (isPrint) {
        return handlerResponse(parsedCommand).result(this.loader.print());
      }
      if (isValidate) {
        return handlerResponse(parsedCommand).result(await this.loader.isValid());
      }
    }
    return this.queryHandler.execute(parsedCommand.action, parsedCommand.command, this.loader.clonePrismaState(), parsedCommand);
  }
  async dryMutation(input) {
    const parsedCommand = "string" == typeof input ? this.parseCommand(input) : input;
    if (parsedCommand.type !== "mutation") {
      throw new Error(`Invalid command type: expected "mutation", got "${parsedCommand.type}"`);
    }
    const clone = this.loader.clonePrismaState();
    const displayCommand = `${parsedCommand.action} ${parsedCommand.command} >`;
    try {
      const result = await this.mutationHandler.execute(parsedCommand.action, parsedCommand.command, clone, parsedCommand);
      if (result?.error) {
        if ("string" === typeof result.error) {
          throw new Error(result.error);
        } else {
          throw result.error;
        }
      }
      console.log("\u2705", chalk3.gray(displayCommand), chalk3.green(`Dry run success!`));
    } catch (e) {
      throw new Error(`Modification failed: ${e.message}`);
    }
    const updatedSchema = clone.builder.print({ sort: true });
    const validation = await validatePrismaSchema(updatedSchema);
    if (validation instanceof Error) {
      throw new Error(`Modification failed: ${validation.message}`);
    }
    console.log("\u2705", chalk3.gray(displayCommand), chalk3.green(`Validation success!`));
    return updatedSchema;
  }
  async mutation(input, options = {}) {
    const parsedCommand = "string" === typeof input ? this.parseCommand(input) : input;
    if (parsedCommand.type !== "mutation") {
      throw new Error(`Invalid command type: expected "mutation", got "${parsedCommand.type}"`);
    }
    const updatedSchema = await this.dryMutation(input);
    if (!updatedSchema) {
      return handlerResponse(parsedCommand).error(`Dry run failed`);
    }
    if (options.dryRun) {
      return handlerResponse(parsedCommand).result(highlightPrismaSchema.highlight(updatedSchema));
    }
    if (options.confirm) {
      const message = `${highlightPrismaSchema.highlight(updatedSchema)}`;
      const confirmed = await options.confirm(message);
      if (!confirmed) {
        return handlerResponse(parsedCommand).error(`Modification cancelled`);
      }
    }
    try {
      const state = await this.loader.getState();
      this.mutationHandler.execute(parsedCommand.action, parsedCommand.command, state, parsedCommand);
      this.mutationState.push(parsedCommand);
      const displayCommand = `${parsedCommand.action} ${parsedCommand.command} > `;
      console.log("\u2705", chalk3.white(displayCommand), chalk3.green("Mutation success"));
    } catch (e) {
      throw new Error(`Modification failed: ${e.message}`);
    }
    if (options.save) {
      await this.save();
    }
    await this.loader.rebase();
    return handlerResponse(parsedCommand).result(highlightPrismaSchema.highlight(updatedSchema));
  }
  async save() {
    if (this.mutationState.length === 0) {
      return;
    }
    const messages = this.mutationState.map((mutation) => mutation.raw);
    this.loader.save(messages);
    this.mutationState = [];
  }
  parseCommand(input) {
    return prismaQlParser.parseCommand(input);
  }
};

// src/modules/utils/model-primary-fields.ts
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

// src/modules/handler-registries/query-handler-registry.ts
var PrismaQlQueryHandlerRegistry = class extends PrismaQlHandlerRegistry {
  constructor(initialHandlers) {
    super(initialHandlers);
  }
};

// src/modules/handler-registries/mutation-handler-registry.ts
var PrismaQlMutationHandlerRegistry = class extends PrismaQlHandlerRegistry {
  constructor(initialHandlers) {
    super(initialHandlers);
  }
};

// src/modules/prehandlers/render-handlers/index.ts
var render_handlers_exports = {};
__export(render_handlers_exports, {
  formatColumns: () => formatColumns,
  getEnumRelations: () => getEnumRelations,
  getEnums: () => getEnums,
  getFields: () => getFields,
  getModel: () => getModel,
  getModelNames: () => getModelNames,
  getModels: () => getModels,
  getRelations: () => getRelations,
  sortModelNames: () => sortModelNames
});

// src/modules/prehandlers/render-handlers/get-enum-relations.ts
import chalk5 from "chalk";
import boxen3 from "boxen";

// src/modules/prehandlers/render-handlers/get-model-names.ts
import chalk4 from "chalk";
import boxen2 from "boxen";
var formatColumns = (items, columns = 2) => {
  const columnWidth = Math.max(...items.map((name) => name.length)) + 2;
  const rows = Math.ceil(items.length / columns);
  let output = "";
  for (let i = 0; i < rows; i++) {
    let rowItems = [];
    for (let j = 0; j < columns; j++) {
      const index = i + j * rows;
      if (index < items.length) {
        rowItems.push(items[index].padEnd(columnWidth));
      }
    }
    output += rowItems.join("  ") + "\n";
  }
  return output.trim();
};
var sortModelNames = (modelNames) => {
  modelNames.sort((a, b) => a.localeCompare(b));
};
var getModelNames = (prismaState, data) => {
  const response = handlerResponse(data);
  const models = useHelper(prismaState).getModels();
  if (models.length === 0) {
    return response.result(chalk4.red.bold("\u274C No models in Prisma schema."));
  }
  const modelNames = models.map((model) => model.name);
  sortModelNames(modelNames);
  const columns = modelNames.length > 6 ? 3 : 2;
  const stats = `${chalk4.white("\u{1F4CA} Total models:")} ${chalk4.white.bold(modelNames.length)}`;
  const formattedModels = formatColumns(modelNames.map((name) => `${chalk4.hex("#11FF00")("\u2022")} ${chalk4.bold(name)}`), columns);
  return response.result(boxen2(`${stats}

${formattedModels}`, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "cyan",
    title: "Prisma Models",
    titleAlignment: "center"
  }));
};

// src/modules/prehandlers/render-handlers/get-enum-relations.ts
var getEnumRelations = (prismaState, data) => {
  const response = handlerResponse(data);
  const helper = useHelper(prismaState);
  const { args } = data;
  const enumName = args?.enums?.[0];
  if (!enumName) {
    return response.error("No enum name provided. Example usage: GET ENUM_RELATIONS -> [EnumName];");
  }
  const _enum = helper.getEnumByName(enumName);
  if (!_enum) {
    return response.error(`Enum ${enumName} not found`);
  }
  const relations = helper.getEnumRelations(enumName);
  const total = relations.length;
  if (!total) {
    return response.result(`Enum ${enumName} has no relations`);
  }
  const columns = relations.length > 6 ? 3 : 2;
  const formattedModels = formatColumns(relations.map((rel) => `${chalk5.hex("#11FF00")("\u2022")} ${chalk5.bold(rel.model.name)} -> ${chalk5.bold(rel.field.name)}`), columns);
  const stats = `${chalk5.white("\u{1F4CA} Total relations:")} ${chalk5.white.bold(total)}`;
  return response.result(boxen3(`${stats}

${formattedModels}`, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green"
  }));
};

// src/modules/prehandlers/render-handlers/get-enums.ts
import { printSchema } from "@mrleebo/prisma-ast";
import boxen4 from "boxen";
import { PrismaHighlighter as PrismaHighlighter3 } from "prismalux";
import chalk6 from "chalk";
var highlightPrismaSchema2 = new PrismaHighlighter3();
var getEnums = (prismaState, data) => {
  const response = handlerResponse(data);
  const options = data.options;
  const helper = useHelper(prismaState);
  let enums = helper.getEnums();
  const onlyEnums = data.args?.enums || [];
  if (onlyEnums.length && !onlyEnums.includes("*")) {
    enums = enums.filter((e) => onlyEnums.includes(e.name));
  }
  if (!enums.length) {
    return response.result(chalk6.yellow(`\u26A0 No enums found`));
  }
  const totalEnums = enums.length;
  const statistic = `\u{1F4CC} Enums in schema: ${chalk6.bold(totalEnums)}`;
  if (options?.raw) {
    const schema = {
      type: "schema",
      list: enums
    };
    const parsed = printSchema(schema);
    const rawOutput = highlightPrismaSchema2.highlight(parsed);
    return response.result(boxen4(`${statistic}
${rawOutput}`, {
      padding: 1,
      width: 100,
      borderColor: "cyan",
      title: "Prisma Enums",
      titleAlignment: "center"
    }));
  }
  const list = [];
  enums.forEach((e) => {
    list.push({
      name: chalk6.white.bold(e.name),
      options: e.enumerators?.filter((e2) => e2.type == "enumerator").map((en) => chalk6.green(en?.name)) || []
    });
  });
  const renderedList = list.map((e) => {
    return `${e.name}
${e.options.join(", ")}
`;
  });
  return response.result(boxen4(`${statistic}
${renderedList.join("\n")}`, {
    padding: 1,
    borderColor: "cyan",
    title: "Prisma Enums",
    titleAlignment: "center"
  }));
};

// src/modules/prehandlers/render-handlers/get-fields.ts
import boxen5 from "boxen";
import chalk7 from "chalk";
import Table from "cli-table3";
var getFields = (prismaState, data) => {
  const response = handlerResponse(data);
  const { args } = data;
  const helper = useHelper(prismaState);
  const modelName = args?.models?.[0];
  if (!modelName) {
    return response.error("\u274C No models specified. Usage: GET FIELDS -> [ModelName]; or GET FIELDS [FieldName], [FieldName2] IN -> [ModelName];");
  }
  const model = helper.getModelByName(modelName);
  if (!model) {
    return response.error(`\u274C Model ${modelName} not found`);
  }
  let fields = helper.getFields(modelName);
  if (!fields.length) {
    return response.result(chalk7.yellow(`\u26A0 No fields found in model ${modelName}`));
  }
  const onlyFilters = args?.fields || [];
  if (onlyFilters.length && !onlyFilters.includes("*")) {
    fields = fields.filter((field) => onlyFilters.includes(field.name));
  }
  if (!fields.length) {
    return response.result(chalk7.yellow(`\u26A0 No fields found in model ${modelName} that match filters`));
  }
  const idField = fields.find((f) => f.attributes?.some((attr) => attr.name === "id"))?.name;
  const table = new Table({
    head: [
      chalk7.bold("Field Name"),
      chalk7.bold("Type"),
      chalk7.bold("Required"),
      chalk7.bold("Array"),
      chalk7.bold("Relation"),
      chalk7.bold("Attributes")
    ],
    colWidths: [20, 15, 10, 10, 25, 25],
    style: { head: ["cyan"] }
  });
  const { relations } = prismaState;
  let relationFields = 0;
  fields.forEach((field) => {
    let name = chalk7.greenBright(field.name);
    const type = chalk7.blueBright(field.fieldType);
    const required = field.optional ? chalk7.redBright("No") : chalk7.greenBright("Yes");
    const array = field.array ? chalk7.yellowBright("Yes") : chalk7.gray("No");
    let hasRelation = field.attributes?.some((attr) => attr.name === "relation");
    let relation = hasRelation ? chalk7.magentaBright("Yes") : chalk7.gray("No");
    const attrs = ["unique", "id", "default"];
    const attributes = field.attributes?.filter(
      (attr) => attrs.includes(attr.name)
    ).map((attr) => {
      if (attrs.includes(attr.name) && Array.isArray(attr.args)) {
        const arg = attr.args[0];
        if ("string" == typeof arg.value) {
          return `@${attr.name}(${arg.value})`;
        }
        if ("object" == typeof arg.value) {
          return `@${attr.name}(${arg.value.name}())`;
        }
      }
      return `@${attr.name}`;
    }).join(", ") || chalk7.gray("None");
    for (const rel of relations) {
      if (rel.modelName === model.name) {
        if (rel.fieldName === field.name) {
          relation = chalk7.magentaBright(rel.relationName);
          hasRelation = true;
        }
        if (rel.foreignKey === field.name) {
          relation = chalk7.magenta(`${rel.relationName} (FK)`);
        }
      }
    }
    if (hasRelation) {
      relationFields++;
    }
    if (field.name == idField) {
      name = `${chalk7.bgGreenBright.black(field.name)} (ID)`;
    }
    table.push([name, type, required, array, relation, attributes]);
  });
  const totalFoundFields = fields.length;
  const statistic = `
    \u{1F4CC}Fields in model: ${chalk7.bold(modelName)}
    Total fields found: ${chalk7.bold(totalFoundFields)}
    Fields with relations: ${chalk7.bold(relationFields)}
    `;
  return response.result(boxen5(`${statistic}
${table.toString()}`, {
    padding: 1,
    borderColor: "cyan",
    title: "Prisma Model Fields",
    titleAlignment: "center"
  }));
};

// src/modules/prehandlers/render-handlers/get-model.ts
import chalk8 from "chalk";
import { printSchema as printSchema2 } from "@mrleebo/prisma-ast";
import { PrismaHighlighter as PrismaHighlighter4 } from "prismalux";
import boxen6 from "boxen";
var highlightPrismaSchema3 = new PrismaHighlighter4();
var getModel = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  const modelName = args?.models?.[0];
  if (!modelName) {
    return response.error("No model specified. Example usage: GET MODEL ->[ModelName];");
  }
  const model = useHelper(prismaState).getModelByName(modelName);
  if (!model) {
    return response.error(`Model ${modelName} not found`);
  }
  const fields = extractModelSummary(model, prismaState.relations);
  const { totalRelations } = getRelationStatistics(prismaState.relations, model.name);
  const schema = {
    type: "schema",
    list: [model]
  };
  const hSchema = highlightPrismaSchema3.highlight(printSchema2(schema));
  let output = `${chalk8.bold.whiteBright("Model:")} ${chalk8.greenBright(model.name)}
`;
  output += `${chalk8.whiteBright("Relations:")} ${totalRelations > 0 ? `${chalk8.greenBright(totalRelations)} relations` : chalk8.redBright("No relations")}

`;
  const maxFieldLength = Math.max(...fields.map((f) => f.name.length), 5);
  const maxTypeLength = Math.max(...fields.map((f) => f.type.length), 4);
  output += chalk8.underline("Unique Fields:\n");
  output += fields.map((field) => {
    const fieldName = field.isId ? chalk8.bold.red(field.name) : field.isUnique ? chalk8.bold.yellow(field.name) : chalk8.white(field.name);
    const fieldType = field.isRelation ? chalk8.cyan(field.type) : chalk8.blueBright(field.type);
    return `${fieldName.padEnd(maxFieldLength + 2)} ${fieldType.padEnd(
      maxTypeLength + 2
    )}`;
  }).join("\n");
  output += "\n\n";
  output += chalk8.underline("Schema:") + hSchema;
  return response.result(boxen6(output, {
    padding: 1,
    borderColor: "cyan",
    borderStyle: "round"
  }));
};

// src/modules/prehandlers/render-handlers/get-models.ts
import { printSchema as printSchema3 } from "@mrleebo/prisma-ast";
import boxen7 from "boxen";
import { PrismaHighlighter as PrismaHighlighter5 } from "prismalux";
import chalk9 from "chalk";
var highlightPrismaSchema4 = new PrismaHighlighter5();
var getModels = (prismaState, data) => {
  const response = handlerResponse(data);
  const { args } = data;
  const models = useHelper(prismaState).getModels(args?.models);
  const schema = {
    type: "schema",
    list: models
  };
  const modelCount = models.length;
  const title = modelCount > 0 ? `\u{1F4CA} Query Result: ${chalk9.bold(modelCount)} model${modelCount > 1 ? "s" : ""} found:` : `\u274C No models found`;
  const highlightedSchema = highlightPrismaSchema4.highlight(printSchema3(schema));
  const output = models?.length ? `
${title}

${highlightedSchema} 
        ` : title;
  const statsBox = boxen7(output, {
    padding: 1,
    borderColor: modelCount > 0 ? "green" : "red",
    borderStyle: "round",
    align: "left"
  });
  return response.result(statsBox);
};

// src/modules/prehandlers/render-handlers/get-relations.ts
var getRelations = (prismaState, data) => {
  const response = handlerResponse(data);
  const helper = useHelper(prismaState);
  const { options, args } = data;
  const modelnames = args?.models || [];
  if (!modelnames.length) {
    return response.error("You must provide at least one model name. Example: GET RELATIONS [ModelNameA], [ModelNameB]");
  }
  const models = helper.getModels();
  const selectedModels = models.filter((m) => modelnames.includes(m.name));
  if (!selectedModels.length) {
    return response.result("No models found");
  }
  const results = [];
  const logger = new PrismaQlFieldRelationLogger(prismaState.relations);
  for (const model of selectedModels) {
    const log = logger.generateRelationTreeLog(model.name, options?.depth || 1);
    results.push(log);
  }
  return response.result(results.join("\n"));
};

// src/modules/prehandlers/json-handlers/index.ts
var json_handlers_exports = {};
__export(json_handlers_exports, {
  getJsonEnumRelations: () => getJsonEnumRelations,
  getJsonEnums: () => getJsonEnums,
  getJsonFields: () => getJsonFields,
  getJsonModel: () => getJsonModel,
  getJsonModelNames: () => getJsonModelNames,
  getJsonModels: () => getJsonModels,
  getJsonRelations: () => getJsonRelations,
  sortModelNames: () => sortModelNames2
});

// src/modules/prehandlers/json-handlers/get-enum-relations.ts
var getJsonEnumRelations = (prismaState, data) => {
  const response = handlerResponse(data);
  const helper = useHelper(prismaState);
  const { args } = data;
  const enumName = args?.enums?.[0];
  if (!enumName) {
    return response.error("No enum name provided. Example usage: GET ENUM_RELATIONS -> [EnumName];");
  }
  const _enum = helper.getEnumByName(enumName);
  if (!_enum) {
    return response.error(`Enum ${enumName} not found`);
  }
  const relations = helper.getEnumRelations(enumName);
  const total = relations.length;
  if (!total) {
    return response.result({
      total: 0,
      relations: []
    });
  }
  return response.result({
    total,
    relations
  });
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

// src/modules/prehandlers/json-handlers/get-fields.ts
var getJsonFields = (prismaState, data) => {
  const response = handlerResponse(data);
  const { args } = data;
  const helper = useHelper(prismaState);
  const modelName = args?.models?.[0];
  if (!modelName) {
    return response.error("\u274C No models specified. Usage: GET FIELDS -> [ModelName]; or GET FIELDS [FieldName], [FieldName2] IN -> [ModelName];");
  }
  const model = helper.getModelByName(modelName);
  if (!model) {
    return response.error(`\u274C Model ${modelName} not found`);
  }
  let fields = helper.getFields(modelName);
  if (!fields.length) {
    return response.result({
      fields: [],
      total: 0
    });
  }
  const onlyFilters = args?.fields || [];
  if (onlyFilters.length && !onlyFilters.includes("*")) {
    fields = fields.filter((field) => onlyFilters.includes(field.name));
  }
  if (!fields.length) {
    return response.result({
      fields: [],
      total: 0
    });
  }
  const relationFields = fields.filter((field) => field.attributes?.some((attr) => attr.name === "relation")).length;
  return response.result({
    fields,
    total: relationFields
  });
};

// src/modules/prehandlers/json-handlers/get-model-names.ts
var sortModelNames2 = (modelNames) => {
  modelNames.sort((a, b) => a.localeCompare(b));
};
var getJsonModelNames = (prismaState, data) => {
  const response = handlerResponse(data);
  const models = useHelper(prismaState).getModels();
  if (models.length === 0) {
    return response.result({
      total: 0,
      models: []
    });
  }
  const modelNames = models.map((model) => model.name);
  sortModelNames2(modelNames);
  return response.result({
    total: modelNames.length,
    models: modelNames
  });
};

// src/modules/prehandlers/json-handlers/get-model.ts
import { printSchema as printSchema4 } from "@mrleebo/prisma-ast";
var getJsonModel = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  const modelName = args?.models?.[0];
  if (!modelName) {
    return response.error("No model specified. Example usage: GET MODEL ->[ModelName];");
  }
  const model = useHelper(prismaState).getModelByName(modelName);
  if (!model) {
    return response.error(`Model ${modelName} not found`);
  }
  const fields = extractModelSummary(model, prismaState.relations);
  const { totalRelations } = getRelationStatistics(prismaState.relations, model.name);
  const schema = {
    type: "schema",
    list: [model]
  };
  return response.result({
    model,
    schema: printSchema4(schema),
    requiredFields: fields,
    totalRelations
  });
};

// src/modules/prehandlers/json-handlers/get-models.ts
import { printSchema as printSchema5 } from "@mrleebo/prisma-ast";
var getJsonModels = (prismaState, data) => {
  const response = handlerResponse(data);
  const { args } = data;
  const models = useHelper(prismaState).getModels(args?.models);
  const schema = {
    type: "schema",
    list: models
  };
  const modelCount = models.length;
  return response.result({
    total: modelCount,
    models,
    schema: printSchema5(schema)
  });
};

// src/modules/prehandlers/json-handlers/get-relations.ts
var getJsonRelations = (prismaState, data) => {
  const response = handlerResponse(data);
  const helper = useHelper(prismaState);
  const { options, args } = data;
  const modelnames = args?.models || [];
  if (!modelnames.length) {
    return response.error("You must provide at least one model name. Example: GET RELATIONS [ModelNameA], [ModelNameB]");
  }
  const models = helper.getModels();
  const selectedModels = models.filter((m) => modelnames.includes(m.name));
  if (!selectedModels.length) {
    return response.result({
      total: 0,
      results: []
    });
  }
  const results = [];
  const logger = new PrismaQlFieldRelationLogger(prismaState.relations);
  for (const model of selectedModels) {
    const log = logger.buildJsonModelTrees(model.name, prismaState.relations, options?.depth || 1);
    results.push(log);
  }
  return response.result({
    results,
    total: results.length
  });
};

// src/modules/prehandlers/mutation-handlers/index.ts
var mutation_handlers_exports = {};
__export(mutation_handlers_exports, {
  addEnum: () => addEnum,
  addField: () => addField,
  addModel: () => addModel,
  addRelation: () => addRelation,
  deleteEnum: () => deleteEnum,
  deleteField: () => deleteField,
  deleteModel: () => deleteModel,
  deleteRelation: () => deleteRelation,
  updateEnum: () => updateEnum,
  updateField: () => updateField
});

// src/modules/prehandlers/mutation-handlers/add-enum.ts
import { constantCase } from "change-case";
var addEnum = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  const enumName = (args?.enums || [])[0];
  if (!enumName.length) {
    return response.error("No enum name provided. Example: 'ADD ENUM ->[EnumName] ({A|B|C});'");
  }
  if (!data.prismaBlock) {
    return response.error("No enum block provided. Example: 'ADD ENUM EnumName ->[({A|B|C})];'");
  }
  let keys = [];
  if (data.prismaBlock) {
    keys = data.prismaBlock.split(/\s+/).map((key) => constantCase(key));
  }
  if (!keys.length) {
    return response.error("No enum options provided. Example: 'ADD ENUM EnumName ({ ->[A|B|C] });'");
  }
  try {
    const builder = prismaState.builder;
    const prevEnum = builder.findByType("enum", { name: enumName });
    if (prevEnum) {
      return response.error(`Enum ${enumName} already exists`);
    }
    builder.enum(enumName, keys);
    return response.result(`Enum ${enumName} added successfully!`);
  } catch (error) {
    return response.error(`Error adding enum: ${error.message}`);
  }
};

// src/modules/prehandlers/mutation-handlers/add-field.ts
import { getSchema as getSchema2 } from "@mrleebo/prisma-ast";
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
    parsed = getSchema2(sourceField);
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

// src/modules/prehandlers/mutation-handlers/add-model.ts
import { getSchema as getSchema3 } from "@mrleebo/prisma-ast";
var addModel = (prismaState, data) => {
  const { args, prismaBlock } = data;
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
    const sourceModel = `model ${modelName} {
        ${prismaBlock || "id Int @id"}
        }`;
    try {
      parsed = getSchema3(sourceModel);
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

// src/modules/prehandlers/mutation-handlers/add-relation.ts
import pluralize2 from "pluralize";
import { camelCase, pascalCase as pascalCase2 } from "change-case";
var addRelation = (prismaState, data) => {
  const { args, options } = data;
  const response = handlerResponse(data);
  const type = options?.type;
  const models = args?.models;
  if (!models || models.length !== 2) {
    return response.error("Two models are required for relation. Example: ADD RELATION ->[ModelA] TO ->[ModelB] (type=1:1)");
  }
  if (!type) {
    return response.error("Relation type is required. Valid types are: '1:1', '1:M', 'M:N'. Example: ADD RELATION ModelA TO ModelB (type=1:1)");
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
  const pivotModelName = pivotTable ? pascalCase2(pivotTable) : null;
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
      const idFieldModelA = helper.getIdFieldTypeModel(modelA) || "String";
      const idFieldModelB = helper.getIdFieldTypeModel(modelB) || "String";
      builder.model(pivotModelName).field("createdAt", "DateTime").attribute("default", ["now()"]).field(fkA, idFieldModelA).attribute("unique").field(fkB, idFieldModelB).attribute("unique").blockAttribute("id", [fkA, fkB]).field(modelA.toLowerCase(), modelA).attribute("relation", [
        relationName,
        `fields: [${fkA}]`,
        `references: [id]`
      ]);
      builder.model(modelA).field(camelCase(modelB), `${pivotModelName}?`).attribute("relation", [relationName]);
      return response.result(`One-to-One relation (with pivot table) added between ${modelA} and ${modelB}`);
    }
  } else if (type == "1:M") {
    if (!pivotTable) {
      const aModelName = options?.fkHolder || modelA;
      const bModelName = aModelName === modelA ? modelB : modelA;
      const idFieldModelB = helper.getIdFieldTypeModel(bModelName) || "String";
      const fkKey = fk(bModelName);
      const refModelKey = selfPrefix(bModelName);
      builder.model(aModelName).field(fkKey, isOptional(idFieldModelB)).field(refModelKey, isOptional(bModelName)).attribute("relation", [relationName, `fields: [${fkKey}]`, `references: [id]`]);
      builder.model(bModelName).field(pluralize2.plural(camelCase(aModelName)), aModelName + "[]").attribute("relation", [relationName]);
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
      builder.model(modelA).field(pluralize2.plural(camelCase(modelB)), `${pivotModelName}[]`).attribute("relation", [relationName]);
      return response.result(`One-to-Many relation (with pivot table) added between ${modelA} and ${modelB}`);
    }
  }
  if (type == "M:N") {
    if (!pivotTable) {
      const toKey = pluralize2.plural(camelCase(modelB));
      const fromKey = pluralize2.plural(selfPrefix(modelA));
      builder.model(modelA).field(toKey, `${modelB}[]`).attribute("relation", [relationName]);
      builder.model(modelB).field(fromKey, `${modelA}[]`).attribute("relation", [relationName]);
      return response.result(`Many-to-Many relation (without pivot table) added between ${modelA} and ${modelB}`);
    } else {
      const customSelfPrefix = (str) => {
        return isSelfRelation ? str + "By" : str;
      };
      const toPluralKey = pluralize2.plural(camelCase(modelB));
      const fromPluralKey = pluralize2.plural(selfPrefix(modelA));
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

// src/modules/prehandlers/mutation-handlers/delete-model.ts
var deleteModel = (prismaState, data) => {
  const { args } = data;
  const response = handlerResponse(data);
  const modelName = args?.models?.[0];
  if (!modelName) {
    return response.error("No model name provided. Usage: DELETE MODEL ->[ModelName];");
  }
  try {
    const builder = prismaState.builder;
    const prevModel = builder.findByType("model", { name: modelName });
    if (!prevModel) {
      return response.error(`Model ${modelName} does not exist`);
    }
    builder.drop(modelName);
    return response.result(`Model ${modelName} deleted successfully`);
  } catch (error) {
    return response.error(`Error deleting model: ${error.message}`);
  }
};

// src/modules/prehandlers/mutation-handlers/delete-relations.ts
import chalk10 from "chalk";
var deleteRelation = (prismaState, data) => {
  const { args, options } = data;
  const response = handlerResponse(data);
  const models = args?.models;
  if (!models || models.length !== 2) {
    return response.error("Two models are required to remove a relation. Example: DELETE RELATION -> [ModelA], [ModelB]");
  }
  const [modelA, modelB] = models;
  const { builder } = prismaState;
  const modelARef = builder.findByType("model", { name: modelA });
  const modelBRef = builder.findByType("model", { name: modelB });
  if (!modelARef) {
    return response.error(`Model ${modelA} not found`);
  }
  if (!modelBRef) {
    return response.error(`Model ${modelB} not found`);
  }
  const fieldA = options?.fieldA;
  const fieldB = options?.fieldB;
  if (fieldA && !fieldB) {
    return response.error(`Field ${fieldA} specified for ${modelA} but no field specified for ${modelB}`);
  }
  if (options?.relationName) {
    console.log(chalk10.yellow(`Relation name is specified. Attempting to remove relation by name`));
    const fieldsA = modelARef.properties.filter(
      (prop) => prop.type === "field" && (prop.fieldType === modelB || prop.fieldType === modelA)
    );
    const fieldsAByRelation = fieldsA.filter(
      (field) => field?.attributes?.find(
        (attr) => attr.type === "attribute" && attr.name === "relation" && attr.args?.some(
          (arg) => arg.type === "attributeArgument" && arg.value === `"${options.relationName}"`
        )
      )
    );
    if (fieldsAByRelation.length === 0) {
      return response.error(`Relation ${options.relationName} not found between ${modelA} and ${modelB}`);
    }
    for (const field of fieldsAByRelation) {
      builder.model(modelA).removeField(field.name);
    }
    const fieldsB = modelBRef.properties.filter(
      (prop) => prop.type === "field" && (prop.fieldType === modelB || prop.fieldType === modelA)
    );
    const fieldsBByRelation = fieldsB.filter(
      (field) => field?.attributes?.find(
        (attr) => attr.type === "attribute" && attr.name === "relation" && attr.args?.some(
          (arg) => arg.type === "attributeArgument" && arg.value === `"${options.relationName}"`
        )
      )
    );
    for (const field of fieldsBByRelation) {
      builder.model(modelB).removeField(field.name);
    }
    if (fieldsAByRelation.length === 0 && fieldsBByRelation.length === 0) {
      return response.error(`Relation ${options.relationName} not found between ${modelA} and ${modelB}`);
    }
    return response.result(`Relation ${options.relationName} removed between ${modelA} and ${modelB}`);
  }
  if (!fieldA && !fieldB) {
    console.log(chalk10.yellow(`No fields specified. Attempting to remove all relations between ${modelA} and ${modelB}`));
    const fieldsToRemoveA = modelARef.properties.filter(
      (prop) => prop.type === "field" && prop.fieldType === modelB
    );
    const fieldsToRemoveB = modelBRef.properties.filter(
      (prop) => prop.type === "field" && prop.fieldType === modelA
    );
    for (const field of fieldsToRemoveA) {
      builder.model(modelA).removeField(field.name);
    }
    for (const field of fieldsToRemoveB) {
      builder.model(modelB).removeField(field.name);
    }
    if (fieldsToRemoveA.length === 0 && fieldsToRemoveB.length === 0) {
      return response.error(`Relations not found between ${modelA} and ${modelB}`);
    }
    return response.result(`All relations between ${modelA} and ${modelB} removed`);
  }
  const modelABuilder = builder.model(modelA);
  const fieldInA = modelARef.properties.find(
    (prop) => prop.type === "field" && prop.name == fieldA && (prop.fieldType === modelB || prop.fieldType === modelA)
  );
  if (fieldInA) {
    modelABuilder.removeField(fieldInA.name);
  }
  const modelBBuilder = builder.model(modelB);
  const fieldInB = modelBRef.properties.find(
    (prop) => prop.type === "field" && prop.name == fieldB && (prop.fieldType === modelB || prop.fieldType === modelA)
  );
  if (fieldInB) {
    modelBBuilder.removeField(fieldInB.name);
  }
  if (fieldInA || fieldInB) {
    return response.result(`Relation ${fieldInA?.name || fieldInB?.name} removed between ${modelA} and ${modelB}`);
  }
  return response.error(`Relation not found between ${modelA} and ${modelB}`);
};

// src/modules/prehandlers/mutation-handlers/update-enum.ts
import { constantCase as constantCase2 } from "change-case";
var updateEnum = (prismaState, data) => {
  const { args, options } = data;
  const response = handlerResponse(data);
  const enumName = args?.enums?.[0];
  if (!enumName) {
    return response.error("No enum name provided. Example: UPDATE ENUM ->[EnumName] ({A|B|C})");
  }
  if (!data.prismaBlock) {
    return response.error("No enum block provided. Example: 'UPDATE ENUM EnumName ->[({A|B|C})];'");
  }
  let keys = [];
  if (data.prismaBlock) {
    keys = data.prismaBlock.split(/\s+/);
  }
  if (!keys.length) {
    return response.error("No enum options provided. Example: 'UPDATE ENUM EnumName ({ ->[A|B|C] });'");
  }
  try {
    const enumOptions = keys?.map((key) => constantCase2(key));
    const builder = prismaState.builder;
    const prevEnum = builder.findByType("enum", { name: enumName });
    if (!prevEnum) {
      builder.enum(enumName, enumOptions);
      return response.result(`Enum ${enumName} added successfully`);
    }
    const oldValues = prevEnum.enumerators.filter((el) => el.type == "enumerator").map((e) => e.name);
    const doExtend = !options?.replace;
    let finalValues;
    if (doExtend) {
      finalValues = Array.from(/* @__PURE__ */ new Set([...oldValues, ...enumOptions]));
    } else {
      finalValues = enumOptions;
    }
    builder.drop(enumName);
    builder.enum(enumName, finalValues);
    return response.result(`Enum ${enumName} added successfully`);
  } catch (error) {
    return response.error(`Error adding enum: ${error.message}`);
  }
};

// src/modules/prehandlers/mutation-handlers/update-field.ts
import { getSchema as getSchema4 } from "@mrleebo/prisma-ast";
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
    parsed = getSchema4(sourceField);
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

// src/modules/handlers/mutation-handler.ts
var mutationsHandler = new PrismaQlMutationHandlerRegistry();
mutationsHandler.register("ADD", "MODEL", addModel);
mutationsHandler.register("ADD", "FIELD", addField);
mutationsHandler.register("ADD", "ENUM", addEnum);
mutationsHandler.register("ADD", "RELATION", addRelation);
mutationsHandler.register("DELETE", "ENUM", deleteEnum);
mutationsHandler.register("DELETE", "MODEL", deleteModel);
mutationsHandler.register("DELETE", "FIELD", deleteField);
mutationsHandler.register("DELETE", "RELATION", deleteRelation);
mutationsHandler.register("UPDATE", "FIELD", updateField);
mutationsHandler.register("UPDATE", "ENUM", updateEnum);

// src/modules/handlers/query-render-handler.ts
var queryRendersHandler = new PrismaQlQueryHandlerRegistry();
queryRendersHandler.register("GET", "MODEL", getModel);
queryRendersHandler.register("GET", "MODELS", getModels);
queryRendersHandler.register("GET", "FIELDS", getFields);
queryRendersHandler.register("GET", "ENUMS", getEnums);
queryRendersHandler.register("GET", "MODELS_LIST", getModelNames);
queryRendersHandler.register("GET", "RELATIONS", getRelations);
queryRendersHandler.register("GET", "ENUM_RELATIONS", getEnumRelations);

// src/modules/handlers/query-json-handler.ts
var queryJSONHandler = new PrismaQlQueryHandlerRegistry();
queryJSONHandler.register("GET", "MODEL", getJsonModel);
queryJSONHandler.register("GET", "MODELS", getJsonModels);
queryJSONHandler.register("GET", "FIELDS", getJsonFields);
queryJSONHandler.register("GET", "ENUMS", getJsonEnums);
queryJSONHandler.register("GET", "MODELS_LIST", getJsonModelNames);
queryJSONHandler.register("GET", "RELATIONS", getJsonRelations);
queryJSONHandler.register("GET", "ENUM_RELATIONS", getEnumRelations);
export {
  PrismaQlDslParser,
  PrismaQlFieldRelationLogger,
  PrismaQlHandlerRegistry,
  PrismaQlMutationHandlerRegistry,
  PrismaQlProvider,
  PrismaQlQueryHandlerRegistry,
  PrismaQlRelationCollector,
  PrismaQlSchemaHelper,
  PrismaQlSchemaLoader,
  basePrismaQlAgsProcessor,
  extractModelSummary,
  getManyToManyModelName,
  getManyToManyTableName,
  getRelationStatistics,
  handlerResponse,
  json_handlers_exports as jsonGetters,
  loadPrismaSchema,
  mutation_handlers_exports as mutationHandlers,
  mutationsHandler,
  parseFieldForBuilder,
  prismaQlParser,
  queryJSONHandler,
  queryRendersHandler,
  render_handlers_exports as renderGetters,
  useHelper,
  validatePrismaSchema
};
//# sourceMappingURL=index.js.map