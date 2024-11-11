CREATE TABLE IF NOT EXISTS mcc_codes (
	mcc integer NOT NULL PRIMARY KEY,
	expense_type text,
	budget_bucket_code integer
);

ALTER TABLE mcc_codes
	OWNER TO "main-system";
	