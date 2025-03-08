import { Schema, Model, Field, Enum, Block } from "@mrleebo/prisma-ast";
import { PrismaQlSchemaData } from "../prisma-schema-loader.js";
import { Property } from "@mrleebo/prisma-ast";
/**
 * Парсит поле AST и возвращает объект, пригодный для передачи в fieldBuilder.
 * @param {Property} prop - Поле из AST Prisma
 * @returns {object | null} - Структурированные данные или null (если поле недопустимо)
 */
export declare function parseFieldForBuilder(prop: Property): {
    name: string;
    fieldType: string;
    attributes: {
        name: string;
        args: any[];
    }[];
    sourceType: string;
} | null;
export declare class PrismaQlSchemaHelper {
    private parsedSchema;
    constructor(parsedSchema: Schema);
    getModels(names?: Array<string>): Model[];
    getModelByName(name: string): Model | undefined;
    getFieldByName(modelName: string, fieldName: string): Field | undefined;
    getFields(modelName: string): Field[];
    getIdFieldTypeModel(modelName: string): string | undefined;
    getEnums(): Enum[];
    getEnumByName(name: string): Enum | undefined;
    getEnumRelations(enumName: string): Array<{
        model: Model;
        field: Field;
    }>;
    getRelations(): Field[];
    getGenerators(): Block[];
    getModelRelations(modelName: string): Field[];
}
export declare const useHelper: (schema: Schema | PrismaQlSchemaData) => PrismaQlSchemaHelper;
//# sourceMappingURL=schema-helper.d.ts.map