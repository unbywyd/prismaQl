#!/usr/bin/env node
import { program } from 'commander';
import loadQueryRenderManager from './modules/cli-provider.js';
program
    .command('ql <text>')
    .option('-d, --dry [boolean]', 'Dry run')
    .description('Query the schema')
    .action(async (text, options) => {
    try {
        loadQueryRenderManager(options).then(async (query) => {
            await query(text);
        });
    }
    catch (error) {
        console.error("Error parsing command:", error.message);
    }
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map