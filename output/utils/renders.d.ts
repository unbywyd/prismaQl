import { Break, Comment, createPrismaSchemaBuilder, Enum, Model, Property } from "@mrleebo/prisma-ast";
export declare const getModels: (models: Model[]) => string;
export declare const modelsToSchema: (models: Model[]) => string;
/**
 * Converts model relations to Prisma syntax.
 */
export declare const relationsToSchema: (model: Model, builder: ReturnType<typeof createPrismaSchemaBuilder>) => string;
/**
 * Converts an ENUM object to Prisma schema.
 */
export declare const enumsToSchema: (enumItems: Enum[]) => string;
export declare const fieldsToSchema: (model: Model, fields: (Comment | Break | Property)[]) => string;
//# sourceMappingURL=renders.d.ts.map