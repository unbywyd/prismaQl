import { handlerResponse } from "../handler-registries/handler-registry.js";
import { useHelper } from "../schema-helper.js";
import boxen from "boxen";
import chalk from "chalk";
import Table from "cli-table3";
export const getFields = (prismaState, data) => {
    const response = handlerResponse(data);
    const { args } = data;
    const helper = useHelper(prismaState);
    if (!args?.models?.length) {
        return response.result(chalk.red("❌ No models specified"));
    }
    const modelName = args.models[0];
    const model = helper.getModelByName(modelName);
    if (!model) {
        return response.result(chalk.red(`❌ Model ${modelName} not found`));
    }
    let fields = helper.getFields(modelName);
    if (!fields.length) {
        return response.result(chalk.yellow(`⚠ No fields found in model ${modelName}`));
    }
    const onlyFilters = args?.fields || [];
    if (onlyFilters.length && !onlyFilters.includes("*")) {
        fields = fields.filter(field => onlyFilters.includes(field.name));
    }
    if (!fields.length) {
        return response.result(chalk.yellow(`⚠ No fields found in model ${modelName} that match filters`));
    }
    const idField = fields.find(f => f.attributes?.some(attr => attr.name === "id"))?.name;
    // Создаем таблицу
    const table = new Table({
        head: [
            chalk.bold("Field Name"),
            chalk.bold("Type"),
            chalk.bold("Required"),
            chalk.bold("Array"),
            chalk.bold("Relation"),
            chalk.bold("Attributes")
        ],
        colWidths: [20, 15, 10, 10, 25, 25], // Устанавливаем ширину колонок
        style: { head: ["cyan"] } // Цвет заголовков
    });
    const { relations } = prismaState;
    let relationFields = 0;
    // Обрабатываем поля модели
    fields.forEach((field) => {
        let name = chalk.greenBright(field.name);
        const type = chalk.blueBright(field.fieldType);
        const required = field.optional ? chalk.redBright("No") : chalk.greenBright("Yes");
        const array = field.array ? chalk.yellowBright("Yes") : chalk.gray("No");
        let hasRelation = field.attributes?.some(attr => attr.name === "relation");
        let relation = hasRelation
            ? chalk.magentaBright("Yes")
            : chalk.gray("No");
        // Собираем атрибуты
        const attrs = ['unique', 'id', 'default'];
        const attributes = field.attributes?.filter(attr => attrs.includes(attr.name)).map(attr => {
            if (attrs.includes(attr.name) && Array.isArray(attr.args)) {
                const arg = attr.args[0];
                if ("string" == typeof arg.value) {
                    return `@${attr.name}(${arg.value})`;
                }
                if ("object" == typeof arg.value) {
                    return `@${attr.name}(${arg.value.name}())`;
                }
            }
            return `@${attr.name}`;
        }).join(", ") || chalk.gray("None");
        for (const rel of relations) {
            if (rel.modelName === model.name) {
                if (rel.fieldName === field.name) {
                    relation = chalk.magentaBright(rel.relationName);
                    hasRelation = true;
                }
                if (rel.foreignKey === field.name) {
                    relation = chalk.magenta(`${rel.relationName} (FK)`);
                }
            }
        }
        if (hasRelation) {
            relationFields++;
        }
        if (field.name == idField) {
            name = `${chalk.bgGreenBright.black(field.name)} (ID)`;
        }
        table.push([name, type, required, array, relation, attributes]);
    });
    const totalFoundFields = fields.length;
    const statistic = `
    📌Fields in model: ${chalk.bold(modelName)}
    Total fields found: ${chalk.bold(totalFoundFields)}
    Fields with relations: ${chalk.bold(relationFields)}
    `;
    return response.result(boxen(`${statistic}\n${table.toString()}`, {
        padding: 1,
        borderColor: "cyan",
        title: "Prisma Model Fields",
        titleAlignment: "center"
    }));
};
//# sourceMappingURL=get-fields.js.map