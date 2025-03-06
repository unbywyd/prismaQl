import { DSLAction, DSLCommand, ParsedDSL, DSLType } from '../dsl.js';
import { PrismaSchemaData } from '../prisma-schema-loader.js';
export type HandlerResponse = {
    dsl: ParsedDSL<DSLAction, DSLCommand, DSLType>;
    result?: any;
    error?: string | Error;
};
export type Handler<A extends DSLAction, C extends DSLCommand | undefined, T extends DSLType> = (prismaState: PrismaSchemaData, dsl: ParsedDSL<A, C, T>) => HandlerResponse;
export declare const handlerResponse: (dsl: ParsedDSL<DSLAction, DSLCommand, DSLType>) => {
    error: (error: string | Error) => HandlerResponse;
    result: (result: any) => HandlerResponse;
};
export declare class HandlerRegistry<A extends DSLAction, C extends DSLCommand | undefined, T extends DSLType> {
    protected handlers: Record<string, Handler<A, C, T>>;
    constructor(initialHandlers?: Record<string, Handler<A, C, T>>);
    register(action: A, command: C, handler: Handler<A, C, T>): void;
    execute(action: A, command: C, prismaState: PrismaSchemaData | null, dsl: ParsedDSL<A, C, T>): HandlerResponse;
}
//# sourceMappingURL=handler-registry.d.ts.map