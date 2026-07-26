import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  //driver: 'd1-http',
  dbCredentials: {
    url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/7a638c969b0f7eba44ae37fc0343ecbf650a57d913135743afe9225936775531.sqlite',
},
});
