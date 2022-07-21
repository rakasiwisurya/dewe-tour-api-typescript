"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryDeleteTransaction = exports.queryRejectTransaction = exports.queryApproveTransaction = exports.queryUpdateProofPayment = exports.queryIncomeTrip = exports.queryGetTransaction = exports.queryGetTransactions = exports.queryInsertTransaction = exports.queryGetTransactionCodeByLastData = void 0;
exports.queryGetTransactionCodeByLastData = `
SELECT
  transaction_code
FROM
  transactions
ORDER BY
  transaction_id
DESC
LIMIT 1
`;
exports.queryInsertTransaction = `
INSERT INTO transactions
  (
    transaction_code,
    user_id,
    trip_id,
    qty,
    total
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    $5
  )
`;
exports.queryGetTransactions = `
SELECT
  transactions.transaction_id,
  transactions.transaction_code,
  transactions.user_id,
  transactions.trip_id,
  transactions.transaction_status_code,
  transactions.transaction_status_name,
  transactions.proof_payment_date,
  transactions.proof_payment,
  transactions.booking_date,
  transactions.admin_action_date,
  users.fullname,
  trips.title
FROM
  transactions
LEFT JOIN
  users
ON
  transactions.user_id = users.user_id
LEFT JOIN
  trips
ON
  transactions.trip_id = trips.trip_id
`;
exports.queryGetTransaction = `
SELECT
  transactions.transaction_id,
  transactions.transaction_code,
  transactions.user_id,
  transactions.trip_id,
  transactions.qty,
  transactions.total,
  transactions.transaction_status_code,
  transactions.transaction_status_name,
  transactions.proof_payment,
  transactions.proof_payment_date,
  transactions.booking_date,
  transactions.admin_action_date,
  users.fullname,
  users.phone,
  genders.gender_name,
  trips.date_trip,
  trips.day,
  trips.night,
  trips.accomodation,
  trips.transportation,
  countries.country_name
FROM
  transactions
LEFT JOIN
  users
  LEFT JOIN
    genders
  ON
    users.gender_id = genders.gender_id
ON
  transactions.user_id = users.user_id
LEFT JOIN
  trips
  LEFT JOIN
    countries
  ON
    trips.country_id = countries.country_id
ON
  transactions.trip_id = trips.trip_id
WHERE
  transaction_id = $1
`;
exports.queryIncomeTrip = `
SELECT
  transactions.trip_id,
  SUM(transactions.total) :: integer AS total_income,
  trips.title,
  trips.quota,
  trips.max_quota,
  countries.country_name
FROM transactions
LEFT JOIN trips ON transactions.trip_id = trips.trip_id
LEFT JOIN countries ON trips.country_id = countries.country_id
GROUP BY
  transactions.trip_id,
  trips.title,
  trips.quota,
  trips.max_quota,
  countries.country_name
`;
exports.queryUpdateProofPayment = `
UPDATE
  transactions
SET
  transaction_status_code = $2,
  transaction_status_name = $3,
  proof_payment_date = $4,
  proof_payment = $5
WHERE
  transaction_id = $1
`;
exports.queryApproveTransaction = `
UPDATE
  transactions
SET
  transaction_status_code = $2,
  transaction_status_name = $3,
  admin_action_date = $4
WHERE
  transaction_id = $1
`;
exports.queryRejectTransaction = `
UPDATE
  transactions
SET
  transaction_status_code = $2,
  transaction_status_name = $3,
  admin_action_date = $4
WHERE
  transaction_id = $1
`;
exports.queryDeleteTransaction = `
DELETE FROM
  transactions
WHERE
  transaction_id = $1
`;
