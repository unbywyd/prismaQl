import { handlerResponse } from "../handler-registries/handler-registry.js";
import { constantCase } from "change-case";
export const updateEnum = (prismaState, data) => {
    const { args, options } = data;
    const response = handlerResponse(data);
    const enumName = args?.enums?.[0];
    if (!enumName) {
        return response.error("No enum name provided. Example: UPDATE ENUM ->[EnumName] ({A|B|C})");
    }
    if (!data.prismaBlock) {
        return response.error("No enum block provided. Example: 'UPDATE ENUM EnumName ->[({A|B|C})];'");
    }
    let keys = [];
    if (data.prismaBlock) {
        keys = data.prismaBlock.split(/\s+/);
    }
    if (!keys.length) {
        return response.error("No enum options provided. Example: 'UPDATE ENUM EnumName ({ ->[A|B|C] });'");
    }
    try {
        const enumOptions = keys?.map(key => constantCase(key));
        const builder = prismaState.builder;
        const prevEnum = builder.findByType("enum", { name: enumName });
        if (!prevEnum) {
            builder.enum(enumName, enumOptions);
            return response.result(`Enum ${enumName} added successfully`);
        }
        const oldValues = prevEnum.enumerators.filter(el => el.type == "enumerator").map(e => e.name);
        const doExtend = !options?.replace;
        let finalValues;
        if (doExtend) {
            finalValues = Array.from(new Set([...oldValues, ...enumOptions]));
        }
        else {
            finalValues = enumOptions;
        }
        builder.drop(enumName);
        builder.enum(enumName, finalValues);
        return response.result(`Enum ${enumName} added successfully`);
    }
    catch (error) {
        return response.error(`Error adding enum: ${error.message}`);
    }
};
//# sourceMappingURL=update-enum.js.map