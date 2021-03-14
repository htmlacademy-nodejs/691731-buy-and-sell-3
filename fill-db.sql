/* 
  Fill table of users
*/
INSERT INTO users (email, password_hash, first_name, last_name, avatar) VALUES
('ivanov@example.local', '5f4dcc3b5aa765d61d8327deb882cf99', 'Ivan', 'Ivanov', 'avatar1.jpg'),
('petrov@example.local', '5f4dcc3b5aa765d61d8327deb882cf99', 'Piter', 'Parker', 'avatar2.jpg');

/*
  Fill table of categories
*/
INSERT INTO categories (name) VALUES
('Animals'),
('Games'),
('Other');

/*
  Fill table of offers
*/
ALTER TABLE offers DISABLE TRIGGER ALL;
INSERT INTO offers (title, description, sum, type, user_id) VALUES
('Куплю гараж', 'Куплю гараж, чтобы держать там крокодила', 10000, 'OFFER', 1),
('Продам гараж', 'Продам гараж, где можно держать крокодила', 10000, 'SALE', 2),
('Куплю крокодила', 'Куплю крокодила, чтобы держать в гараже', 1000, 'OFFER', 2),
('Продам крокодила', 'Продам крокодила, которого можно держать в гараже', 1000, 'SALE', 1),
('Продам крокодиловую сумку', 'Продам сумку из крокодиловой кожи, изготовление на заказ', 2000, 'SALE', 1);
ALTER TABLE offers ENABLE TRIGGER ALL;

/*
  Fill table of picture
*/
ALTER TABLE pictures DISABLE TRIGGER ALL;
INSERT INTO pictures (image, offer_id) VALUES
('image1.jpg', 1),
('image2.jpg', 2),
('image3.jpg', 3),
('image4.jpg', 4),
('image5.jpg', 5);
ALTER TABLE pictures ENABLE TRIGGER ALL;

/*
  Fill table of comments
*/
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments (text, user_id, offer_id) VALUES
('Купи мой гараж', 2, 1),
('Купи, кому говорю', 2, 1),
('Плохой гараж', 1, 2),
('Не куплю', 1, 2),
('Купи крокодила', 1, 3),
('Отличный крокодил', 1, 3),
('Не куплю крокодила', 2, 4),
('Дрянной крокодил', 2, 4),
('Пожалей крокодила', 2, 5),
('Держать негде', 1, 5);
ALTER TABLE comments ENABLE TRIGGER ALL;

/*
  Fill table of offer_categories
*/
ALTER TABLE offer_categories DISABLE TRIGGER ALL;
INSERT INTO offer_categories (offer_id, category_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 1),
(4, 1),
(5, 3);
ALTER TABLE offer_categories ENABLE TRIGGER ALL;
