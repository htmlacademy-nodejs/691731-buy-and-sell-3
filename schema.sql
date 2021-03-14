DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS pictures;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS offer_categories;

CREATE TABLE categories(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) NOT NULL
);

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  avatar varchar(50)
);

CREATE TABLE offers(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  sum integer NOT NULL,
  type varchar(5) NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  user_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
          ON DELETE SET NULL
          ON UPDATE SET NULL
);

CREATE TABLE pictures(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  image text NOT NULL,
  offer_id integer,
  FOREIGN KEY (offer_id) REFERENCES offers (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
);

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text text NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  user_id integer NOT NULL,
  offer_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
  FOREIGN KEY (offer_id) REFERENCES offers (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
);

CREATE TABLE offer_categories(
  offer_id integer NOT NULL,
  category_id integer NOT NULL,
  PRIMARY KEY (offer_id, category_id),
  FOREIGN KEY (offer_id) REFERENCES offers(id)
          ON DELETE CASCADE,
          ON UPDATE CASCADE
  FOREIGN KEY (category_id) REFERENCES categories(id)
          ON DELETE CASCADE
          oN UPDATE CASCADE
);

CREATE INDEX ON offers (title);
