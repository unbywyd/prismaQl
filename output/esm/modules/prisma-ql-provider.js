import chalk from "chalk";
import { prismaQlParser } from "./dsl.js";
import { handlerResponse } from "./handler-registries/handler-registry.js";
import { validatePrismaSchema } from "./utils/prisma-validation.js";
import { PrismaHighlighter } from "prismalux";
const highlightPrismaSchema = new PrismaHighlighter();
export class PrismaQlProvider {
    queryHandler;
    mutationHandler;
    loader;
    mutationState = [];
    constructor(config) {
        this.queryHandler = config.queryHandler;
        this.mutationHandler = config.mutationHandler;
        this.loader = config.loader;
    }
    async multiApply(commands, options = {}) {
        const commandsArray = Array.isArray(commands) ? commands : commands.split(';').map((c) => c.trim()).filter((c) => c.length > 0).map((c) => c + ';');
        const responses = [];
        for (const command of commandsArray) {
            try {
                const result = await this.apply(command);
                if (result?.response?.error && !options.forceApplyAll) {
                    throw new Error("string" === typeof result.response.error ? result.response.error : "Error applying command");
                }
                responses.push(result);
            }
            catch (e) {
                console.log(chalk.red(`Error processing command: ${e.message}`));
                if (!options.forceApplyAll) {
                    throw e;
                }
            }
        }
        const hasMutations = responses.some((r) => r.parsedCommand.type === 'mutation');
        if (options.save && hasMutations && !options.dryRun) {
            if (options.confirm) {
                const confirmed = await options.confirm(highlightPrismaSchema.highlight(this.loader.print()));
                if (confirmed) {
                    await this.save();
                }
            }
            else {
                await this.save();
            }
        }
        return responses.map((r) => r.response);
    }
    async apply(input, options) {
        const parsedCommand = "string" === typeof input ? this.parseCommand(input) : input;
        if (parsedCommand.type === 'query') {
            return {
                parsedCommand: parsedCommand,
                response: await this.query(parsedCommand)
            };
        }
        if (parsedCommand.type === 'mutation') {
            return {
                parsedCommand: parsedCommand,
                response: await this.mutation(parsedCommand, options)
            };
        }
        throw new Error(`Invalid command type: expected "query" or "mutation", got "${parsedCommand.type}"`);
    }
    async query(input) {
        const parsedCommand = "string" === typeof input ? this.parseCommand(input) : input;
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
    async dryMutation(input) {
        const parsedCommand = "string" == typeof input ? this.parseCommand(input) : input;
        if (parsedCommand.type !== 'mutation') {
            throw new Error(`Invalid command type: expected "mutation", got "${parsedCommand.type}"`);
        }
        const clone = this.loader.clonePrismaState();
        const displayCommand = `${parsedCommand.action} ${parsedCommand.command} >`;
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
            console.log('✅', chalk.gray(displayCommand), chalk.green(`Dry run success!`));
        }
        catch (e) {
            throw new Error(`Modification failed: ${e.message}`);
        }
        // Validate the modified schema
        const updatedSchema = clone.builder.print({ sort: true });
        const validation = await validatePrismaSchema(updatedSchema);
        if (validation instanceof Error) {
            throw new Error(`Modification failed: ${validation.message}`);
        }
        console.log('✅', chalk.gray(displayCommand), chalk.green(`Validation success!`));
        return updatedSchema;
    }
    async mutation(input, options = {}) {
        const parsedCommand = "string" === typeof input ? this.parseCommand(input) : input;
        if (parsedCommand.type !== 'mutation') {
            throw new Error(`Invalid command type: expected "mutation", got "${parsedCommand.type}"`);
        }
        const updatedSchema = await this.dryMutation(input);
        if (!updatedSchema) {
            return handlerResponse(parsedCommand).error(`Dry run failed`);
        }
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
            this.mutationState.push(parsedCommand);
            const displayCommand = `${parsedCommand.action} ${parsedCommand.command} > `;
            console.log('✅', chalk.white(displayCommand), chalk.green('Mutation success'));
        }
        catch (e) {
            throw new Error(`Modification failed: ${e.message}`);
        }
        // We need to rebase parsedSchema to the updated schema
        if (options.save) {
            await this.save();
        }
        await this.loader.rebase();
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
        return prismaQlParser.parseCommand(input);
    }
}
//# sourceMappingURL=prisma-ql-provider.js.map