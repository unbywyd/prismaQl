import { MutationHandlerRegistry } from "./handler-registries/mutation-handler-registry.js";
import { QueryHandlerRegistry } from "./handler-registries/query-handler-registry.js";
import { PrismaQlProvider } from "./prisma-ql-provider.js";
import PrismaSchemaLoader from "./prisma-schema-loader.js";
import parser from "./dsl.js";
import { PrismaRelationCollector } from "./relation-collector.js";
import { getModels } from "./cli-handlers/get-models.js";
import { getModel } from "./cli-handlers/get-model.js";
const manager = new PrismaSchemaLoader(new PrismaRelationCollector());
const queryHandler = new QueryHandlerRegistry();
const mutationHandler = new MutationHandlerRegistry();
queryHandler.register("MODEL", getModel);
queryHandler.register("MODELS", getModels);
queryHandler.register("FIELDS", (prismaState, args, options) => {
    console.log("Prisma state:", args, options);
    return {};
});
mutationHandler.register("MODEL", (prismaState, args, options) => {
    console.log("Prisma state:", prismaState);
    return { data: `Mutation result: added model ${args?.models?.[0]}` };
});
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
            return provider.mutation(sourceCommand).then(console.log).catch(console.error);
        }
        else if (actionType === "query") {
            provider.query(sourceCommand).then(console.log).catch(console.error);
        }
        else {
            throw new Error(`Invalid action type: ${actionType}`);
        }
    };
};
export default loadQueryRenderManager;
//# sourceMappingURL=cli-provider.js.map