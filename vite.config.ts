import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Use the port the environment assigns (e.g. the preview tool's autoPort), else Vite's defaults
const assignedPort = process.env.PORT ? Number(process.env.PORT) : undefined;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: assignedPort ?? 5173 },
  preview: { port: assignedPort ?? 4173 },
});
