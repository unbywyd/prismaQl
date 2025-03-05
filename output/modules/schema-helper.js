export class SchemaHelper {
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
    getFields(modelName) {
        const model = this.getModelByName(modelName);
        if (!model)
            return [];
        return model.properties.filter((prop) => prop.type === "field");
    }
    getEnums() {
        return this.parsedSchema.list
            .filter((item) => item.type === "enum");
    }
    getEnumByName(name) {
        return this.getEnums().find((enumItem) => enumItem.name === name);
    }
    getRelations() {
        return this.getModels()
            .flatMap((model) => model.properties)
            .filter((prop) => prop.type === "field" && prop.fieldType === "relation");
    }
    getModelRelations(modelName) {
        const model = this.getModelByName(modelName);
        if (!model)
            return [];
        return model.properties.filter((prop) => prop.type === "field" && prop.fieldType === "relation");
    }
}
export const useHelper = (schema) => {
    return new SchemaHelper("type" in schema ? schema : schema.parsedSchema);
};
//# sourceMappingURL=schema-helper.js.map