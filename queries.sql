/*
  Get all categories
*/
SELECT * FROM categories;

/*
  Get not empty categories
*/
SELECT id, name FROM categories
  JOIN offer_categories
  ON id = category_id
  GROUP BY id;

/*
  Get categories with count's offers
*/
SELECT id, name, count(offer_id) FROM categories
  LEFT JOIN offer_categories
  ON id = category_id
  GROUP BY id;

/*
  Get offers (id, title, sum, type, text, created_at, image, author firstname, author lastname, author email, count of comments, name of categories). Sorted by date of created - new first.
*/
SELECT offers.*,
  pictures.image,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM offers
  LEFT JOIN pictures ON pictures.offer_id = offers.id
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON offer_categories.category_id = categories.id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
  GROUP BY offers.id, users.id, pictures.id 
  ORDER BY offers.created_at DESC;

/*
  Get detail information about offer with id = 1 (id,  title, sum, type, text, created_at, image, author firstname, author lastname, author email, count of comments, name of categories)
*/
SELECT offers.*,
  pictures.image,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM offers
  LEFT JOIN pictures ON pictures.offer_id = offers.id
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON offer_categories.category_id = categories.id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
WHERE offers.id = 1
  GROUP BY offers.id, users.id, pictures.id;

/*
  Get list of 5 fresh comments (id, offer_id, author first_name, author last_name, text of comment)
*/
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5

/*
  Get comments list for offer with id = 1 (comment_id, offer_id, author first_name, author last_name, text of comment). Sorted by date of created - new first. 
*/
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.offer_id = 1
  ORDER BY comments.created_at DESC

