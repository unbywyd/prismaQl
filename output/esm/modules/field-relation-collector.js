import pkg from '@prisma/internals';
const { getDMMF } = pkg;
import pluralize from 'pluralize';
import { pascalCase } from 'change-case';
export class PrismaQlRelationCollector {
    models;
    relations = [];
    getRelations() {
        return this.relations;
    }
    async setModels(models) {
        this.relations = [];
        this.models = models;
        await this.parsePrismaSchema();
        return this.relations;
    }
    constructor(models = []) {
        this.models = models;
    }
    getRelation(modelName, fieldName) {
        return this.relations.find(r => r.modelName === modelName && r.fieldName === fieldName) || null;
    }
    /**
 * Function to detect one-to-one relationships in Prisma DMMF models.
 * It now detects **both** sides of the relationship (forward & reverse).
 */
    detectOneToOneRelations(models) {
        const relations = [];
        // Step 1: Identify explicit M:N join tables to exclude
        const joinTables = models.filter(model => {
            const relationFields = model.fields.filter(f => f.kind === "object" && !f.isList);
            const scalarFields = model.fields.filter(f => f.kind === "scalar");
            // Must have exactly two foreign key relations
            if (relationFields.length !== 2)
                return false;
            // Must have a composite primary key
            return model.primaryKey?.fields?.every(f => scalarFields.some(sf => sf.name === f));
        }).map(m => m.name);
        for (const model of models) {
            // Step 2: Skip explicit Many-to-Many join tables
            if (joinTables.includes(model.name))
                continue;
            for (const field of model.fields) {
                if (field.kind !== "object" || field.isList) {
                    continue;
                }
                if (!field.relationFromFields || field.relationFromFields.length === 0) {
                    continue;
                }
                // Step 3: Identify the foreign key
                let isUniqueRelation = false;
                let foreignKeys = [];
                const relationFromFields = field.relationFromFields;
                if (relationFromFields.length === 1) {
                    const fkField = model.fields.find(f => f.name === relationFromFields[0]);
                    if (fkField?.isUnique || model.primaryKey?.fields.includes(fkField?.name)) {
                        isUniqueRelation = true;
                        foreignKeys.push(fkField?.name);
                    }
                }
                else {
                    const isCompositePrimaryKey = model.primaryKey?.fields.every(f => relationFromFields.includes(f));
                    const isCompositeUnique = model.uniqueIndexes?.some(idx => idx.fields.length === relationFromFields.length &&
                        idx.fields.every(f => relationFromFields.includes(f)));
                    if (isCompositePrimaryKey || isCompositeUnique) {
                        isUniqueRelation = true;
                        foreignKeys = [...relationFromFields];
                    }
                }
                if (!isUniqueRelation) {
                    continue;
                }
                // Step 4: Find the related model
                const relatedModel = models.find(m => m.name === field.type);
                if (!relatedModel) {
                    continue;
                }
                // Step 5: Find the inverse field
                const inverseField = relatedModel.fields.find(f => f.relationName === field.relationName && f.name !== field.name);
                // Step 6: Determine reference keys
                const referenceKeys = field.relationToFields || [];
                // Step 7: Avoid duplicate detection
                const existingRelation = relations.find(r => r.modelName === model.name &&
                    r.relatedModel === relatedModel.name &&
                    r.fieldName === field.name);
                if (existingRelation) {
                    continue; // Skip if already recorded
                }
                // Step 8: Push the forward relation (owning side)
                relations.push({
                    type: "1:1",
                    fieldName: field.name,
                    modelName: model.name,
                    relatedModel: relatedModel.name,
                    relationName: field.relationName,
                    foreignKey: foreignKeys.join(", "),
                    referenceKey: referenceKeys.join(", "),
                    inverseField: inverseField?.name,
                    relationDirection: "forward",
                    constraints: [...foreignKeys]
                });
                // Step 9: Push the backward relation (inverse side) if an inverse field exists
                if (inverseField) {
                    relations.push({
                        type: "1:1",
                        fieldName: inverseField.name,
                        modelName: relatedModel.name,
                        relatedModel: model.name,
                        relationName: field.relationName,
                        foreignKey: undefined,
                        referenceKey: undefined,
                        inverseField: field.name,
                        relationDirection: "backward",
                        constraints: [...referenceKeys]
                    });
                }
            }
        }
        return relations;
    }
    detectOneToManyRelations(models) {
        const relations = [];
        for (const model of models) {
            for (const field of model.fields) {
                if (field.kind !== "object" || !field.isList) {
                    continue;
                }
                // Find the related model by matching the field type
                const relatedModel = models.find(m => m.name === field.type);
                if (!relatedModel)
                    continue;
                // Look for the inverse field in the related model
                const inverseField = relatedModel.fields.find(f => f.relationName === field.relationName && !f.isList);
                if (!inverseField)
                    continue;
                // Ensure that the inverse field has a defined foreign key (relationFromFields)
                if (!inverseField.relationFromFields || inverseField.relationFromFields.length === 0) {
                    continue;
                }
                // Join fields for composite keys, if necessary
                const fk = inverseField.relationFromFields.join(", ");
                const rk = inverseField.relationToFields && inverseField.relationToFields.length > 0
                    ? inverseField.relationToFields.join(", ")
                    : undefined;
                // Avoid duplicates in self-relations by checking if we already recorded this
                const existingRelation = relations.find(r => r.modelName === model.name &&
                    r.relatedModel === relatedModel.name &&
                    r.fieldName === field.name &&
                    r.relationName === field.relationName);
                if (existingRelation) {
                    continue; // Skip if already recorded
                }
                // Forward relation: The "many" side (students)
                relations.push({
                    type: "1:M",
                    fieldName: inverseField.name, // The field that holds the FK
                    modelName: relatedModel.name,
                    relatedModel: model.name,
                    relationName: field.relationName, // Track relationName!
                    foreignKey: fk,
                    referenceKey: rk,
                    inverseField: field.name,
                    relationDirection: "forward",
                    constraints: [...inverseField.relationFromFields]
                });
                // Backward relation: The "one" side (teacher)
                relations.push({
                    type: "1:M",
                    fieldName: field.name,
                    modelName: model.name,
                    relatedModel: relatedModel.name,
                    relationName: field.relationName, // Track relationName!
                    foreignKey: undefined,
                    referenceKey: undefined,
                    inverseField: inverseField.name,
                    relationDirection: "backward",
                    constraints: [...inverseField.relationFromFields]
                });
            }
        }
        return relations;
    }
    getManyToManyTableName(modelA, modelB, relationName) {
        return getManyToManyTableName(modelA, modelB, relationName);
    }
    detectManyToManyRelations(models) {
        const relations = [];
        const seenRelations = new Set(); // Prevent duplicate relations
        for (const model of models) {
            for (const field of model.fields) {
                // Skip non-list and non-object fields
                if (field.kind !== "object" || !field.isList) {
                    continue;
                }
                // Find the related model
                const relatedModel = models.find(m => m.name === field.type);
                if (!relatedModel)
                    continue;
                // Find all inverse fields (not just the first match)
                const inverseFields = relatedModel.fields.filter(f => f.relationName === field.relationName && f.isList);
                if (inverseFields.length === 0)
                    continue;
                // Ensure this is truly an implicit M:N relation (no foreign keys)
                const hasExplicitForeignKey = models.some(m => m.fields.some(f => f.relationName === field.relationName && (f.relationFromFields || []).length > 0));
                if (hasExplicitForeignKey) {
                    continue; // Skip 1:M relations like `TeacherStudents`
                }
                for (const inverseField of inverseFields) {
                    // **Fix 1: Avoid adding same field as inverse**
                    if (field.name === inverseField.name) {
                        continue; // Skip redundant self-mapping
                    }
                    // **Fix 2: Ensure only unique relations are added**
                    const relationKey = [model.name, relatedModel.name, field.relationName]
                        .sort() // Ensures consistency (A-B == B-A)
                        .join("|");
                    if (seenRelations.has(relationKey)) {
                        continue; // Avoid duplicate bidirectional relations
                    }
                    seenRelations.add(relationKey);
                    const isExplicit = models.some(m => m.fields.some(f => f.relationName === field.relationName && (f.relationFromFields || []).length > 0));
                    const tableName = this.getManyToManyTableName(model.name, relatedModel.name, isExplicit ? field.relationName : undefined);
                    // Add relation for the current field
                    relations.push({
                        type: "M:N",
                        fieldName: field.name,
                        modelName: model.name,
                        relatedModel: relatedModel.name,
                        relationName: field.relationName,
                        foreignKey: undefined,
                        referenceKey: undefined,
                        inverseField: inverseField.name,
                        relationDirection: "bidirectional",
                        relationTable: tableName, // Prisma implicit table naming convention
                        constraints: []
                    });
                    if (inverseField.name) {
                        // Add relation for the inverse field
                        relations.push({
                            type: "M:N",
                            fieldName: inverseField.name,
                            modelName: relatedModel.name,
                            relatedModel: model.name,
                            relationName: field.relationName,
                            foreignKey: undefined,
                            referenceKey: undefined,
                            inverseField: field.name,
                            relationDirection: "bidirectional",
                            relationTable: tableName, // Prisma implicit table naming convention
                            constraints: []
                        });
                    }
                }
            }
        }
        return relations;
    }
    detectExplicitManyToManyRelations(models) {
        const relations = [];
        for (const model of models) {
            // Step 1: Identify potential join tables
            const relationFields = model.fields.filter(f => f.kind === "object" && !f.isList);
            const scalarFields = model.fields.filter(f => f.kind === "scalar");
            // A join table must have **exactly two foreign key relations**
            if (relationFields.length !== 2) {
                continue;
            }
            // Step 2: Ensure both relations are linked via foreign keys
            const [relation1, relation2] = relationFields;
            if (!relation1.relationFromFields?.length ||
                !relation2.relationFromFields?.length) {
                continue;
            }
            // Step 3: Find the related models
            const model1 = models.find(m => m.name === relation1.type);
            const model2 = models.find(m => m.name === relation2.type);
            if (!model1 || !model2) {
                continue;
            }
            // Step 4: Ensure that **both foreign keys** form a composite primary key
            const compositePK = model.primaryKey?.fields?.every(f => scalarFields.some(sf => sf.name === f));
            if (!compositePK) {
                continue; // If the table does not use a composite key, it's not an explicit M:N relation
            }
            // Step 5: Register the **Explicit Many-to-Many Relation**
            relations.push({
                type: "M:N",
                fieldName: pluralize(model1.name), // Example: "posts"
                modelName: model1.name,
                relatedModel: model2.name,
                relationName: relation1.relationName,
                foreignKey: relation1.relationFromFields.join(", "),
                referenceKey: relation1.relationToFields?.join(", "),
                inverseField: pluralize(model2.name.toLowerCase()), // Example: "categories"
                relationDirection: "bidirectional",
                relationTable: model.name, // The join table
                constraints: [...relation1.relationFromFields, ...relation2.relationFromFields]
            });
            relations.push({
                type: "M:N",
                fieldName: pluralize(model2.name),
                modelName: model2.name,
                relatedModel: model1.name,
                relationName: relation2.relationName,
                foreignKey: relation2.relationFromFields.join(", "),
                referenceKey: relation2.relationToFields?.join(", "),
                inverseField: pluralize(model1.name.toLowerCase()),
                relationDirection: "bidirectional",
                relationTable: model.name, // The join table
                constraints: [...relation1.relationFromFields, ...relation2.relationFromFields]
            });
            // Add the join table model itself to the relations if it has relations
            relations.push({
                type: "M:N",
                fieldName: undefined,
                modelName: model.name,
                relatedModel: `${model1.name}, ${model2.name}`,
                relationName: `${relation1.relationName}, ${relation2.relationName}`,
                foreignKey: `${relation1.relationFromFields.join(", ")}, ${relation2.relationFromFields.join(", ")}`,
                referenceKey: `${relation1.relationToFields?.join(", ")}, ${relation2.relationToFields?.join(", ")}`,
                inverseField: `${pluralize(model1.name)}, ${pluralize(model2.name)}`,
                relationDirection: "bidirectional",
                relationTable: model.name,
                constraints: [...relation1.relationFromFields, ...relation2.relationFromFields]
            });
        }
        return relations;
    }
    deduplicateRelations(relations) {
        const seen = new Set();
        const result = [];
        for (const r of relations) {
            const key = [
                r.type,
                r.modelName,
                r.relatedModel,
                r.fieldName,
                r.relationName,
                r.foreignKey || '',
                r.referenceKey || '',
                r.inverseField || '',
                r.relationTable || '',
                r.relationDirection || '',
                (r.constraints || []).join(',')
            ].join('|');
            if (!seen.has(key)) {
                seen.add(key);
                result.push(r);
            }
        }
        return result;
    }
    async collectRelations(models) {
        // 1) Detect explicit M:N relations
        const explicitM2MRelations = this.detectExplicitManyToManyRelations(models);
        // Collect join table names to exclude them from 1:1 and 1:M detection
        const explicitJoinTableNames = new Set(explicitM2MRelations
            .filter(r => r.modelName === r.relationTable)
            .map(r => r.modelName));
        // 2) Detect implicit M:N relations
        const implicitM2MRelations = this.detectManyToManyRelations(models);
        // 3) Filter models to exclude join tables for 1:1 and 1:M detection
        const modelsForOneX = models.filter(m => !explicitJoinTableNames.has(m.name));
        // 4) Detect 1:1 and 1:M relations on filtered models
        const oneToOneRelations = this.detectOneToOneRelations(modelsForOneX);
        const oneToManyRelations = this.detectOneToManyRelations(modelsForOneX);
        // 5) Combine all relations into one array
        let relations = [
            ...explicitM2MRelations,
            ...implicitM2MRelations,
            ...oneToOneRelations,
            ...oneToManyRelations
        ];
        relations = this.deduplicateRelations(relations);
        return relations;
    }
    async parsePrismaSchema(schema) {
        const dmmf = schema ? await getDMMF({ datamodel: schema }) : null;
        const models = dmmf ? dmmf.datamodel.models : this.models;
        const relations = this.collectRelations(models);
        this.relations = await relations;
    }
}
export const getManyToManyTableName = (modelA, modelB, relationName) => {
    // If the relation is explicit (relationName is set), use it
    if (relationName)
        return relationName;
    // In implicit M:N relations, Prisma automatically names tables as _ModelAToModelB (in alphabetical order)
    const [first, second] = [modelA, modelB].sort();
    return `_${pascalCase(first)}To${pascalCase(second)}`;
};
export const getManyToManyModelName = (modelA, modelB, relationName) => {
    // If the relation is explicit (relationName is set), use it
    if (relationName)
        return relationName;
    // In implicit M:N relations, Prisma automatically names tables as _ModelAToModelB (in alphabetical order)
    const [first, second] = [modelA, modelB].sort();
    return `${pascalCase(first)}To${pascalCase(second)}`;
};
//# sourceMappingURL=field-relation-collector.js.map