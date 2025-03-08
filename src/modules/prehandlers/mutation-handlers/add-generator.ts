import { PrismaQlHandler, handlerResponse } from "../../handler-registries/handler-registry.js";
import { getSchema } from "@mrleebo/prisma-ast";

export const addGenerator: PrismaQlHandler<"ADD", "GENERATOR", "mutation"> = (prismaState, data) => {
    const { args } = data;
    const response = handlerResponse(data);
    const builder = prismaState.builder;

    const generatorName = args?.generators?.[0];
    if (!generatorName) {
        return response.error("No generator name provided. Example: 'ADD GENERATOR ->[GeneratorName] ({key: value});'");
    }

    const prismaBlock = data.prismaBlock;
    if (!prismaBlock) {
        return response.error("No generator block provided. Example: 'ADD GENERATOR GeneratorName ->[({key: value})];'");
    }

    const prevGenerator = builder.findByType("generator", { name: generatorName });
    if (prevGenerator) {
        return response.error(`Generator ${generatorName} already exists`);
    }

    let parsed: ReturnType<typeof getSchema>;

    const sourceModel = `generator ${generatorName} {
        ${prismaBlock}
    }`;
    try {
        parsed = getSchema(sourceModel);
    } catch (error) {
        return response.error(`Invalid block provided. Error parsing model: ${error.message}`);
    }

    const schema = prismaState.builder.getSchema();
    const newGenerator = parsed.list[0];
    schema.list.push(newGenerator);

    return response.result(`Generator ${generatorName} added successfully!`);
};
