import { DSLCommand, MutationAction } from "../dsl.js";
import { Handler, HandlerRegistry } from "./handler-registry.js";
export declare class MutationHandlerRegistry extends HandlerRegistry<MutationAction, DSLCommand> {
    constructor(initialHandlers?: Record<string, Handler<MutationAction, DSLCommand>>);
}
//# sourceMappingURL=mutation-handler-registry.d.ts.map