import { handlerResponse } from "src/modules/handler-registries/handler-registry.js";
import { useHelper } from "src/modules/utils/schema-helper.js";
export const getJsonGenerators = (prismaState, data) => {
    const response = handlerResponse(data);
    const helper = useHelper(prismaState);
    const generators = helper.getGenerators();
    if (!generators)
        return response.result({
            total: 0,
            generators: []
        });
    const sections = [];
    generators.forEach((generator) => {
        const props = [];
        generator?.assignments?.forEach((assignment) => {
            if (!assignment)
                return;
            props.push({
                key: assignment?.key,
                value: assignment?.value
            });
        });
        sections.push({
            name: generator.name,
            properties: props
        });
    });
    return response.result({
        total: generators.length,
        generators: sections
    });
};
//# sourceMappingURL=get-generators.js.map