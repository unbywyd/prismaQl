import { PrismaQlRelationType } from './field-relation-collector.cjs';
import '@prisma/generator-helper';

type BasePrismaQlDSLAction = "GET" | "ADD" | "DELETE" | "UPDATE" | "PRINT" | "VALIDATE";
type BasePrismaQLDSLCommand = "MODELS" | "MODEL" | "FIELD" | "FIELDS" | "RELATIONS" | "DB" | "ENUM_RELATIONS" | "ENUMS" | "ENUM" | "MODELS_LIST" | "RELATION" | "GENERATOR" | "GENERATORS";
type PrismaQlDSLAction<A extends string = BasePrismaQlDSLAction> = A;
type PrismaQLDSLCommand<C extends string = BasePrismaQLDSLCommand> = C;
type PrismaQlDSLType = "query" | "mutation";
type PrismaQlDSLMutationAction = "ADD" | "DELETE" | "UPDATE";
type PrismaQlDSLQueryAction = "GET" | "PRINT" | "VALIDATE";
type PrismaQLDSLArgs<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined> = {
    models?: string[];
    fields?: string[];
    enums?: string[];
    generators?: string[];
};
type DSLPrismaRelationType = PrismaQlRelationType;
type PrismaQlDSLOptionMap = {
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
            pivotOnly?: boolean;
            fkHolder?: string;
            required?: boolean;
            relationName?: string;
        };
        MODEL: {
            empty?: boolean;
        };
    };
    UPDATE: {
        ENUM: {
            replace: boolean;
        };
        GENERATOR: {
            output?: string;
            provider?: string;
        };
        DB: {
            provider?: string;
            url?: string;
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
type PrismaQlDSLOptions<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined> = A extends keyof PrismaQlDSLOptionMap ? C extends keyof PrismaQlDSLOptionMap[A] ? PrismaQlDSLOptionMap[A][C] : Record<string, string | number | boolean | Array<string>> : Record<string, string | number | boolean | Array<string>>;
interface PrismaQLParsedDSL<A extends PrismaQlDSLAction = PrismaQlDSLAction, C extends PrismaQLDSLCommand = PrismaQLDSLCommand, T extends PrismaQlDSLType = PrismaQlDSLType> {
    action: A;
    command?: C;
    args?: PrismaQLDSLArgs<A, C>;
    options?: PrismaQlDSLOptions<A, C>;
    prismaBlock?: string;
    raw: string;
    type: T;
}
type PrismaQlDSLArgsProcessor<A extends PrismaQlDSLAction = PrismaQlDSLAction, C extends PrismaQLDSLCommand = PrismaQLDSLCommand> = (parsedArgs: PrismaQLDSLArgs<A, C>, rawArgs: string | undefined) => PrismaQLDSLArgs<A, C>;
declare class PrismaQlDslParser<A extends string = PrismaQlDSLAction, C extends string = PrismaQLDSLCommand> {
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
declare const basePrismaQlAgsProcessor: Record<PrismaQlDSLAction, {
    default: PrismaQlDSLArgsProcessor<any, any>;
} & Partial<Record<PrismaQLDSLCommand, PrismaQlDSLArgsProcessor<any, any>>>>;
declare const prismaQlParser: PrismaQlDslParser<BasePrismaQlDSLAction, BasePrismaQLDSLCommand>;

export { type BasePrismaQLDSLCommand, type BasePrismaQlDSLAction, type DSLPrismaRelationType, type PrismaQLDSLArgs, type PrismaQLDSLCommand, type PrismaQLParsedDSL, type PrismaQlDSLAction, type PrismaQlDSLArgsProcessor, type PrismaQlDSLMutationAction, type PrismaQlDSLOptionMap, type PrismaQlDSLOptions, type PrismaQlDSLQueryAction, type PrismaQlDSLType, PrismaQlDslParser, basePrismaQlAgsProcessor, prismaQlParser };
