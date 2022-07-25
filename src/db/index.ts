import pgPromise from "pg-promise";
import { databaseUrl } from "../constants";

const pgp = pgPromise({
  /* Initialization Options */
});

export const db = pgp(process.env.DATABASE_URL ? process.env.DATABASE_URL : databaseUrl);
