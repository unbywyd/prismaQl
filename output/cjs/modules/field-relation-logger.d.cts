import { createPrismaSchemaBuilder } from '@mrleebo/prisma-ast';
import { PrismaQLRelation } from './field-relation-collector.cjs';
import '@prisma/generator-helper';

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

export { type PrismaQLRelationStatistics, PrismaQlFieldRelationLogger, type PrismaQlJsonRelationTree, type PrismaQlModelTree, type PrismaQlRelationNode, getRelationStatistics };
