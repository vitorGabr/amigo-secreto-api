FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

# Generate Prisma Client
COPY prisma .
RUN bunx prisma generate

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
CMD ["bun", "run","start"]

EXPOSE 3000