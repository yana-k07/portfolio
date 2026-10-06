import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build:preview` makes one self-contained HTML file (hash routing)
// that can be opened anywhere. The normal build is what goes to Vercel.
export default defineConfig(({ mode }) => {
  const preview = mode === "preview";
  return {
    base: preview ? "./" : "/",
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    plugins: [
      react(),
      tailwindcss(),
      ...(preview
        ? [
            viteSingleFile(),
            {
              name: "preview-fonts",
              transformIndexHtml: (html) =>
                html.replace(
                  "</head>",
                  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&display=swap" /></head>'
                ),
            },
          ]
        : []),
    ],
  };
});
