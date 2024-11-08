CREATE TABLE IF NOT EXISTS budget_buckets (
	budget_bucket_code integer NOT NULL PRIMARY KEY, 
	expense_type text
);

ALTER TABLE budget_buckets
	OWNER TO "main-system";
