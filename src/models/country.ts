export const queryInsertCountry = `
INSERT INTO countries
  (country_name)
VALUES
  ($1)
RETURNING
  country_id,
  country_name
`;

export const queryGetCountry = `
SELECT
  *
FROM
  countries
WHERE
  country_name = $1
`;

export const queryGetCountries = `
SELECT
  *
FROM
  countries
ORDER BY
  country_name
`;
