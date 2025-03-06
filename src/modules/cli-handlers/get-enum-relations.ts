import chalk from "chalk";
import { Handler, handlerResponse } from "../handler-registries/handler-registry.js";
import { useHelper } from "../schema-helper.js";
import { formatColumns } from "./get-model-names.js";
import boxen from "boxen";


export const getEnumRelations: Handler<"GET", "ENUM_RELATIONS", "query"> = (prismaState, data) => {
    const response = handlerResponse(data);
    const helper = useHelper(prismaState);

    const { args } = data;
    if (!args?.enums?.length) {
        return response.error("No enum name provided");
    }
    const enumName = args.enums[0];
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