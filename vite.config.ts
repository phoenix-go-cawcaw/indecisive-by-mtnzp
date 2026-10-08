import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV ?? (command === "build" ? "production" : "development"),
    ),
  },
  plugins: [tanstackStart({ server: { entry: "server" } }), react(), tailwindcss()],
  resolve: { tsconfigPaths: true },
}));
