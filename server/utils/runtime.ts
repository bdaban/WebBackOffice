// server/utils/runtime.ts
export const getDbRuntime = () => {
  const c = useRuntimeConfig()
  return {
    type: (c.db?.type || process.env.DB_TYPE) as any,
    host: c.db?.host || process.env.DB_HOST,
    port: Number(c.db?.port || process.env.DB_PORT || 1433),
    username: c.db?.username || process.env.DB_USERNAME,
    password: c.db?.password || process.env.DB_PASSWORD,
    database: c.db?.database || process.env.DB_DATABASE,
  }
}
