import { DSLAction, DSLCommand, DSLArgs, DSLOptions } from '../dsl.js';
import { PrismaSchemaData } from '../prisma-schema-loader.js';
export type Handler<T extends DSLAction, C extends DSLCommand | undefined> = (prismaState: PrismaSchemaData, args?: DSLArgs<T, C>, options?: DSLOptions<T, C>) => any;
export declare class HandlerRegistry<T extends DSLAction, C extends DSLCommand | undefined> {
    protected handlers: Record<string, Handler<T, C>>;
    constructor(initialHandlers?: Record<string, Handler<T, C>>);
    register(command: C, handler: Handler<T, C>): void;
    execute(command: C, prismaState: PrismaSchemaData | null, args?: DSLArgs<T, C>, options?: DSLOptions<T, C>): any;
}
//# sourceMappingURL=handler-registry.d.ts.map