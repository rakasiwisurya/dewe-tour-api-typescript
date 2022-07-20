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
`;

export const queryGetTripsByKeyword = `
SELECT
  *
FROM
  trips
WHERE
  title
ILIKE
  $1
`;

export const queryGetDetailTrip = `
SELECT
  *
FROM
  trips
WHERE
  trip_id = $1
`;
