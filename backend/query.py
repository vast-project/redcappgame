queries = {
    # richiede session_id come input, produce in output i valori con count > 1 (o insieme vuoto se non ce ne sono)
    "A": """with answer_count AS (
SELECT session_id, response_value, count(*) as a_count
FROM user_answers
GROUP BY session_id, response_value),
top_value AS (
SELECT session_id, max(a_count) as a_max
FROM answer_count
GROUP BY session_id)
SELECT ac.session_id, ac.response_value, ac.a_count
FROM answer_count ac INNER JOIN top_value tv ON ac.session_id = tv.session_id 
WHERE ac.session_id = :session_id AND a_count > 1 AND a_count = a_max
ORDER BY 3 DESC;""",
    # richiede la lingua dell'utente come input, produce in output il numero di utenti che hanno risposto
    "B": """SELECT count(distinct ua.session_id)
FROM user_answers ua INNER JOIN user_context uc ON ua.session_id = uc.session_id
WHERE language = :language;""",
    # richiede la lingua dell'utente come input, produce in output i valori con prevalenza massima (possono essere più di uno)
    "C": """with answer_count AS (
SELECT language, response_value, count(*) as a_count
FROM user_answers ua INNER JOIN user_context uc ON ua.session_id = uc.session_id
GROUP BY language, response_value),
top_value AS (
SELECT language, max(a_count) as a_max
FROM answer_count
GROUP BY language)
SELECT ac.language, ac.response_value, ac.a_count
FROM answer_count ac INNER JOIN top_value tv ON ac.language = tv.language
WHERE ac.language = :language AND a_count > 1 AND a_count = a_max
ORDER BY 3 DESC;""",
    "L": "SELECT language FROM user_context WHERE session_id = :session_id;",
    "T": """(SELECT t.translation FROM value_translations o
JOIN value_translations t ON o.en_name=t.en_name AND o.lang=:from
WHERE t.lang=:to and o.translation=:original)
UNION
(SELECT t.translation FROM value_translations t
WHERE t.lang=:to and t.translation=:original)
LIMIT 1;""",
}


def get_query(query_name, data=None):
    print(data)
    print(queries[query_name])
    return queries[query_name]
    return queries[query_name].format(**data)
