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
  ...require("./modules/handlers/mutation-handler.js"),
  ...require("./modules/handlers/query-render-handler.js"),
  ...require("./modules/handlers/query-json-handler.js"),
  renderGetters: require("./modules/prehandlers/render-handlers/index.js"),
  jsonGetters: require("./modules/prehandlers/json-handlers/index.js"),
  mutationHandlers: require("./modules/prehandlers/mutation-handlers/index.js")
};
//# sourceMappingURL=index.cjs.map