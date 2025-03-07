/**
 * PrismaQL - The Ultimate Prisma Schema Management Tool
 * ------------------------------------------------------
 * Author: Artyom Gorlovetskiy (unbywyd.com)
 *
 * PrismaQL is a powerful tool for precise and programmatic editing of Prisma schema files 
 * using a SQL-like DSL. It allows developers to modify models, fields, relations, and enums 
 * while preserving schema integrity through AST-based processing, validation, and commit tracking.
 *
 * This package consists of:
 * - `prismaql` (core): DSL parser, schema loader, command handlers, and transaction system.
 * - `prismaql-cli`: A command-line interface for executing PrismaQL commands interactively.
 *
 * Designed for automation, safety, and efficiency, PrismaQL ensures controlled schema 
 * modifications with built-in validation, rollback capabilities, and structured query/mutation operations.
 */


export * from "./modules/dsl.js";
export * from "./modules/prisma-schema-loader.js";
export * from "./modules/field-relation-collector.js";
export * from "./modules/field-relation-logger.js";
export * from "./modules/prisma-ql-provider.js";

export * from "./modules/utils/model-primary-fields.js";
export * from "./modules/utils/prisma-validation.js";
export * from "./modules/utils/schema-helper.js";
export * from "./modules/utils/load-prisma-schema.js";

export * from "./modules/handler-registries/handler-registry.js";
export * from "./modules/handler-registries/query-handler-registry.js";
export * from "./modules/handler-registries/mutation-handler-registry.js";

// cli getters renders
export * as renderGetters from "./modules/prehandlers/render-handlers/index.js";
export * as jsonGetters from "./modules/prehandlers/json-handlers/index.js";

// mutation handlers
export * as mutationHandlers from "./modules/prehandlers/mutation-handlers/index.js";

// preregistered handlers
export * from "./modules/handlers/mutation-handler.js";
export * from "./modules/handlers/query-render-handler.js";
export * from "./modules/handlers/query-json-handler.js";