CREATE OR REPLACE PROCEDURE ADD_PAYMENT_INFO(
    p_owner_id NUMBER,
    p_account_number VARCHAR2,
    p_account_holder VARCHAR2,
    p_bank_name VARCHAR2,
    p_iban VARCHAR2
) IS
BEGIN
    IF IS_VALID_PAYMENTINFO_INSERT(p_bank_name, p_account_number) THEN
        INSERT INTO PAYMENT_INFO (
            ID,
            OWNER_ID,
            ACCOUNT_NUMBER,
            ACCOUNT_HOLDER,
            BANK_NAME,
            IBAN
        ) VALUES (
            PAYMENTINFO_ID_SEQ.NEXTVAL, 
            p_owner_id,
            p_account_number,
            p_account_holder,
            p_bank_name,
            p_iban
        );
    ELSE
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
		v_old_location_type VARCHAR2(20);
		location_type VARCHAR2(20);
BEGIN
    SELECT COUNT(*) INTO v_org_count
    FROM ORGANIZATIONS
    WHERE ORGANIZATION_ID = p_organization_id;

    IF v_org_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Organization does not exist.');
    END IF;
    IF UPPER(p_type) NOT IN ('ADDRESS', 'PICKUP', 'DUAL') THEN
		
        RAISE_APPLICATION_ERROR(-20002, 'Invalid type. Allowed values are ADDRESS, PICKUP, DUAL.');
    END IF;
		
		 FOR existing_location IN (SELECT * FROM LOCATIONS
                            WHERE upper(STREET_ADDRESS) LIKE UPPER(p_street_address)
                                AND upper(CITY) LIKE UPPER(P_CITY)
                                AND upper(COUNTRY) LIKE UPPER(P_COUNTRY)
                                AND ORGANIZATION_ID = P_ORGANIZATION_ID
                            )
    LOOP
        v_old_location_type := existing_location.TYPE;
				location_type := existing_location.TYPE;
        
        IF v_old_location_type = 'DUAL' OR P_TYPE = 'DUAL' THEN
            location_type := 'DUAL';
        ELSIF v_old_location_type IS NOT NULL AND P_TYPE IS NOT NULL AND v_old_location_type <> P_TYPE THEN
					location_type :='DUAL';
        ELSIF v_old_location_type IS NULL or v_old_location_type=P_TYPE THEN
				    location_type := P_TYPE;
					
				END IF;
            UPDATE LOCATIONS 
						SET TYPE=location_type
            WHERE LOCATION_ID=EXISTING_LOCATION.LOCATION_ID;
					 RETURN;

    END LOOP;

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
			dbms_output.put_line('contact '||v_count);
			dbms_output.put_line('contact '||p_value||'olgol');
			
			IF v_count = 0 AND P_VALUE<>'' THEN
				dbms_output.put_line('contact added successfully');
    END IF;

    -- If no existing contact, then add the contact
    IF v_count = 0 AND P_VALUE is not null THEN
        INSERT INTO CONTACTS (OWNER_ID, TYPE, VALUE)
        VALUES (p_organization_id, UPPER(p_type), p_value);
				dbms_output.put_line('contact added successfully');
		ELSE
		dbms_output.put_line('contact added sfailed');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Handle exceptions or log errors as per your requirements
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END add_contact;
/

CREATE OR REPLACE PROCEDURE UPDATE_ORGANIZATION(
    p_id number,
    p_name VARCHAR2,
    p_url VARCHAR2
)  IS
		COUNTER NUMBER;
		p_type varchar2(20);
BEGIN

    SELECT COUNT(*) INTO COUNTER FROM ORGANIZATIONS O WHERE UPPER(P_NAME)=UPPER(O.NAME) AND O.ORGANIZATION_ID<>P_ID; 

    IF COUNTER=0 THEN

        UPDATE ORGANIZATIONS SET NAME=P_NAME, URL=P_URL WHERE ORGANIZATION_ID=P_ID;
				
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Organization  with same name already exists');
    END IF;
END ;
/
CREATE OR REPLACE PROCEDURE UPDATE_BRANCH(
    P_ID NUMBER,
    p_name VARCHAR2,
    p_url VARCHAR2,
    p_manager VARCHAR2,
    p_square_footage NUMBER,
    p_avg_shipping_duration NUMBER
)  IS
   
BEGIN
    -- Insert organization data and get the organization ID
    UPDATE_ORGANIZATION(P_ID,p_name, p_url);

    -- Insert branch-specific data into the BRANCHES table
    UPDATE BRANCHES SET MANAGER=P_MANAGER,SQUARE_FOOTAGE=p_square_footage, AVG_SHIPPING_DURATION= p_avg_shipping_duration WHERE BRANCH_ID=P_ID;

END;
/

CREATE OR REPLACE PROCEDURE UPDATE_SUPPLIER(
    S_ID NUMBER,
    S_name VARCHAR2,
    S_url VARCHAR2,
		S_AVG_DELIVERY_TIME NUMBER
   
)  IS
   
BEGIN
    -- Insert organization data and get the organization ID
    UPDATE_ORGANIZATION(S_ID,S_name, S_url);

    -- Insert branch-specific data into the BRANCHES table
    UPDATE SUPPLIERS SET AVG_DELIVERY_TIME=S_AVG_DELIVERY_TIME WHERE SUPPLIER_ID=S_ID;

END;
/

CREATE OR REPLACE PROCEDURE UPDATE_TRANSPORT_COMPANY(
    T_ID NUMBER,
    T_name VARCHAR2,
    T_url VARCHAR2,
		T_CAPACITY NUMBER
   
)  IS
   
BEGIN
    -- Insert organization data and get the organization ID
    UPDATE_ORGANIZATION(T_ID,T_name, T_url);

    -- Insert branch-specific data into the BRANCHES table
    UPDATE TRANSPORT_COMPANIES SET CAPACITY=T_CAPACITY WHERE COMPANY_ID=T_ID;

END;
/

CREATE OR REPLACE PROCEDURE UPDATE_PAYMENT_INFO(
    p_owner_id NUMBER,
    p_account_number VARCHAR2,
    p_account_holder VARCHAR2,
    p_bank_name VARCHAR2,
    p_iban VARCHAR2
) IS
COUNTER NUMBER;
ACCOUNT_NUM NUMBER;
BEGIN
SELECT COUNT(*) INTO COUNTER FROM PAYMENT_INFO P WHERE UPPER(P.BANK_NAME) =UPPER( P_BANK_NAME) AND P.ACCOUNT_NUMBER=P_ACCOUNT_NUMBER AND P.OWNER_ID<>P_OWNER_ID;
    IF COUNTER=0 THEN
        -- Insert data into the PAYMENT_INFO table
				SELECT COUNT(*) INTO ACCOUNT_NUM FROM PAYMENT_INFO WHERE OWNER_ID=P_OWNER_ID;
				IF ACCOUNT_NUM=0 THEN
				ADD_PAYMENT_INFO(P_OWNER_ID,P_ACCOUNT_NUMBER,P_ACCOUNT_HOLDER,P_BANK_NAME,P_IBAN);
				ELSE
				UPDATE PAYMENT_INFO SET ACCOUNT_NUMBER=p_account_number,ACCOUNT_HOLDER= p_account_holder, BANK_NAME=p_bank_name,IBAN= p_iban WHERE OWNER_ID=P_OWNER_ID;
				END IF;
    ELSE
        -- Raise an error if the payment information already exists
        RAISE_APPLICATION_ERROR(-20001, 'DUPLICATE ACCOUNT ALREADY EXISTS');
    END IF;
END;
/

CREATE OR REPLACE PROCEDURE UPDATE_LOCATION(
    p_street_address VARCHAR2,
    p_postal_code VARCHAR2,
    p_city VARCHAR2,
    p_state_province VARCHAR2,
    p_country VARCHAR2,
    p_organization_id NUMBER,
    p_type VARCHAR2
) IS
    v_org_count NUMBER;
		v_old_location_type VARCHAR2(20);
		location_type VARCHAR2(20);
		P_location_id NUMBER;
BEGIN
    -- Check if the organization_id exists in the ORGANIZATIONS table
    SELECT COUNT(*) INTO v_org_count
    FROM ORGANIZATIONS
    WHERE ORGANIZATION_ID = p_organization_id;
		    IF v_org_count = 0 THEN
        -- Raise an exception if the organization does not exist
        RAISE_APPLICATION_ERROR(-20001, 'Organization does not exist.');
    END IF;
		
		
		SELECT LOCATION_ID INTO P_LOCATION_ID FROM LOCATIONS WHERE ORGANIZATION_ID=p_organization_id AND (TYPE=p_type or upper(type) like '%DUAL%')  ;
		
		IF P_LOCATION_ID IS NULL THEN
		INSERT_LOCATION(
    p_street_address,
    p_postal_code,
    p_city,
    p_state_province,
    p_country,
    p_organization_id,
    p_type
);
    RETURN;
		END IF; 


		
		FOR existing_location IN (SELECT * FROM LOCATIONS
                            WHERE upper(STREET_ADDRESS) LIKE UPPER(p_street_address)
                                AND upper(CITY) LIKE UPPER(P_CITY)
                                AND upper(COUNTRY) LIKE UPPER(P_COUNTRY)
                                AND ORGANIZATION_ID = P_ORGANIZATION_ID AND LOCATION_ID<>P_LOCATION_ID
                            )
    LOOP
        v_old_location_type := existing_location.TYPE;
				location_type := existing_location.TYPE;
        
        IF v_old_location_type = 'DUAL' OR P_TYPE = 'DUAL' THEN
            location_type := 'DUAL';
        ELSIF v_old_location_type IS NOT NULL AND P_TYPE IS NOT NULL AND v_old_location_type <> P_TYPE THEN
					location_type :='DUAL';
        ELSIF v_old_location_type IS NULL or v_old_location_type=P_TYPE THEN
				    location_type := P_TYPE;
					
				END IF;
            UPDATE LOCATIONS 
						SET TYPE=location_type
            WHERE LOCATION_ID=EXISTING_LOCATION.LOCATION_ID;
						DELETE FROM LOCATIONS WHERE LOCATION_ID=P_LOCATION_ID;
					 RETURN;
    END LOOP;
		
		
		
		 UPDATE LOCATIONS SET STREET_ADDRESS=p_street_address, POSTAL_CODE=p_postal_code, CITY=p_city, STATE_PROVINCE=p_state_province,COUNTRY= p_country WHERE location_id=p_location_id;
    

    -- No need to return a value in a procedure
EXCEPTION
    WHEN OTHERS THEN
        -- Handle exceptions (you may customize this part as needed)
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/

CREATE OR REPLACE PROCEDURE INSERT_FT(
    ft_type VARCHAR2,
    trans_id NUMBER,
    meth VARCHAR2,
    from_acc NUMBER,
    to_acc NUMBER,
		curr VARCHAR2,
		amnt NUMBER
) IS
BEGIN
        INSERT INTO FINANCIAL_TRANSACTIONS (
            FINANCIAL_TRANSACTION_ID,
            TYPE,
            PRODUCT_TRANSACTION_ID,
            METHOD,
            FROM_ACCOUNT,
            TO_ACCOUNT,
						STATUS,
						CURRENCY,
						AMOUNT
        ) VALUES (
            FTRANSACTION_ID_SEQ.NEXTVAL,
            UPPER(ft_type),
            trans_id,
						meth,
						from_acc,
						to_acc,
						UPPER('PENDING'),
						curr,
						amnt
        );
END;
/

CREATE OR REPLACE PROCEDURE INSERT_PURCHASE_TRANSACTION(
    trans_id NUMBER,
    meth VARCHAR2,
    to_acc NUMBER,
		curr VARCHAR2,
		amnt NUMBER
) IS
	 from_acc NUMBER;
BEGIN
				SELECT P.ID INTO from_acc
				FROM ORGANIZATIONS O JOIN PAYMENT_INFO P ON O.ORGANIZATION_ID=P.OWNER_ID
				WHERE O.TYPE='CENTRAL';
				
        INSERT_FT('PURCHASE_ORDER_PAYMENT', trans_id,meth,from_acc,to_acc,curr,amnt);
END;
/



--insert SHIPMENTS
CREATE OR REPLACE PROCEDURE INSERT_SHIPMENTS(
    tcompany_id NUMBER,
    trans_id NUMBER,
    dept_time VARCHAR2,
		dept_date VARCHAR2,
		vehicle_num VARCHAR2,
    currloc VARCHAR2,
		start_loc NUMBER,
		dest NUMBER,	
		amnt NUMBER
) IS
BEGIN
        INSERT INTO SHIPMENTS (
            SHIPMENT_ID,
            TRANSPORT_COMPANY_ID,
            PRODUCT_TRANSACTION_ID,
            DEPARTURE_TIME,
						DEPARTURE_DATE,
            VEHICLE_NO,
						CURRENT_LOCATION,
						START_LOCATION,
						DESTINATION,
						COST
        ) VALUES (
            SHIPMENT_ID_SEQ.NEXTVAL,
            tcompany_id,
            trans_id,
						dept_time,
						TO_DATE(dept_date, 'YYYY-MM-DD'),
						vehicle_num,
						currloc,
						start_loc,
						dest,
						amnt
        );
END;
/


--insert SHIPMENTS
CREATE OR REPLACE PROCEDURE INSERT_SHIPMENTS_SUPPLY(
    tcompany_id NUMBER,
    trans_id NUMBER,
    dept_time VARCHAR2,
		dept_date VARCHAR2,
		vehicle_num VARCHAR2,
    currloc VARCHAR2,
		branchid NUMBER
) IS
start_loc NUMBER;
		dest NUMBER;
		amnt NUMBER;
BEGIN
				SELECT L.LOCATION_ID INTO start_loc
				FROM ORGANIZATIONS O JOIN LOCATIONS L ON O.ORGANIZATION_ID=L.ORGANIZATION_ID
				WHERE O.TYPE='CENTRAL';
				
				SELECT L.LOCATION_ID INTO dest
				FROM LOCATIONS L 
				WHERE L.ORGANIZATION_ID=branchid;
				
				INSERT_SHIPMENTS(tcompany_id,trans_id, dept_time, dept_date, vehicle_num, currloc, start_loc,dest, 1500);
				UPDATE_STOCK(trans_id,'CONFIRMED_SUPPLY');
END;
/

-----------------------------------------

--insert SHIPMENTS
CREATE OR REPLACE PROCEDURE INSERT_SHIPMENTS_CLIENT(
    tcompany_id NUMBER,
    trans_id NUMBER,
    dept_time VARCHAR2,
		dept_date VARCHAR2,
		vehicle_num VARCHAR2,
    currloc VARCHAR2,
		clientid NUMBER
) IS
start_loc NUMBER;
		dest NUMBER;
		amnt NUMBER;
BEGIN
				SELECT L.LOCATION_ID INTO start_loc
				FROM ORGANIZATIONS O JOIN LOCATIONS L ON O.ORGANIZATION_ID=L.ORGANIZATION_ID
				WHERE O.TYPE='CENTRAL';
				
				SELECT L.LOCATION_ID INTO dest
				FROM LOCATIONS L 
				WHERE L.ORGANIZATION_ID=clientid;
				
				INSERT_SHIPMENTS(tcompany_id,trans_id, dept_time, dept_date, vehicle_num, currloc, start_loc,dest, 1500);
				UPDATE_STOCK(trans_id,'CLIENT_TRANSACTION');
END;
/
------------------------------------------------




---------------------------------------------------------------------
-- CREATE OR REPLACE TRIGGER BEFORE_DELETE_ORGANIZATION
-- BEFORE DELETE ON ORGANIZATIONS
-- FOR EACH ROW
-- DECLARE
-- 
-- COUNTER NUMBER;
-- PENDING_TRANSACTIONS NUMBER;
--  v_log_message VARCHAR2(255); 
--  
-- BEGIN
--   
-- 	SELECT COUNT(*) INTO COUNTER FROM ORGANIZATION_BACKUP WHERE NAME=:OLD.NAME;
-- 	SELECT COUNT(*) INTO PENDING_TRANSACTIONS FROM PRODUCT_TRANSACTIONS WHERE COUNTERPARTY_ID=:OLD.ORGANIZATION_ID AND UPPER(STATUS)='PENDING';
-- 	
-- 	IF PENDING_TRANSACTIONS<>0 THEN
-- 	INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE)
--     VALUES (CURRENT_TIMESTAMP,:OLD.TYPE ||' ' ||:OLD.ORGANIZATION_ID||' '|| :OLD.NAME || ' DELETE FAILED','DELETE');
-- 		 RAISE_APPLICATION_ERROR(-20001, 'deletion stopped. Organization has pending transactions.');
-- 	 end if;
-- 	
-- 	IF COUNTER=0 THEN
-- 	INSERT INTO ORGANIZATION_BACKUP(NAME,URL,TYPE) VALUES (:OLD.NAME, :OLD.URL,:OLD.TYPE);
-- 	ELSE
-- 	UPDATE ORGANIZATION_BACKUP SET DELETE_TIME=CURRENT_TIMESTAMP;
-- 	END IF;
-- 	 v_log_message := :OLD.TYPE ||' ' || :OLD.NAME || ' DELETED';
-- 
--     -- Insert data into the LOGS table
--     INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE)
--     VALUES (CURRENT_TIMESTAMP, v_log_message,'DELETE');
-- 	
-- END;
-- /

--procedure 
CREATE OR REPLACE PROCEDURE UPDATE_FT(
   p_transaction_id NUMBER,
	 ft_type VARCHAR2
) IS
	arrival VARCHAR2(20);
BEGIN
        UPDATE FINANCIAL_TRANSACTIONS
				SET STATUS= 'COMPLETED'
				WHERE PRODUCT_TRANSACTION_ID=p_transaction_id AND TYPE=ft_type;
				
				IF ft_type='PURCHASE_ORDER_PAYMENT' THEN
					SELECT ARRIVAL_TIME INTO arrival
					FROM SHIPMENTS
					WHERE PRODUCT_TRANSACTION_ID=p_transaction_id;
					
					IF ARRIVAL IS NOT NULL THEN
					UPDATE PRODUCT_TRANSACTIONS
					SET STATUS='COMPLETED'
					WHERE TRANSACTION_ID=p_transaction_id;
					END IF;
				END IF;
				
END;
/


CREATE OR REPLACE PROCEDURE UPDATE_STOCK(
   p_transaction_id NUMBER,
	 t_type VARCHAR2
) IS
BEGIN
        IF t_type= 'PURCHASE_TRANSACTION' THEN
					FOR R IN (SELECT *  FROM ORDER_PRODUCTS WHERE ORDER_ID=p_transaction_id)
					LOOP
						UPDATE PRODUCTS 
						SET CENTRAL_STOCK=CENTRAL_STOCK+R.QUANTITY
						WHERE PRODUCT_ID= R.PRODUCT_ID;
					END LOOP;					
				END IF;
				
				IF t_type= 'CLIENT_TRANSACTION' THEN
					FOR R IN (SELECT *  FROM ORDER_PRODUCTS WHERE ORDER_ID=p_transaction_id)
					LOOP
						UPDATE PRODUCTS 
						SET CENTRAL_STOCK=CENTRAL_STOCK-R.QUANTITY
						WHERE PRODUCT_ID=R.PRODUCT_ID;
					END LOOP;				
				END IF;
				
				IF t_type= 'CONFIRMED_SUPPLY' THEN
					FOR R IN (SELECT *  FROM CONFIRMED_SUPPLY_PRODUCTS WHERE SUPPLY_ID=p_transaction_id)
					LOOP
						UPDATE PRODUCTS 
						SET CENTRAL_STOCK=CENTRAL_STOCK-R.QUANTITY
						WHERE PRODUCT_ID=R.PRODUCT_ID;
					END LOOP;				
				END IF;
				
END;
/


CREATE OR REPLACE PROCEDURE UPDATE_SHIPMENT(
   p_transaction_id NUMBER,
	 t_type VARCHAR2,
	 arr_time VARCHAR2,
	 arr_date VARCHAR2
) IS
	stat VARCHAR2(20);
BEGIN
        UPDATE SHIPMENTS
				SET ARRIVAL_TIME=UPPER(arr_time), ARRIVAL_DATE= TO_DATE(arr_date,'YYYY-MM-DD' )
				WHERE PRODUCT_TRANSACTION_ID=p_transaction_id;
				
				IF t_type='PURCHASE_TRANSACTION' THEN
				
					UPDATE_STOCK(p_transaction_id,t_type);
					
					SELECT STATUS INTO stat
					FROM FINANCIAL_TRANSACTIONS
					WHERE PRODUCT_TRANSACTION_ID=p_transaction_id AND TYPE='PURCHASE_ORDER_PAYMENT';
					
					IF stat='COMPLETED' THEN
					UPDATE PRODUCT_TRANSACTIONS
					SET STATUS='COMPLETED'
					WHERE TRANSACTION_ID=p_transaction_id;
					END IF;
				END IF;
				
				IF t_type='CONFIRMED_SUPPLY' THEN
				UPDATE PRODUCT_TRANSACTIONS
				SET STATUS='COMPLETED'
				WHERE TRANSACTION_ID=p_transaction_id;
				UPDATE_SUPPLY_REQUEST(p_transaction_id);
				END IF;
				
				----------
				IF t_type='CLIENT_TRANSACTION' THEN
				
					UPDATE_STOCK(p_transaction_id,t_type);-------------------------------------------
					
					SELECT STATUS INTO stat
					FROM FINANCIAL_TRANSACTIONS
					WHERE PRODUCT_TRANSACTION_ID=p_transaction_id AND TYPE='CLIENT_ORDER_PAYMENT';
					
					IF stat='COMPLETED' THEN
					UPDATE PRODUCT_TRANSACTIONS
					SET STATUS='COMPLETED'
					WHERE TRANSACTION_ID=p_transaction_id;
					END IF;
				END IF;
			
END;
/



CREATE OR REPLACE PROCEDURE UPDATE_SUPPLY_REQUEST(
    p_transaction_id NUMBER
) IS
	left_quantity NUMBER;
	reqid NUMBER;
BEGIN

				SELECT CS.REQUEST_ID INTO reqid
				FROM CONFIRMED_SUPPLY CS
				WHERE CS.SUPPLY_ID= p_transaction_id;

        SELECT SUM( REQ.QUANTITY_REQUESTED-NVL(CONFIRM.QUANTITY_DELIVERED, 0) ) INTO left_quantity
				FROM 
				(
				SELECT SRP.PRODUCT_ID,SRP.QUANTITY AS QUANTITY_REQUESTED
				FROM SUPPLY_REQUEST_PRODUCTS SRP
				WHERE SRP.REQUEST_ID= reqid
				) REQ LEFT OUTER JOIN
				(
				SELECT CSP.PRODUCT_ID, SUM(CSP.QUANTITY) AS QUANTITY_DELIVERED
				FROM CONFIRMED_SUPPLY_PRODUCTS CSP JOIN CONFIRMED_SUPPLY CS ON CS.SUPPLY_ID=CSP.SUPPLY_ID
				WHERE CS.REQUEST_ID= reqid
				GROUP BY CSP.PRODUCT_ID
				) CONFIRM ON REQ.PRODUCT_ID=CONFIRM.PRODUCT_ID  
				LEFT OUTER JOIN PRODUCTS P ON REQ.PRODUCT_ID=P.PRODUCT_ID;
				
				IF left_quantity<=0  THEN
				UPDATE SUPPLY_REQUESTS
				SET STATUS='COMPLETED'
				WHERE REQUEST_ID=reqid;
				END IF;
			
END;
/
































































