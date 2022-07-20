"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryInsertTrip = void 0;
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
