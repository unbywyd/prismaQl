import fs from "fs";
import fsx from "fs-extra";
import path from "path";
import { getSchema, createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { validatePrismaSchema } from "./prisma-validation.js";
import readline from "readline";
import { MutationCommandTypes, QueryCommandTypes } from "./dsl.js";
import { loadPrismaSchema } from "./load-prisma-schema.js";
import globalRelationCollector from "./relation-collector.js";
import pkg from '@prisma/internals';
const { getDMMF } = pkg;
export class PrismaSchemaManager {
    prismaState = null;
    getSchemaPath() {
        return this.prismaState?.schemaPath;
    }
    setPrismaState(newState) {
        this.prismaState = newState;
    }
    getRelations() {
        return globalRelationCollector.getRelations();
    }
    getSourcePrismaSchema() {
        return this.prismaState?.schema;
    }
    /**
     * Command handler registry - maps command types to their respective handlers.
     */
    commandHandlers = {};
    /**
     * Registers a new command handler.
     * @param type - The command type to handle.
     * @param handler - The function that processes the command.
     */
    registerCommandHandler(type, handler) {
        if (this.commandHandlers[type]) {
            throw new Error(`Handler for command "${type}" is already registered.`);
        }
        this.commandHandlers[type] = handler;
    }
    /**
     * Executes a given command by finding and calling the appropriate handler.
     * @param command - The parsed command object.
     * @returns Promise resolving with the handler result.
     * @throws If no handler is registered for the command type.
     */
    async executeCommand(prismaData, command) {
        const handler = this.commandHandlers[command.type];
        if (!handler) {
            throw new Error(`No handler registered for command type: "${command.type}"`);
        }
        return handler(prismaData, command, this);
    }
    // Store pending modifications
    successfulModifications = [];
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
        return globalRelationCollector.setModels(models);
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
    clearCache() {
        if (this.prismaState && this.prismaState.schemaPath) {
            this.loadFromFile(this.prismaState.schemaPath, true);
        }
        else {
            throw new Error('No schema loaded to reload.');
        }
    }
    query(command) {
        if (!this.prismaState) {
            throw new Error("No schema loaded.");
        }
        if (!QueryCommandTypes.includes(command.type)) {
            throw new Error(`Invalid command type: ${command.type}`);
        }
        return this.executeCommand(this.prismaState, command);
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
    /**
     * Apply a modification to the schema builder and track it.
     * @param {Command} command - The command to modify the schema.
     */
    async applyModification(command) {
        if (!this.prismaState) {
            throw new Error("No schema loaded.");
        }
        if (!MutationCommandTypes.includes(command.type)) {
            throw new Error(`Invalid command type: ${command.type}`);
        }
        const currentSchema = this.prismaState.builder.print({ sort: true });
        const isValid = await validatePrismaSchema(currentSchema);
        if (isValid instanceof Error) {
            throw new Error('Cannot apply modification to invalid schema. Please fix the schema before applying modifications.');
        }
        // Clone the current state to apply the modification
        const clonePrismaState = this.clonePrismaState();
        const cloneBuilder = clonePrismaState.builder;
        try {
            await this.executeCommand(clonePrismaState, command);
        }
        catch (e) {
            throw new Error(`Modification failed: ${e.message}`);
        }
        // Validate the modified schema
        const updatedSchema = cloneBuilder.print({ sort: true });
        const validation = await validatePrismaSchema(updatedSchema);
        if (validation instanceof Error) {
            throw new Error(`Modification failed: ${validation.message}`);
        }
        // Apply the modification to the main schema because it's valid
        try {
            await this.executeCommand(this.prismaState, command);
        }
        catch (e) {
            throw new Error(`Modification failed: ${e.message}`);
        }
        const sourceSchema = this.prismaState.builder.print({ sort: true });
        const parsedSchema = getSchema(sourceSchema);
        // Need to rebuild relations and state based on the new builder
        this.setPrismaState({ schemaPath: this.prismaState.schemaPath, schema: sourceSchema, parsedSchema, builder: this.prismaState.builder });
        // Нужно будет оптимизировать этот момент учитывая только релейшен изменения
        await this.collectRelations();
        // Store modification for review
        this.successfulModifications.push(command);
        console.log(`✅ Modification applied: ${command.type} ${"model" in command ? command.model : ""}`);
    }
    /**
     * Ask the user if they want to apply the modifications before saving.
     */
    async confirmAndSave(sourcePath) {
        if (this.successfulModifications.length === 0) {
            console.log("✅ No pending modifications. Saving directly.");
            return this.save(sourcePath);
        }
        console.log("⚠️ Pending Modifications:");
        this.successfulModifications.forEach((cmd, index) => {
            console.log(`${index + 1}. ${cmd.type} ${"model" in cmd ? cmd.model : ""}`);
        });
        const userConfirmed = await this.askUser("Apply pending modifications before saving? (y/n): ");
        if (userConfirmed) {
            console.log("✅ Applying modifications...");
            this.successfulModifications = []; // Clear modifications after applying
        }
        else {
            console.log("❌ Modifications discarded. Schema remains unchanged.");
        }
        this.save(sourcePath);
    }
    async askUser(question) {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer.trim().toLowerCase() === "y");
            });
        });
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
        console.log(this.prismaState.builder.print({ sort: true }));
    }
    lastValidatedSchema = null;
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
export default PrismaSchemaManager;
//# sourceMappingURL=manager%20copy.js.map