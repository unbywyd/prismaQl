import { Break, Comment, createPrismaSchemaBuilder, Enum, getSchema, Model, printSchema, Property, Schema } from "@mrleebo/prisma-ast";

export const modelsToSchema = (models: Model[]) => {
    const schema: Schema = {
        type: 'schema',
        list: models
    };
    return printSchema(schema);
}

/**
 * Converts model relations to Prisma syntax.
 */
export const relationsToSchema = (model: Model, builder: ReturnType<typeof createPrismaSchemaBuilder>) => {
    const relatedFields = model.properties.filter(prop => {
        if (prop.type !== "field") return false;

        const isExplicitRelation = prop.attributes?.some(attr => attr.name === "relation");
        const isArrayRelation = prop.array === true && "string" == typeof prop.fieldType && builder.findByType("model", { name: prop.fieldType });

        return isExplicitRelation || isArrayRelation;
    });

    const tempSchema: Schema = {
        type: "schema",
        list: [{
            type: "model",
            name: model.name,
            properties: relatedFields
        }]
    };

    return printSchema(tempSchema);
};



/**
 * Converts an ENUM object to Prisma schema.
 */
export const enumsToSchema = (enumItems: Enum[]) => {
    const schema: Schema = {
        type: 'schema',
        list: enumItems
    };
    return printSchema(schema);
};


export const fieldsToSchema = (model: Model, fields: (Comment | Break | Property)[]) => {
    // Создаим временную моедль на основе переданной модели и добавим только эти поля и отрендерим 
    const tempSchema: Schema = {
        type: 'schema',
        list: [{
            type: "model",
            name: model.name,
            properties: fields
        }]
    };
    return printSchema(tempSchema);
}

