import { PrismaQlMutationHandlerRegistry } from '../handler-registries/mutation-handler-registry.cjs';
import '../dsl.cjs';
import '../field-relation-collector.cjs';
import '@prisma/generator-helper';
import '../handler-registries/handler-registry.cjs';
import '../prisma-schema-loader.cjs';
import '@mrleebo/prisma-ast';

declare const mutationsHandler: PrismaQlMutationHandlerRegistry;

export { mutationsHandler };
