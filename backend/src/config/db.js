import mongoose from 'mongoose';
import pg from 'pg';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongoUri = process.env.MONGODB_URI;
const isPgConfigured = !!(process.env.DATABASE_URL || (process.env.PGHOST && process.env.PGUSER));

let dbDriver = 'sqlite';
let pgPool = null;
let sqliteDb = null;

// Initialize SQLite fallback database (zero-config local)
function initSqlite() {
  const dbPath = path.resolve(__dirname, '../../jeevanvani.sqlite');
  sqliteDb = new Database(dbPath);
  sqliteDb.pragma('foreign_keys = ON');

  const schemaPath = path.resolve(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    let ddl = fs.readFileSync(schemaPath, 'utf8');
    ddl = ddl
      .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/DECIMAL\([0-9, ]+\)/gi, 'REAL')
      .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
      .replace(/BOOLEAN DEFAULT false/gi, 'INTEGER DEFAULT 0')
      .replace(/BOOLEAN/gi, 'INTEGER');

    sqliteDb.exec(ddl);

    // Safely add any new columns to existing tables if needed
    const safeAddColumn = (table, colDef) => {
      try {
        sqliteDb.exec(`ALTER TABLE ${table} ADD COLUMN ${colDef}`);
      } catch (err) {
        // Column already exists or table not ready, ignore
      }
    };

    safeAddColumn('beneficiary_profiles', 'preferred_sector TEXT');
    safeAddColumn('beneficiary_profiles', 'training_preference TEXT');
    safeAddColumn('beneficiary_profiles', 'constraints TEXT');
    safeAddColumn('beneficiary_profiles', 'career_goal TEXT');
    safeAddColumn('recommendations', 'confidence_score REAL DEFAULT 85.0');
  }
  console.log(`[Database] Connected to SQLite database at ${dbPath}`);
}

// 1. If MONGODB_URI is configured, connect with Mongoose
if (mongoUri) {
  try {
    await mongoose.connect(mongoUri);
    dbDriver = 'mongodb';
    console.log('[Database] 🍃 Successfully connected to MongoDB via Mongoose!');
  } catch (err) {
    console.warn('[Database] MongoDB connection failed. Falling back to local SQLite:', err.message);
    initSqlite();
  }
} else if (isPgConfigured) {
  // 2. Otherwise try PostgreSQL
  try {
    const config = process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1')
            ? false
            : { rejectUnauthorized: false },
        }
      : {
          host: process.env.PGHOST,
          port: Number(process.env.PGPORT || 5432),
          user: process.env.PGUSER,
          password: process.env.PGPASSWORD,
          database: process.env.PGDATABASE,
        };

    pgPool = new pg.Pool(config);
    const client = await pgPool.connect();
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const ddl = fs.readFileSync(schemaPath, 'utf8');
      await client.query(ddl);
    }
    client.release();
    dbDriver = 'postgres';
    console.log('[Database] 🐘 Successfully connected to PostgreSQL and verified schema.');
  } catch (err) {
    console.warn('[Database] PostgreSQL connection failed. Falling back to local SQLite:', err.message);
    pgPool = null;
    initSqlite();
  }
} else {
  console.log('[Database] MONGODB_URI not provided. Running in local zero-config SQLite mode.');
  initSqlite();
}

/**
 * Universal query function for SQL mode (PostgreSQL / SQLite).
 */
export async function query(text, params = []) {
  if (dbDriver === 'postgres' && pgPool) {
    return await pgPool.query(text, params);
  }

  if (sqliteDb) {
    let orderedParams = [];
    const hasDollarPlaceholders = /\$([0-9]+)/.test(text);
    const sqliteQuery = hasDollarPlaceholders
      ? text.replace(/\$([0-9]+)/g, (match, num) => {
          const idx = parseInt(num, 10) - 1;
          orderedParams.push(params[idx]);
          return '?';
        })
      : text;

    const queryParams = hasDollarPlaceholders ? orderedParams : params;
    const stmt = sqliteDb.prepare(sqliteQuery);

    if (stmt.reader) {
      const rows = stmt.all(...queryParams);
      return { rows, rowCount: rows.length };
    } else {
      const result = stmt.run(...queryParams);
      return {
        rows: result.lastInsertRowid ? [{ id: Number(result.lastInsertRowid) }] : [],
        rowCount: result.changes,
      };
    }
  }

  throw new Error('[Database] No active database driver initialized.');
}

export { mongoose, dbDriver };
export default { query, mongoose, getDriver: () => dbDriver };
