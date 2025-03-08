import chalk from "chalk";
import { handlerResponse } from "../../handler-registries/handler-registry.js";
import { getSchema } from "@mrleebo/prisma-ast";
export function normalizeQuotes(input) {
    return input
        .replace(/^[\'"]+/, '')
        .replace(/[\'"]+$/, '');
}
export const updateGenerator = (prismaState, data) => {
    const { args, options } = data;
    const response = handlerResponse(data);
    const builder = prismaState.builder;
    const generatorName = args?.generators?.[0];
    if (!generatorName) {
        return response.error("No generator name provided. Example: 'ADD GENERATOR ->[GeneratorName] ({key: value});'");
    }
    const prevGenerator = builder.findByType("generator", { name: generatorName });
    if (!prevGenerator) {
        return response.error(`Generator ${generatorName} does not exist`);
    }
    let parsed;
    const prismaBlock = data.prismaBlock;
    if (prismaBlock) {
        if (!prismaBlock) {
            return response.error("No generator block provided. Example: 'ADD GENERATOR GeneratorName ->[({key: value})];'");
        }
        console.log(chalk.yellow(`Warning: generator block provided. Generator ${generatorName} will be replaced`));
        builder.drop(prevGenerator.name);
        const sourceModel = `generator ${generatorName} {
        ${prismaBlock}
    }`;
        try {
            parsed = getSchema(sourceModel);
        }
        catch (error) {
            return response.error(`Invalid block provided. Error parsing model: ${error.message}`);
        }
        const schema = prismaState.builder.getSchema();
        const newGenerator = parsed.list[0];
        schema.list.push(newGenerator);
    }
    else if (options && Object.keys(options).length) {
        const generator = builder.generator(generatorName);
        const otherOptions = Object.keys(options).filter(key => key !== 'output' && key !== 'provider');
        if (otherOptions.length) {
            console.log(chalk.yellow(`Warning: unknown options ${otherOptions.join(', ')} will be skipped`));
            const validOptions = ['output', 'provider'];
            console.log(chalk.yellow(`Valid options are: ${validOptions.join(', ')}`));
        }
        if (options?.output) {
            generator.assignment('output', normalizeQuotes(options.output));
        }
        if (options?.provider) {
            generator.assignment('provider', normalizeQuotes(options.provider));
        }
    }
    return response.result(`Generator ${generatorName} added successfully!`);
};
//# sourceMappingURL=update-generator.js.map