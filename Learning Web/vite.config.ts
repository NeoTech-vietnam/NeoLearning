import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiPort = Number.parseInt(process.env.API_PORT ?? "4174", 10);
const resolvedApiPort = Number.isSafeInteger(apiPort) && apiPort > 0 ? apiPort : 4174;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: `http://127.0.0.1:${resolvedApiPort}`,
        changeOrigin: true
      }
    }
  }
});
