import { PrismaQlHandler } from '../../handler-registries/handler-registry.cjs';
import '../../dsl.cjs';
import '../../field-relation-collector.cjs';
import '@prisma/generator-helper';
import '../../prisma-schema-loader.cjs';
import '@mrleebo/prisma-ast';

declare const getFields: PrismaQlHandler<"GET", "FIELDS", "query">;

export { getFields };
