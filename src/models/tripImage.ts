export const queryInsertTripImage = `
INSERT INTO trip_images
  (trip_image_code, trip_image_name)
VALUES
  ($1, $2)
`;

export const queryGetImageCodeByLastData = `
SELECT
  trip_image_code
FROM
  trip_images
ORDER BY
  trip_image_id
DESC
LIMIT 1
`;

export const queryGetImageByImageCode = `
SELECT
  *
FROM
  trip_images
WHERE
  trip_image_code = $1
`;
