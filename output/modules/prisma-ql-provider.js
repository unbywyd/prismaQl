import chalk from "chalk";
import parser from "./dsl.js";
import { handlerResponse } from "./handler-registries/handler-registry.js";
import { validatePrismaSchema } from "./prisma-validation.js";
import { PrismaHighlighter } from "prismalux";
const highlightPrismaSchema = new PrismaHighlighter();
export class PrismaQlProvider {
    queryHandler;
    mutationHandler;
    loader;
    mutationState = []; // Состояние мутаций
    constructor(config) {
        this.queryHandler = config.queryHandler;
        this.mutationHandler = config.mutationHandler;
        this.loader = config.loader;
    }
    // Выполнение запроса
    async query(input) {
        const parsedCommand = this.parseCommand(input);
        if (parsedCommand.type !== 'query') {
            throw new Error(`Invalid command type: expected "query", got "${parsedCommand.type}"`);
        }
        if (!parsedCommand.command) {
            const isPrint = parsedCommand.action === 'PRINT';
            const isValidate = parsedCommand.action === 'VALIDATE';
            if (!isPrint && !isValidate) {
                throw new Error(`Invalid command: command is required`);
            }
            if (isPrint) {
                return handlerResponse(parsedCommand).result(this.loader.print());
            }
            if (isValidate) {
                return handlerResponse(parsedCommand).result(await this.loader.isValid());
            }
        }
        return this.queryHandler.execute(parsedCommand.action, parsedCommand.command, this.loader.clonePrismaState(), parsedCommand);
    }
    // Выполнение мутации
    async mutation(input, options = {}) {
        const parsedCommand = this.parseCommand(input);
        if (parsedCommand.type !== 'mutation') {
            throw new Error(`Invalid command type: expected "mutation", got "${parsedCommand.type}"`);
        }
        const clone = this.loader.clonePrismaState();
        try {
            const result = await this.mutationHandler.execute(parsedCommand.action, parsedCommand.command, clone, parsedCommand);
            if (result?.error) {
                if ("string" === typeof result.error) {
                    throw new Error(result.error);
                }
                else {
                    throw result.error;
                }
            }
            console.log('- ' + chalk.green("Dry run success"));
        }
        catch (e) {
            throw new Error(`Modification failed: ${e.message}`);
        }
        // Validate the modified schema
        const updatedSchema = clone.builder.print({ sort: true });
        console.log(updatedSchema);
        const validation = await validatePrismaSchema(updatedSchema);
        if (validation instanceof Error) {
            throw new Error(`Modification failed: ${validation.message}`);
        }
        console.log('- ' + chalk.green("Validation success"));
        if (options.dryRun) {
            return handlerResponse(parsedCommand).result(highlightPrismaSchema.highlight(updatedSchema));
        }
        if (options.confirm) {
            const message = `${highlightPrismaSchema.highlight(updatedSchema)}`;
            const confirmed = await options.confirm(message);
            if (!confirmed) {
                return handlerResponse(parsedCommand).error(`Modification cancelled`);
            }
        }
        // Apply the modification to the main schema because it's valid
        try {
            const state = await this.loader.getState();
            this.mutationHandler.execute(parsedCommand.action, parsedCommand.command, state, parsedCommand);
            // Сохраняем все примененные мутации
            this.mutationState.push(parsedCommand);
            console.log('- ' + chalk.green("Mutation success"));
        }
        catch (e) {
            throw new Error(`Modification failed: ${e.message}`);
        }
        if (options.save) {
            await this.save();
        }
        return handlerResponse(parsedCommand).result(highlightPrismaSchema.highlight(updatedSchema));
    }
    async save() {
        if (this.mutationState.length === 0) {
            return;
        }
        const messages = this.mutationState.map((mutation) => mutation.raw);
        this.loader.save(messages);
        this.mutationState = [];
    }
    parseCommand(input) {
        return parser.parseCommand(input);
    }
}
//# sourceMappingURL=prisma-ql-provider.js.map