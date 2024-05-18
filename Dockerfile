
FROM node:18 AS builder

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY . .

RUN  npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./package.json

EXPOSE 8000

CMD ["node", "./dist/app.js"]
