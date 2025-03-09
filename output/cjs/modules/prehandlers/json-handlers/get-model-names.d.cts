import { PrismaQlHandler } from '../../handler-registries/handler-registry.cjs';
import '../../dsl.cjs';
import '../../field-relation-collector.cjs';
import '@prisma/generator-helper';
import '../../prisma-schema-loader.cjs';
import '@mrleebo/prisma-ast';

declare const sortModelNames: (modelNames: string[]) => void;
declare const getJsonModelNames: PrismaQlHandler<"GET", "MODELS_LIST", "query">;

export { getJsonModelNames, sortModelNames };
