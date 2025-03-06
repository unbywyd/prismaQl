import { DSLCommand, DSLQueryAction, DSLMutationAction } from "./dsl.js";
import { HandlerResponse } from "./handler-registries/handler-registry.js";
import { MutationHandlerRegistry } from "./handler-registries/mutation-handler-registry.js";
import { QueryHandlerRegistry } from "./handler-registries/query-handler-registry.js";
import PrismaSchemaLoader from "./prisma-schema-loader.js";
export type MutationOptions = {
    save?: boolean;
    dryRun?: boolean;
    confirm?: (schema: string) => Promise<boolean>;
};
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
    query<A extends DSLQueryAction, C extends DSLCommand>(input: string): Promise<HandlerResponse>;
    mutation<A extends DSLMutationAction, C extends DSLCommand>(input: string, options?: MutationOptions): Promise<HandlerResponse>;
    save(): Promise<void>;
    private parseCommand;
}
//# sourceMappingURL=prisma-ql-provider.d.ts.map