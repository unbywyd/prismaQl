import fs from "fs";
import fsx from "fs-extra";
import path from "path";
import { getSchema, createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { validatePrismaSchema } from "./prisma-validation.js";
import { loadPrismaSchema } from "./load-prisma-schema.js";
import pkg from '@prisma/internals';
const { getDMMF } = pkg;
import { PrismaHighlighter } from "prismalux";
const HighlightPrismaSchema = new PrismaHighlighter();
export class PrismaSchemaLoader {
    relationCollector;
    lastValidatedSchema = null;
    prismaState = null;
    constructor(relationCollector) {
        this.relationCollector = relationCollector;
    }
    getSchemaPath() {
        return this.prismaState?.schemaPath;
    }
    setPrismaState(newState) {
        this.prismaState = newState;
    }
    getRelations() {
        return this.relationCollector.getRelations();
    }
    getSourcePrismaSchema() {
        return this.prismaState?.schema;
    }
    async loadFromFile(filePath, forceReload = false) {
        if (this.prismaState && !forceReload) {
            return this.prismaState;
        }
        const { schema, path } = await loadPrismaSchema(filePath);
        return this.prepareSchema(schema, path);
    }
    async collectRelations() {
        const prismaSchema = this.prismaState?.schema || '';
        const dmmf = await getDMMF({ datamodel: prismaSchema });
        const models = dmmf.datamodel.models;
        return this.relationCollector.setModels(models);
    }
    async prepareSchema(sourcePrismaSchema, schemaPath) {
        const isValid = await this.isValid(sourcePrismaSchema);
        if (isValid instanceof Error) {
            throw isValid;
        }
        const parsedSchema = getSchema(sourcePrismaSchema);
        const builder = createPrismaSchemaBuilder(sourcePrismaSchema);
        this.setPrismaState({ schemaPath: schemaPath || '', schema: sourcePrismaSchema, parsedSchema, builder });
        await this.collectRelations();
        return this.prismaState;
    }
    loadFromText(sourcePrismaSchema) {
        return this.prepareSchema(sourcePrismaSchema);
    }
    async getSchema() {
        if (!this.prismaState) {
            await this.loadFromFile();
        }
        return this.prismaState;
    }
    clonePrismaState() {
        if (!this.prismaState) {
            throw new Error("No schema loaded.");
        }
        const { schema: sourcePrismaSchema, schemaPath } = this.prismaState;
        const cloneBuilder = createPrismaSchemaBuilder(sourcePrismaSchema);
        const parsedSchema = getSchema(sourcePrismaSchema);
        return { schemaPath, schema: sourcePrismaSchema, parsedSchema, builder: cloneBuilder };
    }
    save(sourcePath) {
        if (!this.prismaState) {
            throw new Error('No schema loaded to save. Please load a schema first.');
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
        }
        catch (e) {
            throw new Error('Cannot save invalid schema. Please fix the schema before saving.');
        }
        const finalPath = outputPath || this.prismaState.schemaPath;
        // ✅ Generate timestamped backup
        if (fs.existsSync(finalPath)) {
            const backupDir = path.join(path.dirname(finalPath), ".prisma", "backups");
            fsx.ensureDirSync(backupDir);
            const backupPath = path.join(backupDir, `${path.basename(finalPath)}_${new Date().toISOString().replace(/[:.]/g, "-")}.bak.prisma`);
            fsx.copyFileSync(finalPath, backupPath);
        }
        // ✅ Print the schema using builder (formatted output)
        const updatedsourcePrismaSchema = this.prismaState.builder.print({ sort: true });
        // ✅ Save schema
        fs.writeFileSync(finalPath, updatedsourcePrismaSchema, "utf-8");
        console.log(`✅ Schema saved successfully to ${finalPath}`);
    }
    print() {
        if (!this.prismaState) {
            throw new Error("No schema loaded.");
        }
        console.log(HighlightPrismaSchema.highlight(this.prismaState.builder.print({ sort: true })));
    }
    async isValid(sourceSchema) {
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
        }
        else {
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
//# sourceMappingURL=manager.js.map