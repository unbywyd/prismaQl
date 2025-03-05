import { DSLAction, DSLCommand } from "./dsl.js";
import { MutationHandlerRegistry } from "./handler-registries/mutation-handler-registry.js";
import { QueryHandlerRegistry } from "./handler-registries/query-handler-registry.js";
import PrismaSchemaLoader from "./prisma-schema-loader.js";
export declare class PrismaQlProvider {
    private queryHandler;
    private mutationHandler;
    private loader;
    private mutationState;
    constructor(config: {
        queryHandler: QueryHandlerRegistry;
        mutationHandler: MutationHandlerRegistry;
        loader: PrismaSchemaLoader;
    });
    query<A extends DSLAction, C extends DSLCommand>(input: string): Promise<any>;
    mutation<A extends DSLAction, C extends DSLCommand>(input: string): Promise<any>;
    save(): Promise<void>;
    private parseCommand;
}
//# sourceMappingURL=prisma-ql-provider.d.ts.map