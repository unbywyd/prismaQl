import { MutationHandlerRegistry } from "./handler-registries/mutation-handler-registry.js";
import { QueryHandlerRegistry } from "./handler-registries/query-handler-registry.js";
import { PrismaQlProvider } from "./prisma-ql-provider.js";
import PrismaSchemaLoader from "./prisma-schema-loader.js";
import parser from "./dsl.js";
import { PrismaRelationCollector } from "./field-relation-collector.js";
import { getModels } from "./cli-handlers/get-models.js";
import { getModel } from "./cli-handlers/get-model.js";
import { addModel } from "./cli-handlers/add-model.js";
import { getFields } from "./cli-handlers/get-fields.js";
import { getModelNames } from "./cli-handlers/get-model-names.js";
import { getEnums } from "./cli-handlers/get-enums.js";
import { getRelations } from "./cli-handlers/get-raltions.js";
import { addEnum } from "./cli-handlers/add-enum.js";
import { deleteEnum } from "./cli-handlers/delete-enum.js";
import { getEnumRelations } from "./cli-handlers/get-enum-relations.js";
import { deleteModel } from "./cli-handlers/delete-model.js";
import { addField } from "./cli-handlers/add-field.js";
import { deleteField } from "./cli-handlers/delete-field.js";
import { updateField } from "./cli-handlers/update-field.js";
import { addRelation } from "./cli-handlers/add-relation.js";
const manager = new PrismaSchemaLoader(new PrismaRelationCollector());
const queryHandler = new QueryHandlerRegistry();
const mutationHandler = new MutationHandlerRegistry();
queryHandler.register("GET", "MODEL", getModel);
queryHandler.register("GET", "MODELS", getModels);
queryHandler.register("GET", "FIELDS", getFields);
queryHandler.register("GET", "ENUMS", getEnums);
queryHandler.register("GET", "MODELS_LIST", getModelNames);
queryHandler.register("GET", "RELATIONS", getRelations);
queryHandler.register("GET", "ENUM_RELATIONS", getEnumRelations);
mutationHandler.register("ADD", "MODEL", addModel);
mutationHandler.register("ADD", "FIELD", addField);
mutationHandler.register("ADD", "ENUM", addEnum);
mutationHandler.register("ADD", "RELATION", addRelation);
mutationHandler.register("DELETE", "ENUM", deleteEnum);
mutationHandler.register("DELETE", "MODEL", deleteModel);
mutationHandler.register("DELETE", "FIELD", deleteField);
mutationHandler.register("UPDATE", "FIELD", updateField);
const loadQueryRenderManager = async () => {
    await manager.loadFromFile();
    const provider = new PrismaQlProvider({
        queryHandler,
        mutationHandler,
        loader: manager,
    });
    return (sourceCommand) => {
        const actionType = parser.detectActionType(sourceCommand);
        if (actionType === "mutation") {
            provider.mutation(sourceCommand).then(res => {
                if (res?.result) {
                    console.log(res.result);
                }
                else if (res.error) {
                    console.error(res.error);
                }
            }).catch(console.error);
        }
        else if (actionType === "query") {
            provider.query(sourceCommand).then(res => {
                if (res?.result) {
                    console.log(res.result);
                }
                else {
                    console.error(res.error);
                }
            }).catch(console.error);
        }
        else {
            throw new Error(`Invalid action type: ${actionType}`);
        }
    };
};
export default loadQueryRenderManager;
//# sourceMappingURL=cli-provider.js.map