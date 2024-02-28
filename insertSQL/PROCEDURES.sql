CREATE OR REPLACE PROCEDURE ADD_PAYMENT_INFO(
    p_owner_id NUMBER,
    p_account_number VARCHAR2,
    p_account_holder VARCHAR2,
    p_bank_name VARCHAR2,
    p_iban VARCHAR2
) IS
BEGIN
    -- Check if the payment information already exists
    IF IS_VALID_PAYMENTINFO_INSERT(p_bank_name, p_account_number) THEN
        -- Insert data into the PAYMENT_INFO table
        INSERT INTO PAYMENT_INFO (
            ID,
            OWNER_ID,
            ACCOUNT_NUMBER,
            ACCOUNT_HOLDER,
            BANK_NAME,
            IBAN
        ) VALUES (
            PAYMENTINFO_ID_SEQ.NEXTVAL, -- Assuming you have a sequence named PAYMENT_INFO_SEQ
            p_owner_id,
            p_account_number,
            p_account_holder,
            p_bank_name,
            p_iban
        );
    ELSE
        -- Raise an error if the payment information already exists
        RAISE_APPLICATION_ERROR(-20001, 'DUPLICATE ACCOUNT ALREADY EXISTS');
    END IF;
END;
/

CREATE OR REPLACE PROCEDURE INSERT_LOCATION(
    p_street_address VARCHAR2,
    p_postal_code VARCHAR2,
    p_city VARCHAR2,
    p_state_province VARCHAR2,
    p_country VARCHAR2,
    p_organization_id NUMBER,
    p_type VARCHAR2
) IS
    v_location_id NUMBER;
    v_org_count NUMBER;
BEGIN
    -- Check if the organization_id exists in the ORGANIZATIONS table
    SELECT COUNT(*) INTO v_org_count
    FROM ORGANIZATIONS
    WHERE ORGANIZATION_ID = p_organization_id;

    IF v_org_count = 0 THEN
        -- Raise an exception if the organization does not exist
        RAISE_APPLICATION_ERROR(-20001, 'Organization does not exist.');
    END IF;

    -- Check if the provided type is one of the allowed values
    IF UPPER(p_type) NOT IN ('ADDRESS', 'PICKUP', 'DUAL') THEN
        -- Raise an exception if the type is not allowed
        RAISE_APPLICATION_ERROR(-20002, 'Invalid type. Allowed values are ADDRESS, PICKUP, DUAL.');
    END IF;

    -- Get the next LOCATION_ID from the sequence
    SELECT LOCATION_ID_SEQ.NEXTVAL INTO v_location_id FROM DUAL;

    -- Insert into LOCATIONS table
    INSERT INTO LOCATIONS (
        LOCATION_ID,
        STREET_ADDRESS,
        POSTAL_CODE,
        CITY,
        STATE_PROVINCE,
        COUNTRY,
        ORGANIZATION_ID,
        TYPE
    ) VALUES (
        v_location_id,
        p_street_address,
        p_postal_code,
        p_city,
        p_state_province,
        p_country,
        p_organization_id,
        UPPER(p_type)
    );

    -- No need to return a value in a procedure
EXCEPTION
    WHEN OTHERS THEN
        -- Handle exceptions (you may customize this part as needed)
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE add_contact(
    p_organization_id NUMBER,
    p_type VARCHAR2,
    p_value VARCHAR2
) AS
    v_count NUMBER;
BEGIN
    -- Check if contact with the same values exists
    SELECT COUNT(*)
    INTO v_count
    FROM CONTACTS
    WHERE OWNER_ID = p_organization_id
      AND upper(TYPE) = UPPER(p_type)
      AND VALUE = p_value;

    -- If no existing contact, then add the contact
    IF v_count = 0 THEN
        INSERT INTO CONTACTS (OWNER_ID, TYPE, VALUE)
        VALUES (p_organization_id, UPPER(p_type), p_value);
    ELSE
        -- If contact already exists, raise an error
        RAISE_APPLICATION_ERROR(-20001, 'Contact with the same values already exists.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Handle exceptions or log errors as per your requirements
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END add_contact;
/

