CREATE TABLE IF NOT EXISTS mcc_codes (
	mcc integer NOT NULL PRIMARY KEY,
	expense_type text
	budget_bucket_code integer
);

ALTER TABLE mcc_codes
	OWNER TO "main-system";
	
ALTER TABLE mcc_codes
	ADD CONSTRAINT fk_budget_bucket_code
	FOREIGN KEY (budget_bucket_code)
	REFERENCES budget_buckets (budget_bucket_code);
