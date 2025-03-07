import { PrismaQLDSLCommand, PrismaQlDSLQueryAction } from "../dsl.js";
import { PrismaQlHandler, PrismaQlHandlerRegistry } from "./handler-registry.js";

export class PrismaQlQueryHandlerRegistry extends PrismaQlHandlerRegistry<PrismaQlDSLQueryAction, PrismaQLDSLCommand, 'query'> {
    constructor(
        initialHandlers?: Record<string, PrismaQlHandler<PrismaQlDSLQueryAction, PrismaQLDSLCommand, 'query'>>,
    ) {
        super(initialHandlers);
    }
}