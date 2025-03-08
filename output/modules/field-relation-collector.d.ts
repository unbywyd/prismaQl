import type { DMMF } from "@prisma/generator-helper";
export type PrismaQlRelationType = "1:1" | "1:M" | "M:N";
export interface PrismaQLRelation {
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
export declare class PrismaQlRelationCollector {
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
export declare const getManyToManyTableName: (modelA: string, modelB: string, relationName?: string) => string;
export declare const getManyToManyModelName: (modelA: string, modelB: string, relationName?: string) => string;
export {};
//# sourceMappingURL=field-relation-collector.d.ts.map