import { PrismaQlDSLAction, PrismaQLDSLCommand, PrismaQLParsedDSL, PrismaQlDSLType } from '../dsl.js';
import { PrismaQlSchemaData } from '../prisma-schema-loader.js';
export type PrismaQLHandlerResponse = {
    dsl: PrismaQLParsedDSL<PrismaQlDSLAction, PrismaQLDSLCommand, PrismaQlDSLType>;
    result?: any;
    error?: string | Error;
};
export type PrismaQlHandler<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand, T extends PrismaQlDSLType> = (prismaState: PrismaQlSchemaData, dsl: PrismaQLParsedDSL<A, C, T>) => PrismaQLHandlerResponse;
export declare const handlerResponse: (dsl: PrismaQLParsedDSL<PrismaQlDSLAction, PrismaQLDSLCommand, PrismaQlDSLType>) => {
    error: (error: string | Error) => PrismaQLHandlerResponse;
    result: (result: any) => PrismaQLHandlerResponse;
};
export declare class PrismaQlHandlerRegistry<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand, T extends PrismaQlDSLType> {
    protected handlers: Record<string, PrismaQlHandler<A, C, T>>;
    constructor(initialHandlers?: Record<string, PrismaQlHandler<A, C, T>>);
    register(action: A, command: C, handler: PrismaQlHandler<A, C, T>): void;
    execute(action: A, command: C, prismaState: PrismaQlSchemaData | null, dsl: PrismaQLParsedDSL<A, C, T>): PrismaQLHandlerResponse;
}
//# sourceMappingURL=handler-registry.d.ts.map