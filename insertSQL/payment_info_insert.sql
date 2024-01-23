CREATE SEQUENCE PAYMENT_INFO_ID_SEQ
INCREMENT BY 1
START WITH 101
MAXVALUE 1000
NOCYCLE;




-- Insert data into PAYMENT_INFO table using the sequence for ID
INSERT INTO PAYMENT_INFO (
    ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    PAYMENT_INFO_ID_SEQ.NEXTVAL,
    '1234567890', -- Replace with an actual account number
    'Global Brand Pvt. Ltd.',
    'Bank of Bangladesh',
    'BD12345678901234567890123456789012'
);

INSERT INTO PAYMENT_INFO (
    ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    PAYMENT_INFO_ID_SEQ.NEXTVAL,
    '2345678901', -- Replace with an actual account number
    'Distribution Hub Ltd',
    'Dhaka Bank',
    'BD23456789012345678901234567890123'
);

-- Assuming your sequence is named 'PAYMENT_INFO_ID_SEQ'

-- Insert data for India
INSERT INTO PAYMENT_INFO (
    ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    PAYMENT_INFO_ID_SEQ.NEXTVAL,
    '3456789012', -- Replace with an actual account number
    'RP Tech India',
    'State Bank of India',
    'IN34567890123456789012345678901234'
);

INSERT INTO PAYMENT_INFO (
    ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    PAYMENT_INFO_ID_SEQ.NEXTVAL,
    '4567890123', -- Replace with an actual account number
    'Retrotech Business Solutions PVT LTD',
    'HDFC Bank',
    'IN45678901234567890123456789012345'
);

INSERT INTO PAYMENT_INFO (
    ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    PAYMENT_INFO_ID_SEQ.NEXTVAL,
    '5678901234', -- Replace with an actual account number
    'BenQ India Pvt. Ltd',
    'ICICI Bank',
    'IN56789012345678901234567890123456'
);

-- Insert data for China
INSERT INTO PAYMENT_INFO (
    ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    PAYMENT_INFO_ID_SEQ.NEXTVAL,
    '6789012345', -- Replace with an actual account number
    'Beijing Guangtian Runze Technology Co. Ltd.',
    'Bank of China',
    'CN67890123456789012345678901234567'
);

INSERT INTO PAYMENT_INFO (
    ID,
    ACCOUNT_NUMBER,
    ACCOUNT_HOLDER,
    BANK_NAME,
    IBAN
)
VALUES (
    PAYMENT_INFO_ID_SEQ.NEXTVAL,
    '7890123456', -- Replace with an actual account number
    'Shenzhen Jingang Zhuoyue Technology Limited',
    'Industrial and Commercial Bank of China',
    'CN78901234567890123456789012345678'
);

