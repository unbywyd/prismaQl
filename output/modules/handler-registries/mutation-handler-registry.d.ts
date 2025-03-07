import { PrismaQLDSLCommand, PrismaQlDSLMutationAction } from "../dsl.js";
import { PrismaQlHandler, PrismaQlHandlerRegistry } from "./handler-registry.js";
export declare class PrismaQlMutationHandlerRegistry extends PrismaQlHandlerRegistry<PrismaQlDSLMutationAction, PrismaQLDSLCommand, 'mutation'> {
    constructor(initialHandlers?: Record<string, PrismaQlHandler<PrismaQlDSLMutationAction, PrismaQLDSLCommand, 'mutation'>>);
}
//# sourceMappingURL=mutation-handler-registry.d.ts.map