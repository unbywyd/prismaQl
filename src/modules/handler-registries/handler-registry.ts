import {
    DSLAction,
    DSLCommand,
    DSLArgs,
    DSLOptions,
} from '../dsl.js';
import { PrismaSchemaData } from '../prisma-schema-loader.js';

export type Handler<T extends DSLAction, C extends DSLCommand | undefined> = (
    prismaState: PrismaSchemaData,
    args?: DSLArgs<T, C>,
    options?: DSLOptions<T, C>
) => any;

export class HandlerRegistry<T extends DSLAction, C extends DSLCommand | undefined> {
    protected handlers: Record<string, Handler<T, C>> = {};

    constructor(
        initialHandlers?: Record<string, Handler<T, C>>,
    ) {
        if (initialHandlers) {
            this.handlers = { ...initialHandlers };
        }
    }

    register(command: C, handler: Handler<T, C>) {
        this.handlers[command as string] = handler;
    }

    execute(command: C, prismaState: PrismaSchemaData | null, args?: DSLArgs<T, C>, options?: DSLOptions<T, C>) {
        const handler = this.handlers[command as string];
        if (!handler) {
            throw new Error(`Handler for command "${command}" not found.`);
        }
        return handler(prismaState!, args, options);
    }
}