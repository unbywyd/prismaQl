import chalk from "chalk";
import boxen from "boxen";
import { printSchema } from "@mrleebo/prisma-ast";
import relationLogger from "../../relation-logger.js";
import pkg from '@prisma/internals';
const { getDMMF } = pkg;
import { extractModelSummary } from "../../get-model-summary.js";
import { PrismaHighlighter } from "prismalux";
const highlightPrismaSchema = new PrismaHighlighter();
export const renderModel = async (model) => {
    const fields = extractModelSummary(model);
    const { totalRelations, uniqueModels } = relationLogger.getRelationStatistics(model.name);
    const schema = {
        type: "schema",
        list: [model],
    };
    const hSchema = highlightPrismaSchema.highlight(printSchema(schema));
    // Model Title
    let output = `${chalk.bold.whiteBright("Model:")} ${chalk.greenBright(model.name)}\n`;
    output += `${chalk.whiteBright("Relations:")} ${totalRelations > 0
        ? `${chalk.greenBright(totalRelations)} relations`
        : chalk.redBright("No relations")}\n\n`;
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
        return `${fieldName.padEnd(maxFieldLength + 2)} ${fieldType.padEnd(maxTypeLength + 2)}`;
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
};
//# sourceMappingURL=render-model.js.map