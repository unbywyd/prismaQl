import { PrismaQlHandler, handlerResponse } from "../../handler-registries/handler-registry.js";

export const deleteField: PrismaQlHandler<"DELETE", "FIELD", "mutation"> = (prismaState, data) => {
    const { args } = data;
    const response = handlerResponse(data);

    if (!args?.fields || !args.fields.length) {
        return response.error("No field name provided. Example: DELETE FIELD ->[FieldName] IN ->[ModelName]");
    }

    const modelName = args?.models?.[0];
    if (!modelName) {
        return response.error("No model name provided. Example: DELETE FIELD FieldName IN ->[ModelName]");
    }


    const fieldName = args.fields[0];
    try {

        const builder = prismaState.builder;

        const prevModel = builder.findByType("model", { name: modelName });
        if (!prevModel) {
            return response.error(`Model ${modelName} does not exist`);
        }

        if (!prevModel.properties.find((prop) => prop.type === "field" && prop.name === fieldName)) {
            return response.error(`Field ${fieldName} does not exist in model ${modelName}`);
        }
        const model = builder.model(modelName);
        model.removeField(fieldName);
        return response.result(`Field ${modelName} deleted successfully`);
    } catch (error) {
        return response.error(`Error deleting field: ${error.message}`);
    }
};
