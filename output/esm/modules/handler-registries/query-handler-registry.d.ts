import { PrismaQLDSLCommand, PrismaQlDSLQueryAction } from "../dsl.js";
import { PrismaQlHandler, PrismaQlHandlerRegistry } from "./handler-registry.js";
export declare class PrismaQlQueryHandlerRegistry extends PrismaQlHandlerRegistry<PrismaQlDSLQueryAction, PrismaQLDSLCommand, 'query'> {
    constructor(initialHandlers?: Record<string, PrismaQlHandler<PrismaQlDSLQueryAction, PrismaQLDSLCommand, 'query'>>);
}
//# sourceMappingURL=query-handler-registry.d.ts.map