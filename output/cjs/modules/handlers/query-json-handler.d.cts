import { PrismaQlQueryHandlerRegistry } from '../handler-registries/query-handler-registry.cjs';
import '../dsl.cjs';
import '../field-relation-collector.cjs';
import '@prisma/generator-helper';
import '../handler-registries/handler-registry.cjs';
import '../prisma-schema-loader.cjs';
import '@mrleebo/prisma-ast';

declare const queryJSONHandler: PrismaQlQueryHandlerRegistry;

export { queryJSONHandler };
