"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCreateCountriesTable = void 0;
exports.queryCreateCountriesTable = `
CREATE TABLE public.countries (
  country_id SERIAL NOT NULL,
  country_name VARCHAR(30) NOT NULL,
  CONSTRAINT countries_pkey PRIMARY KEY (country_id)
)
`;
