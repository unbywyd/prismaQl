import fs from "fs";
import fsx from "fs-extra";
import path from "path";
import { getSchema, createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { validatePrismaSchema } from "./utils/prisma-validation.js";
import { loadPrismaSchema } from "./utils/load-prisma-schema.js";
import pkg from '@prisma/internals';
const { getDMMF } = pkg;
import type { DMMF } from "@prisma/generator-helper";
import { PrismaRelationCollector, Relation } from "./field-relation-collector.js";
import { PrismaHighlighter } from "prismalux";
import chalk from "chalk";
const HighlightPrismaSchema = new PrismaHighlighter();

export type PrismaSchemaData = {
    schemaPath?: string;
    schema: string;
    ast: ReturnType<typeof getSchema>;
    builder: ReturnType<typeof createPrismaSchemaBuilder>;
    relations: Relation[]
}

export type PrismaSchemaLoaderOptions = {
    backupPath?: string;
}

export class PrismaSchemaLoader {
    private lastValidatedSchema: string | null = null;
    private readonly prismaState: PrismaSchemaData | null = null;
    private backupPath: string | null = null;
    constructor(
        public relationCollector: PrismaRelationCollector,
        public options: PrismaSchemaLoaderOptions = {}
    ) {
        if (options.backupPath) {
            this.backupPath = options.backupPath;
        }
    }
    async rebase() {
        const schema = this.prismaState?.builder.print({ sort: true });
        const parsedSchema = getSchema(schema!);
        const builder = createPrismaSchemaBuilder(schema);
        this.setPrismaState({ schemaPath: this.prismaState?.schemaPath, schema: schema!, ast: parsedSchema, builder, relations: this.relationCollector.getRelations() });
        await this.collectRelations();
    }
    getSchemaPath() {
        return this.prismaState?.schemaPath;
    }
    private setPrismaState(newState: PrismaSchemaData) {
        (this.prismaState as PrismaSchemaData) = newState;
    }
    async loadFromFile(filePath?: string, forceReload = false) {
        if (this.prismaState && !forceReload) {
            return this.prismaState;
        }
        const { schema, path } = await loadPrismaSchema(filePath);
        return this.prepareSchema(schema, path);
    }
    async collectRelations() {
        const prismaSchema = this.prismaState?.schema || '';
        const dmmf = await getDMMF({ datamodel: prismaSchema });
        const models = dmmf.datamodel.models as DMMF.Model[];
        return this.relationCollector.setModels(models);
    }
    private async prepareSchema(sourcePrismaSchema: string, schemaPath?: string) {
        const isValid = await this.isValid(sourcePrismaSchema);
        if (isValid instanceof Error) {
            throw isValid;
        }
        const parsedSchema = getSchema(sourcePrismaSchema);
        const builder = createPrismaSchemaBuilder(sourcePrismaSchema);
        this.setPrismaState({ schemaPath: schemaPath || '', schema: sourcePrismaSchema, ast: parsedSchema, builder, relations: this.relationCollector.getRelations() });
        await this.collectRelations();
        return this.prismaState;
    }
    loadFromText(sourcePrismaSchema: string) {
        return this.prepareSchema(sourcePrismaSchema);
    }
    async getState(): Promise<PrismaSchemaData> {
        if (!this.prismaState) {
            await this.loadFromFile();
        }
        const relations = this.relationCollector.getRelations();
        return {
            ...this.prismaState! || {},
            relations
        }
    }
    clonePrismaState(): PrismaSchemaData {
        if (!this.prismaState) {
            throw new Error("No schema loaded.");
        }
        const { schema: sourcePrismaSchema, schemaPath } = this.prismaState;
        const cloneBuilder = createPrismaSchemaBuilder(sourcePrismaSchema);
        const parsedSchema = getSchema(sourcePrismaSchema);
        return { schemaPath, schema: sourcePrismaSchema, ast: parsedSchema, builder: cloneBuilder, relations: this.relationCollector.getRelations() };
    }
    async save(commits: Array<string> | string, sourcePath?: string) {
        if (!this.prismaState) {
            throw new Error('No schema loaded to save. Please load a schema first.');
        }

        const messages = Array.isArray(commits) ? commits : [commits];
        console.log(`🔄 Saving schema with ${messages.length} commit(s):`);

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const commitNumber = i + 1;
            console.log(chalk.grey(`Commit ${commitNumber}:`), chalk.cyanBright(message));
        }

        let outputPath = sourcePath;
        if (sourcePath && !path.isAbsolute(sourcePath)) {
            outputPath = path.join(process.cwd(), sourcePath);
        }

        if (!this.prismaState?.schemaPath && !outputPath) {
            throw new Error('Cannot save schema without a path, please provide a path!');
        }

        try {
            this.check();
        } catch (e) {
            throw new Error('Cannot save invalid schema. Please fix the schema before saving.');
        }

        const finalPath = outputPath || this.prismaState.schemaPath;

        if (!finalPath) {
            throw new Error('Cannot save schema without a path, please provide a path!');
        }
        // ✅ Generate timestamped backup
        if (fs.existsSync(finalPath)) {
            const backupDir = this.backupPath ? this.backupPath : path.join(path.dirname(finalPath), ".prisma", "backups");
            fsx.ensureDirSync(backupDir);
            const backupPath = path.join(backupDir, `${path.basename(finalPath)}_${new Date().toISOString().replace(/[:.]/g, "-")}.bak.prisma`);
            fsx.copyFileSync(finalPath, backupPath);
        }

        // ✅ Print the schema using builder (formatted output)
        const updatedsourcePrismaSchema = this.prismaState.builder.print({ sort: true });

        // ✅ Save schema
        fs.writeFileSync(finalPath, updatedsourcePrismaSchema, "utf-8");

        console.log(chalk.greenBright(`✅ Schema saved successfully to ${finalPath}`));
        console.log(chalk.grey(`📅 Timestamp: ${new Date().toLocaleString()}`));
    }
    print() {
        if (!this.prismaState) {
            return "No schema loaded.";
        }
        return HighlightPrismaSchema.highlight(this.prismaState.builder.print({ sort: true }));
    }
    async isValid(sourceSchema?: string): Promise<true | Error> {
        if (!sourceSchema && !this.prismaState) {
            throw new Error("No schema loaded.");
        }
        const sourcePrismaSchema = sourceSchema || this.prismaState?.builder.print({ sort: true });
        if (!sourcePrismaSchema) {
            return new Error("No schema content provided.");
        }
        if (this.lastValidatedSchema === sourcePrismaSchema) {
            return true;
        }
        const validation = await validatePrismaSchema(sourcePrismaSchema);
        if (validation === true) {
            this.lastValidatedSchema = sourcePrismaSchema;
        } else {
            this.lastValidatedSchema = null;
        }
        return validation;
    }
    check() {
        if (!this.prismaState) {
            throw new Error("No schema loaded.");
        }
        this.isValid();
    }
}

export default PrismaSchemaLoader;
