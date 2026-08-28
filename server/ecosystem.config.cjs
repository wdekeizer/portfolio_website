module.exports = {
  apps: [
    {
      name: "portfolio-api",
      cwd: __dirname,
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
