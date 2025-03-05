import parser from "./dsl.js";
import { validatePrismaSchema } from "./prisma-validation.js";
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
        return this.queryHandler.execute(parsedCommand.command, this.loader.clonePrismaState(), parsedCommand.args, parsedCommand.options);
    }
    // Выполнение мутации
    async mutation(input) {
        const parsedCommand = this.parseCommand(input);
        if (parsedCommand.type !== 'mutation') {
            throw new Error(`Invalid command type: expected "mutation", got "${parsedCommand.type}"`);
        }
        const clone = this.loader.clonePrismaState();
        try {
            await this.mutationHandler.execute(parsedCommand.command, clone, parsedCommand.args, parsedCommand.options);
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
        // Apply the modification to the main schema because it's valid
        try {
            const state = await this.loader.getState();
            this.mutationHandler.execute(parsedCommand.command, state, parsedCommand.args, parsedCommand.options);
            // Сохраняем все примененные мутации
            this.mutationState.push(parsedCommand);
        }
        catch (e) {
            throw new Error(`Modification failed: ${e.message}`);
        }
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