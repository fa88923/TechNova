CREATE TABLE LOCATIONS (
	LOCATION_ID NUMBER CONSTRAINT LOCATIONS_PK PRIMARY KEY,
	STREET_ADDRESS VARCHAR2 ( 100 ),
	POSTAL_CODE VARCHAR2 ( 20 ),
	CITY VARCHAR2 ( 20 ),
	STATE_PROVINCE VARCHAR2 ( 50 ),
	COUNTRY VARCHAR2 ( 20 ) 
);
-- Add ORGANIZATION_ID column as a foreign key
ALTER TABLE LOCATIONS ADD ORGANIZATION_ID NUMBER;
-- Add foreign key constraint
ALTER TABLE LOCATIONS ADD CONSTRAINT ORG_FK FOREIGN KEY ( ORGANIZATION_ID ) REFERENCES ORGANIZATIONS ( ORGANIZATION_ID ) ON DELETE CASCADE;
ALTER TABLE LOCATIONS ADD TYPE VARCHAR2 ( 20 ) DEFAULT 'ADDRESS' CHECK ( UPPER( TYPE ) IN ( 'ADDRESS', 'PICKUP', 'DUAL' ) );
CREATE TABLE ORGANIZATIONS (
	ORGANIZATION_ID NUMBER CONSTRAINT TRANSPORT_PK PRIMARY KEY,
	NAME VARCHAR2 ( 100 ) NOT NULL UNIQUE,
	URL VARCHAR2 ( 200 ),
	TYPE VARCHAR2 ( 20 ) CHECK ( UPPER( TYPE ) IN ( 'BRANCH', 'SUPPLIER', 'TRANSPORT', 'CENTRAL', 'CLIENT' ) ),
	CONSTRAINT LOC_FK FOREIGN KEY ( ADDRESS ) REFERENCES LOCATIONS ( LOCATION_ID ) ON DELETE 
	SET NULL 
	);
CREATE TABLE CONTACTS (
	OWNER_ID NUMBER,
	TYPE VARCHAR2 ( 30 ) CHECK ( UPPER( TYPE ) IN ( 'EMAIL', 'PHONE_NUMBER' ) ),
	VALUE VARCHAR2 ( 255 ),
	CONSTRAINT CONTACT_PK PRIMARY KEY ( OWNER_ID, TYPE, VALUE ),
	CONSTRAINT CONTACT_OWNER_FK FOREIGN KEY ( OWNER_ID ) REFERENCES ORGANIZATIONS ( ORGANIZATION_ID ) ON DELETE CASCADE --     CONSTRAINT EMAIL_FORMAT_CHECK CHECK ((TYPE = 'email' AND REGEXP_LIKE(VALUE, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'))
--                                        OR (TYPE = 'phone' AND REGEXP_LIKE(VALUE, '^\d+$')))       // constraints to check that the format is the same, add this later
	
);
CREATE TABLE PAYMENT_INFO (-- this type of design helps an organization to be associated with multiple bank accounts
	ID NUMBER CONSTRAINT PAY_PK PRIMARY KEY,
	OWNER_ID NUMBER,
	ACCOUNT_NUMBER VARCHAR2 ( 30 ) NOT NULL,
	ACCOUNT_HOLDER VARCHAR2 ( 255 ),
	BANK_NAME VARCHAR2 ( 255 ) NOT NULL,
	IBAN VARCHAR2 ( 34 ),
	CONSTRAINT PAYMENT_UNQ UNIQUE ( ACCOUNT_NUMBER, BANK_NAME ),
	CONSTRAINT ACCOUNT_OWNER_FK FOREIGN KEY ( OWNER_ID ) REFERENCES ORGANIZATIONS ( ORGANIZATION_ID ) ON DELETE CASCADE 
);
CREATE TABLE CLIENT_COMPANIES (
	CLIENT_ID NUMBER,
	TYPE VARCHAR2 ( 30 ),
	CONSTRAINT CLIENT_ID_FK FOREIGN KEY ( CLIENT_ID ) REFERENCES ORGANIZATIONS ( ORGANIZATION_ID ) ON DELETE CASCADE,
	CONSTRAINT CLIENT_PK PRIMARY KEY ( CLIENT_ID ) 
);



CREATE TABLE SUPPLIERS(
SUPPLIER_ID NUMBER,
PICKUP_LOCATION_ID NUMBER,
AVG_DELIVERY_TIME NUMBER,
CONSTRAINT PICKUP_LOC_FK FOREIGN KEY(PICKUP_LOCATION_ID) REFERENCES LOCATIONS(LOCATION_ID),
CONSTRAINT SUPPLIER_ID_FK FOREIGN KEY (SUPPLIER_ID) REFERENCES ORGANIZATIONS(ORGANIZATION_ID) ON DELETE CASCADE,
CONSTRAINT SUPPLIER_PK PRIMARY KEY(SUPPLIER_ID)
);


CREATE TABLE TRANSPORT_COMPANIES(
COMPANY_ID NUMBER,
CAPACITY NUMBER,
CONSTRAINT TRANSPORTER_ID_FK FOREIGN KEY (COMPANY_ID) REFERENCES ORGANIZATIONS(ORGANIZATION_ID) ON DELETE CASCADE,
CONSTRAINT TRANSPORT_COMPANY_PK PRIMARY KEY(COMPANY_ID)
);
CREATE TABLE BRANCHES (
	BRANCH_ID NUMBER,
	MANAGER VARCHAR2 ( 50 ),
	SQUARE_FOOTAGE NUMBER,
	AVG_SHIPPING_DURATION NUMBER,
	CONSTRAINT BRANCH_ID_FK FOREIGN KEY ( BRANCH_ID ) REFERENCES ORGANIZATIONS ( ORGANIZATION_ID ) ON DELETE CASCADE,
	CONSTRAINT BRANCH_PK PRIMARY KEY ( BRANCH_ID ) 
);
CREATE TABLE BRANCH_INCOME_STATEMENT (
	BRANCH_ID NUMBER,
	START_DATE DATE,
	END_DATE DATE,
	EARNINGS NUMBER,
	OVERHEAD NUMBER,
	REPORT_DOCUMENT BLOB,
	CONSTRAINT BRANCH_FK FOREIGN KEY ( BRANCH_ID ) REFERENCES BRANCHES ( BRANCH_ID ) ON DELETE CASCADE,
	CONSTRAINT REPORT_PK PRIMARY KEY ( BRANCH_ID, START_DATE ) 
);
CREATE TABLE PRODUCTS (
	PRODUCT_ID NUMBER CONSTRAINT PRODUCT_PK PRIMARY KEY,
	PRODUCT_NAME VARCHAR2 ( 100 ) NOT NULL,
	CATEGORY VARCHAR2 ( 20 ),
	RETAIL_PRICE NUMBER DEFAULT 0 CHECK ( RETAIL_PRICE >= 0 ),
	WARRANTY NUMBER CHECK ( WARRANTY >= 0 ),
	MANUFACTURER_ID VARCHAR2 ( 20 ),
	CENTRAL_STOCK NUMBER DEFAULT 0 
);
CREATE TABLE FEATURE_NAMES ( FEATURE_ID NUMBER CONSTRAINT FEATURE_PK PRIMARY KEY, FEATURE_NAME VARCHAR2 ( 30 ) UNIQUE NOT NULL );
CREATE TABLE PRODUCT_FEATURES (
	PRODUCT_ID NUMBER,
	FEATURE_ID NUMBER,
	VALUE VARCHAR2 ( 30 ) NOT NULL,
	CONSTRAINT PID_FK FOREIGN KEY ( PRODUCT_ID ) REFERENCES PRODUCTS ( PRODUCT_ID ) ON DELETE CASCADE,
	CONSTRAINT FEATURE_FK FOREIGN KEY ( FEATURE_ID ) REFERENCES FEATURE_NAMES ( FEATURE_ID ) ON DELETE CASCADE,
	CONSTRAINT PK PRIMARY KEY ( PRODUCT_ID, FEATURE_ID ) 
);
CREATE TABLE SUPPLIER_PRODUCT (
	SUPPLIER_ID NUMBER,
	PRODUCT_ID NUMBER,
	WHOLESALE_PRICE NUMBER CHECK ( WHOLESALE_PRICE >= 0 ),
	CONSTRAINT SP_PK PRIMARY KEY ( SUPPLIER_ID, PRODUCT_ID ),
	CONSTRAINT SUP_FK FOREIGN KEY ( SUPPLIER_ID ) REFERENCES SUPPLIERS ( SUPPLIER_ID ) ON DELETE CASCADE,
	CONSTRAINT PRO_SUP_FK FOREIGN KEY ( PRODUCT_ID ) REFERENCES PRODUCTS ( PRODUCT_ID ) ON DELETE CASCADE 
);
CREATE TABLE PRODUCT_TRANSACTIONS (
	TRANSACTION_ID NUMBER CONSTRAINT TRANSACTION_PK PRIMARY KEY,
	TYPE VARCHAR2 ( 30 ) CHECK ( UPPER( TYPE ) IN ( 'CLIENT_TRANSACTION', 'PURCHASE_TRANSACTION', 'CONFIRMED_SUPPLY' ) ),
	COUNTERPARTY_ID NUMBER,--PLACE TRIGGERS TO CHECK ORGANIZATION TYPE LATER
	PICKUP_DATE DATE DEFAULT SYSDATE,
	STATUS VARCHAR2 ( 20 ) CHECK ( UPPER( STATUS ) IN ( 'COMPLETED', 'PENDING' ) ),
	CONSTRAINT ORGANIZATION_FK FOREIGN KEY ( COUNTERPARTY_ID ) REFERENCES ORGANIZATIONS ( ORGANIZATION_ID ) ON DELETE CASCADE 
);

CREATE TABLE SUPPLY_REQUESTS(
REQUEST_ID NUMBER, 
PLACEMENT_DATE DATE DEFAULT SYSDATE,
DEADLINE DATE,
CONSTRAINT SR_PK PRIMARY KEY(REQUEST_ID)
);

-------------!!!!!!!!!!!!!!ADDED NEW

ALTER TABLE SUPPLY_REQUESTS
ADD BRANCH_ID NUMBER;


ALTER TABLE SUPPLY_REQUESTS
ADD CONSTRAINT SUPREQ_BRANCH_FK FOREIGN KEY (BRANCH_ID) REFERENCES BRANCHES (BRANCH_ID);

-- Add STATUS column to SUPPLY_REQUEST table
ALTER TABLE SUPPLY_REQUESTS
ADD STATUS VARCHAR2(20) CHECK (UPPER(STATUS) IN ('PENDING', 'COMPLETED'));

-------------------------------------------

CREATE TABLE SUPPLY_REQUEST_PRODUCTS(
REQUEST_ID NUMBER,
PRODUCT_ID NUMBER,
CONSTRAINT SRP_PK PRIMARY KEY(REQUEST_ID,PRODUCT_ID),
QUANTITY NUMBER CHECK(QUANTITY>0),
CONSTRAINT SRP_REQUEST_FK FOREIGN KEY(REQUEST_ID) REFERENCES SUPPLY_REQUESTS(REQUEST_ID) ON DELETE CASCADE,
CONSTRAINT SRP_PRODUCT_FK FOREIGN KEY(PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID) ON DELETE CASCADE
);
CREATE TABLE CONFIRMED_SUPPLY (
	SUPPLY_ID NUMBER CONSTRAINT SUPPLY_PK PRIMARY KEY,
	REQUEST_ID NUMBER,
	CONSTRAINT CR_REQUEST_FK FOREIGN KEY ( REQUEST_ID ) REFERENCES SUPPLY_REQUESTS ( REQUEST_ID ) ON DELETE 
	SET NULL,
	CONSTRAINT CR_FK FOREIGN KEY ( SUPPLY_ID ) REFERENCES PRODUCT_TRANSACTIONS ( TRANSACTION_ID ) ON DELETE CASCADE 
);

CREATE TABLE CONFIRMED_SUPPLY_PRODUCTS(
SUPPLY_ID NUMBER,
PRODUCT_ID NUMBER,
CONSTRAINT PTI_PK2 PRIMARY KEY(SUPPLY_ID,PRODUCT_ID),
QUANTITY NUMBER CHECK(QUANTITY>0),
CONSTRAINT CSP_SUPPLY_FK2 FOREIGN KEY(SUPPLY_ID) REFERENCES CONFIRMED_SUPPLY(SUPPLY_ID) ON DELETE CASCADE,
CONSTRAINT CSP_PRODUCT_FK2 FOREIGN KEY(PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID) ON DELETE CASCADE
);
CREATE TABLE ORDER_PRODUCTS (
	ORDER_ID NUMBER,
	PRODUCT_ID NUMBER,
	CONSTRAINT OP_PK PRIMARY KEY ( ORDER_ID, PRODUCT_ID ),
	QUANTITY NUMBER CHECK ( QUANTITY > 0 ),
	PRICE NUMBER CHECK ( PRICE > 0 ),
	CONSTRAINT OP_ORDER_FK FOREIGN KEY ( ORDER_ID ) REFERENCES PRODUCT_TRANSACTIONS ( TRANSACTION_ID ) ON DELETE CASCADE,
	CONSTRAINT OP_PRODUCT_FK FOREIGN KEY ( PRODUCT_ID ) REFERENCES PRODUCTS ( PRODUCT_ID ) ON DELETE CASCADE 
);
CREATE TABLE FINANCIAL_TRANSACTIONS (
	FINANCIAL_TRANSACTION_ID NUMBER CONSTRAINT FTRANSACTION_PK PRIMARY KEY,
	TYPE VARCHAR2 ( 50 ) CHECK ( UPPER( TYPE ) IN ( 'PURCHASE_ORDER_PAYMENT', 'CLIENT_ORDER_PAYMENT', 'SHIPPING_PAYMENT' ) ),
	PRODUCT_TRANSACTION_ID NUMBER,--ADD TRIGGERS TO CHECK TYPE
	METHOD VARCHAR2 ( 50 ),
	FROM_ACCOUNT NUMBER,
	TO_ACCOUNT NUMBER,
	STATUS VARCHAR2 ( 20 ) CHECK ( UPPER( STATUS ) IN ( 'PENDING', 'COMPLETED' ) ),
	CURRENCY VARCHAR2 ( 20 ),
	AMOUNT NUMBER ( 15 ),
	CONSTRAINT FROM_FK FOREIGN KEY ( FROM_ACCOUNT ) REFERENCES PAYMENT_INFO ( ID ) ON DELETE 
	SET NULL,
	CONSTRAINT TO_FK FOREIGN KEY ( TO_ACCOUNT ) REFERENCES PAYMENT_INFO ( ID ) ON DELETE 
	SET NULL,
	CONSTRAINT PT_FK FOREIGN KEY ( PRODUCT_TRANSACTION_ID ) REFERENCES PRODUCT_TRANSACTIONS ( TRANSACTION_ID ) ON DELETE CASCADE,
	CONSTRAINT FTRANSACTIONS_UNQ UNIQUE ( PRODUCT_TRANSACTION_ID, TYPE ) 
);
CREATE TABLE SHIPMENTS (
	SHIPMENT_ID NUMBER CONSTRAINT SHIPMENT_PK PRIMARY KEY,
	TRANSPORT_COMPANY_ID NUMBER,--ADD TRIGGERS
	PRODUCT_TRANSACTION_ID NUMBER,
	DEPARTURE_TIME VARCHAR2 ( 20 ),
	DEPARTURE_DATE DATE,
	ARRIVAL_TIME VARCHAR2 ( 20 ),
	ARRIVAL_DATE DATE,
	VEHICLE_NO VARCHAR2 ( 20 ),
	CURRENT_LOCATION VARCHAR2 ( 255 ),
	START_LOCATION NUMBER,
	DESTINATION NUMBER,
	COST NUMBER CHECK ( COST > 0 ),
	CONSTRAINT TRANSPORT_COMPANY_FK FOREIGN KEY ( TRANSPORT_COMPANY_ID ) REFERENCES ORGANIZATIONS ( ORGANIZATION_ID ) ON DELETE 
	SET NULL,
	CONSTRAINT SHIPFROM_FK FOREIGN KEY ( START_LOCATION ) REFERENCES LOCATIONS ( LOCATION_ID ) ON DELETE 
	SET NULL,
	CONSTRAINT SHIPTO_FK FOREIGN KEY ( DESTINATION ) REFERENCES LOCATIONS ( LOCATION_ID ) ON DELETE 
	SET NULL,
	CONSTRAINT PRODUCT_TRANSACTION_FK FOREIGN KEY ( PRODUCT_TRANSACTION_ID ) REFERENCES PRODUCT_TRANSACTIONS ( TRANSACTION_ID ) ON DELETE CASCADE 
);


ALTER TABLE LOGS ADD TYPE VARCHAR2 ( 20 );
ALTER TABLE LOGS ADD CONSTRAINT CHK_LOG_TYPE CHECK ( UPPER( TYPE ) IN ( 'UPDATE', 'INSERT', 'DELETE' ) );
CREATE TABLE ORGANIZATION_BACKUP (
	NAME VARCHAR2 ( 100 ) NOT NULL UNIQUE,
	URL VARCHAR2 ( 200 ),
	TYPE VARCHAR2 ( 20 ) CHECK ( UPPER( TYPE ) IN ( 'BRANCH', 'SUPPLIER', 'TRANSPORT', 'CENTRAL', 'CLIENT' ) ),
	DELETE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	ACTIVE_START_YEAR NUMBER,
	ACTIVE_END_YEAR NUMBER,
INFO VARCHAR2 ( 500 ) 
);


CREATE TABLE LOGS ( LOG_ID NUMBER GENERATED ALWAYS AS IDENTITY,
TIMESTAMP_COL TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
LOG_MESSAGE VARCHAR2 ( 255 ), 
TYPE VARCHAR2 ( 20 ),
ACTION VARCHAR2 (20),
OUTCOME VARCHAR2 (20),
CONSTRAINT LOG_PK PRIMARY KEY ( LOG_ID ) );


CREATE TABLE ORGANIZATION_LOGS (
    LOG_ID NUMBER,
    ORGANIZATION_ID NUMBER,
    ORGANIZATION_TYPE VARCHAR2(20),
    CONSTRAINT ORG_LOG_PK PRIMARY KEY (LOG_ID),
    CONSTRAINT LOG_FK FOREIGN KEY (LOG_ID) REFERENCES LOGS(LOG_ID) ON DELETE CASCADE,
    CONSTRAINT ORG_LOG_FK FOREIGN KEY (ORGANIZATION_ID) REFERENCES ORGANIZATIONS(ORGANIZATION_ID) ON DELETE SET NULL
);

CREATE TABLE TRANSACTION_LOGS (
    LOG_ID NUMBER,
    TRANSACTION_ID NUMBER,
    TRANSACTION_TYPE VARCHAR2(20),
    TRANSACTION_PART VARCHAR2(50),
    CONSTRAINT TRAN_LOG_PK PRIMARY KEY (LOG_ID),
    CONSTRAINT TRAN_LOG_FK FOREIGN KEY (LOG_ID) REFERENCES LOGS(LOG_ID) ON DELETE CASCADE,
    CONSTRAINT TRAN_LOGS_FK FOREIGN KEY (TRANSACTION_ID) REFERENCES PRODUCT_TRANSACTIONS(TRANSACTION_ID) ON DELETE SET NULL
);

/*DROP TABLE ORGANIZATION_LOGS PURGE;
DROP TABLE TRANSACTION_LOGS PURGE;
DROP TABLE LOGS PURGE;*/


