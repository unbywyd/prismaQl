import { printSchema } from "@mrleebo/prisma-ast";
export const modelsToSchema = (models) => {
    const schema = {
        type: 'schema',
        list: models
    };
    return printSchema(schema);
};
/**
 * Converts model relations to Prisma syntax.
 */
export const relationsToSchema = (model, builder) => {
    const relatedFields = model.properties.filter(prop => {
        if (prop.type !== "field")
            return false;
        const isExplicitRelation = prop.attributes?.some(attr => attr.name === "relation");
        const isArrayRelation = prop.array === true && "string" == typeof prop.fieldType && builder.findByType("model", { name: prop.fieldType });
        return isExplicitRelation || isArrayRelation;
    });
    const tempSchema = {
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
export const enumsToSchema = (enumItems) => {
    const schema = {
        type: 'schema',
        list: enumItems
    };
    return printSchema(schema);
};
export const fieldsToSchema = (model, fields) => {
    // Создаим временную моедль на основе переданной модели и добавим только эти поля и отрендерим 
    const tempSchema = {
        type: 'schema',
        list: [{
                type: "model",
                name: model.name,
                properties: fields
            }]
    };
    return printSchema(tempSchema);
};
//# sourceMappingURL=renders.js.map