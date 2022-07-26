export const queryCreateCountriesTable = `
CREATE TABLE public.countries (
  country_id SERIAL NOT NULL,
  country_name VARCHAR(30) NOT NULL,
  CONSTRAINT countries_pkey PRIMARY KEY (country_id)
)
`;
