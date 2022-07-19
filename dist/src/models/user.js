"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryUpdateUser = exports.queryGetUser = void 0;
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
