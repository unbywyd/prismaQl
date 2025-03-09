import { PrismaQlHandler } from '../../handler-registries/handler-registry.cjs';
import '../../dsl.cjs';
import '../../field-relation-collector.cjs';
import '@prisma/generator-helper';
import '../../prisma-schema-loader.cjs';
import '@mrleebo/prisma-ast';

declare function normalizeQuotes(input: string): string;
declare const updateGenerator: PrismaQlHandler<"UPDATE", "GENERATOR", "mutation">;

export { normalizeQuotes, updateGenerator };
