import { PrismaQlHandler, handlerResponse } from "../../handler-registries/handler-registry.js";

export const deleteEnum: PrismaQlHandler<"DELETE", "ENUM", "mutation"> = (prismaState, data) => {
    const { args } = data;
    const response = handlerResponse(data);

    const enumName = args?.enums?.[0];
    if (!enumName) {
        return response.error("No enum name provided. Usage: DELETE ENUM ->[EnumName];");
    }

    try {
        const builder = prismaState.builder;
        const prevEnum = builder.findByType("enum", { name: enumName });
        if (!prevEnum) {
            return response.error(`Enum ${enumName} does not exist`);
        }
        builder.drop(enumName);

        return response.result(`Enum ${enumName} deleted successfully`);
    } catch (error) {
        return response.error(`Error deleting enum: ${error.message}`);
    }
};
