import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.ts',
    external: ['moment'],
    output: [
        {
            file: 'dist/umd/index.js',
            format: 'umd',
            name: 'momutable',
            sourcemap: true,
            globals: { moment: 'moment' },
            exports: 'named',
        },
        {
            file: 'dist/umd/index.min.js',
            format: 'umd',
            name: 'momutable',
            sourcemap: true,
            globals: { moment: 'moment' },
            plugins: [terser()],
            exports: 'named',
        },
    ],
    plugins: [
        typescript({
            tsconfig: 'tsconfig.umd.json',
        }),
        nodeResolve(),
    ],
};
