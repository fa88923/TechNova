create or replace FUNCTION IS_VALID_ORGANIZATION_INSERT(O_NAME IN VARCHAR2)
return BOOLEAN IS
	COUNTER NUMBER;
BEGIN
	SELECT COUNT(*) INTO COUNTER FROM ORGANIZATIONS O WHERE UPPER(O.NAME) = UPPER(O_NAME);
	IF COUNTER = 0 THEN
		RETURN TRUE;
	ELSE 
		RETURN FALSE;
	END IF;
END;
/


create or replace FUNCTION IS_VALID_PAYMENTINFO_INSERT(i_BANK_NAME IN VARCHAR2, i_ACCOUNT_NUMBER IN VARCHAR2)
return BOOLEAN IS
	COUNTER NUMBER;
BEGIN
	SELECT COUNT(*) INTO COUNTER FROM PAYMENT_INFO P WHERE UPPER(P.BANK_NAME) =UPPER( i_BANK_NAME) AND P.ACCOUNT_NUMBER=i_ACCOUNT_NUMBER;
	IF COUNTER = 0 THEN
		RETURN TRUE;
	ELSE 
		RETURN FALSE;
	END IF;
END;

/


CREATE OR REPLACE FUNCTION INSERT_ORGANIZATION(
    p_name VARCHAR2,
    p_url VARCHAR2,
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

CREATE OR REPLACE FUNCTION INSERT_BRANCH(
    p_name VARCHAR2,
    p_url VARCHAR2,
    p_manager VARCHAR2,
    p_square_footage NUMBER,
    p_avg_shipping_duration NUMBER
) RETURN NUMBER IS
    v_branch_id NUMBER;
BEGIN
    -- Insert organization data and get the organization ID
    v_branch_id := INSERT_ORGANIZATION(p_name, p_url, 'BRANCH');

    -- Insert branch-specific data into the BRANCHES table
    INSERT INTO BRANCHES (
        BRANCH_ID,
        MANAGER,
        SQUARE_FOOTAGE,
        AVG_SHIPPING_DURATION
    ) VALUES (
        v_branch_id,
        p_manager,
        p_square_footage,
        p_avg_shipping_duration
    );

    -- Return the ID of the created branch
    RETURN v_branch_id;
END INSERT_BRANCH;
/

CREATE OR REPLACE FUNCTION INSERT_SUPPLIER (
    p_name VARCHAR2,
    p_url VARCHAR2,
    p_avg_shipping_duration NUMBER
) RETURN NUMBER IS
    v_supplier_id NUMBER;
BEGIN
    -- Insert organization data and get the organization ID
    v_supplier_id := INSERT_ORGANIZATION(p_name, p_url, 'SUPPLIER');

    -- Insert branch-specific data into the BRANCHES table
    INSERT INTO SUPPLIERS (
        SUPPLIER_ID,
        AVG_DELIVERY_TIME
    ) VALUES (
        v_supplier_id,
        p_avg_shipping_duration
    );

    -- Return the ID of the created branch
    RETURN v_supplier_id;
END;
/



CREATE OR REPLACE FUNCTION INSERT_TRANSPORT_COMPANY(
    p_name VARCHAR2,
    p_url VARCHAR2,
    p_type VARCHAR2,
    p_capacity NUMBER
) RETURN NUMBER IS
    v_company_id NUMBER;
BEGIN
    -- Insert organization data and get the organization ID
    v_company_id := INSERT_ORGANIZATION(p_name, p_url, p_type);

    -- Insert transport company-specific data into the TRANSPORT_COMPANIES table
    INSERT INTO TRANSPORT_COMPANIES (
        COMPANY_ID,
        CAPACITY
    ) VALUES (
        v_company_id,
        p_capacity
    );

    -- Return the ID of the created transport company
    RETURN v_company_id;
END INSERT_TRANSPORT_COMPANY;
/
