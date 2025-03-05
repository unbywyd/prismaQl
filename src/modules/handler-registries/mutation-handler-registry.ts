import { DSLArgs, DSLCommand, DSLOptions, MutationAction } from "../dsl.js";
import { PrismaSchemaData } from "../prisma-schema-loader.js";
import { Handler, HandlerRegistry } from "./handler-registry.js";


export class MutationHandlerRegistry extends HandlerRegistry<MutationAction, DSLCommand> {
    constructor(
        initialHandlers?: Record<string, Handler<MutationAction, DSLCommand>>,
    ) {
        super(initialHandlers);
    }
}