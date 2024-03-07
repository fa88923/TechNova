
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
						TO_DATE(pickupdate, 'DD-MON-RR'),
            UPPER('PENDING')
        );
				
        RETURN v_transaction_id;
END ;
/

