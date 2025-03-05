import { printSchema } from "@mrleebo/prisma-ast";
import { PrismaHighlighter } from "prismalux";
import chalk from "chalk";
import boxen from "boxen";
const highlightPrismaSchema = new PrismaHighlighter();
export const getModels = (models) => {
    if (models.length === 0) {
        return chalk.red.bold("❌ No models in Prisma schema.");
    }
    // Statistics
    const stats = `${chalk.cyan("📊 Total models:")} ${chalk.green.bold(models.length)}`;
    // Nicely format the list of models
    const formattedModels = models.map(model => `${chalk.hex("#BE5CF6")("•")} ${chalk.bold(model.name)}`).join("\n");
    // Final output in a box
    return boxen(`${stats}\n\n${formattedModels}`, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
        title: "Prisma Models",
        titleAlignment: "center"
    });
};
export const modelsToSchema = (models) => {
    const schema = {
        type: 'schema',
        list: models
    };
    return highlightPrismaSchema.highlight(printSchema(schema));
};
/**
 * Converts model relations to Prisma syntax.
 */
export const relationsToSchema = (model, builder) => {
    const relatedFields = model.properties.filter(prop => {
        if (prop.type !== "field")
            return false;
        const isExplicitRelation = prop.attributes?.some(attr => attr.name === "relation");
        const isArrayRelation = prop.array === true && "string" == typeof prop.fieldType && builder.findByType("model", { name: prop.fieldType });
        return isExplicitRelation || isArrayRelation;
    });
    const tempSchema = {
        type: "schema",
        list: [{
                type: "model",
                name: model.name,
                properties: relatedFields
            }]
    };
    return printSchema(tempSchema);
};
/**
 * Converts an ENUM object to Prisma schema.
 */
export const enumsToSchema = (enumItems) => {
    const schema = {
        type: 'schema',
        list: enumItems
    };
    return printSchema(schema);
};
export const fieldsToSchema = (model, fields) => {
    const tempSchema = {
        type: 'schema',
        list: [{
                type: "model",
                name: model.name,
                properties: fields
            }]
    };
    return highlightPrismaSchema.highlight(printSchema(tempSchema));
};
//# sourceMappingURL=renders.js.map