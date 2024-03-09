

-- Insert data for own account
INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID, -- Considered as equivalent to ID for now
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    1,
    1,
    '11288456', -- Replace with an actual account number
    'Technova',
    'Dutch Bangla Bank',
    'BD12345678901234567890123456789011'
);

-- Insert data for Global Brand Pvt. Ltd.
INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID, -- Considered as equivalent to ID for now
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    2,
    2,
    '1234567890', -- Replace with an actual account number
    'Global Brand Pvt. Ltd.',
    'Bank of Bangladesh',
    'BD12345678901234567890123456789012'
);

-- Insert data for Distribution Hub Ltd
INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID, -- Considered as equivalent to ID for now
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    3,
    3,
    '2345678901', -- Replace with an actual account number
    'Distribution Hub Ltd',
    'Dhaka Bank',
    'BD23456789012345678901234567890123'
);

-- Insert data for RP Tech India
INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID, -- Considered as equivalent to ID for now
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    4,
    4,
    '3456789012', -- Replace with an actual account number
    'RP Tech India',
    'State Bank of India',
    'IN34567890123456789012345678901234'
);

-- Insert data for Retrotech Business Solutions PVT LTD
INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID, -- Considered as equivalent to ID for now
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    5,
    5,
    '4567890123', -- Replace with an actual account number
    'Retrotech Business Solutions PVT LTD',
    'HDFC Bank',
    'IN45678901234567890123456789012345'
);

-- Insert data for BenQ India Pvt. Ltd
INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID, -- Considered as equivalent to ID for now
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    6,
    6,
    '5678901234', -- Replace with an actual account number
    'BenQ India Pvt. Ltd',
    'ICICI Bank',
    'IN56789012345678901234567890123456'
);

-- Insert data for Beijing Guangtian Runze Technology Co. Ltd.
INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID, -- Considered as equivalent to ID for now
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    7,
    7,
    '6789012345', -- Replace with an actual account number
    'Beijing Guangtian Runze Technology Co. Ltd.',
    'Bank of China',
    'CN67890123456789012345678901234567'
);

-- Insert data for Shenzhen Jingang Zhuoyue Technology Limited
INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID, -- Considered as equivalent to ID for now
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    8,
    8,
    '7890123456', -- Replace with an actual account number
    'Shenzhen Jingang Zhuoyue Technology Limited',
    'Industrial and Commercial Bank of China',
    'CN78901234567890123456789012345678'
);


INSERT INTO PAYMENT_INFO (
    ID,
		OWNER_ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)

VALUES (
    9,
		9,
    '112343456', -- Replace with an actual account number
    'Sundarban Courier Service',
    'Dutch Bangla Bank',
    'BD123456789012311'
);

INSERT INTO PAYMENT_INFO (
    ID,
		OWNER_ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)

VALUES (
    10,
		10,
    '11234345677', -- Replace with an actual account number
    ' SA Paribahan',
    'Dutch Bangla Bank',
    'BD12345672289012311'
);

INSERT INTO PAYMENT_INFO (
    ID,
		OWNER_ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)

VALUES (
    11,
		11,
    '11234345677', -- Replace with an actual account number
    'USB Express',
    'SONALI BANK',
    'BD123456722839012311'
);

-- Insert data into PAYMENT_INFO table with different account holder names and same owner ID
INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    12,
    12, -- Same as ID
    '22334455', -- Replace with a different account number
    'Technova Banani',
    'Dutch Bangla Bank',
    'BD23456789012345678901234567890123'
);

INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    13,
    13, -- Same as ID
    '33445566', -- Replace with a different account number
    'Technova Uttara',
    'Dutch Bangla Bank',
    'BD34567890123456789012345678901234'
);

INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    14,
    14, -- Same as ID
    '44556677', -- Replace with a different account number
    'Technova Chittagong',
    'Dutch Bangla Bank',
    'BD45678901234567890123456789012345'
);

INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    15,
    15, -- Same as ID
    '55667788', -- Replace with a different account number
    'Technova Khulna',
    'Dutch Bangla Bank',
    'BD56789012345678901234567890123456'
);

INSERT INTO PAYMENT_INFO (
    ID,
    OWNER_ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    16,
    16, -- Same as ID
    '66778899', -- Replace with a different account number
    'Technova Dhaka',
    'Dutch Bangla Bank',
    'BD67890123456789012345678901234567'
);
--old version

-- INSERT INTO PAYMENT_INFO (
--     ID,
--     ACCOUNT_NUMBER,
--     ACCOUNT_HOLDER,
--     BANK_NAME,
--     IBAN
-- )
-- VALUES (
--     1,
--     '11288456', -- Replace with an actual account number
--     'Technova',
--     'Dutch Bangla Bank',
--     'BD12345678901234567890123456789011'
-- );
-- 
-- 
-- 
-- -- Insert data into PAYMENT_INFO table using the sequence for ID
-- INSERT INTO PAYMENT_INFO (
--     ID,
--     ACCOUNT_NUMBER,
--     ACCOUNT_HOLDER,
--     BANK_NAME,
--     IBAN
-- )
-- VALUES (
--     2,
--     '1234567890', -- Replace with an actual account number
--     'Global Brand Pvt. Ltd.',
--     'Bank of Bangladesh',
--     'BD12345678901234567890123456789012'
-- );
-- 
-- INSERT INTO PAYMENT_INFO (
--     ID,
--     ACCOUNT_NUMBER,
--     ACCOUNT_HOLDER,
--     BANK_NAME,
--     IBAN
-- )
-- VALUES (
--     3,
--     '2345678901', -- Replace with an actual account number
--     'Distribution Hub Ltd',
--     'Dhaka Bank',
--     'BD23456789012345678901234567890123'
-- );
-- 
-- -- Assuming your sequence is named 'PAYMENT_INFO_ID_SEQ'
-- 
-- -- Insert data for India
-- INSERT INTO PAYMENT_INFO (
--     ID,
--     ACCOUNT_NUMBER,
--     ACCOUNT_HOLDER,
--     BANK_NAME,
--     IBAN
-- )
-- VALUES (
--     4,
--     '3456789012', -- Replace with an actual account number
--     'RP Tech India',
--     'State Bank of India',
--     'IN34567890123456789012345678901234'
-- );
-- 
-- INSERT INTO PAYMENT_INFO (
--     ID,
--     ACCOUNT_NUMBER,
--     ACCOUNT_HOLDER,
--     BANK_NAME,
--     IBAN
-- )
-- VALUES (
--     5,
--     '4567890123', -- Replace with an actual account number
--     'Retrotech Business Solutions PVT LTD',
--     'HDFC Bank',
--     'IN45678901234567890123456789012345'
-- );
-- 
-- INSERT INTO PAYMENT_INFO (
--     ID,
--     ACCOUNT_NUMBER,
--     ACCOUNT_HOLDER,
--     BANK_NAME,
--     IBAN
-- )
-- VALUES (
--     6,
--     '5678901234', -- Replace with an actual account number
--     'BenQ India Pvt. Ltd',
--     'ICICI Bank',
--     'IN56789012345678901234567890123456'
-- );
-- 
-- -- Insert data for China
-- INSERT INTO PAYMENT_INFO (
--     ID,
--     ACCOUNT_NUMBER,
--     ACCOUNT_HOLDER,
--     BANK_NAME,
--     IBAN
-- )
-- VALUES (
--     7,
--     '6789012345', -- Replace with an actual account number
--     'Beijing Guangtian Runze Technology Co. Ltd.',
--     'Bank of China',
--     'CN67890123456789012345678901234567'
-- );
-- 
-- INSERT INTO PAYMENT_INFO (
--     ID,
--     ACCOUNT_NUMBER,
--     ACCOUNT_HOLDER,
--     BANK_NAME,
--     IBAN
-- )
-- VALUES (
--     8,
--     '7890123456', -- Replace with an actual account number
--     'Shenzhen Jingang Zhuoyue Technology Limited',
--     'Industrial and Commercial Bank of China',
--     'CN78901234567890123456789012345678'
-- );
-- 