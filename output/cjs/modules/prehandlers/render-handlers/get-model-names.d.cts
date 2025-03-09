import { PrismaQlHandler } from '../../handler-registries/handler-registry.cjs';
import '../../dsl.cjs';
import '../../field-relation-collector.cjs';
import '@prisma/generator-helper';
import '../../prisma-schema-loader.cjs';
import '@mrleebo/prisma-ast';

/**
 * Splits an array into columns
 */
declare const formatColumns: (items: string[], columns?: number) => string;
/**
 * Registers a handler for the `GET_MODEL_NAMES` command with columns
 */
declare const sortModelNames: (modelNames: string[]) => void;
declare const getModelNames: PrismaQlHandler<"GET", "MODELS_LIST", "query">;

export { formatColumns, getModelNames, sortModelNames };
