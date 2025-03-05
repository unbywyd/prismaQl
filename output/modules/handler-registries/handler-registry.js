export class HandlerRegistry {
    handlers = {};
    constructor(initialHandlers) {
        if (initialHandlers) {
            this.handlers = { ...initialHandlers };
        }
    }
    register(command, handler) {
        this.handlers[command] = handler;
    }
    execute(command, prismaState, args, options) {
        const handler = this.handlers[command];
        if (!handler) {
            throw new Error(`Handler for command "${command}" not found.`);
        }
        return handler(prismaState, args, options);
    }
}
//# sourceMappingURL=handler-registry.js.map