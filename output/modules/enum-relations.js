import { useHelper } from "./schema-helper.js";
export const getEnumRelations = (enumName, prismaState) => {
    const helper = useHelper(prismaState);
    const models = helper.getModels();
};
//# sourceMappingURL=enum-relations.js.map