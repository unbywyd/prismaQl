import chalk from "chalk";
import { DSLCommand, QueryAction } from "../dsl.js"
import { Handler, HandlerRegistry } from "../handler-registries/handler-registry.js"
import { Relation } from "../relation-collector.js";
import { Model, printSchema, Property, Schema } from "@mrleebo/prisma-ast";
import { useHelper } from "../schema-helper.js";
import { getRelationStatistics } from "../relation-logger.js";
import { PrismaHighlighter } from "prismalux";
import boxen from "boxen";
const highlightPrismaSchema = new PrismaHighlighter();

export type FieldSummary = {
    name: string;
    type: string;
    isId: boolean;
    isUnique: boolean;
    isRelation: boolean;
};

export function extractModelSummary(model: Model, relations: Relation[]): FieldSummary[] {
    const fields = model?.properties?.filter(
        (prop): prop is Property => prop.type === "field" &&

            ((prop?.attributes?.some(attr => attr.name === "unique") === true) || (prop?.attributes?.some(attr => attr.name === "id") === true))

    ) || [];

    return fields.map((field: any) => {
        const isId = field?.attributes?.some((attr: any) => attr.name === "id") || false;
        const isUnique = field?.attributes?.some((attr: any) => attr.name === "unique") || false;
        let relation;
        let fieldType = field.fieldType;

        relations.find((rel) => {
            if (rel.modelName === model.name) {
                if (rel.fieldName === field.name || rel.foreignKey === field.name) {
                    relation = rel;
                    fieldType = `${rel.relatedModel}.id`;
                }
            }
        });
        if (isId) {
            const defAttr = field?.attributes?.find((attr: any) => attr.name === "default")?.args[0]?.value;
            if (defAttr?.type === "function") {
                fieldType = defAttr.name;
            }
        }
        return {
            name: field.name,
            type: fieldType,
            isId,
            isUnique,
            isRelation: !!relation
        };
    });
}


export const getModel: Handler<"GET", "MODEL"> = (prismaState, args) => {
    if (!args?.models?.length) {
        return "No model specified";
    }
    const modelName = args.models[0];

    const model = useHelper(prismaState).getModelByName(modelName);
    if (!model) {
        return `Model ${modelName} not found`;
    }

    const fields: FieldSummary[] = extractModelSummary(model, prismaState.relations);
    const { totalRelations, uniqueModels } = getRelationStatistics(prismaState.relations, model.name);

    const schema: Schema = {
        type: "schema",
        list: [model],
    };
    const hSchema = highlightPrismaSchema.highlight(printSchema(schema));

    // Model Title
    let output = `${chalk.bold.whiteBright("Model:")} ${chalk.greenBright(model.name)}\n`;
    output += `${chalk.whiteBright("Relations:")} ${totalRelations > 0
        ? `${chalk.greenBright(totalRelations)} relations`
        : chalk.redBright("No relations")
        }\n\n`;

    // Fields Table
    const maxFieldLength = Math.max(...fields.map((f) => f.name.length), 5);
    const maxTypeLength = Math.max(...fields.map((f) => f.type.length), 4);

    output += chalk.underline("Unique Fields:\n");
    output += fields
        .map((field) => {
            const fieldName = field.isId
                ? chalk.bold.red(field.name)
                : field.isUnique
                    ? chalk.bold.yellow(field.name)
                    : chalk.white(field.name);

            const fieldType = field.isRelation ? chalk.cyan(field.type) : chalk.blueBright(field.type);

            return `${fieldName.padEnd(maxFieldLength + 2)} ${fieldType.padEnd(
                maxTypeLength + 2
            )}`;
        })
        .join("\n");

    output += "\n\n";

    // Prisma Schema Source
    output += chalk.underline("Schema:") + hSchema;

    // Boxen output
    return boxen(output, {
        padding: 1,
        borderColor: "cyan",
        borderStyle: "round",
    });
}