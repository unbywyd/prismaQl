export const handlerResponse = (dsl) => {
    return {
        error: (error) => {
            return { dsl, error };
        },
        result: (result) => {
            return {
                dsl, result
            };
        }
    };
};
export class HandlerRegistry {
    handlers = {};
    constructor(initialHandlers) {
        if (initialHandlers) {
            this.handlers = { ...initialHandlers };
        }
    }
    register(action, command, handler) {
        this.handlers[action + '_' + command] = handler;
    }
    execute(action, command, prismaState, dsl) {
        const handler = this.handlers[action + '_' + command];
        if (!handler) {
            throw new Error(`Handler for command "${command}" not found.`);
        }
        return handler(prismaState, dsl);
    }
}
//# sourceMappingURL=handler-registry.js.map