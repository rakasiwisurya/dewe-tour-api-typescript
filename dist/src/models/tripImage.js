"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryGetImageByImageCode = exports.queryGetImageCodeByLastData = exports.queryInsertTripImage = void 0;
exports.queryInsertTripImage = `
INSERT INTO trip_images
  (trip_image_code, trip_image_name)
VALUES
  ($1, $2)
`;
exports.queryGetImageCodeByLastData = `
SELECT
  trip_image_code
FROM
  trip_images
ORDER BY
  trip_image_id
DESC
LIMIT 1
`;
exports.queryGetImageByImageCode = `
SELECT
  *
FROM
  trip_images
WHERE
  trip_image_code = $1
`;
