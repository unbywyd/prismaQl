import { getSchema } from "@mrleebo/prisma-ast";
import { handlerResponse } from "../../handler-registries/handler-registry.js";
import { parseFieldForBuilder, useHelper } from "../../utils/schema-helper.js";
export const addModel = (prismaState, data) => {
    const { args, prismaBlock } = data;
    const response = handlerResponse(data);
    const modelName = (args?.models || [])[0];
    if (!modelName) {
        return response.error("Model name is required. Example: ADD MODEL -> [ModelName] ({id String @id})");
    }
    try {
        const builder = prismaState.builder;
        const prevModel = builder.findByType("model", { name: modelName });
        if (prevModel) {
            return response.error(`Model ${modelName} already exists`);
        }
        if (!prismaBlock) {
            return response.error("No fields provided. Please provide a valid block in ({...}) containing a valid Prisma field description.");
        }
        let parsed;
        const sourceModel = `model ${modelName} {
        ${prismaBlock || "id Int @id"}
        }`;
        try {
            parsed = getSchema(sourceModel);
        }
        catch (error) {
            return response.error(`Invalid block provided. Error parsing model: ${error.message}`);
        }
        const model = useHelper(parsed).getModelByName(modelName);
        if (!model) {
            return response.error(`Model ${modelName} already exists`);
        }
        const modelBuilder = builder.model(modelName);
        const idField = model.properties.find((prop) => prop.type === "field" && prop?.attributes?.some(attr => attr.name === "id"));
        if (!idField) {
            modelBuilder.field("id", "Int").attribute("id");
        }
        const addedFieldNames = new Set();
        for (const prop of model.properties) {
            if (prop.type !== "field") {
                continue;
            }
            const field = prop;
            const fieldData = parseFieldForBuilder(prop);
            if (!fieldData) {
                continue;
            }
            if (fieldData) {
                let fieldBuilder = modelBuilder.field(field.name, fieldData.fieldType);
                addedFieldNames.add(field.name);
                for (const attr of fieldData.attributes) {
                    fieldBuilder = fieldBuilder.attribute(attr.name, attr.args);
                }
            }
        }
        const filterFieldsFor = ['unique', 'index', 'id'];
        const filterFields = (fields, prop) => {
            if (!filterFieldsFor.includes(prop)) {
                return fields;
            }
            return fields.filter((field) => {
                return addedFieldNames.has(field);
            });
        };
        function fixUniqueKeyValues(keyValues, prop) {
            if (!keyValues)
                return null;
            if (!keyValues.fields)
                return keyValues;
            const fields = filterFields(keyValues.fields?.args || [], prop);
            if (fields.length) {
                return {
                    ...keyValues,
                    fields: { type: "array", args: fields }
                };
            }
            else {
                return null;
            }
        }
        const blockAttributesMap = new Map();
        for (const prop of model.properties) {
            if (prop.type === "attribute" && prop.args) {
                let arrayArgs = [];
                let keyValueArgs = {};
                for (const arg of prop.args) {
                    const { value, type } = arg;
                    if (type == "attributeArgument") {
                        if ("string" == typeof value) {
                            modelBuilder.blockAttribute(prop.name, value);
                        }
                        else if ("object" == typeof value) {
                            const val = value;
                            if (val.type === "array") {
                                const result = filterFields(val.args, prop.name);
                                if (result.length) {
                                    modelBuilder.blockAttribute(prop.name, result);
                                }
                            }
                            else if (val.type === "keyValue") {
                                keyValueArgs[val.key] = val.value;
                            }
                        }
                    }
                }
                if (arrayArgs.length || Object.keys(keyValueArgs).length) {
                    if (blockAttributesMap.has(prop.name)) {
                        const existing = blockAttributesMap.get(prop.name);
                        existing.args = [...new Set([...(existing.args || []), ...arrayArgs])];
                        existing.keyValues = { ...existing.keyValues, ...keyValueArgs };
                    }
                    else {
                        blockAttributesMap.set(prop.name, { args: arrayArgs, keyValues: keyValueArgs });
                    }
                }
            }
        }
        for (const [name, { keyValues, args }] of blockAttributesMap.entries()) {
            if (keyValues && args?.length && Object.keys(keyValues).length) {
                const fields = filterFields(args, name);
                if (fields.length) {
                    modelBuilder.blockAttribute(name, {
                        ...keyValues,
                        fields: { type: "array", args }
                    });
                }
                else {
                    modelBuilder.blockAttribute(name, keyValues);
                }
            }
            else if (args?.length) {
                modelBuilder.blockAttribute(name, args);
            }
            else if (keyValues && Object.keys(keyValues).length) {
                const output = fixUniqueKeyValues(keyValues, name);
                if (output) {
                    modelBuilder.blockAttribute(name, output);
                }
            }
        }
        return response.result(`Model ${modelName} added successfully`);
    }
    catch (error) {
        return response.error(`Error adding model: ${error.message}`);
    }
};
//# sourceMappingURL=add-model.js.map