import pgPromise from "pg-promise";
import { databaseUrl } from "../constants";

const pgp = pgPromise({
  /* Initialization Options */
});

const cn = {
  connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL : databaseUrl,
  max: 30,
  ssl: {
    rejectUnauthorized: false,
  },
};

export const db = pgp(cn);
