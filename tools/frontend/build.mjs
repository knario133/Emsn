import * as esbuild from "esbuild";
import { rm, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolviendo rutas desde la raíz
const rootDir = join(fileURLToPath(import.meta.url), "../../..");

const jsEntry = join(rootDir, "frontend/src/js/app.js");
const cssEntry = join(rootDir, "frontend/src/css/app.css");

const jsOutFile = join(rootDir, "src/IntraMessenger.Web/Scripts/dist/app.js");
const cssOutFile = join(rootDir, "src/IntraMessenger.Web/Content/app/app.css");

async function build() {
  try {
    // 1. Limpiar los archivos/directorios de salida controlados
    await rm(join(rootDir, "src/IntraMessenger.Web/Scripts/dist"), {
      recursive: true,
      force: true,
    });
    await rm(join(rootDir, "src/IntraMessenger.Web/Content/app"), {
      recursive: true,
      force: true,
    });

    // 2. Crear directorios
    await mkdir(join(rootDir, "src/IntraMessenger.Web/Scripts/dist"), {
      recursive: true,
    });
    await mkdir(join(rootDir, "src/IntraMessenger.Web/Content/app"), {
      recursive: true,
    });

    // 3. Empaquetar JS
    await esbuild.build({
      entryPoints: [jsEntry],
      bundle: true,
      minify: true,
      outfile: jsOutFile,
      logLevel: "info",
    });

    // 4. Procesar CSS
    await esbuild.build({
      entryPoints: [cssEntry],
      bundle: true,
      minify: true,
      outfile: cssOutFile,
      logLevel: "info",
    });
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
