-- https://dba.stackexchange.com/a/122624
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- Use below view as dummy for local testing

-- DROP VIEW public.user_managed;

-- CREATE VIEW public.user_managed 
-- AS (SELECT
--     session_id,
--     FALSE AS is_expired,
-- 	   now()::date AS m_date
--     FROM user_context);