import { PrismaQLDSLCommand, PrismaQlDSLMutationAction } from "../dsl.js";
import { PrismaQlHandler, PrismaQlHandlerRegistry } from "./handler-registry.js";


export class PrismaQlMutationHandlerRegistry extends PrismaQlHandlerRegistry<PrismaQlDSLMutationAction, PrismaQLDSLCommand, 'mutation'> {
    constructor(
        initialHandlers?: Record<string, PrismaQlHandler<PrismaQlDSLMutationAction, PrismaQLDSLCommand, 'mutation'>>,
    ) {
        super(initialHandlers);
    }
}