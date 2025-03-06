import { DSLCommand, DSLQueryAction } from "../dsl.js";
import { Handler, HandlerRegistry } from "./handler-registry.js";
export declare class QueryHandlerRegistry extends HandlerRegistry<DSLQueryAction, DSLCommand, 'query'> {
    constructor(initialHandlers?: Record<string, Handler<DSLQueryAction, DSLCommand, 'query'>>);
}
//# sourceMappingURL=query-handler-registry.d.ts.map