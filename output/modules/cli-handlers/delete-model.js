import { handlerResponse } from "../handler-registries/handler-registry.js";
export const deleteModel = (prismaState, data) => {
    const { args } = data;
    const response = handlerResponse(data);
    if (!args?.models || !args.models.length) {
        return response.error("No model name provided");
    }
    try {
        const modelName = args.models[0];
        if (!modelName) {
            return response.error("No model name provided");
        }
        const builder = prismaState.builder;
        const prevModel = builder.findByType("model", { name: modelName });
        if (!prevModel) {
            return response.error(`Model ${modelName} does not exist`);
        }
        builder.drop(modelName);
        return response.result(`Model ${modelName} deleted successfully`);
    }
    catch (error) {
        return response.error(`Error deleting model: ${error.message}`);
    }
};
//# sourceMappingURL=delete-model.js.map