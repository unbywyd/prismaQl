import { getManyToManyModelName, getManyToManyTableName } from "../../field-relation-collector.js";
import { PrismaQlHandler, handlerResponse } from "../../handler-registries/handler-registry.js";
import pluralize from "pluralize";
import { camelCase, pascalCase } from "change-case";
import { useHelper } from "../../utils/schema-helper.js";

export const addRelation: PrismaQlHandler<"ADD", "RELATION", "mutation"> = (prismaState, data) => {
    const { args, options } = data;
    const response = handlerResponse(data);
    const type = options?.type;

    const models = args?.models;
    if (!models || models.length !== 2) {
        return response.error("Two models are required for relation. Example: ADD RELATION ->[ModelA] AND ->[ModelB] (type=1:1)");
    }

    if (!type) {
        return response.error("Relation type is required. Valid types are: '1:1', '1:M', 'M:N'. Example: ADD RELATION ModelA AND ModelB (type=1:1)");
    }

    const [modelA, modelB] = models;
    const { builder } = prismaState;
    const modelARef = builder.findByType("model", { name: modelA });
    const modelBRef = builder.findByType("model", { name: modelB });
    if (!modelARef) {
        return response.error(`Model ${modelA} not found, please add it first`);
    }
    if (!modelBRef) {
        return response.error(`Model ${modelB} not found, please add it first`);
    }
    const optional = options?.required === false || options?.required === undefined;
    const pivotTable = (options?.pivotTable && options?.pivotTable === true) ? getManyToManyModelName(modelA, modelB) : (options?.pivotTable || null) as string | null;
    const sourceRelationName = options?.relationName || getManyToManyTableName(modelA, modelB);
    const relationName = `"${sourceRelationName}"`;
    const pivotModelName = pivotTable ? pascalCase(pivotTable) : null;
    const isSelfRelation = modelA === modelB;
    const fk = (modelName: string,): string => {
        return camelCase(`${modelName}Id`);
    }
    const selfPrefix = (modelName: string, asFk = false): string => {
        return isSelfRelation ? camelCase(((modelName + 'By') + (asFk ? "Id" : ""))) : camelCase(modelName + (asFk ? "Id" : ""));
    }

    if (options?.fkHolder && options?.fkHolder !== modelA && options?.fkHolder !== modelB) {
        return response.error(`Model ${options.fkHolder} not found, please add it first`);
    }
    const makeOptional = (str: string) => {
        return str + "?";
    }
    const isOptional = (str: string) => {
        return str + (optional ? "?" : "");
    }

    const helper = useHelper(prismaState);
    // Нужно получить тип поля ИД каждой модели

    if (type == '1:1') {
        if (!pivotTable) {
            const aModelName = options?.fkHolder || modelBRef.name;
            const bModelName = aModelName === modelA ? modelB : modelA;
            const idFieldModelB = (helper.getIdFieldTypeModel(bModelName) || 'String') as string;

            const fkKey = fk(bModelName);
            const refModelKey = selfPrefix(bModelName);
            builder.model(aModelName)
                .field(fkKey, isOptional(idFieldModelB)).attribute("unique")
                .field(refModelKey, isOptional(bModelName))
                .attribute("relation", [relationName, `fields: [${fkKey}]`, `references: [id]`]);

            builder.model(bModelName)
                .field(camelCase(aModelName), makeOptional(aModelName))
                .attribute("relation", [relationName]);

            return response.result(`One-to-One relation added between ${modelA} and ${modelB}`);
        } else {
            const fkA = selfPrefix(modelA, true);
            const fkB = fk(modelB);
            const pivotOnly = options?.pivotOnly;

            const idFieldModelA = (helper.getIdFieldTypeModel(modelA) || 'String') as string;
            const idFieldModelB = (helper.getIdFieldTypeModel(modelB) || 'String') as string;
            if (!pivotOnly) {
                builder.model(pivotModelName!)
                    .field("createdAt", "DateTime").attribute("default", ["now()"])
                    .field(fkA, idFieldModelA).attribute("unique")
                    .field(fkB, idFieldModelB)
                    .blockAttribute("id", [fkA, fkB])
                    .field(modelA.toLowerCase(), modelA).attribute("relation", [
                        relationName,
                        `fields: [${fkA}]`,
                        `references: [id]`
                    ]);

                builder.model(modelA)
                    .field(camelCase(modelB), `${pivotModelName}?`)
                    .attribute("relation", [relationName]);
            } else {
                builder.model(pivotModelName!)
                    .field(fkA, idFieldModelA).attribute("unique")
                    .field(fkB, idFieldModelB)
                    .field("createdAt", "DateTime").attribute("default", ["now()"])
                    .blockAttribute("id", [fkA, fkB]);
            }

            return response.result(`One-to-One relation (with pivot table) added between ${modelA} and ${modelB}`);

        }
    } else if (type == "1:M") {
        if (!pivotTable) {
            const required = options?.required;
            const aModelName = options?.fkHolder || modelA;
            const bModelName = aModelName === modelA ? modelB : modelA;

            const idFieldModelB = (helper.getIdFieldTypeModel(bModelName) || 'String') as string;
            const fkKey = fk(bModelName);
            const refModelKey = selfPrefix(bModelName);

            const fkFieldName = options?.fkName || fkKey;
            const pluralName = options?.pluralName || pluralize.plural(camelCase(aModelName));
            const refFieldName = options?.refName || refModelKey;

            builder.model(aModelName)
                .field(fkFieldName, !required ? isOptional(idFieldModelB) : idFieldModelB)
                .field(refFieldName, !required ? isOptional(bModelName) : bModelName)
                .attribute("relation", [relationName, `fields: [${fkFieldName}]`, `references: [id]`]);

            builder.model(bModelName)
                .field(pluralName, aModelName + "[]")
                .attribute("relation", [relationName]);

            return response.result(`One-to-Many relation added between ${modelA} and ${modelB}`);
        } else {
            const fkA = selfPrefix(modelA, true);
            const fkB = selfPrefix(modelB, true);

            const idFieldModelA = (helper.getIdFieldTypeModel(modelA) || 'String') as string;
            const idFieldModelB = (helper.getIdFieldTypeModel(modelB) || 'String') as string;
            builder.model(pivotModelName!)
                .field("createdAt", "DateTime").attribute("default", ["now()"])
                .field(fkA, idFieldModelA).attribute("unique")
                .field(fkB, idFieldModelB).attribute("unique")
                .blockAttribute("id", [fkA, fkB])
                .field(modelA.toLowerCase(), modelA).attribute("relation", [
                    relationName,
                    `fields: [${fkA}]`,
                    `references: [id]`
                ]);

            builder.model(modelA)
                .field(pluralize.plural(camelCase(modelB)), `${pivotModelName}[]`)
                .attribute("relation", [relationName]);

            return response.result(`One-to-Many relation (with pivot table) added between ${modelA} and ${modelB}`);
        }
    } if (type == "M:N") {
        if (!pivotTable) {
            const toKey = pluralize.plural(camelCase(modelB));
            const fromKey = pluralize.plural(selfPrefix(modelA));

            builder.model(modelA)
                .field(toKey, `${modelB}[]`)
                .attribute("relation", [relationName]);

            builder.model(modelB)
                .field(fromKey, `${modelA}[]`)
                .attribute("relation", [relationName]);
            return response.result(`Many-to-Many relation (without pivot table) added between ${modelA} and ${modelB}`);
        } else {
            const customSelfPrefix = (str: string) => {
                return isSelfRelation ? (str + 'By') : str;
            }
            const toPluralKey = pluralize.plural(camelCase(modelB));
            const fromPluralKey = pluralize.plural(selfPrefix(modelA));

            const aModelBuilder = builder.model(modelA)
                .field(toPluralKey, `${pivotModelName}[]`)
                .attribute("relation", [relationName]);

            const bModelBuilder = isSelfRelation ? aModelBuilder : builder.model(modelB);
            bModelBuilder.field(fromPluralKey, `${pivotModelName}[]`)
                .attribute("relation", [`"${customSelfPrefix(sourceRelationName)}"`]);


            const fkA = selfPrefix(modelA, true);
            const fkB = fk(modelB);

            const toKey = camelCase(modelB);
            const fromKey = selfPrefix(modelA);

            const idFieldModelA = (helper.getIdFieldTypeModel(modelA) || 'String') as string;
            const idFieldModelB = (helper.getIdFieldTypeModel(modelB) || 'String') as string;
            builder.model(pivotModelName!)
                .field(fkA, idFieldModelA)
                .field(fkB, idFieldModelB)
                .field("createdAt", "DateTime").attribute("default", ["now()"])

                .field(fromKey, modelA).attribute("relation", [
                    `"${(customSelfPrefix(sourceRelationName))}"`,
                    `fields: [${fkA}]`,
                    `references: [id]`,
                    `onDelete: Cascade`,
                ])
                .field(toKey, modelB).attribute("relation", [
                    relationName,
                    `fields: [${fkB}]`,
                    `references: [id]`,
                    `onDelete: Cascade`,
                ])
                .blockAttribute("id", [fkA, fkB]);
        }


        return response.result(`Many-to-Many relation (with pivot table) added for ${modelA} and ${modelB}`);
    }

    return response.error("Not implemented");
}

