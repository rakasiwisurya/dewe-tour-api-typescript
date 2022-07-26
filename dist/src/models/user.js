"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryDeleteUser = exports.queryUpdateAvatar = exports.queryUpdateUser = exports.queryGetUser = exports.queryCheckUser = exports.queryInsertUser = exports.queryCheckEmail = void 0;
exports.queryCheckEmail = `
SELECT
  *
FROM
  users
WHERE
  email = $1
`;
exports.queryInsertUser = `
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
exports.queryCheckUser = `
SELECT
  *
FROM 
  users
LEFT JOIN genders ON users.gender_id = genders.gender_id
WHERE
  email = $1
`;
exports.queryGetUser = `
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
exports.queryUpdateUser = `
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
exports.queryUpdateAvatar = `
UPDATE
  users
SET
  avatar = $2
WHERE
  user_id = $1
`;
exports.queryDeleteUser = `
DELETE FROM
  users
WHERE
  user_id = $1
`;
