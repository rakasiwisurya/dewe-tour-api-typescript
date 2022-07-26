export const queryCreateTableUsers = `
CREATE TABLE public.users (
  user_id SERIAL NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  gender_id INTEGER NOT NULL,
  address TEXT NOT NULL,
  role VARCHAR(10) NOT NULL,
  avatar VARCHAR(255) NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (user_id),
	CONSTRAINT users_email_un UNIQUE (email),
  CONSTRAINT users_genders_fkey FOREIGN KEY (gender_id) REFERENCES public.genders(gender_id)
)
`;
