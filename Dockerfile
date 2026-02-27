FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=7654
ENV HOST=0.0.0.0
COPY --from=build /app/.output ./.output
EXPOSE 7654
CMD ["node", ".output/server/index.mjs"]
