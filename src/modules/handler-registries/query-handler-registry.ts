import { DSLArgs, DSLCommand, DSLOptions, DSLQueryAction } from "../dsl.js";
import { Handler, HandlerRegistry } from "./handler-registry.js";

export class QueryHandlerRegistry extends HandlerRegistry<DSLQueryAction, DSLCommand, 'query'> {
    constructor(
        initialHandlers?: Record<string, Handler<DSLQueryAction, DSLCommand, 'query'>>,
    ) {
        super(initialHandlers);
    }
}