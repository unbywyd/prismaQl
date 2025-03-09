import { Model } from '@mrleebo/prisma-ast';
import { PrismaQLRelation } from '../field-relation-collector.cjs';
import { FieldSummary } from '../prehandlers/render-handlers/get-model.cjs';
import '@prisma/generator-helper';
import '../handler-registries/handler-registry.cjs';
import '../dsl.cjs';
import '../prisma-schema-loader.cjs';

declare function extractModelSummary(model: Model, relations: PrismaQLRelation[]): FieldSummary[];

export { extractModelSummary };
