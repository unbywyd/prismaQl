import { createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { Relation } from "./relation-collector.js";
export declare class RelationLogger {
    relations: Relation[];
    setRelations(relations: Relation[]): void;
    buildModelTrees(rootModel: string, relations: Relation[], maxDepth: number, depth?: number, visitedModels?: Set<string>): {
        trees: Record<string, any>[];
        models: Set<string>;
        relations: Set<string>;
    };
    collectRelationStatistics(models: Set<string>, relations: Set<string>, maxDepth: number): {
        uniqueModels: number;
        totalRelations: number;
        maxDepth: number;
    };
    private parseSchemaAndSetRelations;
    provideRelationsFromBuilder(builder: ReturnType<typeof createPrismaSchemaBuilder>): Promise<Relation[]>;
    provideRelationsFromSchema(schema: string): Promise<Relation[]>;
    privideRelationByPrismaPath(prismaPath: string): Promise<Relation[]>;
    generateRelationTreeLog(rootModel: string, maxDepth?: number, relations?: Relation[]): string;
}
declare const instance: RelationLogger;
export default instance;
//# sourceMappingURL=relation-logger.d.ts.map