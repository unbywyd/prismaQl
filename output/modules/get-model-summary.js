export {};
/*
export type FieldSummary = {
    name: string;
    type: string;
    isId: boolean;
    isUnique: boolean;
    isRelation: boolean;
};

export function extractModelSummary(model: Model): FieldSummary[] {
    const fields = model?.properties?.filter(
        (prop): prop is Property => prop.type === "field" &&

            ((prop?.attributes?.some(attr => attr.name === "unique") === true) || (prop?.attributes?.some(attr => attr.name === "id") === true))

    ) || [];

    return fields.map((field: any) => {
        const isId = field?.attributes?.some((attr: any) => attr.name === "id") || false;
        const isUnique = field?.attributes?.some((attr: any) => attr.name === "unique") || false;
        let relation;
        let fieldType = field.fieldType;

        globalRelationCollector.getRelations().find((rel) => {
            if (rel.modelName === model.name) {
                if (rel.fieldName === field.name || rel.foreignKey === field.name) {
                    relation = rel;
                    fieldType = `${rel.relatedModel}.id`;
                }
            }
        });
        if (isId) {
            const defAttr = field?.attributes?.find((attr: any) => attr.name === "default")?.args[0]?.value;
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
}*/
//# sourceMappingURL=get-model-summary.js.map