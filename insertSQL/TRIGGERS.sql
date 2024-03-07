/*CREATE OR REPLACE TRIGGER ORG_INSERT_TRIGGER
AFTER INSERT ON ORGANIZATIONS
FOR EACH ROW
DECLARE
    v_log_message VARCHAR2(255);
BEGIN
    -- Create a log message for successful insertion
    v_log_message := :NEW.TYPE || ' ' || :NEW.ORGANIZATION_ID || ' ' || :NEW.NAME || ' ADDED SUCCESSFULLY';

    -- Insert data into the LOGS table
    INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE)
    VALUES (CURRENT_TIMESTAMP, v_log_message,'INSERT');
END;*/


CREATE OR REPLACE TRIGGER BEFORE_INSERT_LOCATION   --use same functionality when a location is updated, but for some reason I am getting an error
BEFORE INSERT  ON LOCATIONS
FOR EACH ROW
DECLARE
    v_old_location_type VARCHAR2(20);
    location_type VARCHAR2(20);
BEGIN
	
            RAISE_APPLICATION_ERROR(-20001, 'Insertion stopped. Similar location found with type DUAL.'|| LOCATION_TYPE);
END;
/

CREATE OR REPLACE TRIGGER BEFORE_INSERT_LOCATION   --use same functionality when a location is updated, but for some reason I am getting an error
BEFORE INSERT  ON LOCATIONS
FOR EACH ROW
DECLARE
    v_old_location_type VARCHAR2(20);
    location_type VARCHAR2(20);
BEGIN
    -- Check if a similar location already exists in the table
    FOR existing_location IN (SELECT * FROM LOCATIONS
                            WHERE upper(STREET_ADDRESS) LIKE UPPER(:NEW.STREET_ADDRESS)
                                AND upper(CITY) LIKE UPPER(:NEW.CITY)
                                AND upper(COUNTRY) LIKE UPPER(:NEW.COUNTRY)
                                AND ORGANIZATION_ID = :NEW.ORGANIZATION_ID
                            )
    LOOP
        v_old_location_type := existing_location.TYPE;
				location_type := existing_location.TYPE;
        
        IF v_old_location_type = 'DUAL' OR :NEW.TYPE = 'DUAL' THEN
            location_type := 'DUAL';
        ELSIF v_old_location_type IS NOT NULL AND :NEW.TYPE IS NOT NULL AND v_old_location_type <> :NEW.TYPE THEN
					location_type :='DUAL';
        ELSIF v_old_location_type IS NULL or v_old_location_type=:NEW.TYPE THEN
				    location_type := :NEW.TYPE;
					
				END IF;
            UPDATE LOCATIONS 
            --SET TYPE = LOCATION_TYPE
						SET TYPE=location_type
            WHERE LOCATION_ID=EXISTING_LOCATION.LOCATION_ID;
						
			  DBMS_OUTPUT.PUT_LINE('Insertion stopped. Similar location found with type DUAL.'  );
            RAISE_APPLICATION_ERROR(-20001, 'Insertion stopped. Similar location found with type DUAL.'|| LOCATION_TYPE);

    END LOOP;
END;
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
		 RAISE_APPLICATION_ERROR(-20001, 'deletion stopped. Organization has pending transactions.');
	 end if;*/
	
	IF COUNTER=0 THEN
	INSERT INTO ORGANIZATION_BACKUP(NAME,URL,TYPE) VALUES (:OLD.NAME, :OLD.URL,:OLD.TYPE);
	ELSE
	UPDATE ORGANIZATION_BACKUP SET DELETE_TIME=CURRENT_TIMESTAMP;
	END IF;
	 v_log_message := :OLD.TYPE ||' ' || :OLD.NAME || ' DELETED';

    -- Insert data into the LOGS table
    INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE)
    VALUES (CURRENT_TIMESTAMP, v_log_message,'DELETE');
	
END;
/

