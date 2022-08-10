export function getRecursiveSubordinatesSqlString(id: string): string {
  return `WITH RECURSIVE subordinates AS (
 SELECT
  id,
  username,
  boss

 FROM
    "user"
 WHERE
  id::text = '${id}'
 UNION
  SELECT
   u.id,
   u.username,
   u.boss
   
  FROM
   "user" u
  INNER JOIN subordinates s ON s.id::text = u.boss
) SELECT

 s.id,

 s.username AS username2,

 s.boss,

 m.username as boss_name
 
FROM

 subordinates s

 JOIN "user" m

 on s.boss = m.id::text`
}
