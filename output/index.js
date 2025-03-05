#!/usr/bin/env node
import { program } from 'commander';
import { loadPrismaSchema } from './modules/load-prisma-schema.js';
import { validatePrismaSchema } from './modules/prisma-validation.js';
import loadQueryRenderManager from './modules/cli-provider.js';
program
    .command('query <text>')
    .description('Query the schema')
    .action(async (text) => {
    try {
        loadQueryRenderManager().then(async (query) => {
            const result = await query(text);
            console.log(result);
        });
    }
    catch (error) {
        console.error("Error parsing command:", error.message);
    }
});
program
    .command('validate [schemaPath]')
    .description('Validate the schema')
    .action(async (schemaPath) => {
    try {
        const schema = await loadPrismaSchema(schemaPath);
        if (!schema) {
            console.log("No schema found");
            return;
        }
        const ph = schema.path;
        console.log(`Validating schema at ${ph}`);
        const isValid = await validatePrismaSchema(schema.schema);
        if (isValid instanceof Error) {
            console.error("Error validating schema:", isValid.message);
        }
        else {
            console.log("Schema is valid");
        }
    }
    catch (error) {
        console.error("Error parsing command:", error.message);
    }
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map