import { printSchema, Schema, Field, Enumerator } from "@mrleebo/prisma-ast";
import { Handler, handlerResponse } from "../handler-registries/handler-registry.js";
import { useHelper } from "../schema-helper.js";
import boxen from "boxen";
import { PrismaHighlighter } from "prismalux";
import chalk from "chalk";

const highlightPrismaSchema = new PrismaHighlighter();

export const getEnums: Handler<"GET", "ENUMS", "query"> = (prismaState, data) => {
    const response = handlerResponse(data);
    const options = data.options;
    const helper = useHelper(prismaState);
    let enums = helper.getEnums();
    const onlyEnums = data.args?.enums || [];
    if (onlyEnums.length && !onlyEnums.includes("*")) {
        enums = enums.filter(e => onlyEnums.includes(e.name));
    }
    if (!enums.length) {
        return response.result(chalk.yellow(`⚠ No enums found`));
    }
    const totalEnums = enums.length;
    const statistic = `📌 Enums in schema: ${chalk.bold(totalEnums)}`;

    if (options?.raw) {
        const schema: Schema = {
            type: 'schema',
            list: enums
        };
        const parsed = printSchema(schema);
        const rawOutput = highlightPrismaSchema.highlight(parsed);
        return response.result(boxen(`${statistic}\n${rawOutput}`, {
            padding: 1,
            width: 100,
            borderColor: "cyan",
            title: "Prisma Enums",
            titleAlignment: "center"
        }));
    }

    const list: {
        name: string,
        options: Array<string>
    }[] = [];

    enums.forEach(e => {
        list.push({
            name: chalk.white.bold(e.name),
            options: e.enumerators?.filter(e => e.type == "enumerator").map((en: Enumerator) => chalk.green(en?.name)) || []
        });
    });

    const renderedList = list.map(e => {
        return `${e.name}\n${e.options.join(", ")}\n`;
    });

    return response.result(boxen(`${statistic}\n${renderedList.join('\n')}`, {
        padding: 1,
        borderColor: "cyan",
        title: "Prisma Enums",
        titleAlignment: "center"
    }));
}
