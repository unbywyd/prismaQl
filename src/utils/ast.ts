import fs from "fs";
import fsx from "fs-extra";
import path from "path";
import { getSchema, createPrismaSchemaBuilder, Model, printSchema, Schema, Enum } from "@mrleebo/prisma-ast";
import { validatePrismaSchema } from "./prisma-validation.js";
import readline from "readline";
import { Command, MutationCommandType, MutationCommandTypes, parseCommand, QueryCommandType, QueryCommandTypes } from "./dsl.js";
import { enumsToSchema, fieldsToSchema, modelsToSchema, relationsToSchema } from "./renders.js";
import { loadPrismaSchema } from "./load-prisma-schema.js";
import { generateRelationTree } from "./relations.js";


/**
 * Interface for a generic command handler.
 * Each handler receives the parsed command object and returns a result.
 */
type CommandHandler<T extends Command> = (builder: ReturnType<typeof createPrismaSchemaBuilder>, command: T, manager: PrismaSchemaManager) => Promise<unknown>;

export const provideQueryRenderHandlers = (instance: PrismaSchemaManager) => {
    instance.registerCommandHandler("GET_MODEL_NAMES", async (builder) => {
        const schema = builder.print({ sort: true });
        const parsedSchema = getSchema(schema);
        const models = parsedSchema.list
            .filter(item => item.type === "model")
            .map(model => model.name);
        return models;
    });

    instance.registerCommandHandler("GET_RELATION_TREE", async (builder, command) => {
        const schema = builder.print({ sort: true });
        const parsedSchema = getSchema(schema);
        const models = parsedSchema.list?.filter(item => item.type === "model");
        if (!models) {
            throw new Error("No models found in schema.");
        }
        try {
            return await generateRelationTree(command.model, builder, command?.depth || 3);
        } catch (error) {
            console.error("Error generating relation tree:", error.message);
        }
    });


    instance.registerCommandHandler("GET_MODELS", async (builder) => {
        const schema = builder.print({ sort: true });
        const parsedSchema = getSchema(schema);
        const models = parsedSchema.list
            .filter(item => item.type === "model")
            .map(model => model);
        return modelsToSchema(models);
    });

    instance.registerCommandHandler("GET_MODEL", async (builder, command) => {
        const model = builder.findByType("model", { name: command.model });
        if (!model) {
            throw new Error(`Model "${command.model}" not found.`);
        }
        return modelsToSchema([model]);
    });

    instance.registerCommandHandler("GET_FIELD", async (builder, command) => {
        const model = builder.findByType("model", { name: command.model });
        if (!model) {
            throw new Error(`Model "${command.model}" not found.`);
        }

        const field = model.properties.find((prop): prop is any =>
            prop.type === "field" && prop.name === command.field
        );
        if (!field) {
            throw new Error(`Field "${command.field}" not found in model "${command.model}".`);
        }

        if (command.attribute) {
            const attr = field.attributes?.find((attr: any) => attr.name === command.attribute);
            if (!attr) {
                throw new Error(`Attribute "${command.attribute}" not found in field "${command.field}".`);
            }
            return attr;
        }

        return fieldsToSchema(model, [field]);
    });

    instance.registerCommandHandler("GET_RELATIONS", async (builder, command) => {
        const model = builder.findByType("model", { name: command.model });
        if (!model) {
            throw new Error(`Model "${command.model}" not found.`);
        }
        return relationsToSchema(model, builder);
    });

    instance.registerCommandHandler("GET_ENUM_NAMES", async (builder, command) => {
        const schema = builder.print({ sort: true });
        const parsedSchema = getSchema(schema);
        const enums = parsedSchema.list
            .filter(item => item.type === "enum")
            .map(enumItem => enumItem.name);
        return enums;
    });

    instance.registerCommandHandler("GET_ENUMS", async (builder) => {
        const schema = builder.print({ sort: true });
        const parsedSchema = getSchema(schema);
        const enums = parsedSchema.list
            .filter(item => item.type === "enum")
            .map(enumItem => enumItem);
        return enumsToSchema(enums);
    });

    instance.registerCommandHandler("GET_ENUM", async (builder, command) => {
        const enumItem = builder.findByType("enum", { name: command.enum });
        if (!enumItem) {
            throw new Error(`Enum "${command.enum}" not found.`);
        }
        return enumsToSchema([enumItem]);
    });

    instance.registerCommandHandler("VALIDATE_SCHEMA", async (builder, command, manager) => {
        const schema = builder.print({ sort: true });
        const result = await validatePrismaSchema(schema);
        if (result instanceof Error) {
            return `❌ Schema is invalid: ${result.message}`;
        } else {
            return "✅ Schema is valid."
        }
    });

    instance.registerCommandHandler("PRINT", async (builder) => {
        const formattedSchema = builder.print({ sort: true });
        return formattedSchema;
    });
}

export class PrismaSchemaManager {
    private cachedSchema: {
        schemaPath: string;
        schemaContent: string;
        parsedSchema: ReturnType<typeof getSchema>;
        builder: ReturnType<typeof createPrismaSchemaBuilder>;
    } | null = null;

    /**
     * Command handler registry - maps command types to their respective handlers.
     */
    commandHandlers: { [K in Command["type"]]?: CommandHandler<Command & { type: K }> } = {};

    /**
     * Registers a new command handler.
     * @param type - The command type to handle.
     * @param handler - The function that processes the command.
     */
    public registerCommandHandler<T extends Command["type"]>(
        type: T,
        handler: CommandHandler<Extract<Command, { type: T }>>
    ) {
        if (this.commandHandlers[type]) {
            throw new Error(`Handler for command "${type}" is already registered.`);
        }
        this.commandHandlers[type] = handler as CommandHandler<Command>;
    }

    /**
     * Executes a given command by finding and calling the appropriate handler.
     * @param command - The parsed command object.
     * @returns Promise resolving with the handler result.
     * @throws If no handler is registered for the command type.
     */
    private async executeCommand(builder: ReturnType<typeof createPrismaSchemaBuilder>, command: Command): Promise<unknown> {
        const handler = this.commandHandlers[command.type] as CommandHandler<Command>;

        if (!handler) {
            throw new Error(`No handler registered for command type: "${command.type}"`);
        }

        return handler(builder, command, this);
    }

    // Store pending modifications
    private successfulModifications: Command[] = [];

    async loadFromFile(filePath?: string, forceReload = false) {
        if (this.cachedSchema && !forceReload) {
            return this.cachedSchema;
        }
        const { schema, path } = await loadPrismaSchema(filePath);
        return this.prepareSchema(schema, path);
    }

    private async prepareSchema(schemaContent: string, schemaPath?: string) {
        const isValid = await this.isValid(schemaContent);
        if (isValid instanceof Error) {
            throw isValid;
        }
        const parsedSchema = getSchema(schemaContent);
        const builder = createPrismaSchemaBuilder(schemaContent);
        this.cachedSchema = { schemaPath: schemaPath || '', schemaContent, parsedSchema, builder };
        return this.cachedSchema;
    }

    loadFromText(schemaContent: string) {
        return this.prepareSchema(schemaContent);
    }

    async getSchema() {
        if (!this.cachedSchema) {
            await this.loadFromFile();
        }
        return this.cachedSchema;
    }

    clearCache() {
        if (this.cachedSchema && this.cachedSchema.schemaPath) {
            this.loadFromFile(this.cachedSchema.schemaPath, true);
        } else {
            throw new Error('No schema loaded to reload.');
        }
    }

    query(command: Command) {
        if (!this.cachedSchema) {
            throw new Error("No schema loaded.");
        }
        if (!QueryCommandTypes.includes(command.type as unknown as QueryCommandType)) {
            throw new Error(`Invalid command type: ${command.type}`);
        }
        return this.executeCommand(this.cachedSchema.builder, command);
    }

    /**
     * Apply a modification to the schema builder and track it.
     * @param {Command} command - The command to modify the schema.
     */
    async applyModification(command: Command) {
        if (!this.cachedSchema) {
            throw new Error("No schema loaded.");
        }
        if (!MutationCommandTypes.includes(command.type as unknown as MutationCommandType)) {
            throw new Error(`Invalid command type: ${command.type}`);
        }

        const currentSchema = this.cachedSchema.builder.print({ sort: true });
        const isValid = await validatePrismaSchema(currentSchema);
        if (isValid instanceof Error) {
            throw new Error('Cannot apply modification to invalid schema. Please fix the schema before applying modifications.');
        }

        const cloneBuilder = createPrismaSchemaBuilder(currentSchema);
        try {
            await this.executeCommand(cloneBuilder, command);
        } catch (e) {
            throw new Error(`Modification failed: ${e.message}`);
        }

        const updatedSchema = cloneBuilder.print({ sort: true });
        const validation = await validatePrismaSchema(updatedSchema);
        if (validation instanceof Error) {
            throw new Error(`Modification failed: ${validation.message}`);
        }

        try {
            await this.executeCommand(this.cachedSchema?.builder!, command);
        } catch (e) {
            throw new Error(`Modification failed: ${e.message}`);
        }

        // Store modification for review
        this.successfulModifications.push(command);
        console.log(`✅ Modification applied: ${command.type} ${"model" in command ? command.model : ""}`);
    }


    /**
     * Ask the user if they want to apply the modifications before saving.
     */
    async confirmAndSave(sourcePath?: string) {
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
        } else {
            console.log("❌ Modifications discarded. Schema remains unchanged.");
        }

        this.save(sourcePath);
    }

    private async askUser(question: string): Promise<boolean> {
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

    save(sourcePath?: string) {
        if (!this.cachedSchema) {
            throw new Error('No schema loaded to save. Please load a schema first.');
        }

        let outputPath = sourcePath;
        if (sourcePath && !path.isAbsolute(sourcePath)) {
            outputPath = path.join(process.cwd(), sourcePath);
        }

        if (!this.cachedSchema?.schemaPath && !outputPath) {
            throw new Error('Cannot save schema without a path, please provide a path!');
        }

        try {
            this.check();
        } catch (e) {
            throw new Error('Cannot save invalid schema. Please fix the schema before saving.');
        }

        const finalPath = outputPath || this.cachedSchema.schemaPath;

        // ✅ Generate timestamped backup
        if (fs.existsSync(finalPath)) {
            const backupDir = path.join(path.dirname(finalPath), ".prisma", "backups");
            fsx.ensureDirSync(backupDir);
            const backupPath = path.join(backupDir, `${path.basename(finalPath)}_${new Date().toISOString().replace(/[:.]/g, "-")}.bak.prisma`);
            fsx.copyFileSync(finalPath, backupPath);
        }

        // ✅ Print the schema using builder (formatted output)
        const updatedSchemaContent = this.cachedSchema.builder.print({ sort: true });

        // ✅ Save schema
        fs.writeFileSync(finalPath, updatedSchemaContent, "utf-8");

        console.log(`✅ Schema saved successfully to ${finalPath}`);
    }

    print() {
        if (!this.cachedSchema) {
            throw new Error("No schema loaded.");
        }
        console.log(this.cachedSchema.builder.print({ sort: true }));
    }

    private lastValidatedSchema: string | null = null;
    async isValid(sourceSchema?: string): Promise<true | Error> {
        if (!sourceSchema && !this.cachedSchema) {
            throw new Error("No schema loaded.");
        }
        const schemaContent = sourceSchema || this.cachedSchema?.builder.print({ sort: true });
        if (!schemaContent) {
            return new Error("No schema content provided.");
        }
        if (this.lastValidatedSchema === schemaContent) {
            return true;
        }
        const validation = await validatePrismaSchema(schemaContent);
        if (validation === true) {
            this.lastValidatedSchema = schemaContent;
        } else {
            this.lastValidatedSchema = null;
        }
        return validation;
    }

    check() {
        if (!this.cachedSchema) {
            throw new Error("No schema loaded.");
        }
        this.isValid();
    }
}

export default PrismaSchemaManager;

export const loadQueryManager = async () => {
    const manager = new PrismaSchemaManager();
    provideQueryRenderHandlers(manager);
    await manager.loadFromFile();
    return (sourceCommand: string) => {
        try {
            const command = parseCommand(sourceCommand);
            return manager.query(command);
        } catch (error) {
            console.error("Error parsing command:", error.message);
        }
    }
}
