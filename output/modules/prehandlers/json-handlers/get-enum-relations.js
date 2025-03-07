import { handlerResponse } from "../../handler-registries/handler-registry.js";
import { useHelper } from "../../utils/schema-helper.js";
export const getJsonEnumRelations = (prismaState, data) => {
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
        return response.result({
            total: 0,
            relations: [],
        });
    }
    return response.result({
        total,
        relations,
    });
};
//# sourceMappingURL=get-enum-relations.js.map