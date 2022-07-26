"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCreateTableTransactions = void 0;
exports.queryCreateTableTransactions = `
CREATE TABLE public.transactions (
  transaction_id SERIAL NOT NULL,
  transaction_code VARCHAR(50) NOT NULL,
  user_id INTEGER NOT NULL,
  trip_id INTEGER NOT NULL,
  qty INTEGER NOT NULL,
  total INTEGER NOT NULL,
  transaction_status_code VARCHAR(30) NOT NULL DEFAULT 'WAITING_PAYMENT',
  transaction_status_name VARCHAR(30) NOT NULL DEFAULT 'Waiting Payment',
  proof_payment VARCHAR(255),
  proof_payment_date TIMESTAMPTZ,
  booking_date TIMESTAMPTZ DEFAULT now(),
  admin_action_date TIMESTAMPTZ,
  CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id),
  CONSTRAINT transactions_transaction_code_un UNIQUE (transaction_code),
  CONSTRAINT transactions_users_fkey FOREIGN KEY (user_id) REFERENCES public.users (user_id),
  CONSTRAINT transactions_trips_fkey FOREIGN KEY (trip_id) REFERENCES public.trips (trip_id)
)
`;
