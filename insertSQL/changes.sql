ALTER TABLE LOCATIONS
ADD ORGANIZATION_ID NUMBER;

-- Add foreign key constraint
ALTER TABLE LOCATIONS
ADD CONSTRAINT ORG_FK FOREIGN KEY (ORGANIZATION_ID) REFERENCES ORGANIZATIONS(ORGANIZATION_ID) ON DELETE CASCADE;

ALTER TABLE LOCATIONS
ADD TYPE VARCHAR2(20) DEFAULT 'ADDRESS' CHECK (UPPER(TYPE) IN ('ADDRESS', 'PICKUP', 'DUAL'));


UPDATE LOCATIONS
SET ORGANIZATION_ID = LOCATION_ID
WHERE LOCATION_ID BETWEEN 1 AND 10;

UPDATE LOCATIONS
SET ORGANIZATION_ID = LOCATION_ID-1
WHERE LOCATION_ID >11;

UPDATE LOCATIONS
SET TYPE = 'DUAL'
WHERE ORGANIZATION_ID BETWEEN 1 AND 3;

-- Set TYPE to 'BOTH' for LOCATION_ID 18 to 28
UPDATE LOCATIONS
SET TYPE = 'DUAL'
WHERE LOCATION_ID BETWEEN 18 AND 28;

UPDATE LOCATIONS
SET TYPE = 'PICKUP', ORGANIZATION_ID = 4
WHERE LOCATION_ID = 11;

-- Insert statement for LOCATION_ID 30, ORGANIZATION_ID 5, and TYPE 'PICKUP'
INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY,
    ORGANIZATION_ID,
    TYPE
)
VALUES (
    30,
    '402, Hydrography Department, Chittagong Port Authority, Bandar Bhaban (Annex Building)',
    '4100', -- Placeholder for POSTAL_CODE, replace with actual value if available
    'Chittagong',
    NULL, -- Placeholder for STATE_PROVINCE, replace with actual value if available
    'Bangladesh',
    5,
    'PICKUP'
);

-- Insert statement for LOCATION_ID 31, ORGANIZATION_ID 6, and TYPE 'PICKUP'
INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY,
    ORGANIZATION_ID,
    TYPE
)
VALUES (
    31,
    '402, Hydrography Department, Chittagong Port Authority, Bandar Bhaban (Annex Building)',
    '4100', -- Placeholder for POSTAL_CODE, replace with actual value if available
    'Chittagong',
    NULL, -- Placeholder for STATE_PROVINCE, replace with actual value if available
    'Bangladesh',
    6,
    'PICKUP'
);

-- Insert statement for LOCATION_ID 32, ORGANIZATION_ID 7, and TYPE 'PICKUP'
INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY,
    ORGANIZATION_ID,
    TYPE
)
VALUES (
    32,
    '402, Hydrography Department, Chittagong Port Authority, Bandar Bhaban (Annex Building)',
    '4100', -- Placeholder for POSTAL_CODE, replace with actual value if available
    'Chittagong',
    NULL, -- Placeholder for STATE_PROVINCE, replace with actual value if available
    'Bangladesh',
    7,
    'PICKUP'
);

-- Insert statement for LOCATION_ID 33, ORGANIZATION_ID 8, and TYPE 'PICKUP'
INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY,
    ORGANIZATION_ID,
    TYPE
)
VALUES (
    33,
    '402, Hydrography Department, Chittagong Port Authority, Bandar Bhaban (Annex Building)',
    '4100', -- Placeholder for POSTAL_CODE, replace with actual value if available
    'Chittagong',
    NULL, -- Placeholder for STATE_PROVINCE, replace with actual value if available
    'Bangladesh',
    8,
    'PICKUP'
);

UPDATE LOCATIONS
SET TYPE = 'DUAL'
WHERE ORGANIZATION_ID BETWEEN 12 AND 16;

ALTER TABLE ORGANIZATIONS DROP COLUMN ADDRESS;

ALTER TABLE SUPPLIERS DROP COLUMN PICKUP_LOCATION_ID;

CREATE TABLE LOGS (
    LOG_ID NUMBER GENERATED ALWAYS AS IDENTITY,
    TIMESTAMP_COL TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LOG_MESSAGE VARCHAR2(255),
    CONSTRAINT LOG_PK PRIMARY KEY (LOG_ID)
);

ALTER TABLE LOGS
ADD TYPE VARCHAR2(20);

ALTER TABLE LOGS
ADD CONSTRAINT CHK_LOG_TYPE CHECK (UPPER(TYPE) IN ('UPDATE', 'INSERT', 'DELETE'));

DROP TABLE PRODUCT_TRANSACTIONS;

CREATE TABLE CONFIRMED_SUPPLY_PRODUCTS(
SUPPLY_ID NUMBER,
PRODUCT_ID NUMBER,
CONSTRAINT PTI_PK PRIMARY KEY(SUPPLY_ID,PRODUCT_ID),
QUANTITY NUMBER CHECK(QUANTITY>0),
CONSTRAINT CSP_SUPPLY_FK FOREIGN KEY(SUPPLY_ID) REFERENCES CONFIRMED_SUPPLY(SUPPLY_ID) ON DELETE CASCADE,
CONSTRAINT CSP_PRODUCT_FK FOREIGN KEY(PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID) ON DELETE CASCADE
);



CREATE TABLE ORDER_PRODUCTS(
ORDER_ID NUMBER,
PRODUCT_ID NUMBER,
CONSTRAINT OP_PK PRIMARY KEY(ORDER_ID,PRODUCT_ID),
QUANTITY NUMBER CHECK(QUANTITY>0),
PRICE NUMBER CHECK(PRICE>0),
CONSTRAINT OP_ORDER_FK FOREIGN KEY(ORDER_ID) REFERENCES PRODUCT_TRANSACTIONS(TRANSACTION_ID) ON DELETE CASCADE,
CONSTRAINT OP_PRODUCT_FK FOREIGN KEY(PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID) ON DELETE CASCADE
);