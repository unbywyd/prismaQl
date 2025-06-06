import { getEnumRelations } from "../prehandlers/render-handlers/get-enum-relations.js";
import { getEnums } from "../prehandlers/render-handlers/get-enums.js";
import { getFields } from "../prehandlers/render-handlers/get-fields.js";
import { getModelNames } from "../prehandlers/render-handlers/get-model-names.js";
import { getModel } from "../prehandlers/render-handlers/get-model.js";
import { getModels } from "../prehandlers/render-handlers/get-models.js";
import { getRelations } from "../prehandlers/render-handlers/get-relations.js";
import { PrismaQlQueryHandlerRegistry } from "../handler-registries/query-handler-registry.js";
import { getGenerators } from "../prehandlers/render-handlers/get-generators.js";
import { getDB } from "../prehandlers/render-handlers/get-db.js";
export const queryRendersHandler = new PrismaQlQueryHandlerRegistry();

queryRendersHandler.register("GET", "MODEL", getModel);
queryRendersHandler.register("GET", "MODELS", getModels);
queryRendersHandler.register("GET", "FIELDS", getFields);
queryRendersHandler.register("GET", "ENUMS", getEnums);
queryRendersHandler.register("GET", "MODELS_LIST", getModelNames);
queryRendersHandler.register("GET", "RELATIONS", getRelations);
queryRendersHandler.register("GET", "ENUM_RELATIONS", getEnumRelations);
queryRendersHandler.register("GET", "GENERATORS", getGenerators);
queryRendersHandler.register("GET", "DB", getDB);