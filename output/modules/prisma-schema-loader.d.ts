import { getSchema, createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { PrismaRelationCollector, Relation } from "./field-relation-collector.js";
export type PrismaSchemaData = {
    schemaPath?: string;
    schema: string;
    ast: ReturnType<typeof getSchema>;
    builder: ReturnType<typeof createPrismaSchemaBuilder>;
    relations: Relation[];
};
export declare class PrismaSchemaLoader {
    relationCollector: PrismaRelationCollector;
    private lastValidatedSchema;
    private readonly prismaState;
    constructor(relationCollector: PrismaRelationCollector);
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
export default PrismaSchemaLoader;
//# sourceMappingURL=prisma-schema-loader.d.ts.map