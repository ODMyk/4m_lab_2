import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {find: "@app", replacement: "/src"},
      {find: "@components", replacement: "/src/components"},
      {find: "@utils", replacement: "/src/utils"},
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
                @use "@app/colors"; 
            `,
      },
    },
  },
});
