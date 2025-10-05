import { PrismaQlDSLAction, PrismaQLDSLCommand, PrismaQLParsedDSL, PrismaQlDSLQueryAction, PrismaQlDSLMutationAction } from './dsl.cjs';
import { PrismaQLHandlerResponse } from './handler-registries/handler-registry.cjs';
import { PrismaQlMutationHandlerRegistry } from './handler-registries/mutation-handler-registry.cjs';
import { PrismaQlQueryHandlerRegistry } from './handler-registries/query-handler-registry.cjs';
import PrismaQlSchemaLoader from './prisma-schema-loader.cjs';
import './field-relation-collector.cjs';
import '@prisma/generator-helper';
import '@mrleebo/prisma-ast';

type PrismaQlMutationOptions = {
    save?: boolean;
    dryRun?: boolean;
    forceApplyAll?: boolean;
    confirm?: (schema: string) => Promise<boolean>;
};
declare class PrismaQlProvider {
    private queryHandler;
    private mutationHandler;
    private loader;
    private mutationState;
    constructor(config: {
        queryHandler: PrismaQlQueryHandlerRegistry;
        mutationHandler: PrismaQlMutationHandlerRegistry;
        loader: PrismaQlSchemaLoader;
    });
    multiApply(commands: string[] | string, options?: PrismaQlMutationOptions): Promise<PrismaQLHandlerResponse[]>;
    apply<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand>(input: string | PrismaQLParsedDSL<PrismaQlDSLAction, PrismaQLDSLCommand, 'query' | 'mutation'>, options?: PrismaQlMutationOptions): Promise<{
        parsedCommand: PrismaQLParsedDSL<A, C, 'query' | 'mutation'>;
        response: PrismaQLHandlerResponse;
    }>;
    query<A extends PrismaQlDSLQueryAction, C extends PrismaQLDSLCommand>(input: string | PrismaQLParsedDSL<PrismaQlDSLQueryAction, PrismaQLDSLCommand, 'query'>): Promise<PrismaQLHandlerResponse>;
    dryMutation<A extends PrismaQlDSLMutationAction, C extends PrismaQLDSLCommand>(input: string | PrismaQLParsedDSL<PrismaQlDSLMutationAction, PrismaQLDSLCommand, 'mutation'>): Promise<string>;
    mutation<A extends PrismaQlDSLMutationAction, C extends PrismaQLDSLCommand>(input: string | PrismaQLParsedDSL<PrismaQlDSLMutationAction, PrismaQLDSLCommand, 'mutation'>, options?: PrismaQlMutationOptions): Promise<PrismaQLHandlerResponse>;
    save(): Promise<void>;
    private parseCommand;
}

export { type PrismaQlMutationOptions, PrismaQlProvider };
