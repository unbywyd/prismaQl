import { Schema, Model, Field, Enum } from "@mrleebo/prisma-ast";
import { PrismaSchemaData } from "./prisma-schema-loader.js";
export declare class SchemaHelper {
    private parsedSchema;
    constructor(parsedSchema: Schema);
    getModels(names?: Array<string>): Model[];
    getModelByName(name: string): Model | undefined;
    getFields(modelName: string): Field[];
    getEnums(): Enum[];
    getEnumByName(name: string): Enum | undefined;
    getRelations(): Field[];
    getModelRelations(modelName: string): Field[];
}
export declare const useHelper: (schema: Schema | PrismaSchemaData) => SchemaHelper;
//# sourceMappingURL=schema-helper.d.ts.map