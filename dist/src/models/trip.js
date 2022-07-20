"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryGetDetailTrip = exports.queryGetTripsByKeyword = exports.queryGetTrips = exports.queryInsertTrip = void 0;
exports.queryInsertTrip = `
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
exports.queryGetTrips = `
SELECT
  *
FROM
  trips
`;
exports.queryGetTripsByKeyword = `
SELECT
  *
FROM
  trips
WHERE
  title
ILIKE
  $1
`;
exports.queryGetDetailTrip = `
SELECT
  *
FROM
  trips
WHERE
  trip_id = $1
`;
