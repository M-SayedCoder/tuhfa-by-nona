import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./src/server/app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { createServer as createViteServer } from "vite";
import express from "express";
import path from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const server = app.getHttpAdapter().getInstance();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  const PORT = 3001; // 👈 غيّرناه لتجنب أي conflict

  if (process.env.NODE_ENV !== "production") {
    console.log("🦁 Dev mode: Vite middleware starting...");

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          port: 24679, // 👈 غيرناه عن أي port شائع
        },
        strictPort: true,
      },
      appType: "spa",
    });

    server.use(vite.middlewares);
  } else {
    console.log("Production mode");
    const dist = path.join(process.cwd(), "dist");
    server.use(express.static(dist));
  }

  await app.listen(PORT, "0.0.0.0");

  console.log(`🚀 Server running: http://localhost:${PORT}`);
}

bootstrap().catch((err) => {
  console.error("❌ Bootstrap error:", err);
});