
CREATE OR REPLACE FUNCTION INSERT_PRODUCT_TRANSACTIONS(
    trans_type VARCHAR2,
    cparty_id NUMBER,
		pickupdate VARCHAR2
) RETURN NUMBER IS
   v_transaction_id NUMBER;
BEGIN

        SELECT PTRANSACTION_ID_SEQ.NEXTVAL INTO v_transaction_id FROM DUAL;

        INSERT INTO PRODUCT_TRANSACTIONS (
            TRANSACTION_ID,
            TYPE,
            COUNTERPARTY_ID,
            PICKUP_DATE,
						STATUS
        ) VALUES (
            v_transaction_id,
            UPPER(trans_type),
            cparty_id,
-- 						TO_DATE(pickupdate, 'DD-MM-RRRR'),
						TO_DATE(pickupdate, 'YYYY-MM-DD'),
            UPPER('PENDING')
        );
				
        RETURN v_transaction_id;
END ;
/
-- DECLARE transactionId NUMBER;
-- BEGIN transactionId := INSERT_PRODUCT_TRANSACTIONS('CONFIRMED_SUPPLY', 12, '5/3/12' ); 
-- DBMS_OUTPUT.PUT_LINE(transactionId);
-- END;
-- /

CREATE OR REPLACE FUNCTION CLIENT_ORDER_STATE(
    p_transaction_id NUMBER
) RETURN NUMBER IS
   state NUMBER;
BEGIN
			SELECT COUNT(SHIPMENT_ID) INTO state
			FROM SHIPMENTS
			WHERE PRODUCT_TRANSACTION_ID=p_transaction_id;

      RETURN state;
END ;
/