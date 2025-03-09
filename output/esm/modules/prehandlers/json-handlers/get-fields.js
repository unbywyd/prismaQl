import { handlerResponse } from "../../handler-registries/handler-registry.js";
import { useHelper } from "../../utils/schema-helper.js";
export const getJsonFields = (prismaState, data) => {
    const response = handlerResponse(data);
    const { args } = data;
    const helper = useHelper(prismaState);
    const modelName = args?.models?.[0];
    if (!modelName) {
        return response.error("❌ No models specified. Usage: GET FIELDS -> [ModelName]; or GET FIELDS [FieldName], [FieldName2] IN -> [ModelName];");
    }
    const model = helper.getModelByName(modelName);
    if (!model) {
        return response.error(`❌ Model ${modelName} not found`);
    }
    let fields = helper.getFields(modelName);
    if (!fields.length) {
        return response.result({
            fields: [],
            total: 0,
        });
    }
    const onlyFilters = args?.fields || [];
    if (onlyFilters.length && !onlyFilters.includes("*")) {
        fields = fields.filter(field => onlyFilters.includes(field.name));
    }
    if (!fields.length) {
        return response.result({
            fields: [],
            total: 0,
        });
    }
    const relationFields = fields.filter(field => field.attributes?.some(attr => attr.name === "relation")).length;
    return response.result({
        fields: fields,
        total: relationFields
    });
};
//# sourceMappingURL=get-fields.js.map