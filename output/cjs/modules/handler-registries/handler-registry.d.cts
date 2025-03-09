import { PrismaQlDSLAction, PrismaQLDSLCommand, PrismaQlDSLType, PrismaQLParsedDSL } from '../dsl.cjs';
import { PrismaQlSchemaData } from '../prisma-schema-loader.cjs';
import '../field-relation-collector.cjs';
import '@prisma/generator-helper';
import '@mrleebo/prisma-ast';

type PrismaQLHandlerResponse = {
    dsl: PrismaQLParsedDSL<PrismaQlDSLAction, PrismaQLDSLCommand, PrismaQlDSLType>;
    result?: any;
    error?: string | Error;
};
type PrismaQlHandler<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand, T extends PrismaQlDSLType> = (prismaState: PrismaQlSchemaData, dsl: PrismaQLParsedDSL<A, C, T>) => PrismaQLHandlerResponse;
declare const handlerResponse: (dsl: PrismaQLParsedDSL<PrismaQlDSLAction, PrismaQLDSLCommand, PrismaQlDSLType>) => {
    error: (error: string | Error) => PrismaQLHandlerResponse;
    result: (result: any) => PrismaQLHandlerResponse;
};
declare class PrismaQlHandlerRegistry<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand, T extends PrismaQlDSLType> {
    protected handlers: Record<string, PrismaQlHandler<A, C, T>>;
    constructor(initialHandlers?: Record<string, PrismaQlHandler<A, C, T>>);
    register(action: A, command: C, handler: PrismaQlHandler<A, C, T>): void;
    execute(action: A, command: C, prismaState: PrismaQlSchemaData | null, dsl: PrismaQLParsedDSL<A, C, T>): PrismaQLHandlerResponse;
}

export { type PrismaQLHandlerResponse, type PrismaQlHandler, PrismaQlHandlerRegistry, handlerResponse };
