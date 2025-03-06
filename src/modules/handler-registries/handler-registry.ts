import {
    DSLAction,
    DSLCommand,
    DSLArgs,
    DSLOptions,
    ParsedDSL,
    DSLType,
} from '../dsl.js';
import { PrismaSchemaData } from '../prisma-schema-loader.js';

export type HandlerResponse = {
    dsl: ParsedDSL<DSLAction, DSLCommand, DSLType>;
    result?: any;
    error?: string | Error;
}

export type Handler<A extends DSLAction, C extends DSLCommand | undefined, T extends DSLType> = (
    prismaState: PrismaSchemaData,
    dsl: ParsedDSL<A, C, T>
) => HandlerResponse;


export const handlerResponse = (dsl: ParsedDSL<DSLAction, DSLCommand, DSLType>): {
    error: (error: string | Error) => HandlerResponse;
    result: (result: any) => HandlerResponse;
} => {
    return {
        error: (error: string | Error) => {
            return { dsl, error };
        },
        result: (result: any) => {
            return {
                dsl, result
            }
        }
    }
}

export class HandlerRegistry<A extends DSLAction, C extends DSLCommand | undefined, T extends DSLType> {
    protected handlers: Record<string, Handler<A, C, T>> = {};

    constructor(
        initialHandlers?: Record<string, Handler<A, C, T>>,
    ) {
        if (initialHandlers) {
            this.handlers = { ...initialHandlers };
        }
    }

    register(action: A, command: C, handler: Handler<A, C, T>) {
        this.handlers[action + '_' + command as string] = handler;
    }

    execute(action: A, command: C, prismaState: PrismaSchemaData | null, dsl: ParsedDSL<A, C, T>) {
        const handler = this.handlers[action + '_' + command as string];
        if (!handler) {
            throw new Error(`Handler for command "${command}" not found.`);
        }
        return handler(prismaState!, dsl);
    }
}