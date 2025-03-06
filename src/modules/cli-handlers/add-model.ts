import { AttributeArgument, getSchema, produceSchema, Property } from "@mrleebo/prisma-ast";
import { Handler, handlerResponse } from "../handler-registries/handler-registry.js";
import { parseFieldForBuilder, useHelper } from "../schema-helper.js";


export const addModel: Handler<"ADD", "MODEL", "mutation"> = (prismaState, data) => {
    const { args, options, prismaBlock } = data;

    const response = handlerResponse(data);
    if (!args?.models) {
        return response.error("No models provided to add.");
    }
    try {
        const modelName = args?.models[0];

        if (!modelName) {
            return response.error("No model name provided");
        }
        const builder = prismaState.builder;

        const prevModel = builder.findByType("model", { name: modelName });
        if (prevModel) {
            return response.error(`Model ${modelName} already exists`);
        }

        if (!prismaBlock) {
            return response.error("No fields provided");
        }
        // Так как команда у нас моожет быть инлайн, нам нужно заменить искуственные переносы строк на настоящие
        const sourceModel = `model ${modelName} {
        ${prismaBlock || "id Int @id"}
        }`;

        const parsed = getSchema(sourceModel);
        const model = useHelper(parsed).getModelByName(modelName);

        if (!model) {
            return response.error(`Model ${modelName} already exists`);
        }

        const modelBuilder = builder.model(modelName);

        const idField = model.properties.find((prop: Property) => prop.type === "field" && prop?.attributes?.some(attr => attr.name === "id"));
        if (!idField) {
            modelBuilder.field("id", "Int").attribute("id");
        }

        const addedFieldNames = new Set<string>();
        for (const prop of model.properties) {
            if (prop.type !== "field") {
                continue;
            }
            const field = prop as Property;

            const fieldData = parseFieldForBuilder(prop as Property);
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
        const filterFieldsFor = ['unique', 'index', 'id'] as Array<string>;
        const filterFields = (fields: Array<string>, prop: string) => {
            if (!filterFieldsFor.includes(prop)) {
                return fields;
            }
            return fields.filter((field) => {
                return addedFieldNames.has(field);
            });
        }
        function fixUniqueKeyValues(keyValues: Record<string, any>, prop: string): any {
            if (!keyValues) return null;
            if (!keyValues.fields) return keyValues;
            const fields = filterFields(keyValues.fields?.args || [], prop);
            if (fields.length) {
                return {
                    ...keyValues,
                    fields: { type: "array", args: fields }
                };
            } else {
                return null;
            }
        }
        const blockAttributesMap = new Map<string, { args?: string[], keyValues?: Record<string, string> }>();

        for (const prop of model.properties) {
            if (prop.type === "attribute" && prop.args) {
                let arrayArgs: string[] = [];
                let keyValueArgs: Record<string, string> = {};
                for (const arg of prop.args) {
                    const { value, type } = arg as any;
                    if (type == "attributeArgument") {
                        if ("string" == typeof value) {
                            modelBuilder.blockAttribute(prop.name, value);
                        } else if ("object" == typeof value) {
                            const val = value as any;
                            if (val.type === "array") {
                                const result = filterFields(val.args, prop.name);
                                if (result.length) {
                                    modelBuilder.blockAttribute(prop.name, result);
                                }
                            } else if (val.type === "keyValue") {
                                keyValueArgs[val.key] = val.value;
                            }
                        }
                    }

                }
                if (arrayArgs.length || Object.keys(keyValueArgs).length) {
                    if (blockAttributesMap.has(prop.name)) {
                        const existing = blockAttributesMap.get(prop.name)!;
                        existing.args = [...new Set([...(existing.args || []), ...arrayArgs])];
                        existing.keyValues = { ...existing.keyValues, ...keyValueArgs };
                    } else {
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
                } else {
                    modelBuilder.blockAttribute(name, keyValues);
                }
            } else if (args?.length) {
                modelBuilder.blockAttribute(name, args);
            } else if (keyValues && Object.keys(keyValues).length) {
                const output = fixUniqueKeyValues(keyValues, name);
                if (output) {
                    modelBuilder.blockAttribute(name, output);
                }
            }
        }
        return response.result(`Model ${modelName} added successfully`);
    } catch (error) {
        return response.error(`Error adding model: ${error.message}`);
    }
}