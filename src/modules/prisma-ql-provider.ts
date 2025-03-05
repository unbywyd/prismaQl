import parser, { DSLAction, DSLCommand, DslParser, ParsedDSL } from "./dsl.js";
import { MutationHandlerRegistry } from "./handler-registries/mutation-handler-registry.js";
import { QueryHandlerRegistry } from "./handler-registries/query-handler-registry.js";
import PrismaSchemaLoader from "./prisma-schema-loader.js";
import { validatePrismaSchema } from "./prisma-validation.js";

export class PrismaQlProvider {
    private queryHandler: QueryHandlerRegistry;
    private mutationHandler: MutationHandlerRegistry;
    private loader: PrismaSchemaLoader;
    private mutationState: ParsedDSL<DSLAction, DSLCommand>[] = []; // Состояние мутаций

    constructor(config: {
        queryHandler: QueryHandlerRegistry;
        mutationHandler: MutationHandlerRegistry;
        loader: PrismaSchemaLoader;
    }) {
        this.queryHandler = config.queryHandler;
        this.mutationHandler = config.mutationHandler;
        this.loader = config.loader;
    }

    // Выполнение запроса
    async query<A extends DSLAction, C extends DSLCommand>(input: string): Promise<any> {
        const parsedCommand = this.parseCommand<A, C>(input);
        if (parsedCommand.type !== 'query') {
            throw new Error(`Invalid command type: expected "query", got "${parsedCommand.type}"`);
        }

        return this.queryHandler.execute(parsedCommand.command!, this.loader.clonePrismaState(), parsedCommand.args, parsedCommand.options);
    }

    // Выполнение мутации
    async mutation<A extends DSLAction, C extends DSLCommand>(input: string): Promise<any> {
        const parsedCommand = this.parseCommand<A, C>(input);
        if (parsedCommand.type !== 'mutation') {
            throw new Error(`Invalid command type: expected "mutation", got "${parsedCommand.type}"`);
        }

        const clone = this.loader.clonePrismaState();
        try {
            await this.mutationHandler.execute(parsedCommand.command!, clone, parsedCommand.args, parsedCommand.options);
        } catch (e) {
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
            this.mutationHandler.execute(parsedCommand.command!, state, parsedCommand.args, parsedCommand.options);

            // Сохраняем все примененные мутации
            this.mutationState.push(parsedCommand);
        } catch (e) {
            throw new Error(`Modification failed: ${e.message}`);
        }

    }

    async save(): Promise<void> {
        if (this.mutationState.length === 0) {
            return;
        }
        const messages = this.mutationState.map((mutation) => mutation.raw);
        this.loader.save(messages);
        this.mutationState = [];
    }

    private parseCommand<A extends DSLAction, C extends DSLCommand>(input: string): ParsedDSL<A, C> {
        return parser.parseCommand<A, C>(input);
    }
}