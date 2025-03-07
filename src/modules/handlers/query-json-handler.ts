import { getJsonEnums } from "../prehandlers/json-handlers/get-enums.js";
import { getJsonFields } from "../prehandlers/json-handlers/get-fields.js";
import { getJsonModelNames } from "../prehandlers/json-handlers/get-model-names.js";
import { getJsonModel } from "../prehandlers/json-handlers/get-model.js";
import { getJsonModels } from "../prehandlers/json-handlers/get-models.js";
import { getJsonRelations } from "../prehandlers/json-handlers/get-relations.js";
import { getEnumRelations } from "../prehandlers/render-handlers/get-enum-relations.js";
import { QueryHandlerRegistry } from "../handler-registries/query-handler-registry.js";


const queryJsonHandler = new QueryHandlerRegistry();

queryJsonHandler.register("GET", "MODEL", getJsonModel);
queryJsonHandler.register("GET", "MODELS", getJsonModels);
queryJsonHandler.register("GET", "FIELDS", getJsonFields);
queryJsonHandler.register("GET", "ENUMS", getJsonEnums);
queryJsonHandler.register("GET", "MODELS_LIST", getJsonModelNames);
queryJsonHandler.register("GET", "RELATIONS", getJsonRelations);
queryJsonHandler.register("GET", "ENUM_RELATIONS", getEnumRelations);

export default queryJsonHandler;