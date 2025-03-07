import { getEnumRelations } from "./cli-handlers/get-enum-relations.js";
import { getEnums } from "./cli-handlers/get-enums.js";
import { getFields } from "./cli-handlers/get-fields.js";
import { getModelNames } from "./cli-handlers/get-model-names.js";
import { getModel } from "./cli-handlers/get-model.js";
import { getModels } from "./cli-handlers/get-models.js";
import { getRelations } from "./cli-handlers/get-raltions.js";
import { QueryHandlerRegistry } from "./handler-registries/query-handler-registry.js";
const queryHandler = new QueryHandlerRegistry();
queryHandler.register("GET", "MODEL", getModel);
queryHandler.register("GET", "MODELS", getModels);
queryHandler.register("GET", "FIELDS", getFields);
queryHandler.register("GET", "ENUMS", getEnums);
queryHandler.register("GET", "MODELS_LIST", getModelNames);
queryHandler.register("GET", "RELATIONS", getRelations);
queryHandler.register("GET", "ENUM_RELATIONS", getEnumRelations);
export default queryHandler;
//# sourceMappingURL=query-handler.js.map