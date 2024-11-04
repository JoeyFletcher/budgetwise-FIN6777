CREATE TABLE users (
                       user_id SERIAL PRIMARY KEY,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       first_name VARCHAR(50),
                       last_name VARCHAR(50),
                       password VARCHAR(255) NOT NULL,  -- Store hashed passwords
                       bank_account VARCHAR(20),
                       routing_number VARCHAR(9),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (username, email, first_name, last_name, password, bank_account, routing_number)
VALUES ('as404302', 'as404302@ucf.edu', 'Astrid', 'Bennett', 'abcde12345', 'ZMEM960', 063107513);
