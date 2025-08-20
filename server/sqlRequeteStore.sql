--Get a club categories --
--Returns rows of categories --
SELECT ca.name AS category_name
FROM clubs AS c
JOIN club_categories AS cc ON c.club_id = cc.club_id
JOIN categories AS ca ON cc.category_id = ca.category_id
WHERE c.club_id = ?
