import { printSchema, Schema } from "@mrleebo/prisma-ast";
import { PrismaQlHandler, handlerResponse } from "../../handler-registries/handler-registry.js"
import { useHelper } from "../../utils/schema-helper.js";
export const getJsonModels: PrismaQlHandler<"GET", "MODELS", 'query'> = (prismaState, data) => {
    const response = handlerResponse(data);
    const { args } = data;
    const models = useHelper(prismaState).getModels(args?.models);

    const schema: Schema = {
        type: "schema",
        list: models,
    }

    const modelCount = models.length;
    return response.result({
        total: modelCount,
        models: models,
        schema: printSchema(schema),
    })
}