-------to show purchase orders

SELECT DISTINCT PT.TRANSACTION_ID,O.NAME, PT.STATUS, FT.STATUS AS PAYMENT_STATUS, S2.STATUS AS SHIPMENT_STATUS
FROM PRODUCT_TRANSACTIONS PT JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=PT.COUNTERPARTY_ID
JOIN FINANCIAL_TRANSACTIONS FT ON FT.PRODUCT_TRANSACTION_ID=PT.TRANSACTION_ID
JOIN (
SELECT S.SHIPMENT_ID, S.PRODUCT_TRANSACTION_ID,
CASE 
		WHEN S.ARRIVAL_DATE IS NULL THEN 'PENDING'
		ELSE 'COMPLETED'
END STATUS
FROM SHIPMENTS S
) S2 ON S2.PRODUCT_TRANSACTION_ID=PT.TRANSACTION_ID
WHERE PT.TYPE='PURCHASE_TRANSACTION'
ORDER BY PT.TRANSACTION_ID DESC

--deatils page
SELECT DISTINCT PT.TRANSACTION_ID,PT.PICKUP_DATE,O.NAME, PT.STATUS, S2.STATUS AS SHIPMENT_STATUS
FROM PRODUCT_TRANSACTIONS PT JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=PT.COUNTERPARTY_ID
WHERE PT.TRANSACTION_ID=6

--FINANCIAL DETAILS OF A PO
SELECT FT.METHOD, PI.ACCOUNT_NUMBER,PI.BANK_NAME, FT.AMOUNT,FT.STATUS
FROM FINANCIAL_TRANSACTIONS FT JOIN PAYMENT_INFO PI ON FT.TO_ACCOUNT=PI.OWNER_ID
WHERE FT.PRODUCT_TRANSACTION_ID=6 AND TYPE= UPPER('PURCHASE_ORDER_PAYMENT')

--SHIPMENT DETAILS OF A PO
SELECT O.NAME, L1.STREET_ADDRESS||', '||L1.CITY||'-'||L1.POSTAL_CODE||','||L1.COUNTRY AS PICK_UP_FROM, S.DEPARTURE_DATE,S.DEPARTURE_TIME,S.VEHICLE_NO,S.CURRENT_LOCATION,S.ARRIVAL_DATE,S.ARRIVAL_TIME,
CASE 
		WHEN S.ARRIVAL_DATE IS NULL THEN 'PENDING'
		ELSE 'COMPLETED'
END STATUS
FROM SHIPMENTS S JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=S.TRANSPORT_COMPANY_ID
		JOIN LOCATIONS L1 ON S.START_LOCATION=L1.LOCATION_ID
WHERE S.PRODUCT_TRANSACTION_ID=6


--purchase list of a po
SELECT P.PRODUCT_NAME,OP.PRICE/OP.QUANTITY AS PRICE_EACH,OP.QUANTITY
FROM ORDER_PRODUCTS OP JOIN PRODUCTS P ON P.PRODUCT_ID=OP.PRODUCT_ID
WHERE OP.ORDER_ID=6
















