FROM node:24-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY prisma7.config.ts ./

RUN npx prisma generate

COPY src ./src

EXPOSE 4000

CMD ["npm", "start"]