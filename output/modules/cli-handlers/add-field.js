import { getSchema } from "@mrleebo/prisma-ast";
import { handlerResponse } from "../handler-registries/handler-registry.js";
import { parseFieldForBuilder, useHelper } from "../schema-helper.js";
export const addField = (prismaState, data) => {
    const response = handlerResponse(data);
    const { args, options } = data;
    const helper = useHelper(prismaState);
    if (!args?.models || !args.models.length) {
        return response.error("No model name provided");
    }
    const modelName = args.models[0];
    const model = prismaState.builder.findByType("model", { name: modelName });
    if (!model) {
        return response.error(`Model ${modelName} not found`);
    }
    if (!args?.fields || !args.fields.length) {
        return response.error("No fields provided");
    }
    const fieldName = args.fields[0];
    if (!fieldName) {
        return response.error("No field name provided");
    }
    if (!data.prismaBlock) {
        return response.error("No field type provided");
    }
    const prevField = model.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
    if (prevField) {
        return response.error(`Field ${fieldName} already exists in model ${modelName}`);
    }
    const sourceField = `model Test {
        ${fieldName}  ${data.prismaBlock}
    }`;
    const parsed = getSchema(sourceField);
    const testModel = parsed.list[0];
    const field = testModel.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
    if (!field) {
        return response.error("Invalid field");
    }
    const fieldData = parseFieldForBuilder(field);
    if (!fieldData) {
        return response.error("Invalid field");
    }
    const modelBuilder = prismaState.builder.model(model.name);
    if (fieldData) {
        let fieldBuilder = modelBuilder.field(fieldData.name, fieldData.fieldType);
        for (const attr of fieldData.attributes) {
            fieldBuilder = fieldBuilder.attribute(attr.name, attr.args);
        }
    }
    return response.result(`Field ${fieldName} added to model ${modelName}`);
};
//# sourceMappingURL=add-field.js.map