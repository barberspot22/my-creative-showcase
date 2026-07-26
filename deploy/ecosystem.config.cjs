module.exports = {
  apps: [
    {
      name: "gbia",
      cwd: "/home/u465383396/apps/gbia",
      script: "server/index.mjs",
      interpreter: "/opt/alt/alt-nodejs22/root/usr/bin/node",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "3008",
        NITRO_HOST: "127.0.0.1",
        NITRO_PORT: "3008",
        VITE_SITE_URL: "https://gbia.com.br",
        SITE_URL: "https://gbia.com.br",
      },
    },
  ],
};
