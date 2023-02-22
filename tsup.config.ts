import { defineConfig } from 'tsup';

export default defineConfig((options) => {
    return {
        entry: options.minify
            ? {
                  'groovin.min': 'src/index.ts',
              }
            : {
                  groovin: 'src/index.ts',
              },
        clean: !options.minify,
        dts: true,
        sourcemap: true,
        format: ['cjs', 'esm'],
    };
});
