import { PrismaQlHandler } from '../../handler-registries/handler-registry.cjs';
import '../../dsl.cjs';
import '../../field-relation-collector.cjs';
import '@prisma/generator-helper';
import '../../prisma-schema-loader.cjs';
import '@mrleebo/prisma-ast';

declare const getJsonEnumRelations: PrismaQlHandler<"GET", "ENUM_RELATIONS", "query">;

export { getJsonEnumRelations };
