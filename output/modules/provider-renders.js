import { validatePrismaSchema } from "./prisma-validation.js";
import { enumsToSchema, fieldsToSchema, modelsToSchema, relationsToSchema } from "./renders.js";
import relationLogger from "./relation-logger.js";
import { renderModels } from "./renders/render-models.js";
export const provideQueryRenderHandlers = (instance) => {
    instance.registerCommandHandler("GET_MODEL_NAMES", async (prismaData) => {
        const { parsedSchema } = prismaData;
        const models = parsedSchema.list
            .filter(item => item.type === "model")
            .map(model => model);
        return renderModels(models);
    });
    instance.registerCommandHandler("GET_RELATION_LIST", async (prismaData, command, manager) => {
        const { parsedSchema } = prismaData;
        const models = parsedSchema.list?.filter(item => item.type === "model");
        if (!models) {
            throw new Error("No models found in schema.");
        }
        try {
            const log = relationLogger.generateRelationTreeLog(command.model, command?.depth || 3, manager.getRelations());
            return log;
        }
        catch (error) {
            console.error("Error generating relation tree:", error.message);
        }
    });
    instance.registerCommandHandler("GET_MODELS", async (prismaData) => {
        const { parsedSchema } = prismaData;
        const models = parsedSchema.list
            .filter(item => item.type === "model")
            .map(model => model);
        return modelsToSchema(models);
    });
    instance.registerCommandHandler("GET_MODEL", async (prismaData, command) => {
        const builder = prismaData.builder;
        const model = builder.findByType("model", { name: command.model });
        if (!model) {
            throw new Error(`Model "${command.model}" not found.`);
        }
        return modelsToSchema([model]);
    });
    instance.registerCommandHandler("GET_FIELD", async ({ builder }, command) => {
        const model = builder.findByType("model", { name: command.model });
        if (!model) {
            throw new Error(`Model "${command.model}" not found.`);
        }
        const field = model.properties.find((prop) => prop.type === "field" && prop.name === command.field);
        if (!field) {
            throw new Error(`Field "${command.field}" not found in model "${command.model}".`);
        }
        if (command.attribute) {
            const attr = field.attributes?.find((attr) => attr.name === command.attribute);
            if (!attr) {
                throw new Error(`Attribute "${command.attribute}" not found in field "${command.field}".`);
            }
            return attr;
        }
        return fieldsToSchema(model, [field]);
    });
    instance.registerCommandHandler("GET_RELATIONS", async ({ builder }, command) => {
        const model = builder.findByType("model", { name: command.model });
        if (!model) {
            throw new Error(`Model "${command.model}" not found.`);
        }
        return relationsToSchema(model, builder);
    });
    instance.registerCommandHandler("GET_ENUM_NAMES", async ({ parsedSchema }, command) => {
        const enums = parsedSchema.list
            .filter(item => item.type === "enum")
            .map(enumItem => enumItem.name);
        return enums;
    });
    instance.registerCommandHandler("GET_ENUMS", async ({ parsedSchema }) => {
        const enums = parsedSchema.list
            .filter(item => item.type === "enum")
            .map(enumItem => enumItem);
        return enumsToSchema(enums);
    });
    instance.registerCommandHandler("GET_ENUM", async ({ builder }, command) => {
        const enumItem = builder.findByType("enum", { name: command.enum });
        if (!enumItem) {
            throw new Error(`Enum "${command.enum}" not found.`);
        }
        return enumsToSchema([enumItem]);
    });
    instance.registerCommandHandler("VALIDATE_SCHEMA", async ({ schema }, command, manager) => {
        const result = await validatePrismaSchema(schema);
        if (result instanceof Error) {
            return `❌ Schema is invalid: ${result.message}`;
        }
        else {
            return "✅ Schema is valid.";
        }
    });
    instance.registerCommandHandler("PRINT", async ({ builder, schema }) => {
        return schema;
    });
};
//# sourceMappingURL=provider-renders.js.map