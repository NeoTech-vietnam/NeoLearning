import { existsSync } from "node:fs";
import { createHash, timingSafeEqual } from "node:crypto";
import { createServer, type Server } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";
import express, { type ErrorRequestHandler, type Express, type RequestHandler } from "express";
import type { ApiErrorResponse, HealthResponse } from "../src/shared/contracts.js";
import { refreshContentIndex } from "./content/index.js";
import { createContentRouter } from "./routes/content.js";
import { createFilesRouter } from "./routes/files.js";
import { createProgressRouter } from "./routes/progress.js";
import { createQuestRouter } from "./routes/quests.js";

export const DEFAULT_API_HOST = "127.0.0.1";
export const DEFAULT_API_PORT = 4174;

function readPort(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isSafeInteger(parsed) && parsed > 0 && parsed <= 65_535
    ? parsed
    : DEFAULT_API_PORT;
}

function apiError(status: number, code: ApiErrorResponse["error"]["code"], message: string): RequestHandler {
  return (_request, response) => {
    response.status(status).json({ error: { code, message } } satisfies ApiErrorResponse);
  };
}

interface PreviewAccess {
  tailnetLogin?: string;
  password?: string;
  allowedHost?: string;
}

export function createApp(access: PreviewAccess = {
  tailnetLogin: process.env.NEOLEARNING_ALLOWED_TAILSCALE_LOGIN,
  password: process.env.NEOLEARNING_PREVIEW_PASSWORD,
  allowedHost: process.env.NEOLEARNING_PREVIEW_HOST
}): Express {
  const app = express();

  if (access.tailnetLogin !== undefined && access.password !== undefined) {
    throw new Error("Choose one private preview authentication method.");
  }
  if (access.tailnetLogin !== undefined) {
    const login = access.tailnetLogin.trim();
    if (!login) throw new Error("NEOLEARNING_ALLOWED_TAILSCALE_LOGIN must not be empty.");
    app.use((request, response, next) => {
      if (request.get("Tailscale-User-Login") !== login) {
        response.status(403).send("Forbidden");
        return;
      }
      next();
    });
  }
  if (access.password !== undefined) {
    if (access.password.length < 16 || !access.allowedHost) {
      throw new Error("Private preview requires a strong password and an exact allowed host.");
    }
    const expected = createHash("sha256").update(`neo:${access.password}`).digest();
    app.use((request, response, next) => {
      if (request.get("Host") !== access.allowedHost) {
        response.status(403).send("Forbidden");
        return;
      }
      const match = /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(request.get("Authorization") ?? "");
      const provided = match ? Buffer.from(match[1], "base64").toString("utf8") : "";
      const actual = createHash("sha256").update(provided).digest();
      if (!timingSafeEqual(actual, expected)) {
        response.set("WWW-Authenticate", 'Basic realm="NeoLearning phone preview"');
        response.status(401).send("Authentication required");
        return;
      }
      next();
    });
  }

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" } satisfies HealthResponse);
  });
  app.use("/api/content", createContentRouter());
  app.use("/api/files", createFilesRouter(undefined, async () => {
    await refreshContentIndex();
  }));
  app.use("/api/quests", createQuestRouter());
  app.use("/api/progress", createProgressRouter());
  app.use(((cause, _request, response, _next) => {
    console.error("NeoLearning API request failed", cause);
    response.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "The API could not complete the request." }
    } satisfies ApiErrorResponse);
  }) satisfies ErrorRequestHandler);
  app.use("/api", apiError(404, "NOT_FOUND", "API route not found."));

  const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
  const clientBuildDirectory = path.resolve(serverDirectory, "../../dist");

  if (existsSync(clientBuildDirectory)) {
    app.use(express.static(clientBuildDirectory));
    app.get("*", (_request, response) => {
      response.sendFile(path.join(clientBuildDirectory, "index.html"));
    });
  }

  return app;
}

export function startServer(
  port = readPort(process.env.API_PORT),
  host = process.env.API_HOST ?? DEFAULT_API_HOST
): Server {
  const server = createServer(createApp());
  server.listen(port, host, () => {
    console.info(`NeoLearning API listening at http://${host}:${port}`);
  });
  return server;
}

const launchedFile = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
const currentFile = fileURLToPath(import.meta.url);

if (launchedFile === currentFile) {
  const server = startServer();
  const closeServer = () => server.close(() => process.exit(0));
  process.once("SIGINT", closeServer);
  process.once("SIGTERM", closeServer);
}
