import { handlerResponse, PrismaQlHandler } from "../../handler-registries/handler-registry.js";
import { useHelper } from "../../utils/schema-helper.js";

export const getJsonGenerators: PrismaQlHandler<"GET", "GENERATORS", 'query'> = (prismaState, data) => {
    const response = handlerResponse(data);
    const helper = useHelper(prismaState);
    const generators = helper.getGenerators();
    if (!generators) return response.result({
        total: 0,
        generators: []
    });

    const sections: Array<{
        name: string,
        properties: Array<{
            key: string,
            value: string
        }>
    }> = [];

    generators.forEach((generator: any) => {

        const props: Array<{
            key: string,
            value: string
        }> = [];

        generator?.assignments?.forEach((assignment: Record<string, any>) => {
            if (!assignment) return;
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
}