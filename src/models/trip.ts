export const queryInsertTrip = `
INSERT INTO trips
  (
    title,
    country_id,
    accomodation,
    transportation,
    eat,
    day,
    night,
    price,
    quota,
    max_quota,
    date_trip,
    description,
    trip_image_code
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $9,
    $10,
    $11,
    $12
  )
`;

export const queryGetTrips = `
SELECT
  *
FROM
  trips
LEFT JOIN
  countries
ON
  trips.country_id = countries.country_id
WHERE
  trips.title ILIKE $1
OR
  countries.country_name ILIKE $1
ORDER BY
  trip_id
OFFSET
  $2
LIMIT
  $3
`;

export const queryGetDetailTrip = `
SELECT
  *
FROM
  trips
LEFT JOIN
  countries
ON
  trips.country_id = countries.country_id
WHERE
  trip_id = $1
`;

export const queryUpdateQuotaTrip = `
UPDATE
  trips
SET
  quota = $2
WHERE
  trip_id = $1
`;

export const queryDeleteTrip = `
DELETE FROM
  trips
WHERE
  trip_id = $1
`;
