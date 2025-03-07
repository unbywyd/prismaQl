import { getEnumRelations } from "../prehandlers/render-handlers/get-enum-relations.js";
import { getEnums } from "../prehandlers/render-handlers/get-enums.js";
import { getFields } from "../prehandlers/render-handlers/get-fields.js";
import { getModelNames } from "../prehandlers/render-handlers/get-model-names.js";
import { getModel } from "../prehandlers/render-handlers/get-model.js";
import { getModels } from "../prehandlers/render-handlers/get-models.js";
import { getRelations } from "../prehandlers/render-handlers/get-relations.js";
import { QueryHandlerRegistry } from "../handler-registries/query-handler-registry.js";

const queryHandler = new QueryHandlerRegistry();

queryHandler.register("GET", "MODEL", getModel);
queryHandler.register("GET", "MODELS", getModels);
queryHandler.register("GET", "FIELDS", getFields);
queryHandler.register("GET", "ENUMS", getEnums);
queryHandler.register("GET", "MODELS_LIST", getModelNames);
queryHandler.register("GET", "RELATIONS", getRelations);
queryHandler.register("GET", "ENUM_RELATIONS", getEnumRelations);

export default queryHandler;