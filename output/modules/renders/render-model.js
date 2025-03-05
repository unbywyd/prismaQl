import relationLogger from "../relation-logger.js";
export const renderModel = (model) => {
    const { totalRelations, uniqueModels } = relationLogger.getRelationStatistics(model.name);
    const fields = model.properties.filter(prop => prop.type === "field");
    console.log(JSON.stringify(fields, null, 2));
};
//# sourceMappingURL=render-model.js.map