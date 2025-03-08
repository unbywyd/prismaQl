import { PrismaQlHandler, handlerResponse } from "../../handler-registries/handler-registry.js"
import { printSchema, Schema } from "@mrleebo/prisma-ast";
import { useHelper } from "../../utils/schema-helper.js";
import { getRelationStatistics } from "../../field-relation-logger.js";
import { extractModelSummary } from "../../utils/model-primary-fields.js";

export interface FieldSummary {
    name: string;
    type: string;
    isId: boolean;
    isUnique: boolean;
    isRelation: boolean;
};

export const getJsonModel: PrismaQlHandler<"GET", "MODEL", "query"> = (prismaState, data) => {
    const { args } = data;
    const response = handlerResponse(data);

    const modelName = args?.models?.[0];
    if (!modelName) {
        return response.error("No model specified. Example usage: GET MODEL ->[ModelName];");
    }

    const model = useHelper(prismaState).getModelByName(modelName);
    if (!model) {
        return response.error(`Model ${modelName} not found`)
    }

    const fields: FieldSummary[] = extractModelSummary(model, prismaState.relations);
    const { totalRelations } = getRelationStatistics(prismaState.relations, model.name);

    const schema: Schema = {
        type: "schema",
        list: [model],
    };

    return response.result({
        model: model,
        schema: printSchema(schema),
        requiredFields: fields,
        totalRelations: totalRelations
    });
}