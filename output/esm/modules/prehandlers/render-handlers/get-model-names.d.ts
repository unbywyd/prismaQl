import { PrismaQlHandler } from "../../handler-registries/handler-registry.js";
/**
 * Splits an array into columns
 */
export declare const formatColumns: (items: string[], columns?: number) => string;
/**
 * Registers a handler for the `GET_MODEL_NAMES` command with columns
 */
export declare const sortModelNames: (modelNames: string[]) => void;
export declare const getModelNames: PrismaQlHandler<"GET", "MODELS_LIST", "query">;
//# sourceMappingURL=get-model-names.d.ts.map