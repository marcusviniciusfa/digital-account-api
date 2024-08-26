import esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  platform: 'node',
  outdir: 'dist',
  tsconfig: 'tsconfig.build.json',
  minify: true,
  legalComments: 'none',
  external: ['node_modules/.prisma/client'],
  plugins: [
    copy({
      assets: {
        from: [
          'node_modules/.prisma/client/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node',
          'node_modules/.prisma/client/schema.prisma',
        ],
        to: '.',
      },
    }),
  ],
});
