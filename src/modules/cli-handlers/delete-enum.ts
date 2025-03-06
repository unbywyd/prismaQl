import { Handler, handlerResponse } from "../handler-registries/handler-registry.js";

export const deleteEnum: Handler<"DELETE", "ENUM", "mutation"> = (prismaState, data) => {
    const { args } = data;
    const response = handlerResponse(data);

    // Проверяем, что переданы аргументы
    if (!args?.enums || !args.enums.length) {
        return response.error("No enum name provided");
    }

    try {
        const enumName = args.enums[0];

        // Проверяем, что имя enum передано
        if (!enumName) {
            return response.error("No enum name provided");
        }

        const builder = prismaState.builder;

        // Проверяем, существует ли enum
        const prevEnum = builder.findByType("enum", { name: enumName });
        if (!prevEnum) {
            return response.error(`Enum ${enumName} does not exist`);
        }

        // Удаляем enum
        builder.drop(enumName);

        return response.result(`Enum ${enumName} deleted successfully`);
    } catch (error) {
        return response.error(`Error deleting enum: ${error.message}`);
    }
};
