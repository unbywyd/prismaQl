import { handlerResponse } from "../../handler-registries/handler-registry.js";
import { useHelper } from "../../utils/schema-helper.js";
export const getJsonEnums = (prismaState, data) => {
    const response = handlerResponse(data);
    const helper = useHelper(prismaState);
    let enums = helper.getEnums();
    const onlyEnums = data.args?.enums || [];
    if (onlyEnums.length && !onlyEnums.includes("*")) {
        enums = enums.filter(e => onlyEnums.includes(e.name));
    }
    if (!enums.length) {
        return response.result({
            total: 0,
            enums: [],
        });
    }
    const totalEnums = enums.length;
    const list = [];
    enums.forEach(e => {
        list.push({
            name: e.name,
            options: e.enumerators?.filter(e => e.type == "enumerator").map((en) => en.name) || []
        });
    });
    return response.result({
        total: totalEnums,
        enums: list,
    });
};
//# sourceMappingURL=get-enums.js.map