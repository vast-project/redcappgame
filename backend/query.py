queries = {
    # richiede session_id come input, produce in output i valori con count > 1 (o insieme vuoto se non ce ne sono)
    "A": """
WITH answer_count AS (
  SELECT
    session_id,
    response_value,
    COUNT(*) AS a_count
  FROM user_answers
  GROUP BY session_id, response_value),
top_value AS (
  SELECT
    session_id,
    MAX(a_count) AS a_max
  FROM answer_count
  GROUP BY session_id)
SELECT
  ac.session_id,
  ac.response_value,
  ac.a_count
FROM answer_count ac
INNER JOIN top_value tv ON ac.session_id = tv.session_id 
WHERE ac.session_id = :session_id AND a_count > 1 AND a_count = a_max
ORDER BY 3 DESC;
""",
    # richiede il gruppo dell'utente come input, produce in output il numero di utenti che hanno risposto
    "B": """
SELECT count(distinct ua.session_id)
FROM user_answers ua
INNER JOIN user_context uc ON ua.session_id = uc.session_id
INNER JOIN user_managed um ON uc.session_id = um.session_id
WHERE is_expired = false AND user_group_id = :user_group_id;
""",
    # richiede il gruppo dell'utente come input, produce in output i valori con prevalenza massima (possono essere più di uno)
    "C": """
WITH answer_count AS (
  SELECT
    user_group_id,
    t_trans.local AS response_value,
    COUNT(*) AS a_count
  FROM user_answers ua
  INNER JOIN user_context uc ON ua.session_id = uc.session_id
  INNER JOIN user_managed um ON uc.session_id = um.session_id
  INNER JOIN value_translations t_orig ON response_value=t_orig.local
  INNER JOIN value_translations t_trans ON t_trans.language = :language AND t_trans.universal=t_orig.universal
  WHERE is_expired = false
  GROUP BY user_group_id, t_trans.local),
top_value AS (
  SELECT 
    user_group_id,
    MAX(a_count) AS a_max
  FROM answer_count
  GROUP BY user_group_id)
SELECT ac.user_group_id, ac.response_value, ac.a_count
FROM answer_count ac INNER JOIN top_value tv ON ac.user_group_id = tv.user_group_id
WHERE a_count > 1 AND a_count = a_max AND ac.user_group_id = :user_group_id
ORDER BY 3 DESC;
""",
    "L": "SELECT * FROM user_context WHERE session_id = :session_id;",
    "T": """
(SELECT t.translation FROM value_translations o
  JOIN value_translations t ON o.en_name=t.en_name AND o.lang=:from
  WHERE t.lang=:to AND o.translation=:original)
UNION
(SELECT t.translation FROM value_translations t
  WHERE t.lang=:to AND t.translation=:original)
LIMIT 1;
""",
}


def get_query(query_name, data=None):
    print(data)
    print(queries[query_name])
    return queries[query_name]
    return queries[query_name].format(**data)
