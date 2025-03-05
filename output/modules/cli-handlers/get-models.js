import { printSchema } from "@mrleebo/prisma-ast";
import { useHelper } from "../schema-helper.js";
import boxen from "boxen";
import { PrismaHighlighter } from "prismalux";
import chalk from "chalk";
const highlightPrismaSchema = new PrismaHighlighter();
export const getModels = (prismaState, args) => {
    const models = useHelper(prismaState).getModels(args?.models);
    const schema = {
        type: "schema",
        list: models,
    };
    const modelCount = models.length;
    const title = modelCount > 0
        ? `📊 Query Result: ${chalk.bold(modelCount)} model${modelCount > 1 ? "s" : ""} found:`
        : `❌ No models found`;
    const highlightedSchema = highlightPrismaSchema.highlight(printSchema(schema));
    const output = models?.length ? `
${title}

${highlightedSchema} 
        ` : title;
    const statsBox = boxen(output, {
        padding: 1,
        borderColor: modelCount > 0 ? "green" : "red",
        borderStyle: "round",
        align: "left"
    });
    return statsBox;
};
//# sourceMappingURL=get-models.js.map