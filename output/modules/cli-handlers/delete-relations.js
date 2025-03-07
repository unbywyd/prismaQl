import chalk from "chalk";
import { handlerResponse } from "../handler-registries/handler-registry.js";
export const deleteRelation = (prismaState, data) => {
    const { args, options } = data;
    const response = handlerResponse(data);
    const models = args?.models;
    if (!models || models.length !== 2) {
        return response.error("Two models are required to remove a relation. Example: DELETE RELATION -> [ModelA], [ModelB]");
    }
    const [modelA, modelB] = models;
    const { builder } = prismaState;
    const modelARef = builder.findByType("model", { name: modelA });
    const modelBRef = builder.findByType("model", { name: modelB });
    if (!modelARef) {
        return response.error(`Model ${modelA} not found`);
    }
    if (!modelBRef) {
        return response.error(`Model ${modelB} not found`);
    }
    const fieldA = options?.fieldA;
    const fieldB = options?.fieldB;
    if (fieldA && !fieldB) {
        return response.error(`Field ${fieldA} specified for ${modelA} but no field specified for ${modelB}`);
    }
    if (options?.relationName) {
        console.log(chalk.yellow(`Relation name is specified. Attempting to remove relation by name`));
        const fieldsA = modelARef.properties.filter((prop) => prop.type === "field" && (prop.fieldType === modelB || prop.fieldType === modelA));
        const fieldsAByRelation = fieldsA.filter((field) => field?.attributes?.find((attr) => attr.type === "attribute" && attr.name === "relation" && attr.args?.some((arg) => arg.type === "attributeArgument" && arg.value === `"${options.relationName}"`)));
        if (fieldsAByRelation.length === 0) {
            return response.error(`Relation ${options.relationName} not found between ${modelA} and ${modelB}`);
        }
        for (const field of fieldsAByRelation) {
            builder.model(modelA).removeField(field.name);
        }
        const fieldsB = modelBRef.properties.filter((prop) => prop.type === "field" && (prop.fieldType === modelB || prop.fieldType === modelA));
        const fieldsBByRelation = fieldsB.filter((field) => field?.attributes?.find((attr) => attr.type === "attribute" && attr.name === "relation" && attr.args?.some((arg) => arg.type === "attributeArgument" && arg.value === `"${options.relationName}"`)));
        for (const field of fieldsBByRelation) {
            builder.model(modelB).removeField(field.name);
        }
        if (fieldsAByRelation.length === 0 && fieldsBByRelation.length === 0) {
            return response.error(`Relation ${options.relationName} not found between ${modelA} and ${modelB}`);
        }
        return response.result(`Relation ${options.relationName} removed between ${modelA} and ${modelB}`);
    }
    if (!fieldA && !fieldB) {
        console.log(chalk.yellow(`No fields specified. Attempting to remove all relations between ${modelA} and ${modelB}`));
        const fieldsToRemoveA = modelARef.properties.filter((prop) => prop.type === "field" && prop.fieldType === modelB);
        const fieldsToRemoveB = modelBRef.properties.filter((prop) => prop.type === "field" && prop.fieldType === modelA);
        for (const field of fieldsToRemoveA) {
            builder.model(modelA).removeField(field.name);
        }
        for (const field of fieldsToRemoveB) {
            builder.model(modelB).removeField(field.name);
        }
        if (fieldsToRemoveA.length === 0 && fieldsToRemoveB.length === 0) {
            return response.error(`Relations not found between ${modelA} and ${modelB}`);
        }
        return response.result(`All relations between ${modelA} and ${modelB} removed`);
    }
    const modelABuilder = builder.model(modelA);
    const fieldInA = modelARef.properties.find((prop) => (prop.type === "field" && prop.name == fieldA) && (prop.fieldType === modelB || prop.fieldType === modelA));
    if (fieldInA) {
        modelABuilder.removeField(fieldInA.name);
    }
    const modelBBuilder = builder.model(modelB);
    const fieldInB = modelBRef.properties.find((prop) => (prop.type === "field" && prop.name == fieldB) && (prop.fieldType === modelB || prop.fieldType === modelA));
    if (fieldInB) {
        modelBBuilder.removeField(fieldInB.name);
    }
    if (fieldInA || fieldInB) {
        return response.result(`Relation ${fieldInA?.name || fieldInB?.name} removed between ${modelA} and ${modelB}`);
    }
    return response.error(`Relation not found between ${modelA} and ${modelB}`);
};
//# sourceMappingURL=delete-relations.js.map