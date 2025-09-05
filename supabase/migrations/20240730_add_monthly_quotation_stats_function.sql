CREATE OR REPLACE FUNCTION get_monthly_quotation_stats()
RETURNS TABLE(month TEXT, total BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_char(q.created_at, 'YYYY-MM') AS month,
    COUNT(q.id) AS total
  FROM quotations AS q
  GROUP BY to_char(q.created_at, 'YYYY-MM')
  ORDER BY month;
END;
$$ LANGUAGE plpgsql;