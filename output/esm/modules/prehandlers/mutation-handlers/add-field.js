import { getSchema } from "@mrleebo/prisma-ast";
import { handlerResponse } from "../../handler-registries/handler-registry.js";
import { parseFieldForBuilder } from "../../utils/schema-helper.js";
export const addField = (prismaState, data) => {
    const response = handlerResponse(data);
    const { args } = data;
    if (!args?.fields || !args.fields.length) {
        return response.error("No fields provided. Example: 'ADD FIELD -> [FieldName] TO [ModelName] ({String @default('123')})'");
    }
    if (!args?.models || !args.models.length) {
        return response.error("No model name provided. Example: 'ADD FIELD [FieldName] TO -> [ModelName] ({String @default('123')})'");
    }
    const modelName = args.models[0];
    const model = prismaState.builder.findByType("model", { name: modelName });
    if (!model) {
        return response.error(`Model ${modelName} not found. Please ensure the model name is correct.`);
    }
    const fieldName = args.fields[0];
    if (!data.prismaBlock) {
        return response.error("No field type provided. Example: 'ADD FIELD [FieldName] TO [ModelName] -> ({String @default('123')})'");
    }
    const prevField = model.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
    if (prevField) {
        return response.error(`Field ${fieldName} already exists in model ${modelName}`);
    }
    const sourceField = `model Test {
        ${fieldName}  ${data.prismaBlock}
    }`;
    let parsed;
    try {
        parsed = getSchema(sourceField);
    }
    catch (error) {
        return response.error(`Error parsing field: ${error.message}`);
    }
    if (!parsed.list.length) {
        return response.error("No models found in the schema. Ensure the field block is correct and includes Prisma field attributes, including the type, but without the field name. Example: 'ADD FIELD [FieldName] TO [ModelName] -> ({String @default('123')})'");
    }
    const testModel = parsed.list[0];
    const field = testModel.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
    if (!field) {
        return response.error("Invalid field. Please refer to the documentation and ensure the field block is correct. Example: 'ADD FIELD [FieldName] TO [ModelName] -> ({String?});'");
    }
    const fieldData = parseFieldForBuilder(field);
    if (!fieldData) {
        return response.error("Invalid field. Please refer to the documentation and ensure the field block is correct. Example: 'ADD FIELD [FieldName] TO [ModelName] -> ({String?});'");
    }
    const modelBuilder = prismaState.builder.model(model.name);
    if (fieldData) {
        const fieldBuilder = modelBuilder.field(fieldData.name, fieldData.fieldType);
        for (const attr of fieldData.attributes) {
            fieldBuilder.attribute(attr.name, attr.args);
        }
    }
    return response.result(`Field ${fieldName} added to model ${modelName}`);
};
//# sourceMappingURL=add-field.js.map