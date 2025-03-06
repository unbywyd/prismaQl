import { createPrismaSchemaBuilder, getSchema } from "@mrleebo/prisma-ast";
import treeify from "treeify";
import chalk from 'chalk';
import boxen from 'boxen';
import { PrismaRelationCollector, Relation } from "./field-relation-collector.js";
import pkg from '@prisma/internals';
const { getDMMF } = pkg;
import type { DMMF } from "@prisma/generator-helper";
import fs from 'fs';
const collector = new PrismaRelationCollector();

export type RelationStatistics = {
    uniqueModels: number;
    totalRelations: number;
    maxDepth: number;
}
export class FieldRelationLogger {
    relations: Relation[];
    setRelations(relations: Relation[]) {
        this.relations = relations;
    }
    constructor(relations?: Relation[]) {
        if (relations) {
            this.setRelations(relations);
        }
    }

    buildModelTrees(
        rootModel: string,
        relations: Relation[],
        maxDepth: number,
        depth = 0,
        visitedModels = new Set<string>()
    ): { trees: Record<string, any>[], models: Set<string>, relations: Set<string> } {
        if (depth > maxDepth || visitedModels.has(rootModel)) return { trees: [], models: new Set(), relations: new Set() };
        visitedModels.add(rootModel);

        let trees: Record<string, any>[] = [];
        let models = new Set<string>();
        let relationsSet = new Set<string>();

        const modelRelations = relations.filter(rel => rel.modelName === rootModel);

        let table: Record<string, any> = {};
        for (const relation of modelRelations) {
            const relationType = relation.type;
            const name = relation.fieldName || relation.modelName;
            const relationAlias = `(as ${relation.fieldName || relation.relationName})`;
            // Determine if the relation is self-referencing
            const isSelfRelation = relation.modelName === relation.relatedModel;
            const selfRelationIcon = isSelfRelation ? chalk.yellow("🔁") : ""; // Add self-relation icon

            let keyInfo = chalk.gray("[-]");
            if (relation.foreignKey) {
                const direction = relation.relationDirection === "backward" ? "←" : "→";
                keyInfo = `[FK: ${chalk.blue(relation.foreignKey)} ${direction} ${chalk.green(relation.referenceKey || "id")}]`;
            } else if (relation.relationTable) {
                keyInfo = `[M:N via ${chalk.yellow(relation.relationTable)}]`;
            }
            if (relation.relationTable && relation.relationTable !== relation.modelName) {
                if (!table[relation.relationTable]) {
                    table[relation.relationTable] = {}; // Adding join table
                }

                // Add relation inside join table
                table[relation.relationTable][
                    `→ ${chalk.yellow(relation.modelName)}:${chalk.cyan(relation.fieldName)} [FK: ${chalk.blue(relation.foreignKey || "?")} → ${chalk.green(relation.referenceKey || "?")}]`
                ] = {};

                table[relation.relationTable][
                    `→ ${chalk.yellow(relation.relatedModel)}:${chalk.cyan(relation.inverseField)} [FK: ${chalk.blue(relation.foreignKey || "?")} → ${chalk.green(relation.referenceKey || "?")}]`
                ] = {};
            }

            const constraints = relation?.constraints?.length
                ? `Constraints: ${chalk.magenta(relation.constraints.join(", "))}`
                : "";

            const isList = (relationType === "1:M" || relationType === "M:N") && !relation?.foreignKey;

            let relationLabel = `→ ${chalk.yellow(relation.relatedModel + (isList ? '[]' : ''))}:${chalk.cyan(name)} ${relationAlias} ${chalk.red(relationType)} ${keyInfo} ${constraints} ${selfRelationIcon}`;

            if (!table[relationLabel]) {
                table[relationLabel] = {};
            }

            // Add to statistics
            models.add(rootModel);
            models.add(relation.relatedModel);
            relationsSet.add(`${rootModel} -> ${relation.relatedModel}`);
        }

        trees.push({ [chalk.bold(rootModel)]: table });

        for (const relation of modelRelations) {
            const subTree = this.buildModelTrees(relation.relatedModel, relations, maxDepth, depth + 1, visitedModels);
            trees = trees.concat(subTree.trees);
            subTree.models.forEach(m => models.add(m));
            subTree.relations.forEach(r => relationsSet.add(r));
        }

        return { trees, models, relations: relationsSet };
    }
    getRelationStatistics(modelName: string, maxDepth: number = 1): RelationStatistics {
        if (!this.relations?.length) {
            throw new Error('No relations found. Please run relation-collector first and use the setRelations method to set the relations.');
        }

        let relatedModels = new Set<string>(); // Unique models
        let relationCount = 0; // Number of relations

        // Recursive function to traverse relations
        const exploreRelations = (currentModel: string, depth: number) => {
            if (depth > maxDepth || relatedModels.has(currentModel)) return;

            relatedModels.add(currentModel);

            // Filter relations for the current model
            for (const rel of this.relations.filter(r => r.modelName === currentModel)) {
                relationCount++;
                exploreRelations(rel.relatedModel, depth + 1);
            }
        };

        // Start traversal from `modelName`
        exploreRelations(modelName, 1);

        return {
            uniqueModels: relatedModels.size, // Number of unique models
            totalRelations: relationCount, // Total number of relations
            maxDepth // Depth passed from outside
        };
    }

    collectRelationStatistics(models: Set<string>, relations: Set<string>, rootModel: string, maxDepth: number) {
        const directRelations = rootModel ? [...relations].filter(r => r.startsWith(rootModel)) : [...relations];
        return {
            uniqueModels: models.size,
            totalRelations: relations.size,
            directRelations: directRelations.length,
            maxDepth
        };
    }
    private async parseSchemaAndSetRelations(schema: string) {
        const dmmf = await getDMMF({ datamodel: schema });
        const models = dmmf.datamodel.models as DMMF.Model[];
        this.setRelations(await collector.setModels(models));
        return this.relations;
    }
    async provideRelationsFromBuilder(builder: ReturnType<typeof createPrismaSchemaBuilder>) {
        const schema = builder.print({ sort: true });
        return this.parseSchemaAndSetRelations(schema);
    }
    async provideRelationsFromSchema(schema: string) {
        return this.parseSchemaAndSetRelations(schema);
    }
    async privideRelationByPrismaPath(prismaPath: string) {
        const prismaSchemaContent = fs.readFileSync(prismaPath, 'utf-8');
        return this.parseSchemaAndSetRelations(prismaSchemaContent);
    }

    generateRelationTreeLog(
        rootModel: string,
        maxDepth: number = 1,
        relations?: Relation[]
    ) {
        if (relations?.length) {
            this.setRelations(relations);
        }
        if (!this.relations?.length) {
            throw new Error('No relations found. Please run relation-collector first and use the setRelations method to set the relations.');
        }

        const { models, relations: rels, trees } = this.buildModelTrees(rootModel, this.relations, maxDepth);

        // Collect statistics
        const stats = this.collectRelationStatistics(models, rels, rootModel, maxDepth);

        let output = `${chalk.green.bold('📊 Relation Tree Statistics')}\n`;
        output += `${chalk.yellow('Model:')} ${chalk.bold(rootModel)}\n`;
        output += `${chalk.cyan('Max Depth:')} ${chalk.bold(maxDepth)}\n`;
        output += `${chalk.blue('Related Models:')} ${chalk.bold(stats.uniqueModels)}\n`;
        output += `${chalk.magenta('Total Relations:')} ${chalk.bold(stats.totalRelations)}\n`;
        output += `${chalk.redBright('Direct Relations:')} ${chalk.bold(stats.directRelations)}\n`;
        // direct relations

        let treeOutput = '';
        for (const tree of trees) {
            treeOutput += treeify.asTree(tree, true, true) + '\n';
        }

        const results = [...rels.values()].filter(el => {
            return el.startsWith(rootModel) || el.endsWith(rootModel);
        }).map(r => chalk.gray(r)).join('\n');
        const relsList = `${chalk.white.bold('🔗 Direct Relations')}\n${results}`;

        // Output statistics + tree, without extra spaces
        return boxen(output.trim() + '\n'  + treeOutput.trim() + `\n\n${relsList}`, {
            padding: 1,
            borderColor: 'green',
            borderStyle: 'round'
        })
    }
}


export const getRelationStatistics = (relations: Relation[], modelName: string, maxDepth: number = 1): RelationStatistics => {

    let relatedModels = new Set<string>(); // Unique models
    let relationCount = 0; // Number of relations

    // Recursive function to traverse relations
    const exploreRelations = (currentModel: string, depth: number) => {
        if (depth > maxDepth || relatedModels.has(currentModel)) return;

        relatedModels.add(currentModel);

        // Filter relations for the current model
        for (const rel of relations.filter(r => r.modelName === currentModel)) {
            relationCount++;
            exploreRelations(rel.relatedModel, depth + 1);
        }
    };

    // Start traversal from `modelName`
    exploreRelations(modelName, 1);

    return {
        uniqueModels: relatedModels.size, // Number of unique models
        totalRelations: relationCount, // Total number of relations
        maxDepth // Depth passed from outside
    };
}
