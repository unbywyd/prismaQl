import { getJsonEnums } from "../prehandlers/json-handlers/get-enums.js";
import { getJsonFields } from "../prehandlers/json-handlers/get-fields.js";
import { getJsonModelNames } from "../prehandlers/json-handlers/get-model-names.js";
import { getJsonModel } from "../prehandlers/json-handlers/get-model.js";
import { getJsonModels } from "../prehandlers/json-handlers/get-models.js";
import { getJsonRelations } from "../prehandlers/json-handlers/get-relations.js";
import { getEnumRelations } from "../prehandlers/render-handlers/get-enum-relations.js";
import { PrismaQlQueryHandlerRegistry } from "../handler-registries/query-handler-registry.js";
import { getJsonGenerators } from "../prehandlers/json-handlers/get-generators.js";

export const queryJSONHandler = new PrismaQlQueryHandlerRegistry();

queryJSONHandler.register("GET", "MODEL", getJsonModel);
queryJSONHandler.register("GET", "MODELS", getJsonModels);
queryJSONHandler.register("GET", "FIELDS", getJsonFields);
queryJSONHandler.register("GET", "ENUMS", getJsonEnums);
queryJSONHandler.register("GET", "MODELS_LIST", getJsonModelNames);
queryJSONHandler.register("GET", "RELATIONS", getJsonRelations);
queryJSONHandler.register("GET", "ENUM_RELATIONS", getEnumRelations);
queryJSONHandler.register("GET", "GENERATORS", getJsonGenerators);
