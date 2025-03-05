import { DSLArgs, DSLCommand, DSLOptions, QueryAction } from "../dsl.js";
import { Handler, HandlerRegistry } from "./handler-registry.js";

export class QueryHandlerRegistry extends HandlerRegistry<QueryAction, DSLCommand> {
    constructor(
        initialHandlers?: Record<string, Handler<QueryAction, DSLCommand>>,
    ) {
        super(initialHandlers);
    }
}