import { getSchema, createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { Command } from "./dsl.js";
/**
 * Interface for a generic command handler.
 * Each handler receives the parsed command object and returns a result.
 */
type CommandHandler<T extends Command> = (builder: ReturnType<typeof createPrismaSchemaBuilder>, command: T, manager: PrismaSchemaManager) => Promise<unknown>;
export declare const provideQueryRenderHandlers: (instance: PrismaSchemaManager) => void;
export declare class PrismaSchemaManager {
    private cachedSchema;
    /**
     * Command handler registry - maps command types to their respective handlers.
     */
    commandHandlers: {
        [K in Command["type"]]?: CommandHandler<Command & {
            type: K;
        }>;
    };
    /**
     * Registers a new command handler.
     * @param type - The command type to handle.
     * @param handler - The function that processes the command.
     */
    registerCommandHandler<T extends Command["type"]>(type: T, handler: CommandHandler<Extract<Command, {
        type: T;
    }>>): void;
    /**
     * Executes a given command by finding and calling the appropriate handler.
     * @param command - The parsed command object.
     * @returns Promise resolving with the handler result.
     * @throws If no handler is registered for the command type.
     */
    private executeCommand;
    private successfulModifications;
    loadFromFile(filePath?: string, forceReload?: boolean): Promise<{
        schemaPath: string;
        schemaContent: string;
        parsedSchema: ReturnType<typeof getSchema>;
        builder: ReturnType<typeof createPrismaSchemaBuilder>;
    }>;
    private prepareSchema;
    loadFromText(schemaContent: string): Promise<{
        schemaPath: string;
        schemaContent: string;
        parsedSchema: ReturnType<typeof getSchema>;
        builder: ReturnType<typeof createPrismaSchemaBuilder>;
    }>;
    getSchema(): Promise<{
        schemaPath: string;
        schemaContent: string;
        parsedSchema: ReturnType<typeof getSchema>;
        builder: ReturnType<typeof createPrismaSchemaBuilder>;
    } | null>;
    clearCache(): void;
    query(command: Command): Promise<unknown>;
    /**
     * Apply a modification to the schema builder and track it.
     * @param {Command} command - The command to modify the schema.
     */
    applyModification(command: Command): Promise<void>;
    /**
     * Ask the user if they want to apply the modifications before saving.
     */
    confirmAndSave(sourcePath?: string): Promise<void>;
    private askUser;
    save(sourcePath?: string): void;
    print(): void;
    private lastValidatedSchema;
    isValid(sourceSchema?: string): Promise<true | Error>;
    check(): void;
}
export default PrismaSchemaManager;
export declare const loadQueryManager: () => Promise<(sourceCommand: string) => Promise<unknown> | undefined>;
//# sourceMappingURL=ast.d.ts.map