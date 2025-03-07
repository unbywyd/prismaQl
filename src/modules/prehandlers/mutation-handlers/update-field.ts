import { Field, getSchema, Model, Property } from "@mrleebo/prisma-ast";
import { PrismaQlHandler, handlerResponse } from "../../handler-registries/handler-registry.js";
import { parseFieldForBuilder } from "../../utils/schema-helper.js";

export const updateField: PrismaQlHandler<"UPDATE", "FIELD", "mutation"> = (prismaState, data) => {
    const response = handlerResponse(data);
    const { args } = data;
    const fieldName = args?.fields?.[0];
    if (!fieldName) {
        return response.error("No field name provided. Usage: UPDATE FIELD ->[FieldName] IN [ModelName] ({String @default('test')})");
    }
    const modelName = args?.models?.[0];

    if (!modelName) {
        return response.error("No model name provided. Usage: UPDATE FIELD [FieldName] IN -> [ModelName] ({String @default('test')})");
    }

    const model = prismaState.builder.findByType("model", { name: modelName });
    if (!model) {
        return response.error(`Model ${modelName} not found`);
    }

    if (!data.prismaBlock) {
        return response.error("No field block provided. Example: 'UPDATE FIELD FieldName IN ModelName ->[({String @default('test')})];'");
    }

    const prevField = model.properties.find((prop) => prop.type === "field" && prop.name === fieldName) as Field;
    if (!prevField) {
        return response.error(`Field ${fieldName} does not exist in model ${modelName}`);
    }
    let parsed: ReturnType<typeof getSchema>;
    const sourceField = `model Test {
        ${fieldName} ${data.prismaBlock}
    }`;

    try {
        parsed = getSchema(sourceField);
    } catch (error) {
        return response.error("There is likely an issue with the block. The block should contain Prisma field attributes including the type, but without the field name. Example: 'String @default('test')'");
    }

    const testModel = parsed.list[0] as Model;
    const newField = testModel.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
    if (!newField) {
        return response.error("Invalid field. Please refer to the documentation and ensure the field block is correct. Example: 'UPDATE FIELD [FieldName] IN [ModelName] -> ({String?});'");
    }
    const fieldData = parseFieldForBuilder(newField as Property);
    if (!fieldData) {
        return response.error("Invalid field. Please refer to the documentation and ensure the field block is correct. Example: 'UPDATE FIELD [FieldName] IN [ModelName] -> ({String?});'");
    }
    const modelBuilder = prismaState.builder.model(model.name);
    if (fieldData) {
        modelBuilder.removeField(fieldName);
        const fieldBuilder = modelBuilder.field(fieldData.name, fieldData.fieldType);

        for (const attr of fieldData.attributes) {
            fieldBuilder.attribute(attr.name, attr.args);
        }
    }

    return response.result(`Field ${fieldName} added to model ${modelName}`);
}
