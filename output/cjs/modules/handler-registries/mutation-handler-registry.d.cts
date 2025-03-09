import { PrismaQlDSLMutationAction, PrismaQLDSLCommand } from '../dsl.cjs';
import { PrismaQlHandlerRegistry, PrismaQlHandler } from './handler-registry.cjs';
import '../field-relation-collector.cjs';
import '@prisma/generator-helper';
import '../prisma-schema-loader.cjs';
import '@mrleebo/prisma-ast';

declare class PrismaQlMutationHandlerRegistry extends PrismaQlHandlerRegistry<PrismaQlDSLMutationAction, PrismaQLDSLCommand, 'mutation'> {
    constructor(initialHandlers?: Record<string, PrismaQlHandler<PrismaQlDSLMutationAction, PrismaQLDSLCommand, 'mutation'>>);
}

export { PrismaQlMutationHandlerRegistry };
