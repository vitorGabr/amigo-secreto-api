import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: './src/db/schemas/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: `${process.env.DATABASE_URL}`,
  },
});