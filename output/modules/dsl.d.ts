import { PrismaQlRelationType } from "./field-relation-collector.js";
export type PrismaQlDSLAction = "GET" | "ADD" | "DELETE" | "UPDATE" | "PRINT" | "VALIDATE";
export type PrismaQLDSLCommand = "MODELS" | "MODEL" | "FIELD" | "FIELDS" | "RELATIONS" | "ENUM_RELATIONS" | "ENUMS" | "ENUM" | "MODELS_LIST" | "RELATION";
export type PrismaQlDSLType = "query" | "mutation";
export type PrismaQlDSLMutationAction = "ADD" | "DELETE" | "UPDATE";
export type PrismaQlDSLQueryAction = "GET" | "PRINT" | "VALIDATE";
export type PrismaQLDSLArgs<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined> = {
    models?: string[];
    fields?: string[];
    enums?: string[];
};
export type DSLPrismaRelationType = PrismaQlRelationType;
export type PrismaQlDSLOptionMap = {
    GET: {
        ENUMS: {
            raw?: boolean;
        };
        RELATIONS: {
            depth?: number;
        };
    };
    ADD: {
        RELATION: {
            type: DSLPrismaRelationType;
            pivotTable?: string | true;
            fkHolder?: string;
            required?: boolean;
            relationName?: string;
        };
    };
    UPDATE: {
        ENUM: {
            replace: boolean;
        };
    };
    DELETE: {
        RELATION: {
            fieldA?: string;
            fieldB?: string;
            relationName?: string;
        };
    };
};
export type PrismaQlDSLOptions<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined> = A extends keyof PrismaQlDSLOptionMap ? C extends keyof PrismaQlDSLOptionMap[A] ? PrismaQlDSLOptionMap[A][C] : Record<string, string | number | boolean | Array<string>> : Record<string, string | number | boolean | Array<string>>;
export interface PrismaQLParsedDSL<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined, T extends PrismaQlDSLType> {
    action: A;
    command?: C;
    args?: PrismaQLDSLArgs<A, C>;
    options?: PrismaQlDSLOptions<A, C>;
    prismaBlock?: string;
    raw: string;
    type: T;
}
export type PrismaQlDSLArgsProcessor<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined> = (parsedArgs: PrismaQLDSLArgs<A, C>, rawArgs: string | undefined) => PrismaQLDSLArgs<A, C>;
export declare class PrismaQlDslParser {
    argsProcessors: Record<PrismaQlDSLAction, {
        default: PrismaQlDSLArgsProcessor<any, any>;
    } & Partial<Record<PrismaQLDSLCommand, PrismaQlDSLArgsProcessor<any, any>>>>;
    constructor(argsProcessors: Record<PrismaQlDSLAction, {
        default: PrismaQlDSLArgsProcessor<any, any>;
    } & Partial<Record<PrismaQLDSLCommand, PrismaQlDSLArgsProcessor<any, any>>>>);
    parseCommand<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined, T extends PrismaQlDSLType>(input: string): PrismaQLParsedDSL<A, C, T>;
    parseParams(input: string): PrismaQlDSLOptions<any, any>;
    parseArgs<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined>(argsStr: string | undefined): PrismaQLDSLArgs<A, C>;
    detectActionType(source: string): PrismaQlDSLType | null;
    isValid(source: string): boolean | Error;
}
export declare const prismaQlParser: PrismaQlDslParser;
//# sourceMappingURL=dsl.d.ts.map