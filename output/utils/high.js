import chalk from 'chalk';
/**
 * Функция подсветки синтаксиса Prisma-схемы с сохранением форматирования.
 * @param schema Prisma schema string
 * @returns Highlighted schema with colors
 */
export const highlightPrismaSchema = (schema) => {
    return schema
        // Подсветка ключевых слов
        .replace(/\b(model|enum|datasource|generator|map|default|unique|id|relation|updatedAt|ignore)\b/g, chalk.cyan.bold('$1'))
        // Подсветка типов данных
        .replace(/\b(String|Int|Boolean|DateTime|Json|Float|Decimal|BigInt)\b/g, chalk.blue('$1'))
        // Подсветка аннотаций @id, @default(), @relation()
        .replace(/(@\w+)(\([^)]*\))?/g, (match, p1, p2) => chalk.magenta(p1) + (p2 ? chalk.yellow(p2) : ''))
        // Подсветка комментариев `// comment`
        .replace(/\/\/(.*)$/gm, chalk.green('// $1'))
        // Подсветка многострочных комментариев `/* comment */`
        .replace(/\/\*([\s\S]*?)\*\//g, (match, p1) => chalk.green(`/*${p1}*/`))
        // Подсветка строк "..." и '...'
        .replace(/(["'])(.*?)\1/g, (match, p1, p2) => chalk.yellow(`${p1}${p2}${p1}`));
};
//# sourceMappingURL=high.js.map