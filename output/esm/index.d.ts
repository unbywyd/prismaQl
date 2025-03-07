import { DMMF } from '@prisma/generator-helper';
import { getSchema, createPrismaSchemaBuilder, Model as Model$1, Property, Schema, Field, Enum } from '@mrleebo/prisma-ast';

type PrismaQlRelationType = "1:1" | "1:M" | "M:N";
interface PrismaQLRelation {
    type: PrismaQlRelationType;
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
declare class PrismaQlRelationCollector {
    private models;
    private relations;
    getRelations(): PrismaQLRelation[];
    setModels(models: Model[]): Promise<PrismaQLRelation[]>;
    constructor(models?: Model[]);
    getRelation(modelName: string, fieldName: string): PrismaQLRelation | null;
    /**
 * Function to detect one-to-one relationships in Prisma DMMF models.
 * It now detects **both** sides of the relationship (forward & reverse).
 */
    detectOneToOneRelations(models: Model[]): PrismaQLRelation[];
    detectOneToManyRelations(models: Model[]): PrismaQLRelation[];
    private getManyToManyTableName;
    detectManyToManyRelations(models: Model[]): PrismaQLRelation[];
    detectExplicitManyToManyRelations(models: Model[]): PrismaQLRelation[];
    private deduplicateRelations;
    collectRelations(models: Model[]): Promise<PrismaQLRelation[]>;
    parsePrismaSchema(schema?: string): Promise<void>;
}
declare const getManyToManyTableName: (modelA: string, modelB: string, relationName?: string) => string;
declare const getManyToManyModelName: (modelA: string, modelB: string, relationName?: string) => string;

type PrismaQlDSLAction = "GET" | "ADD" | "DELETE" | "UPDATE" | "PRINT" | "VALIDATE";
type PrismaQLDSLCommand = "MODELS" | "MODEL" | "FIELD" | "FIELDS" | "RELATIONS" | "ENUM_RELATIONS" | "ENUMS" | "ENUM" | "MODELS_LIST" | "RELATION";
type PrismaQlDSLType = "query" | "mutation";
type PrismaQlDSLMutationAction = "ADD" | "DELETE" | "UPDATE";
type PrismaQlDSLQueryAction = "GET" | "PRINT" | "VALIDATE";
type PrismaQLDSLArgs<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined> = {
    models?: string[];
    fields?: string[];
    enums?: string[];
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
type PrismaQlDSLOptions<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined> = A extends keyof PrismaQlDSLOptionMap ? C extends keyof PrismaQlDSLOptionMap[A] ? PrismaQlDSLOptionMap[A][C] : Record<string, string | number | boolean | Array<string>> : Record<string, string | number | boolean | Array<string>>;
interface PrismaQLParsedDSL<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined, T extends PrismaQlDSLType> {
    action: A;
    command?: C;
    args?: PrismaQLDSLArgs<A, C>;
    options?: PrismaQlDSLOptions<A, C>;
    prismaBlock?: string;
    raw: string;
    type: T;
}
type PrismaQlDSLArgsProcessor<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined> = (parsedArgs: PrismaQLDSLArgs<A, C>, rawArgs: string | undefined) => PrismaQLDSLArgs<A, C>;
declare class PrismaQlDslParser {
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
declare const prismaQlParser: PrismaQlDslParser;

type PrismaQlSchemaData = {
    schemaPath?: string;
    schema: string;
    ast: ReturnType<typeof getSchema>;
    builder: ReturnType<typeof createPrismaSchemaBuilder>;
    relations: PrismaQLRelation[];
};
type PrismaQlSchemaLoaderOptions = {
    backupPath?: string;
};
declare class PrismaQlSchemaLoader {
    relationCollector: PrismaQlRelationCollector;
    options: PrismaQlSchemaLoaderOptions;
    private lastValidatedSchema;
    private readonly prismaState;
    private backupPath;
    constructor(relationCollector: PrismaQlRelationCollector, options?: PrismaQlSchemaLoaderOptions);
    rebase(): Promise<void>;
    getSchemaPath(): string | undefined;
    private setPrismaState;
    loadFromFile(filePath?: string, forceReload?: boolean): Promise<PrismaQlSchemaData | null>;
    collectRelations(): Promise<PrismaQLRelation[]>;
    private prepareSchema;
    loadFromText(sourcePrismaSchema: string): Promise<PrismaQlSchemaData | null>;
    getState(): Promise<PrismaQlSchemaData>;
    clonePrismaState(): PrismaQlSchemaData;
    save(commits: Array<string> | string, sourcePath?: string): Promise<void>;
    print(): string;
    isValid(sourceSchema?: string): Promise<true | Error>;
    check(): void;
}

type PrismaQlModelTree = {
    model: string;
    relations: PrismaQlRelationNode[];
};
type PrismaQlJsonRelationTree = {
    trees: PrismaQlModelTree[];
    models: Set<string>;
    relations: Set<string>;
};
type PrismaQlRelationNode = {
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
    subTree?: PrismaQlModelTree;
};
type PrismaQLRelationStatistics = {
    uniqueModels: number;
    totalRelations: number;
    maxDepth: number;
};
declare class PrismaQlFieldRelationLogger {
    relations: PrismaQLRelation[];
    setRelations(relations: PrismaQLRelation[]): void;
    constructor(relations?: PrismaQLRelation[]);
    buildJsonModelTrees(rootModel: string, relations: PrismaQLRelation[], maxDepth: number, depth?: number, visitedModels?: Set<string>): PrismaQlJsonRelationTree;
    buildModelTrees(rootModel: string, relations: PrismaQLRelation[], maxDepth: number, depth?: number, visitedModels?: Set<string>): {
        trees: Record<string, any>[];
        models: Set<string>;
        relations: Set<string>;
    };
    getRelationStatistics(modelName: string, maxDepth?: number): PrismaQLRelationStatistics;
    collectRelationStatistics(models: Set<string>, relations: Set<string>, rootModel: string, maxDepth: number): {
        uniqueModels: number;
        totalRelations: number;
        directRelations: number;
        maxDepth: number;
    };
    private parseSchemaAndSetRelations;
    provideRelationsFromBuilder(builder: ReturnType<typeof createPrismaSchemaBuilder>): Promise<PrismaQLRelation[]>;
    provideRelationsFromSchema(schema: string): Promise<PrismaQLRelation[]>;
    privideRelationByPrismaPath(prismaPath: string): Promise<PrismaQLRelation[]>;
    generateRelationTreeLog(rootModel: string, maxDepth?: number, relations?: PrismaQLRelation[]): string;
}
declare const getRelationStatistics: (relations: PrismaQLRelation[], modelName: string, maxDepth?: number) => PrismaQLRelationStatistics;

type PrismaQLHandlerResponse = {
    dsl: PrismaQLParsedDSL<PrismaQlDSLAction, PrismaQLDSLCommand, PrismaQlDSLType>;
    result?: any;
    error?: string | Error;
};
type PrismaQlHandler<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined, T extends PrismaQlDSLType> = (prismaState: PrismaQlSchemaData, dsl: PrismaQLParsedDSL<A, C, T>) => PrismaQLHandlerResponse;
declare const handlerResponse: (dsl: PrismaQLParsedDSL<PrismaQlDSLAction, PrismaQLDSLCommand, PrismaQlDSLType>) => {
    error: (error: string | Error) => PrismaQLHandlerResponse;
    result: (result: any) => PrismaQLHandlerResponse;
};
declare class PrismaQlHandlerRegistry<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined, T extends PrismaQlDSLType> {
    protected handlers: Record<string, PrismaQlHandler<A, C, T>>;
    constructor(initialHandlers?: Record<string, PrismaQlHandler<A, C, T>>);
    register(action: A, command: C, handler: PrismaQlHandler<A, C, T>): void;
    execute(action: A, command: C, prismaState: PrismaQlSchemaData | null, dsl: PrismaQLParsedDSL<A, C, T>): PrismaQLHandlerResponse;
}

declare class PrismaQlMutationHandlerRegistry extends PrismaQlHandlerRegistry<PrismaQlDSLMutationAction, PrismaQLDSLCommand, 'mutation'> {
    constructor(initialHandlers?: Record<string, PrismaQlHandler<PrismaQlDSLMutationAction, PrismaQLDSLCommand, 'mutation'>>);
}

declare class PrismaQlQueryHandlerRegistry extends PrismaQlHandlerRegistry<PrismaQlDSLQueryAction, PrismaQLDSLCommand, 'query'> {
    constructor(initialHandlers?: Record<string, PrismaQlHandler<PrismaQlDSLQueryAction, PrismaQLDSLCommand, 'query'>>);
}

type PrismaQlMutationOptions = {
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
        queryHandler: PrismaQlQueryHandlerRegistry;
        mutationHandler: PrismaQlMutationHandlerRegistry;
        loader: PrismaQlSchemaLoader;
    });
    multiApply(commands: string[] | string, options?: PrismaQlMutationOptions): Promise<PrismaQLHandlerResponse[]>;
    apply<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand>(input: string | PrismaQLParsedDSL<PrismaQlDSLAction, PrismaQLDSLCommand, 'query' | 'mutation'>, options?: PrismaQlMutationOptions): Promise<{
        parsedCommand: PrismaQLParsedDSL<A, C, 'query' | 'mutation'>;
        response: PrismaQLHandlerResponse;
    }>;
    query<A extends PrismaQlDSLQueryAction, C extends PrismaQLDSLCommand>(input: string | PrismaQLParsedDSL<PrismaQlDSLQueryAction, PrismaQLDSLCommand, 'query'>): Promise<PrismaQLHandlerResponse>;
    dryMutation<A extends PrismaQlDSLMutationAction, C extends PrismaQLDSLCommand>(input: string | PrismaQLParsedDSL<PrismaQlDSLMutationAction, PrismaQLDSLCommand, 'mutation'>): Promise<string>;
    mutation<A extends PrismaQlDSLMutationAction, C extends PrismaQLDSLCommand>(input: string | PrismaQLParsedDSL<PrismaQlDSLMutationAction, PrismaQLDSLCommand, 'mutation'>, options?: PrismaQlMutationOptions): Promise<PrismaQLHandlerResponse>;
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
declare const getModel: PrismaQlHandler<"GET", "MODEL", "query">;

declare function extractModelSummary(model: Model$1, relations: PrismaQLRelation[]): FieldSummary$1[];

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
declare class PrismaQlSchemaHelper {
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
declare const useHelper: (schema: Schema | PrismaQlSchemaData) => PrismaQlSchemaHelper;

declare const loadPrismaSchema: (inputPath?: string) => Promise<{
    schema: string;
    path: string;
}>;

declare const getEnumRelations: PrismaQlHandler<"GET", "ENUM_RELATIONS", "query">;

declare const getEnums: PrismaQlHandler<"GET", "ENUMS", "query">;

declare const getFields: PrismaQlHandler<"GET", "FIELDS", "query">;

/**
 * Splits an array into columns
 */
declare const formatColumns: (items: string[], columns?: number) => string;
/**
 * Registers a handler for the `GET_MODEL_NAMES` command with columns
 */
declare const sortModelNames$1: (modelNames: string[]) => void;
declare const getModelNames: PrismaQlHandler<"GET", "MODELS_LIST", "query">;

declare const getModels: PrismaQlHandler<"GET", "MODELS", 'query'>;

declare const getRelations: PrismaQlHandler<"GET", "RELATIONS", 'query'>;

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

declare const getJsonEnumRelations: PrismaQlHandler<"GET", "ENUM_RELATIONS", "query">;

declare const getJsonEnums: PrismaQlHandler<"GET", "ENUMS", "query">;

declare const getJsonFields: PrismaQlHandler<"GET", "FIELDS", "query">;

declare const sortModelNames: (modelNames: string[]) => void;
declare const getJsonModelNames: PrismaQlHandler<"GET", "MODELS_LIST", "query">;

type FieldSummary = {
    name: string;
    type: string;
    isId: boolean;
    isUnique: boolean;
    isRelation: boolean;
};
declare const getJsonModel: PrismaQlHandler<"GET", "MODEL", "query">;

declare const getJsonModels: PrismaQlHandler<"GET", "MODELS", 'query'>;

declare const getJsonRelations: PrismaQlHandler<"GET", "RELATIONS", 'query'>;

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

declare const addEnum: PrismaQlHandler<"ADD", "ENUM", "mutation">;

declare const addField: PrismaQlHandler<"ADD", "FIELD", "mutation">;

declare const addModel: PrismaQlHandler<"ADD", "MODEL", "mutation">;

declare const addRelation: PrismaQlHandler<"ADD", "RELATION", "mutation">;

declare const deleteEnum: PrismaQlHandler<"DELETE", "ENUM", "mutation">;

declare const deleteField: PrismaQlHandler<"DELETE", "FIELD", "mutation">;

declare const deleteModel: PrismaQlHandler<"DELETE", "MODEL", "mutation">;

declare const deleteRelation: PrismaQlHandler<"DELETE", "RELATION", "mutation">;

declare const updateEnum: PrismaQlHandler<"UPDATE", "ENUM", "mutation">;

declare const updateField: PrismaQlHandler<"UPDATE", "FIELD", "mutation">;

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

declare const mutationsHandler: PrismaQlMutationHandlerRegistry;

declare const queryRendersHandler: PrismaQlQueryHandlerRegistry;

declare const queryJSONHandler: PrismaQlQueryHandlerRegistry;

export { type DSLPrismaRelationType, type PrismaQLDSLArgs, type PrismaQLDSLCommand, type PrismaQLHandlerResponse, type PrismaQLParsedDSL, type PrismaQLRelation, type PrismaQLRelationStatistics, type PrismaQlDSLAction, type PrismaQlDSLArgsProcessor, type PrismaQlDSLMutationAction, type PrismaQlDSLOptionMap, type PrismaQlDSLOptions, type PrismaQlDSLQueryAction, type PrismaQlDSLType, PrismaQlDslParser, PrismaQlFieldRelationLogger, type PrismaQlHandler, PrismaQlHandlerRegistry, type PrismaQlJsonRelationTree, type PrismaQlModelTree, PrismaQlMutationHandlerRegistry, type PrismaQlMutationOptions, PrismaQlProvider, PrismaQlQueryHandlerRegistry, PrismaQlRelationCollector, type PrismaQlRelationNode, type PrismaQlRelationType, type PrismaQlSchemaData, PrismaQlSchemaHelper, PrismaQlSchemaLoader, type PrismaQlSchemaLoaderOptions, extractModelSummary, getManyToManyModelName, getManyToManyTableName, getRelationStatistics, handlerResponse, index$1 as jsonGetters, loadPrismaSchema, index as mutationHandlers, mutationsHandler, parseFieldForBuilder, prismaQlParser, queryJSONHandler, queryRendersHandler, index$2 as renderGetters, useHelper, validatePrismaSchema };
