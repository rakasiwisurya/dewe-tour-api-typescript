"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCreateTableGenders = void 0;
exports.queryCreateTableGenders = `
CREATE TABLE public.genders (
  gender_id SERIAL NOT NULL,
  gender_name VARCHAR(10) NOT NULL,
  CONSTRAINT genders_pkey PRIMARY KEY (gender_id)
)
`;
