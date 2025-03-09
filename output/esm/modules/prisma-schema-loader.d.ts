import { getSchema, createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { PrismaQlRelationCollector, PrismaQLRelation } from "./field-relation-collector.js";
export type PrismaQlSchemaData = {
    schemaPath?: string;
    schema: string;
    ast: ReturnType<typeof getSchema>;
    builder: ReturnType<typeof createPrismaSchemaBuilder>;
    relations: PrismaQLRelation[];
};
export type PrismaQlSchemaLoaderOptions = {
    backupPath?: string;
    cwd?: string;
};
export declare class PrismaQlSchemaLoader {
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
export default PrismaQlSchemaLoader;
//# sourceMappingURL=prisma-schema-loader.d.ts.map