import { DMMF } from '@prisma/generator-helper';
import { getSchema, createPrismaSchemaBuilder, Model as Model$1, Property, Schema, Field, Enum } from '@mrleebo/prisma-ast';

type RelationType = "1:1" | "1:M" | "M:N";
interface Relation {
    type: RelationType;
    fieldName?: string;
    modelName: string;
    relatedModel: string;
    foreignKey?: string;
    referenceKey?: string;
    inverseField?: string;
    relationDirection?: "forward" | "backward" | "bidirectional";
    relationTable?: string;
    relationName: string;
    constraints?: string[];
}
type Model = DMMF.Model;
declare class PrismaRelationCollector {
    private models;
    private relations;
    getRelations(): Relation[];
    setModels(models: Model[]): Promise<Relation[]>;
    constructor(models?: Model[]);
    getRelation(modelName: string, fieldName: string): Relation | null;
    /**
 * Function to detect one-to-one relationships in Prisma DMMF models.
 * It now detects **both** sides of the relationship (forward & reverse).
 */
    detectOneToOneRelations(models: Model[]): Relation[];
    detectOneToManyRelations(models: Model[]): Relation[];
    private getManyToManyTableName;
    detectManyToManyRelations(models: Model[]): Relation[];
    detectExplicitManyToManyRelations(models: Model[]): Relation[];
    private deduplicateRelations;
    collectRelations(models: Model[]): Promise<Relation[]>;
    parsePrismaSchema(schema?: string): Promise<void>;
}
declare const getManyToManyTableName: (modelA: string, modelB: string, relationName?: string) => string;
declare const getManyToManyModelName: (modelA: string, modelB: string, relationName?: string) => string;

type DSLAction = "GET" | "ADD" | "DELETE" | "UPDATE" | "PRINT" | "VALIDATE";
type DSLCommand = "MODELS" | "MODEL" | "FIELD" | "FIELDS" | "RELATIONS" | "ENUM_RELATIONS" | "ENUMS" | "ENUM" | "MODELS_LIST" | "RELATION";
type DSLType = "query" | "mutation";
type DSLMutationAction = "ADD" | "DELETE" | "UPDATE";
type DSLQueryAction = "GET" | "PRINT" | "VALIDATE";
type DSLArgs<A extends DSLAction, C extends DSLCommand | undefined> = {
    models?: string[];
    fields?: string[];
    enums?: string[];
};
type DSLPrismaRelationType = RelationType;
type DSLOptionMap = {
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
type DSLOptions<A extends DSLAction, C extends DSLCommand | undefined> = A extends keyof DSLOptionMap ? C extends keyof DSLOptionMap[A] ? DSLOptionMap[A][C] : Record<string, string | number | boolean | Array<string>> : Record<string, string | number | boolean | Array<string>>;
interface ParsedDSL<A extends DSLAction, C extends DSLCommand | undefined, T extends DSLType> {
    action: A;
    command?: C;
    args?: DSLArgs<A, C>;
    options?: DSLOptions<A, C>;
    prismaBlock?: string;
    raw: string;
    type: T;
}
type DSLArgsProcessor<A extends DSLAction, C extends DSLCommand | undefined> = (parsedArgs: DSLArgs<A, C>, rawArgs: string | undefined) => DSLArgs<A, C>;
declare class DslParser {
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
declare const dslParser: DslParser;

type PrismaSchemaData = {
    schemaPath?: string;
    schema: string;
    ast: ReturnType<typeof getSchema>;
    builder: ReturnType<typeof createPrismaSchemaBuilder>;
    relations: Relation[];
};
type PrismaSchemaLoaderOptions = {
    backupPath?: string;
};
declare class PrismaSchemaLoader {
    relationCollector: PrismaRelationCollector;
    options: PrismaSchemaLoaderOptions;
    private lastValidatedSchema;
    private readonly prismaState;
    private backupPath;
    constructor(relationCollector: PrismaRelationCollector, options?: PrismaSchemaLoaderOptions);
    rebase(): Promise<void>;
    getSchemaPath(): string | undefined;
    private setPrismaState;
    loadFromFile(filePath?: string, forceReload?: boolean): Promise<PrismaSchemaData | null>;
    collectRelations(): Promise<Relation[]>;
    private prepareSchema;
    loadFromText(sourcePrismaSchema: string): Promise<PrismaSchemaData | null>;
    getState(): Promise<PrismaSchemaData>;
    clonePrismaState(): PrismaSchemaData;
    save(commits: Array<string> | string, sourcePath?: string): Promise<void>;
    print(): string;
    isValid(sourceSchema?: string): Promise<true | Error>;
    check(): void;
}

type ModelTree = {
    model: string;
    relations: RelationNode[];
};
type JsonRelationTree = {
    trees: ModelTree[];
    models: Set<string>;
    relations: Set<string>;
};
type RelationNode = {
    relatedModel: string;
    field: string;
    type: string;
    alias?: string;
    foreignKey?: string;
    referenceKey?: string;
    relationTable?: string;
    inverseField?: string;
    constraints?: string[];
    isSelfRelation?: boolean;
    isList?: boolean;
    subTree?: ModelTree;
};
type RelationStatistics = {
    uniqueModels: number;
    totalRelations: number;
    maxDepth: number;
};
declare class FieldRelationLogger {
    relations: Relation[];
    setRelations(relations: Relation[]): void;
    constructor(relations?: Relation[]);
    buildJsonModelTrees(rootModel: string, relations: Relation[], maxDepth: number, depth?: number, visitedModels?: Set<string>): JsonRelationTree;
    buildModelTrees(rootModel: string, relations: Relation[], maxDepth: number, depth?: number, visitedModels?: Set<string>): {
        trees: Record<string, any>[];
        models: Set<string>;
        relations: Set<string>;
    };
    getRelationStatistics(modelName: string, maxDepth?: number): RelationStatistics;
    collectRelationStatistics(models: Set<string>, relations: Set<string>, rootModel: string, maxDepth: number): {
        uniqueModels: number;
        totalRelations: number;
        directRelations: number;
        maxDepth: number;
    };
    private parseSchemaAndSetRelations;
    provideRelationsFromBuilder(builder: ReturnType<typeof createPrismaSchemaBuilder>): Promise<Relation[]>;
    provideRelationsFromSchema(schema: string): Promise<Relation[]>;
    privideRelationByPrismaPath(prismaPath: string): Promise<Relation[]>;
    generateRelationTreeLog(rootModel: string, maxDepth?: number, relations?: Relation[]): string;
}
declare const getRelationStatistics: (relations: Relation[], modelName: string, maxDepth?: number) => RelationStatistics;

type HandlerResponse = {
    dsl: ParsedDSL<DSLAction, DSLCommand, DSLType>;
    result?: any;
    error?: string | Error;
};
type Handler<A extends DSLAction, C extends DSLCommand | undefined, T extends DSLType> = (prismaState: PrismaSchemaData, dsl: ParsedDSL<A, C, T>) => HandlerResponse;
declare const handlerResponse: (dsl: ParsedDSL<DSLAction, DSLCommand, DSLType>) => {
    error: (error: string | Error) => HandlerResponse;
    result: (result: any) => HandlerResponse;
};
declare class HandlerRegistry<A extends DSLAction, C extends DSLCommand | undefined, T extends DSLType> {
    protected handlers: Record<string, Handler<A, C, T>>;
    constructor(initialHandlers?: Record<string, Handler<A, C, T>>);
    register(action: A, command: C, handler: Handler<A, C, T>): void;
    execute(action: A, command: C, prismaState: PrismaSchemaData | null, dsl: ParsedDSL<A, C, T>): HandlerResponse;
}

declare class MutationHandlerRegistry extends HandlerRegistry<DSLMutationAction, DSLCommand, 'mutation'> {
    constructor(initialHandlers?: Record<string, Handler<DSLMutationAction, DSLCommand, 'mutation'>>);
}

declare class QueryHandlerRegistry extends HandlerRegistry<DSLQueryAction, DSLCommand, 'query'> {
    constructor(initialHandlers?: Record<string, Handler<DSLQueryAction, DSLCommand, 'query'>>);
}

type MutationOptions = {
    save?: boolean;
    dryRun?: boolean;
    confirm?: (schema: string) => Promise<boolean>;
};
declare class PrismaQlProvider {
    private queryHandler;
    private mutationHandler;
    private loader;
    private mutationState;
    constructor(config: {
        queryHandler: QueryHandlerRegistry;
        mutationHandler: MutationHandlerRegistry;
        loader: PrismaSchemaLoader;
    });
    multiApply(commands: string[] | string, options?: MutationOptions): Promise<HandlerResponse[]>;
    apply<A extends DSLAction, C extends DSLCommand>(input: string | ParsedDSL<DSLAction, DSLCommand, 'query' | 'mutation'>, options?: MutationOptions): Promise<{
        parsedCommand: ParsedDSL<A, C, 'query' | 'mutation'>;
        response: HandlerResponse;
    }>;
    query<A extends DSLQueryAction, C extends DSLCommand>(input: string | ParsedDSL<DSLQueryAction, DSLCommand, 'query'>): Promise<HandlerResponse>;
    dryMutation<A extends DSLMutationAction, C extends DSLCommand>(input: string | ParsedDSL<DSLMutationAction, DSLCommand, 'mutation'>): Promise<string>;
    mutation<A extends DSLMutationAction, C extends DSLCommand>(input: string | ParsedDSL<DSLMutationAction, DSLCommand, 'mutation'>, options?: MutationOptions): Promise<HandlerResponse>;
    save(): Promise<void>;
    private parseCommand;
}

type FieldSummary$1 = {
    name: string;
    type: string;
    isId: boolean;
    isUnique: boolean;
    isRelation: boolean;
};
declare const getModel: Handler<"GET", "MODEL", "query">;

declare function extractModelSummary(model: Model$1, relations: Relation[]): FieldSummary$1[];

/**
 * Finds and validates the Prisma schema.
 * @returns Promise<void> Resolves if valid, throws an error if invalid.
 */
declare function validatePrismaSchema(schema: string): Promise<true | Error>;

/**
 * Парсит поле AST и возвращает объект, пригодный для передачи в fieldBuilder.
 * @param {Property} prop - Поле из AST Prisma
 * @returns {object | null} - Структурированные данные или null (если поле недопустимо)
 */
declare function parseFieldForBuilder(prop: Property): {
    name: string;
    fieldType: string;
    attributes: {
        name: string;
        args: any[];
    }[];
    sourceType: string;
} | null;
declare class SchemaHelper {
    private parsedSchema;
    constructor(parsedSchema: Schema);
    getModels(names?: Array<string>): Model$1[];
    getModelByName(name: string): Model$1 | undefined;
    getFieldByName(modelName: string, fieldName: string): Field | undefined;
    getFields(modelName: string): Field[];
    getIdFieldTypeModel(modelName: string): string | undefined;
    getEnums(): Enum[];
    getEnumByName(name: string): Enum | undefined;
    getEnumRelations(enumName: string): Array<{
        model: Model$1;
        field: Field;
    }>;
    getRelations(): Field[];
    getModelRelations(modelName: string): Field[];
}
declare const useHelper: (schema: Schema | PrismaSchemaData) => SchemaHelper;

declare const loadPrismaSchema: (inputPath?: string) => Promise<{
    schema: string;
    path: string;
}>;

declare const getEnumRelations: Handler<"GET", "ENUM_RELATIONS", "query">;

declare const getEnums: Handler<"GET", "ENUMS", "query">;

declare const getFields: Handler<"GET", "FIELDS", "query">;

/**
 * Splits an array into columns
 */
declare const formatColumns: (items: string[], columns?: number) => string;
/**
 * Registers a handler for the `GET_MODEL_NAMES` command with columns
 */
declare const sortModelNames$1: (modelNames: string[]) => void;
declare const getModelNames: Handler<"GET", "MODELS_LIST", "query">;

declare const getModels: Handler<"GET", "MODELS", 'query'>;

declare const getRelations: Handler<"GET", "RELATIONS", 'query'>;

declare const index$2_formatColumns: typeof formatColumns;
declare const index$2_getEnumRelations: typeof getEnumRelations;
declare const index$2_getEnums: typeof getEnums;
declare const index$2_getFields: typeof getFields;
declare const index$2_getModel: typeof getModel;
declare const index$2_getModelNames: typeof getModelNames;
declare const index$2_getModels: typeof getModels;
declare const index$2_getRelations: typeof getRelations;
declare namespace index$2 {
  export { type FieldSummary$1 as FieldSummary, index$2_formatColumns as formatColumns, index$2_getEnumRelations as getEnumRelations, index$2_getEnums as getEnums, index$2_getFields as getFields, index$2_getModel as getModel, index$2_getModelNames as getModelNames, index$2_getModels as getModels, index$2_getRelations as getRelations, sortModelNames$1 as sortModelNames };
}

declare const getJsonEnumRelations: Handler<"GET", "ENUM_RELATIONS", "query">;

declare const getJsonEnums: Handler<"GET", "ENUMS", "query">;

declare const getJsonFields: Handler<"GET", "FIELDS", "query">;

declare const sortModelNames: (modelNames: string[]) => void;
declare const getJsonModelNames: Handler<"GET", "MODELS_LIST", "query">;

type FieldSummary = {
    name: string;
    type: string;
    isId: boolean;
    isUnique: boolean;
    isRelation: boolean;
};
declare const getJsonModel: Handler<"GET", "MODEL", "query">;

declare const getJsonModels: Handler<"GET", "MODELS", 'query'>;

declare const getJsonRelations: Handler<"GET", "RELATIONS", 'query'>;

type index$1_FieldSummary = FieldSummary;
declare const index$1_getJsonEnumRelations: typeof getJsonEnumRelations;
declare const index$1_getJsonEnums: typeof getJsonEnums;
declare const index$1_getJsonFields: typeof getJsonFields;
declare const index$1_getJsonModel: typeof getJsonModel;
declare const index$1_getJsonModelNames: typeof getJsonModelNames;
declare const index$1_getJsonModels: typeof getJsonModels;
declare const index$1_getJsonRelations: typeof getJsonRelations;
declare const index$1_sortModelNames: typeof sortModelNames;
declare namespace index$1 {
  export { type index$1_FieldSummary as FieldSummary, index$1_getJsonEnumRelations as getJsonEnumRelations, index$1_getJsonEnums as getJsonEnums, index$1_getJsonFields as getJsonFields, index$1_getJsonModel as getJsonModel, index$1_getJsonModelNames as getJsonModelNames, index$1_getJsonModels as getJsonModels, index$1_getJsonRelations as getJsonRelations, index$1_sortModelNames as sortModelNames };
}

declare const addEnum: Handler<"ADD", "ENUM", "mutation">;

declare const addField: Handler<"ADD", "FIELD", "mutation">;

declare const addModel: Handler<"ADD", "MODEL", "mutation">;

declare const addRelation: Handler<"ADD", "RELATION", "mutation">;

declare const deleteEnum: Handler<"DELETE", "ENUM", "mutation">;

declare const deleteField: Handler<"DELETE", "FIELD", "mutation">;

declare const deleteModel: Handler<"DELETE", "MODEL", "mutation">;

declare const deleteRelation: Handler<"DELETE", "RELATION", "mutation">;

declare const updateEnum: Handler<"UPDATE", "ENUM", "mutation">;

declare const updateField: Handler<"UPDATE", "FIELD", "mutation">;

declare const index_addEnum: typeof addEnum;
declare const index_addField: typeof addField;
declare const index_addModel: typeof addModel;
declare const index_addRelation: typeof addRelation;
declare const index_deleteEnum: typeof deleteEnum;
declare const index_deleteField: typeof deleteField;
declare const index_deleteModel: typeof deleteModel;
declare const index_deleteRelation: typeof deleteRelation;
declare const index_updateEnum: typeof updateEnum;
declare const index_updateField: typeof updateField;
declare namespace index {
  export { index_addEnum as addEnum, index_addField as addField, index_addModel as addModel, index_addRelation as addRelation, index_deleteEnum as deleteEnum, index_deleteField as deleteField, index_deleteModel as deleteModel, index_deleteRelation as deleteRelation, index_updateEnum as updateEnum, index_updateField as updateField };
}

declare const mutationHandler: MutationHandlerRegistry;

declare const queryHandler: QueryHandlerRegistry;

declare const queryJsonHandler: QueryHandlerRegistry;

export { type DSLAction, type DSLArgs, type DSLArgsProcessor, type DSLCommand, type DSLMutationAction, type DSLOptionMap, type DSLOptions, type DSLPrismaRelationType, type DSLQueryAction, type DSLType, DslParser, FieldRelationLogger, type Handler, HandlerRegistry, type HandlerResponse, type JsonRelationTree, type ModelTree, MutationHandlerRegistry, type MutationOptions, type ParsedDSL, PrismaQlProvider, PrismaRelationCollector, type PrismaSchemaData, PrismaSchemaLoader, type PrismaSchemaLoaderOptions, QueryHandlerRegistry, type Relation, type RelationNode, type RelationStatistics, type RelationType, SchemaHelper, dslParser, extractModelSummary, getManyToManyModelName, getManyToManyTableName, getRelationStatistics, handlerResponse, index$1 as jsonGetters, loadPrismaSchema, mutationHandler, index as mutationHandlers, parseFieldForBuilder, queryHandler, queryJsonHandler, index$2 as renderGetters, useHelper, validatePrismaSchema };
