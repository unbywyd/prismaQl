import { getSchema, createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import PrismaSchemaLoader from "../../prisma-schema-loader.js";
export type PrismaSchemaData = {
    schemaPath: string;
    schema: string;
    parsedSchema: ReturnType<typeof getSchema>;
    builder: ReturnType<typeof createPrismaSchemaBuilder>;
};
export declare const provideQueryRenderHandlers: (instance: PrismaSchemaLoader) => void;
//# sourceMappingURL=render-handlers.d.ts.map