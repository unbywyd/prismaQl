import pkg from '@prisma/internals';
const { getDMMF } = pkg;
import treeify from "treeify";
import pluralize from 'pluralize';
import chalk from 'chalk';
import boxen from 'boxen';
/**
 * Function to detect one-to-one relationships in Prisma DMMF models.
 * It now detects **both** sides of the relationship (forward & reverse).
 */
export function detectOneToOneRelations(models) {
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
export function detectOneToManyRelations(models) {
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
export function detectManyToManyRelations(models) {
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
                    relationTable: `_${field.relationName}`, // Prisma implicit table naming convention
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
                        relationTable: `_${field.relationName}`, // Prisma implicit table naming convention
                        constraints: []
                    });
                }
            }
        }
    }
    return relations;
}
export function detectExplicitManyToManyRelations(models) {
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
function deduplicateRelations(relations) {
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
async function parsePrismaSchema(schema) {
    const dmmf = await getDMMF({ datamodel: schema });
    const models = dmmf.datamodel.models;
    // Псевдокод: суть та же, адаптируйте под ваш проект
    // 1) Находим explicit M:N
    const explicitM2MRelations = detectExplicitManyToManyRelations(models);
    // Собираем имена join-таблиц, чтобы исключить их из 1:1 и 1:M
    const explicitJoinTableNames = new Set(explicitM2MRelations
        .filter(r => r.modelName === r.relationTable)
        .map(r => r.modelName));
    // 2) Находим implicit M:N
    const implicitM2MRelations = detectManyToManyRelations(models);
    // В implicit M:N обычно нет «таблицы-связки» — но, если надо, 
    // их тоже можно как-то помечать, чтобы исключить лишние поля.
    // 3) Фильтруем модели, чтобы убрать join-таблицы из рассмотрения для 1:1 и 1:M
    const modelsForOneX = models.filter(m => !explicitJoinTableNames.has(m.name));
    // 4) Вызываем 1:1 и 1:M только на отфильтрованных моделях
    const oneToOneRelations = detectOneToOneRelations(modelsForOneX);
    const oneToManyRelations = detectOneToManyRelations(modelsForOneX);
    // 5) Объединяем всё в один массив
    let relations = [
        ...explicitM2MRelations,
        ...implicitM2MRelations,
        ...oneToOneRelations,
        ...oneToManyRelations
    ];
    // 6) (Опционально) Фильтрация дубликатов: 
    // Если есть вероятность, что какие-то связи повторяются буквально, можно убрать через Set или какую-то "equals" проверку
    relations = deduplicateRelations(relations); // примерная функция, см. ниже
    return relations;
}
export function buildModelTrees(rootModel, relations, maxDepth, depth = 0, visitedModels = new Set()) {
    if (depth > maxDepth || visitedModels.has(rootModel))
        return { trees: [], models: new Set(), relations: new Set() };
    visitedModels.add(rootModel);
    let trees = [];
    let models = new Set();
    let relationsSet = new Set();
    const modelRelations = relations.filter(rel => rel.modelName === rootModel);
    let table = {};
    for (const relation of modelRelations) {
        const relationType = relation.type;
        const name = relation.fieldName || relation.modelName;
        const relationAlias = `(as ${relation.fieldName || relation.relationName})`;
        // Определяем, является ли связь самореференсной (self-referencing)
        const isSelfRelation = relation.modelName === relation.relatedModel;
        const selfRelationIcon = isSelfRelation ? chalk.yellow("🔁") : ""; // Добавляем иконку
        let keyInfo = chalk.gray("[-]");
        if (relation.foreignKey) {
            const direction = relation.relationDirection === "backward" ? "←" : "→";
            keyInfo = `[FK: ${chalk.blue(relation.foreignKey)} ${direction} ${chalk.green(relation.referenceKey || "id")}]`;
        }
        else if (relation.relationTable) {
            keyInfo = `[M:N via ${chalk.yellow(relation.relationTable)}]`;
        }
        if (relation.relationTable && relation.relationTable !== relation.modelName) {
            if (!table[relation.relationTable]) {
                table[relation.relationTable] = {}; // Добавляем join-таблицу
            }
            // Добавляем связь внутри join-таблицы
            table[relation.relationTable][`→ ${chalk.yellow(relation.modelName)}:${chalk.cyan(relation.fieldName)} [FK: ${chalk.blue(relation.foreignKey || "?")} → ${chalk.green(relation.referenceKey || "?")}]`] = {};
            table[relation.relationTable][`→ ${chalk.yellow(relation.relatedModel)}:${chalk.cyan(relation.inverseField)} [FK: ${chalk.blue(relation.foreignKey || "?")} → ${chalk.green(relation.referenceKey || "?")}]`] = {};
        }
        const constraints = relation?.constraints?.length
            ? `Constraints: ${chalk.magenta(relation.constraints.join(", "))}`
            : "";
        const isList = (relationType === "1:M" || relationType === "M:N") && !relation?.foreignKey;
        let relationLabel = `→ ${chalk.yellow(relation.relatedModel + (isList ? '[]' : ''))}:${chalk.cyan(name)} ${relationAlias} ${chalk.red(relationType)} ${keyInfo} ${constraints} ${selfRelationIcon}`;
        if (!table[relationLabel]) {
            table[relationLabel] = {};
        }
        // Добавляем в статистику
        models.add(rootModel);
        models.add(relation.relatedModel);
        relationsSet.add(`${rootModel} -> ${relation.relatedModel}`);
    }
    trees.push({ [chalk.bold(rootModel)]: table });
    for (const relation of modelRelations) {
        const subTree = buildModelTrees(relation.relatedModel, relations, maxDepth, depth + 1, visitedModels);
        trees = trees.concat(subTree.trees);
        subTree.models.forEach(m => models.add(m));
        subTree.relations.forEach(r => relationsSet.add(r));
    }
    return { trees, models, relations: relationsSet };
}
export function collectRelationStatistics(models, relations, maxDepth) {
    return {
        uniqueModels: models.size,
        totalRelations: relations.size,
        maxDepth
    };
}
export async function generateRelationTree(rootModel, builder, maxDepth = 3) {
    const schema = builder.print({ sort: true });
    const relations = await parsePrismaSchema(schema);
    const { models, relations: rels, trees } = buildModelTrees(rootModel, relations, maxDepth);
    // Собираем статистику
    const stats = collectRelationStatistics(models, rels, maxDepth);
    let output = `${chalk.green.bold('📊 Relation Tree Statistics')}\n`;
    output += `${chalk.yellow('Model:')} ${chalk.bold(rootModel)}\n`;
    output += `${chalk.cyan('Max Depth:')} ${chalk.bold(maxDepth)}\n`;
    output += `${chalk.blue('Unique Related Models:')} ${chalk.bold(stats.uniqueModels)}\n`;
    output += `${chalk.magenta('Total Relations Count:')} ${chalk.bold(stats.totalRelations)}\n\n`;
    let treeOutput = '';
    for (const tree of trees) {
        treeOutput += treeify.asTree(tree, true, true) + '\n';
    }
    // Выводим статистику + дерево, без лишних пробелов
    console.log(boxen(output.trim() + '\n' + treeOutput.trim(), {
        padding: 1,
        borderColor: 'green',
        borderStyle: 'round'
    }));
}
//# sourceMappingURL=relations.js.map