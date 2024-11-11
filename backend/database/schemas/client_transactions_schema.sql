CREATE TABLE IF NOT EXISTS client_transactions (
	transaction_id integer NOT NULL PRIMARY KEY,
	transaction_date date,
	mcc_code integer,
	detail text,
	amount numeric(10, 2),
	merchant_name text,
	merchant_city text,
	merchant_state varchar(2),
	merchant_street text,
	merchant_zip varchar(10),
	db_cr varchar(10),
	account_id varchar(10)
);

ALTER TABLE client_transactions
	OWNER TO "main-system";

