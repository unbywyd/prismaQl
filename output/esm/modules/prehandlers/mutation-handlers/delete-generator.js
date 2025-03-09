import { handlerResponse } from "../../handler-registries/handler-registry.js";
export const deleteGenerator = (prismaState, data) => {
    const { args } = data;
    const response = handlerResponse(data);
    const builder = prismaState.builder;
    const generatorName = args?.generators?.[0];
    if (!generatorName) {
        return response.error("No generator name provided. Example: 'ADD GENERATOR ->[GeneratorName];'");
    }
    const prevGenerator = builder.findByType("generator", { name: generatorName });
    if (!prevGenerator) {
        return response.error(`Generator ${generatorName} does not exist`);
    }
    builder.drop(prevGenerator.name);
    return response.result(`Generator ${generatorName} dropped`);
};
//# sourceMappingURL=delete-generator.js.map