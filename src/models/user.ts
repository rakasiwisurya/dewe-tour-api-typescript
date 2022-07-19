export const queryGetUser = `
SELECT
  fullname,
  email,
  phone,
  gender_id,
  address,
  avatar
FROM
  users
WHERE
  user_id = $1
`;

export const queryUpdateUser = `
UPDATE
  users
SET
  fullname = $2,
  phone = $3,
  address = $4,
  gender_id = $5
WHERE
  user_id = $1
`;
