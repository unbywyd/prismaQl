import { getSchema, createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import PrismaSchemaManager from "../../manager.js";
export type PrismaSchemaData = {
    schemaPath: string;
    schema: string;
    parsedSchema: ReturnType<typeof getSchema>;
    builder: ReturnType<typeof createPrismaSchemaBuilder>;
};
export declare const provideQueryRenderHandlers: (instance: PrismaSchemaManager) => void;
//# sourceMappingURL=query-handlers.d.ts.map