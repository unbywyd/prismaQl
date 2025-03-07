import {
    PrismaQlDSLAction,
    PrismaQLDSLCommand,
    PrismaQLParsedDSL,
    PrismaQlDSLType,
} from '../dsl.js';
import { PrismaQlSchemaData } from '../prisma-schema-loader.js';

export type PrismaQLHandlerResponse = {
    dsl: PrismaQLParsedDSL<PrismaQlDSLAction, PrismaQLDSLCommand, PrismaQlDSLType>;
    result?: any;
    error?: string | Error;
}

export type PrismaQlHandler<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand, T extends PrismaQlDSLType> = (
    prismaState: PrismaQlSchemaData,
    dsl: PrismaQLParsedDSL<A, C, T>
) => PrismaQLHandlerResponse;


export const handlerResponse = (dsl: PrismaQLParsedDSL<PrismaQlDSLAction, PrismaQLDSLCommand, PrismaQlDSLType>): {
    error: (error: string | Error) => PrismaQLHandlerResponse;
    result: (result: any) => PrismaQLHandlerResponse;
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

export class PrismaQlHandlerRegistry<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand, T extends PrismaQlDSLType> {
    protected handlers: Record<string, PrismaQlHandler<A, C, T>> = {};

    constructor(
        initialHandlers?: Record<string, PrismaQlHandler<A, C, T>>,
    ) {
        if (initialHandlers) {
            this.handlers = { ...initialHandlers };
        }
    }

    register(action: A, command: C, handler: PrismaQlHandler<A, C, T>) {
        this.handlers[action + '_' + command as string] = handler;
    }

    execute(action: A, command: C, prismaState: PrismaQlSchemaData | null, dsl: PrismaQLParsedDSL<A, C, T>) {
        const handler = this.handlers[action + '_' + command as string];
        if (!handler) {
            throw new Error(`Handler for command "${command}" not found.`);
        }
        return handler(prismaState!, dsl);
    }
}