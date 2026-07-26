import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Two build targets:
// - default (Lovable hosting / preview): Cloudflare worker bundle emitted to `dist/`
// - BUILD_TARGET=node (Hostinger/PM2, see scripts/deploy-hostinger.sh): node-server in `.output/`
const isNodeTarget = process.env.BUILD_TARGET === "node";

export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      // Redirect TanStack Start's bundled server entry to src/server.ts
      server: { entry: "server" },
    }),
    viteReact(),
    nitro(
      isNodeTarget
        ? { preset: "node-server" }
        : {
            preset: "cloudflare_module",
            output: { dir: "dist" },
            compatibilityDate: "2025-09-01",
          },
    ),
  ],
});
