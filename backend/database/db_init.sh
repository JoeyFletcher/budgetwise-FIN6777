#!/bin/bash

docker exec -it backend_db psql -U main-system -d budget_app_db -f ./schemas/budget_buckets_schema.sql
docker exec -it backend_db psql -U main-system -d budget_app_db -f ./schemas/client_transactions_schema.sql
docker exec -it backend_db psql -U main-system -d budget_app_db -f ./schemas/mcc_codes_schema.sql
docker exec -it backend_db psql -U main-system -d budget_app_db -f ./schemas/users_schema.sql


docker exec -it backend_db psql -U main-system -d budget_app_db -c "
COPY budget_buckets(budget_bucket_code, expense_type)
FROM '/seed/budget_buckets.csv'
DELIMITER ','
CSV HEADER;"

docker exec -it backend_db psql -U main-system -d budget_app_db -c "
COPY client_transactions(transaction_id, transaction_date,mcc_code,detail,amount,merchant_name,merchant_city,merchant_state,merchant_street,merchant_zip,db_cr,account_id)
FROM '/seed/client_transactions.csv'
DELIMITER ','
CSV HEADER;"

docker exec -it backend_db psql -U main-system -d budget_app_db -c "
COPY mcc_codes(mcc, expense_type,budget_bucket_code)
FROM '/seed/mcc_codes.csv'
DELIMITER ','
CSV HEADER;"
