CREATE OR REPLACE TRIGGER ORG_INSERT_TRIGGER
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
END;

CREATE OR REPLACE TRIGGER BEFORE_INSERT_LOCATION
BEFORE INSERT ON LOCATIONS
FOR EACH ROW
DECLARE
    v_old_location_type VARCHAR2(20);
    location_type VARCHAR2(20);
BEGIN
    -- Check if a similar location already exists in the table
    FOR existing_location IN (SELECT * FROM LOCATIONS
                              WHERE upper(STREET_ADDRESS) LIKE :NEW.STREET_ADDRESS
                                AND upper(CITY) LIKE :NEW.CITY
                                AND upper(COUNTRY) LIKE :NEW.COUNTRY
                                AND ORGANIZATION_ID = :NEW.ORGANIZATION_ID
                              )
    LOOP
        v_old_location_type := existing_location.TYPE;

        IF v_old_location_type = 'DUAL' OR :NEW.TYPE = 'DUAL' THEN
            location_type := 'DUAL';
        ELSIF v_old_location_type IS NOT NULL AND :NEW.TYPE IS NOT NULL AND v_old_location_type <> :NEW.TYPE THEN
					  location_type :='DUAL';
        ELSIF v_old_location_type IS NULL or v_old_location_type=:NEW.TYPE THEN
					  location_type := :NEW.TYPE;
					
				END IF;
            UPDATE LOCATIONS
            SET TYPE = location_type
            WHERE upper(STREET_ADDRESS) LIKE :NEW.STREET_ADDRESS
              AND upper(CITY) LIKE :NEW.CITY
              AND upper(COUNTRY) LIKE :NEW.COUNTRY
              AND ORGANIZATION_ID = :NEW.ORGANIZATION_ID;
			  DBMS_OUTPUT.PUT_LINE('Insertion stopped. Similar location found with type DUAL.');
            RAISE_APPLICATION_ERROR(-20001, 'Insertion stopped. Similar location found with type DUAL.');

        EXIT;
    END LOOP;
END;
/
