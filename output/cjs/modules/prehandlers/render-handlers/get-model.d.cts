import { PrismaQlHandler } from '../../handler-registries/handler-registry.cjs';
import '../../dsl.cjs';
import '../../field-relation-collector.cjs';
import '@prisma/generator-helper';
import '../../prisma-schema-loader.cjs';
import '@mrleebo/prisma-ast';

interface FieldSummary {
    name: string;
    type: string;
    isId: boolean;
    isUnique: boolean;
    isRelation: boolean;
}
declare const getModel: PrismaQlHandler<"GET", "MODEL", "query">;

export { type FieldSummary, getModel };
