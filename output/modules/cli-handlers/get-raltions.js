import { handlerResponse } from "../handler-registries/handler-registry.js";
import { FieldRelationLogger } from "../field-relation-logger.js";
import { useHelper } from "../schema-helper.js";
export const getRelations = (prismaState, data) => {
    const response = handlerResponse(data);
    const helper = useHelper(prismaState);
    const { options, args } = data;
    const modelnames = args?.models || [];
    if (!modelnames.length) {
        return response.result("You must provide at least one model name");
    }
    const models = helper.getModels();
    const selectedModels = models.filter(m => modelnames.includes(m.name));
    if (!selectedModels.length) {
        return response.result("No models found");
    }
    const results = [];
    const logger = new FieldRelationLogger(prismaState.relations);
    for (const model of selectedModels) {
        const log = logger.generateRelationTreeLog(model.name, options?.depth || 1);
        results.push(log);
    }
    return response.result(results.join("\n"));
};
//# sourceMappingURL=get-raltions.js.map