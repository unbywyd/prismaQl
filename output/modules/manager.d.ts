import { getSchema, createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { PrismaRelationCollector } from "./relation-collector.js";
export type PrismaSchemaData = {
    schemaPath: string;
    schema: string;
    parsedSchema: ReturnType<typeof getSchema>;
    builder: ReturnType<typeof createPrismaSchemaBuilder>;
};
export declare class PrismaSchemaLoader {
    relationCollector: PrismaRelationCollector;
    private lastValidatedSchema;
    private readonly prismaState;
    constructor(relationCollector: PrismaRelationCollector);
    getSchemaPath(): string | undefined;
    setPrismaState(newState: PrismaSchemaData): void;
    getRelations(): import("./relation-collector.js").Relation[];
    getSourcePrismaSchema(): string | undefined;
    loadFromFile(filePath?: string, forceReload?: boolean): Promise<PrismaSchemaData | null>;
    collectRelations(): Promise<import("./relation-collector.js").Relation[]>;
    private prepareSchema;
    loadFromText(sourcePrismaSchema: string): Promise<PrismaSchemaData | null>;
    getSchema(): Promise<PrismaSchemaData | null>;
    clonePrismaState(): PrismaSchemaData;
    save(sourcePath?: string): void;
    print(): void;
    isValid(sourceSchema?: string): Promise<true | Error>;
    check(): void;
}
export default PrismaSchemaLoader;
//# sourceMappingURL=manager.d.ts.map