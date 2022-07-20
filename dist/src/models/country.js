"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryGetCountries = exports.queryGetCountry = exports.queryInsertCountry = void 0;
exports.queryInsertCountry = `
INSERT INTO countries
  (country_name)
VALUES
  ($1)
RETURNING
  country_id,
  country_name
`;
exports.queryGetCountry = `
SELECT
  *
FROM
  countries
WHERE
  country_name = $1
`;
exports.queryGetCountries = `
SELECT
  *
FROM
  countries
ORDER BY
  country_name
`;
