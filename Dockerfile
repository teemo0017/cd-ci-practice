# syntax=docker/dockerfile:1

# ── Etapa "deps": solo instala dependencias ────────────────────────────────
# Se cachea de forma independiente: si package.json/package-lock.json no
# cambian, Docker reutiliza esta capa entera y no vuelve a descargar nada.
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Etapa "build": compila la app de producción ─────────────────────────────
# Aquí sí entra todo el código fuente y node_modules completo, pero esta
# etapa NUNCA llega a la imagen final.
FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── Etapa "runtime": la imagen que realmente se publica y se ejecuta ───────
# Solo copiamos .output/, que Nitro empaqueta con su propio node_modules
# mínimo. No hay código fuente, no hay devDependencies, no hay node_modules
# completo: la imagen queda pequeña y con menos superficie de ataque.
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# La imagen node:alpine ya trae un usuario "node" sin privilegios de root.
# Ejecutar como root dentro del contenedor es una mala práctica de seguridad.
COPY --from=build --chown=node:node /app/.output ./.output
USER node

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
