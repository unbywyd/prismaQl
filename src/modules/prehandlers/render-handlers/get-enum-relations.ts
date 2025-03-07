import chalk from "chalk";
import { PrismaQlHandler, handlerResponse } from "../../handler-registries/handler-registry.js";
import { useHelper } from "../../utils/schema-helper.js";
import boxen from "boxen";
import { formatColumns } from "./get-model-names.js";


export const getEnumRelations: PrismaQlHandler<"GET", "ENUM_RELATIONS", "query"> = (prismaState, data) => {
    const response = handlerResponse(data);
    const helper = useHelper(prismaState);
    const { args } = data;

    const enumName = args?.enums?.[0];
    if (!enumName) {
        return response.error("No enum name provided. Example usage: GET ENUM_RELATIONS -> [EnumName];");
    }

    const _enum = helper.getEnumByName(enumName);
    if (!_enum) {
        return response.error(`Enum ${enumName} not found`);
    }
    const relations = helper.getEnumRelations(enumName);

    const total = relations.length;
    if (!total) {
        return response.result(`Enum ${enumName} has no relations`);
    }
    const columns = relations.length > 6 ? 3 : 2;
    const formattedModels = formatColumns(relations.map(rel => `${chalk.hex("#11FF00")("•")} ${chalk.bold(rel.model.name)} -> ${chalk.bold(rel.field.name)}`), columns);
    const stats = `${chalk.white("📊 Total relations:")} ${chalk.white.bold(total)}`;

    return response.result(boxen(`${stats}\n\n${formattedModels}`, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "green",
    }));

}