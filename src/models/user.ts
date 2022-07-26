export const queryCheckEmail = `
SELECT
  *
FROM
  users
WHERE
  email = $1
`;

export const queryInsertUser = `
INSERT INTO users
  (fullname, email, password, phone, gender_id, address, role)
VALUES
  ($1, $2, $3, $4, $5, $6, $7)
RETURNING
  user_id,
  fullname,
  email,
  phone,
  gender_id,
  address,
  role
`;

export const queryCheckUser = `
SELECT
  *
FROM 
  users
LEFT JOIN genders ON users.gender_id = genders.gender_id
WHERE
  email = $1
`;

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

export const queryUpdateAvatar = `
UPDATE
  users
SET
  avatar = $2
WHERE
  user_id = $1
`;

export const queryDeleteUser = `
DELETE FROM
  users
WHERE
  user_id = $1
`;
