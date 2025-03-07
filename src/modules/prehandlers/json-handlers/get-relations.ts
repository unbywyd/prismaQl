import { Handler, handlerResponse } from "../../handler-registries/handler-registry.js";
import { FieldRelationLogger, JsonRelationTree } from "../../field-relation-logger.js";
import { useHelper } from "../../utils/schema-helper.js";


export const getJsonRelations: Handler<"GET", "RELATIONS", 'query'> = (prismaState, data) => {
    const response = handlerResponse(data);
    const helper = useHelper(prismaState);
    const { options, args } = data;

    const modelnames = args?.models || [];
    if (!modelnames.length) {
        return response.error("You must provide at least one model name. Example: GET RELATIONS [ModelNameA], [ModelNameB]");
    }
    const models = helper.getModels();
    const selectedModels = models.filter(m => modelnames.includes(m.name));
    if (!selectedModels.length) {
        return response.result({
            total: 0,
            results: []
        });
    }
    const results: Array<JsonRelationTree> = [];
    const logger = new FieldRelationLogger(prismaState.relations);
    for (const model of selectedModels) {
        const log = logger.buildJsonModelTrees(model.name, prismaState.relations, options?.depth || 1);
        results.push(log);
    }
    return response.result({
        results,
        total: results.length
    });
}