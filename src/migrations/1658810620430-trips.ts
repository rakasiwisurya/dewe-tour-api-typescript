export const queryCreateTableTrips = `
CREATE TABLE public.trips (
  trip_id SERIAL NOT NULL,
  title VARCHAR(50) NOT NULL,
  country_id INTEGER NOT NULL,
  accomodation VARCHAR(30) NOT NULL,
  transportation VARCHAR(30) NOT NULL,
  eat VARCHAR(30) NOT NULL,
  day INTEGER NOT NULL,
  night INTEGER NOT NULL,
  price INTEGER NOT NULL,
  quota INTEGER NOT NULL,
  max_quota INTEGER NOT NULL,
  description TEXT NOT NULL,
  trip_image_code VARCHAR(20) NOT NULL,
  date_trip DATE NOT NULL,
  CONSTRAINT trips_pkey PRIMARY KEY (trip_id),
  CONSTRAINT trips_countries_fkey FOREIGN KEY (country_id) REFERENCES public.countries (country_id)
)
`;
