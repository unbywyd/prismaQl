import { Schema, Model, Field, Enum } from "@mrleebo/prisma-ast";
import { PrismaSchemaData } from "../prisma-schema-loader.js";
import { Property } from "@mrleebo/prisma-ast";

/**
 * Парсит поле AST и возвращает объект, пригодный для передачи в fieldBuilder.
 * @param {Property} prop - Поле из AST Prisma
 * @returns {object | null} - Структурированные данные или null (если поле недопустимо)
 */
export function parseFieldForBuilder(prop: Property) {
    if (prop.type !== "field") return null;

    const { name, fieldType, array, optional, attributes } = prop;

    if (typeof name !== "string" || typeof fieldType !== "string") return null;

    // Пропускаем relation-поля (чтобы они не ломали логику)
    if (attributes?.some(attr => attr.name === "relation")) return null;

    // Определяем финальный тип Prisma-поля
    let prismaFieldType = fieldType;
    if (optional) prismaFieldType += "?";
    if (array) prismaFieldType += "[]";

    // Обрабатываем атрибуты (например, @id, @default, @unique)
    const parsedAttributes: { name: string; args: any[] }[] = [];
    for (const attr of attributes || []) {
        let attrArgs = attr.args?.map(arg => arg.value) || [];
        parsedAttributes.push({ name: attr.name, args: attrArgs });
    }


    return {
        name,
        fieldType: prismaFieldType,
        attributes: parsedAttributes,
        sourceType: fieldType
    };
}



export class SchemaHelper {
    private parsedSchema: Schema;

    constructor(parsedSchema: Schema) {
        this.parsedSchema = parsedSchema;
    }
    getModels(names?: Array<string>): Model[] {
        const models = this.parsedSchema.list
            .filter((item): item is Model => item.type === "model");
        if (names?.length) {
            return models.filter((model) => names.includes(model.name));
        }
        return models;
    }

    getModelByName(name: string): Model | undefined {
        return this.getModels().find((model) => model.name === name);
    }

    getFieldByName(modelName: string, fieldName: string): Field | undefined {
        const model = this.getModelByName(modelName);
        if (!model) return undefined;
        return model.properties.find((prop): prop is Field => prop.type === "field" && prop.name === fieldName);
    }
    getFields(modelName: string): Field[] {
        const model = this.getModelByName(modelName);
        if (!model) return [];
        return model.properties.filter((prop): prop is Field => prop.type === "field");
    }

    getIdFieldTypeModel(modelName: string): string | undefined {
        const model = this.getModelByName(modelName);
        if (!model) return undefined;
        const idField = model.properties.find((prop): prop is Field => prop.type === "field" && (prop as Field)?.attributes?.some(attr => attr.name === "id")!);
        return idField?.fieldType as string | undefined;
    }

    getEnums(): Enum[] {
        return this.parsedSchema.list
            .filter((item): item is Enum => item.type === "enum");
    }

    getEnumByName(name: string): Enum | undefined {
        return this.getEnums().find((enumItem) => enumItem.name === name);
    }

    getEnumRelations(enumName: string): Array<{
        model: Model,
        field: Field
    }> {
        const models = this.getModels();
        return models.filter((model) => {
            return model.properties.some((prop): prop is Field => {
                return prop.type === "field" && prop.fieldType === enumName;
            });
        }).map((model) => {
            const field = model.properties.find((prop): prop is Field => {
                return prop.type === "field" && prop.fieldType === enumName;
            });
            return {
                model,
                field: field!
            }
        });
    }

    getRelations(): Field[] {
        return this.getModels()
            .flatMap((model) => model.properties)
            .filter((prop): prop is Field => prop.type === "field" && prop.fieldType === "relation");
    }

    getModelRelations(modelName: string): Field[] {
        const model = this.getModelByName(modelName);
        if (!model) return [];
        return model.properties.filter(
            (prop): prop is Field => prop.type === "field" && prop.fieldType === "relation"
        );
    }
}

export const useHelper = (schema: Schema | PrismaSchemaData) => {
    return new SchemaHelper("type" in schema ? schema : schema.ast);
}