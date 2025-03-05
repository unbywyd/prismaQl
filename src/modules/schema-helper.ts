import { Schema, Model, Field, Enum } from "@mrleebo/prisma-ast";
import { PrismaSchemaData } from "./prisma-schema-loader.js";

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

    getFields(modelName: string): Field[] {
        const model = this.getModelByName(modelName);
        if (!model) return [];
        return model.properties.filter((prop): prop is Field => prop.type === "field");
    }

    getEnums(): Enum[] {
        return this.parsedSchema.list
            .filter((item): item is Enum => item.type === "enum");
    }

    getEnumByName(name: string): Enum | undefined {
        return this.getEnums().find((enumItem) => enumItem.name === name);
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
    return new SchemaHelper("type" in schema ? schema : schema.parsedSchema);
}