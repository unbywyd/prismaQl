import { defineConfig } from "tsup";
import { replaceInFile } from 'replace-in-file'

export default defineConfig([
    {
        entry: ["src/**/*.ts"],
        format: ["cjs"],
        outDir: "output/cjs",
        sourcemap: false,
        splitting: false,
        dts: true,
        bundle: true,
        external: ["path", "fs", "fs-extra"],
        noExternal: ["change-case", "boxen", "chalk"],
        clean: true,
        target: "node20",
        outExtension: () => ({ js: ".cjs" }),
        onSuccess: async () => {
            await replaceInFile({
                files: "output/cjs/**/*.cjs",
                from: /\.js/g,
                to: ".cjs",
            });
        },
    },
]);
