export type DSLAction = "GET" | "ADD" | "DELETE" | "UPDATE" | "PRINT" | "VALIDATE";
export type DSLCommand = "MODELS" | "MODEL" | "FIELD" | "FIELDS" | "RELATIONS" | "RELATION_FIELDS" | "ENUMS" | "ENUM" | "MODEL_NAMES" | "ENUM_NAMES" | "RELATION";
export type DSLType = "query" | "mutation";
export type MutationAction = "ADD" | "DELETE" | "UPDATE";
export type QueryAction = "GET" | "PRINT" | "VALIDATE";
export type DSLArgs<A extends DSLAction, C extends DSLCommand | undefined> = {
    models?: string[];
    fields?: string[];
    relations?: string[];
    enums?: string[];
};
export type DSLOptions<A extends DSLAction, C extends DSLCommand | undefined> = Record<string, string | number | boolean>;
export interface ParsedDSL<A extends DSLAction, C extends DSLCommand | undefined> {
    action: A;
    command?: C;
    args?: DSLArgs<A, C>;
    options?: DSLOptions<A, C>;
    prismaBlock?: string;
    raw: string;
    type: DSLType;
}
export type DSLArgsProcessor<A extends DSLAction, C extends DSLCommand | undefined> = (parsedArgs: DSLArgs<A, C>, rawArgs: string | undefined) => DSLArgs<A, C>;
export declare class DslParser {
    argsProcessors: Record<DSLAction, {
        default: DSLArgsProcessor<any, any>;
    } & Partial<Record<DSLCommand, DSLArgsProcessor<any, any>>>>;
    constructor(argsProcessors: Record<DSLAction, {
        default: DSLArgsProcessor<any, any>;
    } & Partial<Record<DSLCommand, DSLArgsProcessor<any, any>>>>);
    parseCommand<A extends DSLAction, C extends DSLCommand | undefined>(input: string): ParsedDSL<A, C>;
    parseParams(input: string): DSLOptions<any, any>;
    parseArgs<A extends DSLAction, C extends DSLCommand | undefined>(argsStr: string | undefined): DSLArgs<A, C>;
    detectActionType(source: string): DSLType | null;
}
declare const instance: DslParser;
export default instance;
//# sourceMappingURL=dsl.d.ts.map