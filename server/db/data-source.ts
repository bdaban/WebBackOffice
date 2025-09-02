// server/db/data-source.ts
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import * as Entities from './entities'
import { getDbRuntime } from '../utils/runtime'

let _ds: DataSource | null = null

export const getDataSource = async () => {
  if (_ds && _ds.isInitialized) return _ds

  const db = getDbRuntime()
  _ds = new DataSource({
    type: db.type as any,  // 'mssql'
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
    database: db.database,
    entities: Object.values(Entities),
    synchronize: false,
    logging: false,
    extra: { options: { encrypt: false } } // MSSQL için
  })
  await _ds.initialize()
  return _ds
}
