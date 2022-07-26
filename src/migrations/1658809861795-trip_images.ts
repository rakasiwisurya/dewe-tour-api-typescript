export const queryCreateTableTripImages = `
CREATE TABLE public.trip_images (
  trip_image_id SERIAL NOT NULL,
  trip_image_code VARCHAR(20) NOT NULL,
  trip_image_name VARCHAR(255) NOT NULL,
  CONSTRAINT trip_images_pkey PRIMARY KEY (trip_image_id)
)
`;
