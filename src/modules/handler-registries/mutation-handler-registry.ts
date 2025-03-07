import { DSLCommand, DSLMutationAction } from "../dsl.js";
import { Handler, HandlerRegistry } from "./handler-registry.js";


export class MutationHandlerRegistry extends HandlerRegistry<DSLMutationAction, DSLCommand, 'mutation'> {
    constructor(
        initialHandlers?: Record<string, Handler<DSLMutationAction, DSLCommand, 'mutation'>>,
    ) {
        super(initialHandlers);
    }
}