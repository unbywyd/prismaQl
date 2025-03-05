///import { parseCommand } from "./dsl.js";
import PrismaSchemaLoader from "./prisma-schema-loader.js";
import { provideQueryRenderHandlers } from "./renders/query/render-handlers.js";
import relationLogger from "./relation-logger.js";
const loadQueryRenderManager = async () => {
    const manager = new PrismaSchemaLoader();
    provideQueryRenderHandlers(manager);
    await manager.loadFromFile();
    await relationLogger.setRelations(manager.getRelations()); // Directly set relations from manager
    return (sourceCommand) => {
        try {
            const command = parseCommand(sourceCommand);
            return manager.query(command);
        }
        catch (error) {
            console.error("Error parsing command:", error.message);
        }
    };
};
export default loadQueryRenderManager;
//# sourceMappingURL=query-renders.js.map