import { createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { Relation } from "./field-relation-collector.js";
export type RelationStatistics = {
    uniqueModels: number;
    totalRelations: number;
    maxDepth: number;
};
export declare class RelationLogger {
    relations: Relation[];
    setRelations(relations: Relation[]): void;
    constructor(relations?: Relation[]);
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
export declare const getRelationStatistics: (relations: Relation[], modelName: string, maxDepth?: number) => RelationStatistics;
//# sourceMappingURL=relation-logger.d.ts.map