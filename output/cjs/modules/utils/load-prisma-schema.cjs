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

// src/modules/utils/load-prisma-schema.ts
var load_prisma_schema_exports = {};
__export(load_prisma_schema_exports, {
  loadPrismaSchema: () => loadPrismaSchema
});
module.exports = __toCommonJS(load_prisma_schema_exports);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var loadPrismaSchema = async (cwd, inputPath) => {
  let schemaPath = null;
  if (inputPath) {
    const resolvedPath = import_path.default.isAbsolute(inputPath) ? inputPath : import_path.default.resolve(cwd, inputPath);
    if (import_fs.default.existsSync(resolvedPath)) {
      const stat = import_fs.default.statSync(resolvedPath);
      if (stat.isDirectory()) {
        const possibleSchemaPaths = [
          import_path.default.join(resolvedPath, "prisma", "schema.prisma"),
          import_path.default.join(resolvedPath, "schema.prisma")
        ];
        schemaPath = possibleSchemaPaths.find(import_fs.default.existsSync) || null;
      } else if (stat.isFile()) {
        schemaPath = resolvedPath;
      }
    }
    if (!schemaPath) {
      throw new Error(`\u274C Path "${inputPath}" does not point to a valid Prisma schema file or directory.`);
    }
  } else {
    const possibleSchemaPaths = [
      import_path.default.join(cwd, "prisma", "schema.prisma"),
      import_path.default.join(cwd, "schema.prisma")
    ];
    schemaPath = possibleSchemaPaths.find(import_fs.default.existsSync) || null;
  }
  if (!schemaPath) {
    throw new Error(`\u274C Prisma schema file not found. Please ensure that the schema.prisma file exists in the "prisma" directory or provide a valid path.`);
  }
  const schemaContent = await import_fs.default.promises.readFile(schemaPath, "utf-8");
  if (!/^\s*(generator|datasource|client)\b/m.test(schemaContent)) {
    throw new Error(`\u274C The file at "${schemaPath}" does not appear to be a valid Prisma schema.`);
  }
  return { schema: schemaContent, path: schemaPath };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loadPrismaSchema
});
