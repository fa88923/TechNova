
CREATE OR REPLACE FUNCTION INSERT_PRODUCT_TRANSACTIONS(
    type VARCHAR2,
    counter_party_id NUMBER,
    p_type VARCHAR2
) RETURN NUMBER IS
    v_organization_id NUMBER;
BEGIN

    IF IS_VALID_ORGANIZATION_INSERT(p_name) THEN
        SELECT ORGANIZATION_ID_SEQ.NEXTVAL INTO v_organization_id FROM DUAL;

        INSERT INTO ORGANIZATIONS (
            ORGANIZATION_ID,
            NAME,
            URL,
            TYPE
        ) VALUES (
            v_organization_id,
            p_name,
            p_url,
            UPPER(p_type)
        );
				
        RETURN v_organization_id;
    ELSE
						RAISE_APPLICATION_ERROR(-20001, 'Organization already exists');
    END IF;
END ;
/