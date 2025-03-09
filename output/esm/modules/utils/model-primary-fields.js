export function extractModelSummary(model, relations) {
    const fields = model?.properties?.filter((prop) => prop.type === "field" &&
        ((prop?.attributes?.some(attr => attr.name === "unique") === true) || (prop?.attributes?.some(attr => attr.name === "id") === true))) || [];
    return fields.map((field) => {
        const isId = field?.attributes?.some((attr) => attr.name === "id") || false;
        const isUnique = field?.attributes?.some((attr) => attr.name === "unique") || false;
        let relation;
        let fieldType = field.fieldType;
        relations.find((rel) => {
            if (rel.modelName === model.name) {
                if (rel.fieldName === field.name || rel.foreignKey === field.name) {
                    relation = rel;
                    fieldType = `${rel.relatedModel}.id`;
                }
            }
        });
        if (isId) {
            const defAttr = field?.attributes?.find((attr) => attr.name === "default")?.args[0]?.value;
            if (defAttr?.type === "function") {
                fieldType = defAttr.name;
            }
        }
        return {
            name: field.name,
            type: fieldType,
            isId,
            isUnique,
            isRelation: !!relation
        };
    });
}
//# sourceMappingURL=model-primary-fields.js.map