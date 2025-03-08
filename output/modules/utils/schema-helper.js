/**
 * Парсит поле AST и возвращает объект, пригодный для передачи в fieldBuilder.
 * @param {Property} prop - Поле из AST Prisma
 * @returns {object | null} - Структурированные данные или null (если поле недопустимо)
 */
export function parseFieldForBuilder(prop) {
    if (prop.type !== "field")
        return null;
    const { name, fieldType, array, optional, attributes } = prop;
    if (typeof name !== "string" || typeof fieldType !== "string")
        return null;
    // Пропускаем relation-поля (чтобы они не ломали логику)
    if (attributes?.some(attr => attr.name === "relation"))
        return null;
    // Определяем финальный тип Prisma-поля
    let prismaFieldType = fieldType;
    if (optional)
        prismaFieldType += "?";
    if (array)
        prismaFieldType += "[]";
    // Обрабатываем атрибуты (например, @id, @default, @unique)
    const parsedAttributes = [];
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
export class PrismaQlSchemaHelper {
    parsedSchema;
    constructor(parsedSchema) {
        this.parsedSchema = parsedSchema;
    }
    getModels(names) {
        const models = this.parsedSchema.list
            .filter((item) => item.type === "model");
        if (names?.length) {
            return models.filter((model) => names.includes(model.name));
        }
        return models;
    }
    getModelByName(name) {
        return this.getModels().find((model) => model.name === name);
    }
    getFieldByName(modelName, fieldName) {
        const model = this.getModelByName(modelName);
        if (!model)
            return undefined;
        return model.properties.find((prop) => prop.type === "field" && prop.name === fieldName);
    }
    getFields(modelName) {
        const model = this.getModelByName(modelName);
        if (!model)
            return [];
        return model.properties.filter((prop) => prop.type === "field");
    }
    getIdFieldTypeModel(modelName) {
        const model = this.getModelByName(modelName);
        if (!model)
            return undefined;
        const idField = model.properties.find((prop) => prop.type === "field" && prop?.attributes?.some(attr => attr.name === "id"));
        return idField?.fieldType;
    }
    getEnums() {
        return this.parsedSchema.list
            .filter((item) => item.type === "enum");
    }
    getEnumByName(name) {
        return this.getEnums().find((enumItem) => enumItem.name === name);
    }
    getEnumRelations(enumName) {
        const models = this.getModels();
        return models.filter((model) => {
            return model.properties.some((prop) => {
                return prop.type === "field" && prop.fieldType === enumName;
            });
        }).map((model) => {
            const field = model.properties.find((prop) => {
                return prop.type === "field" && prop.fieldType === enumName;
            });
            return {
                model,
                field: field
            };
        });
    }
    getRelations() {
        return this.getModels()
            .flatMap((model) => model.properties)
            .filter((prop) => prop.type === "field" && prop.fieldType === "relation");
    }
    getGenerators() {
        return this.parsedSchema.list
            .filter((item) => item.type === "generator");
    }
    getModelRelations(modelName) {
        const model = this.getModelByName(modelName);
        if (!model)
            return [];
        return model.properties.filter((prop) => prop.type === "field" && prop.fieldType === "relation");
    }
}
export const useHelper = (schema) => {
    return new PrismaQlSchemaHelper("type" in schema ? schema : schema.ast);
};
//# sourceMappingURL=schema-helper.js.map