export default {
  seed: {
    executor: 'ts-node',
    options: {
      compilerOptions: {
        module: 'CommonJS',
      },
    },
    script: 'prisma/seed.ts',
  },
};
