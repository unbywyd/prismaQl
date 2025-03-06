import { getSchema } from "@mrleebo/prisma-ast";
import { Handler, handlerResponse } from "../handler-registries/handler-registry.js";
import { useHelper } from "../schema-helper.js";

export const addEnum: Handler<"ADD", "ENUM", "mutation"> = (prismaState, data) => {
    const { args, options, prismaBlock } = data;
    const response = handlerResponse(data);


    // Проверяем, что переданы аргументы
    if (!args?.enums) {
        return response.error("No enum name provided");
    }

    let keys = Object.keys(options || {});
    if (!keys.length && !data.prismaBlock) {
        return response.error("No enum options provided");
    }
    if (data.prismaBlock) {
        keys = data.prismaBlock.split(/\s+/);
    }
    if (!keys.length) {
        return response.error("No enum options provided");
    }
    try {
        const enumName = args.enums[0];

        // Проверяем, что имя enum'а передано
        if (!enumName) {
            return response.error("No enum name provided");
        }

        const builder = prismaState.builder;

        // Проверяем, что enum с таким именем уже не существует
        const prevEnum = builder.findByType("enum", { name: enumName });
        if (prevEnum) {
            return response.error(`Enum ${enumName} already exists`);
        }

        builder.enum(enumName, keys);

        return response.result(`Enum ${enumName} added successfully`);
    } catch (error) {
        return response.error(`Error adding enum: ${error.message}`);
    }
};