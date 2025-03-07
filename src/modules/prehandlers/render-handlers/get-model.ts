import chalk from "chalk";
import { Handler, handlerResponse } from "../../handler-registries/handler-registry.js"
import { printSchema, Schema } from "@mrleebo/prisma-ast";
import { useHelper } from "../../utils/schema-helper.js";
import { getRelationStatistics } from "../../field-relation-logger.js";
import { PrismaHighlighter } from "prismalux";
import { extractModelSummary } from "../../utils/model-primary-fields.js";
import boxen from "boxen";
const highlightPrismaSchema = new PrismaHighlighter();

export type FieldSummary = {
    name: string;
    type: string;
    isId: boolean;
    isUnique: boolean;
    isRelation: boolean;
};


export const getModel: Handler<"GET", "MODEL", "query"> = (prismaState, data) => {
    const { args } = data;
    const response = handlerResponse(data);

    const modelName = args?.models?.[0];
    if (!modelName) {
        return response.error("No model specified. Example usage: GET MODEL ->[ModelName];");
    }


    const model = useHelper(prismaState).getModelByName(modelName);
    if (!model) {
        return response.error(`Model ${modelName} not found`)
    }

    const fields: FieldSummary[] = extractModelSummary(model, prismaState.relations);
    const { totalRelations } = getRelationStatistics(prismaState.relations, model.name);

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
    return response.result(boxen(output, {
        padding: 1,
        borderColor: "cyan",
        borderStyle: "round",
    }));
}