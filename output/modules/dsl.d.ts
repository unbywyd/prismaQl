import { PrismaQlRelationType } from "./field-relation-collector.js";
export type BasePrismaQlDSLAction = "GET" | "ADD" | "DELETE" | "UPDATE" | "PRINT" | "VALIDATE";
export type BasePrismaQLDSLCommand = "MODELS" | "MODEL" | "FIELD" | "FIELDS" | "RELATIONS" | "ENUM_RELATIONS" | "ENUMS" | "ENUM" | "MODELS_LIST" | "RELATION";
export type PrismaQlDSLAction<A extends string = BasePrismaQlDSLAction> = A;
export type PrismaQLDSLCommand<C extends string = BasePrismaQLDSLCommand> = C;
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
export interface PrismaQLParsedDSL<A extends PrismaQlDSLAction = PrismaQlDSLAction, C extends PrismaQLDSLCommand = PrismaQLDSLCommand, T extends PrismaQlDSLType = PrismaQlDSLType> {
    action: A;
    command?: C;
    args?: PrismaQLDSLArgs<A, C>;
    options?: PrismaQlDSLOptions<A, C>;
    prismaBlock?: string;
    raw: string;
    type: T;
}
export type PrismaQlDSLArgsProcessor<A extends PrismaQlDSLAction = PrismaQlDSLAction, C extends PrismaQLDSLCommand = PrismaQLDSLCommand> = (parsedArgs: PrismaQLDSLArgs<A, C>, rawArgs: string | undefined) => PrismaQLDSLArgs<A, C>;
export declare class PrismaQlDslParser<A extends string = PrismaQlDSLAction, C extends string = PrismaQLDSLCommand> {
    argsProcessors: Record<PrismaQlDSLAction, {
        default: PrismaQlDSLArgsProcessor<any, any>;
    } & Partial<Record<PrismaQLDSLCommand, PrismaQlDSLArgsProcessor<any, any>>>>;
    private customCommands;
    private actionTypeMap;
    constructor(argsProcessors: Record<PrismaQlDSLAction, {
        default: PrismaQlDSLArgsProcessor<any, any>;
    } & Partial<Record<PrismaQLDSLCommand, PrismaQlDSLArgsProcessor<any, any>>>>);
    registerCommand(action: A, command: C, type: PrismaQlDSLType): void;
    getCommands(): Record<A, C[]>;
    parseCommand<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand, T extends 'query' | 'mutation'>(input: string): PrismaQLParsedDSL<A, C, T>;
    parseParams(input: string): PrismaQlDSLOptions<any, any>;
    parseArgs<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined>(argsStr: string | undefined): PrismaQLDSLArgs<A, C>;
    detectActionType(source: string): PrismaQlDSLType | null;
    isValid(source: string): boolean | Error;
}
export declare const basePrismaQlAgsProcessor: Record<PrismaQlDSLAction, {
    default: PrismaQlDSLArgsProcessor<any, any>;
} & Partial<Record<PrismaQLDSLCommand, PrismaQlDSLArgsProcessor<any, any>>>>;
export declare const prismaQlParser: PrismaQlDslParser<BasePrismaQlDSLAction, BasePrismaQLDSLCommand>;
type CustomAction = BasePrismaQlDSLAction | "CUSTOM_ACTION";
type CustomCommand = BasePrismaQLDSLCommand | "CUSTOM_COMMAND";
export declare const customParser: PrismaQlDslParser<CustomAction, CustomCommand>;
export {};
//# sourceMappingURL=dsl.d.ts.map