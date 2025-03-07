import { RelationType } from "./field-relation-collector.js";
export type DSLAction = "GET" | "ADD" | "DELETE" | "UPDATE" | "PRINT" | "VALIDATE";
export type DSLCommand = "MODELS" | "MODEL" | "FIELD" | "FIELDS" | "RELATIONS" | "ENUM_RELATIONS" | "ENUMS" | "ENUM" | "MODELS_LIST" | "RELATION";
export type DSLType = "query" | "mutation";
export type DSLMutationAction = "ADD" | "DELETE" | "UPDATE";
export type DSLQueryAction = "GET" | "PRINT" | "VALIDATE";
export type DSLArgs<A extends DSLAction, C extends DSLCommand | undefined> = {
    models?: string[];
    fields?: string[];
    enums?: string[];
};
export type DSLPrismaRelationType = RelationType;
export type DSLOptionMap = {
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
export type DSLOptions<A extends DSLAction, C extends DSLCommand | undefined> = A extends keyof DSLOptionMap ? C extends keyof DSLOptionMap[A] ? DSLOptionMap[A][C] : Record<string, string | number | boolean | Array<string>> : Record<string, string | number | boolean | Array<string>>;
export interface ParsedDSL<A extends DSLAction, C extends DSLCommand | undefined, T extends DSLType> {
    action: A;
    command?: C;
    args?: DSLArgs<A, C>;
    options?: DSLOptions<A, C>;
    prismaBlock?: string;
    raw: string;
    type: T;
}
export type DSLArgsProcessor<A extends DSLAction, C extends DSLCommand | undefined> = (parsedArgs: DSLArgs<A, C>, rawArgs: string | undefined) => DSLArgs<A, C>;
export declare class DslParser {
    argsProcessors: Record<DSLAction, {
        default: DSLArgsProcessor<any, any>;
    } & Partial<Record<DSLCommand, DSLArgsProcessor<any, any>>>>;
    constructor(argsProcessors: Record<DSLAction, {
        default: DSLArgsProcessor<any, any>;
    } & Partial<Record<DSLCommand, DSLArgsProcessor<any, any>>>>);
    parseCommand<A extends DSLAction, C extends DSLCommand | undefined, T extends DSLType>(input: string): ParsedDSL<A, C, T>;
    parseParams(input: string): DSLOptions<any, any>;
    parseArgs<A extends DSLAction, C extends DSLCommand | undefined>(argsStr: string | undefined): DSLArgs<A, C>;
    detectActionType(source: string): DSLType | null;
    isValid(source: string): boolean | Error;
}
declare const instance: DslParser;
export default instance;
//# sourceMappingURL=dsl.d.ts.map