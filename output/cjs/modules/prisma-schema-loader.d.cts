import { getSchema, createPrismaSchemaBuilder } from '@mrleebo/prisma-ast';
import { PrismaQLRelation, PrismaQlRelationCollector } from './field-relation-collector.cjs';
import '@prisma/generator-helper';

type PrismaQlSchemaData = {
    schemaPath?: string;
    schema: string;
    ast: ReturnType<typeof getSchema>;
    builder: ReturnType<typeof createPrismaSchemaBuilder>;
    relations: PrismaQLRelation[];
};
type PrismaQlSchemaLoaderOptions = {
    backupPath?: string;
    cwd?: string;
};
declare class PrismaQlSchemaLoader {
    relationCollector: PrismaQlRelationCollector;
    options: PrismaQlSchemaLoaderOptions;
    private lastValidatedSchema;
    private readonly prismaState;
    private backupPath;
    private cwd;
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

export { type PrismaQlSchemaData, PrismaQlSchemaLoader, type PrismaQlSchemaLoaderOptions, PrismaQlSchemaLoader as default };
