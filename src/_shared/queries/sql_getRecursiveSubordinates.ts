export function getRecursiveSubordinatesSqlString(id: number) {
  return `WITH RECURSIVE subordinates AS (
 SELECT
  id,
  username,
  boss

 FROM
    "user"
 WHERE
  id = ${id}
 UNION
  SELECT
   u.id,
   u.username,
   u.boss
   
  FROM
   "user" u
  INNER JOIN subordinates s ON s.id = u.boss
) SELECT
 *
FROM
 subordinates`
}
