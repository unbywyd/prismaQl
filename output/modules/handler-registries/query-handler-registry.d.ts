import { DSLCommand, QueryAction } from "../dsl.js";
import { Handler, HandlerRegistry } from "./handler-registry.js";
export declare class QueryHandlerRegistry extends HandlerRegistry<QueryAction, DSLCommand> {
    constructor(initialHandlers?: Record<string, Handler<QueryAction, DSLCommand>>);
}
//# sourceMappingURL=query-handler-registry.d.ts.map