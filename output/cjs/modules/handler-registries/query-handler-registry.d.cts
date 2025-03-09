import { PrismaQlDSLQueryAction, PrismaQLDSLCommand } from '../dsl.cjs';
import { PrismaQlHandlerRegistry, PrismaQlHandler } from './handler-registry.cjs';
import '../field-relation-collector.cjs';
import '@prisma/generator-helper';
import '../prisma-schema-loader.cjs';
import '@mrleebo/prisma-ast';

declare class PrismaQlQueryHandlerRegistry extends PrismaQlHandlerRegistry<PrismaQlDSLQueryAction, PrismaQLDSLCommand, 'query'> {
    constructor(initialHandlers?: Record<string, PrismaQlHandler<PrismaQlDSLQueryAction, PrismaQLDSLCommand, 'query'>>);
}

export { PrismaQlQueryHandlerRegistry };
