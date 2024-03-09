CREATE OR REPLACE TRIGGER org_insert_trigger
AFTER INSERT ON ORGANIZATIONS
FOR EACH ROW
DECLARE
  v_log_id NUMBER;
BEGIN
  INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME)
  VALUES (CURRENT_TIMESTAMP,:NEW.TYPE ||' '|| :NEW.ORGANIZATION_ID || ' ' ||:NEW.NAME || ' Inserted','ORGANIZATION', 'INSERT', 'SUCCESSFUL')
  RETURNING LOG_ID INTO v_log_id;

  INSERT INTO ORGANIZATION_LOGS (LOG_ID, ORGANIZATION_ID, ORGANIZATION_TYPE)
  VALUES (v_log_id, :NEW.ORGANIZATION_ID, :NEW.TYPE);
END org_insert_trigger;
/

CREATE OR REPLACE TRIGGER check_negative_stock
BEFORE UPDATE OF CENTRAL_STOCK ON PRODUCTS
FOR EACH ROW
DECLARE
  v_new_stock NUMBER;
BEGIN
  v_new_stock := :NEW.CENTRAL_STOCK;

  IF v_new_stock < 0 THEN
    RAISE_APPLICATION_ERROR(-20001, 'Central Stock cannot be updated to a value less than 0.');
  END IF;
END check_negative_stock;
/



CREATE OR REPLACE TRIGGER BEFORE_DELETE_ORGANIZATION
BEFORE DELETE ON ORGANIZATIONS
FOR EACH ROW
DECLARE

COUNTER NUMBER;
PENDING_TRANSACTIONS NUMBER;
 v_log_message VARCHAR2(255); 
 
BEGIN
  
	SELECT COUNT(*) INTO COUNTER FROM ORGANIZATION_BACKUP WHERE NAME=:OLD.NAME;
	/*SELECT COUNT(*) INTO PENDING_TRANSACTIONS FROM PRODUCT_TRANSACTIONS WHERE COUNTERPARTY_ID=:OLD.ORGANIZATION_ID AND UPPER(STATUS)='PENDING';
	
	IF PENDING_TRANSACTIONS<>0 THEN
	INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE)
    VALUES (CURRENT_TIMESTAMP,:OLD.TYPE ||' ' ||:OLD.ORGANIZATION_ID||' '|| :OLD.NAME || ' DELETE FAILED','DELETE');
		 --RAISE_APPLICATION_ERROR(-20001, 'deletion stopped. Organization has pending transactions.');
	 end if;
	*/
	IF COUNTER=0 THEN
	INSERT INTO ORGANIZATION_BACKUP(NAME,URL,TYPE) VALUES (:OLD.NAME, :OLD.URL,:OLD.TYPE);
	ELSE
	UPDATE ORGANIZATION_BACKUP SET DELETE_TIME=CURRENT_TIMESTAMP;
	END IF;
	 v_log_message := :OLD.TYPE ||' ' || :OLD.NAME || ' DELETED';

    INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE,ACTION,OUTCOME)
    VALUES (CURRENT_TIMESTAMP, v_log_message,'ORGANIZATION','DELETE','SUCCESSFUL');
	
END;
/



--march 9
CREATE OR REPLACE TRIGGER log_shipment_arrival
AFTER UPDATE OF ARRIVAL_DATE ON SHIPMENTS
FOR EACH ROW
WHEN (NEW.ARRIVAL_DATE IS NOT NULL)
DECLARE
    v_log_id NUMBER;
		V_TRANSACTION_TYPE VARCHAR2(30);
BEGIN
    INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME)
    VALUES (CURRENT_TIMESTAMP, 'Shipment arrived on ' || :NEW.ARRIVAL_DATE || ' at ' || NVL(:NEW.ARRIVAL_TIME,'NO TIME GIVEN'), 'PRODUCT_TRANSACTION', 'UPDATE', 'SUCCESSFUL')
    RETURNING LOG_ID INTO v_log_id;
		
		SELECT P.TYPE INTO V_TRANSACTION_TYPE FROM PRODUCT_TRANSACTIONS P WHERE P.TRANSACTION_ID=:NEW.PRODUCT_TRANSACTION_ID;  
    
    INSERT INTO TRANSACTION_LOGS (LOG_ID, TRANSACTION_ID, TRANSACTION_TYPE, TRANSACTION_PART)
    VALUES (v_log_id, :NEW.PRODUCT_TRANSACTION_ID, V_TRANSACTION_TYPE, 'SHIPMENT');
    
END;
/         --TRANSACTION_TYPE TA PORE SHORANOR LAGTE PARE


CREATE OR REPLACE TRIGGER trg_financial_transaction_completed
AFTER UPDATE OF STATUS ON FINANCIAL_TRANSACTIONS
FOR EACH ROW
WHEN (NEW.STATUS = 'COMPLETED' AND OLD.STATUS != 'COMPLETED')
DECLARE
    v_log_id NUMBER;
BEGIN

    INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME)
    VALUES (CURRENT_TIMESTAMP, :NEW.TYPE||'  of PRODUCT_TRANSACTION' || :NEW.PRODUCT_TRANSACTION_ID || ' marked as COMPLETED','PRODUCT_TRANSACTION', 'UPDATE', 'SUCCESSFUL')
    RETURNING LOG_ID INTO v_log_id;
		
    INSERT INTO TRANSACTION_LOGS (LOG_ID, TRANSACTION_ID, TRANSACTION_PART)
    VALUES (v_log_id, :NEW.PRODUCT_TRANSACTION_ID, :NEW.TYPE);

END;
/

CREATE OR REPLACE TRIGGER trg_after_product_transaction_insert
AFTER INSERT ON PRODUCT_TRANSACTIONS
FOR EACH ROW
DECLARE
    v_log_message VARCHAR2(50);
		 v_log_id NUMBER;
BEGIN
    v_log_message := :NEW.TYPE ||' ' || :NEW.TRANSACTION_ID || ' ENTERED ';

    INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME)
    VALUES (CURRENT_TIMESTAMP, v_log_message, 'PRODUCT_TRANSACTION', 'INSERT', 'SUCCESSFUL')
    RETURNING LOG_ID INTO v_log_id;

INSERT INTO TRANSACTION_LOGS (LOG_ID, TRANSACTION_ID, TRANSACTION_PART)
    VALUES (v_log_id, :NEW.TRANSACTION_ID, 'CREATION');

END;
/

CREATE OR REPLACE TRIGGER trg_after_location_update
AFTER UPDATE ON LOCATIONS
FOR EACH ROW
DECLARE
    v_log_message VARCHAR2(255);
    v_log_id NUMBER;
    ORG_TYPE VARCHAR2(30);
BEGIN

    IF :NEW.STREET_ADDRESS <> :OLD.STREET_ADDRESS OR :NEW.CITY <> :OLD.CITY OR :NEW.POSTAL_CODE <> :OLD.POSTAL_CODE OR :NEW.COUNTRY <> :OLD.COUNTRY THEN
		    
				SELECT TYPE INTO ORG_TYPE FROM ORGANIZATIONS WHERE ORGANIZATION_ID = :NEW.ORGANIZATION_ID;
        v_log_message := 'LOCATION UPDATED FOR '||ORG_TYPE||' '|| :NEW.ORGANIZATION_ID || ' FROM ' || :OLD.STREET_ADDRESS||', '||:OLD.CITY||'-'||:OLD.POSTAL_CODE||', '|| :OLD.COUNTRY ||' TO '||:NEW.STREET_ADDRESS||', '||:NEW.CITY||'-'||:NEW.POSTAL_CODE||', '|| :NEW.COUNTRY;

        

        INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME)
        VALUES (CURRENT_TIMESTAMP, v_log_message, 'ORGANIZATION', 'UPDATE', 'SUCCESSFUL')
        RETURNING LOG_ID INTO v_log_id;

        INSERT INTO ORGANIZATION_LOGS (LOG_ID, ORGANIZATION_ID, ORGANIZATION_TYPE)
        VALUES (v_log_id, :NEW.ORGANIZATION_ID, ORG_TYPE);
    END IF;
END;
/

CREATE OR REPLACE TRIGGER after_payment_info_update
AFTER UPDATE ON PAYMENT_INFO
FOR EACH ROW
DECLARE
    v_log_message VARCHAR2(255);
    v_log_id NUMBER;
    ORG_TYPE VARCHAR2(30);
BEGIN

    SELECT TYPE INTO ORG_TYPE FROM ORGANIZATIONS WHERE ORGANIZATION_ID = :NEW.OWNER_ID;

    IF :NEW.ACCOUNT_NUMBER <> :OLD.ACCOUNT_NUMBER OR :NEW.ACCOUNT_HOLDER <> :OLD.ACCOUNT_HOLDER OR :NEW.BANK_NAME <> :OLD.BANK_NAME OR :NEW.IBAN <> :OLD.IBAN THEN
		
       v_log_message := 'PAYMENT INFO UPDATED FOR '||ORG_TYPE||' '|| :NEW.OWNER_ID ;

        INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME)
        VALUES (CURRENT_TIMESTAMP, v_log_message, 'ORGANIZATION', 'UPDATE', 'SUCCESSFUL')
        RETURNING LOG_ID INTO v_log_id;

        INSERT INTO ORGANIZATION_LOGS (LOG_ID, ORGANIZATION_ID, ORGANIZATION_TYPE)
        VALUES (v_log_id, :NEW.OWNER_ID, ORG_TYPE);
    END IF;
END;
/