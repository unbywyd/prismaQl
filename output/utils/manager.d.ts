import { getSchema, createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { Command } from "./dsl.js";
import { PrismaRelationCollector } from "./relation-collector.js";
export type PrismaSchemaData = {
    schemaPath: string;
    schema: string;
    parsedSchema: ReturnType<typeof getSchema>;
    builder: ReturnType<typeof createPrismaSchemaBuilder>;
};
/**
 * Interface for a generic command handler.
 * Each handler receives the parsed command object and returns a result.
 */
type CommandHandler<T extends Command> = (prismaData: Readonly<PrismaSchemaData>, command: T, manager: PrismaSchemaManager) => Promise<unknown>;
export declare class PrismaSchemaManager {
    relationCollector: PrismaRelationCollector;
    private readonly prismaState;
    getSchemaPath(): string | undefined;
    setPrismaState(newState: PrismaSchemaData): void;
    getRelations(): import("./relation-collector.js").Relation[];
    getSourcePrismaSchema(): string | undefined;
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
    loadFromFile(filePath?: string, forceReload?: boolean): Promise<PrismaSchemaData | null>;
    collectRelations(): Promise<import("./relation-collector.js").Relation[]>;
    private prepareSchema;
    loadFromText(sourcePrismaSchema: string): Promise<PrismaSchemaData | null>;
    getSchema(): Promise<PrismaSchemaData | null>;
    clearCache(): void;
    query(command: Command): Promise<unknown>;
    clonePrismaState(): PrismaSchemaData;
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
//# sourceMappingURL=manager.d.ts.map