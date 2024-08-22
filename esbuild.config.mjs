import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  outdir: 'dist',
  tsconfig: 'tsconfig.build.json',
  minify: true,
  legalComments: 'none',
});
