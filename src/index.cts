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


module.exports = {
    ...require("./modules/dsl.js"),
    ...require("./modules/prisma-schema-loader.js"),
    ...require("./modules/field-relation-collector.js"),
    ...require("./modules/field-relation-logger.js"),
    ...require("./modules/prisma-ql-provider.js"),
    ...require("./modules/utils/model-primary-fields.js"),
    ...require("./modules/utils/prisma-validation.js"),
    ...require("./modules/utils/schema-helper.js"),
    ...require("./modules/utils/load-prisma-schema.js"),
    ...require("./modules/handler-registries/handler-registry.js"),
    ...require("./modules/handler-registries/query-handler-registry.js"),
    ...require("./modules/handler-registries/mutation-handler-registry.js"),
    renderGetters: require("./modules/prehandlers/render-handlers/index.js"),
    jsonGetters: require("./modules/prehandlers/json-handlers/index.js"),
    mutationHandlers: require("./modules/prehandlers/mutation-handlers/index.js"),
    mutationHandler: require("./modules/handlers/mutation-handler.js"),
    queryRenderHandler: require("./modules/handlers/query-render-handler.js"),
    queryJsonHandler: require("./modules/handlers/query-json-handler.js")
};
