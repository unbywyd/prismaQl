import { constantCase } from "change-case";
import { handlerResponse } from "../handler-registries/handler-registry.js";
export const addEnum = (prismaState, data) => {
    const { args } = data;
    const response = handlerResponse(data);
    const enumName = (args?.enums || [])[0];
    if (!enumName.length) {
        return response.error("No enum name provided. Example: 'ADD ENUM ->[EnumName] ({A|B|C});'");
    }
    if (!data.prismaBlock) {
        return response.error("No enum block provided. Example: 'ADD ENUM EnumName ->[({A|B|C})];'");
    }
    let keys = [];
    if (data.prismaBlock) {
        keys = data.prismaBlock.split(/\s+/).map((key) => constantCase(key));
    }
    if (!keys.length) {
        return response.error("No enum options provided. Example: 'ADD ENUM EnumName ({ ->[A|B|C] });'");
    }
    try {
        const builder = prismaState.builder;
        const prevEnum = builder.findByType("enum", { name: enumName });
        if (prevEnum) {
            return response.error(`Enum ${enumName} already exists`);
        }
        builder.enum(enumName, keys);
        return response.result(`Enum ${enumName} added successfully!`);
    }
    catch (error) {
        return response.error(`Error adding enum: ${error.message}`);
    }
};
//# sourceMappingURL=add-enum.js.map