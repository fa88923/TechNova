--FINANCIAL_TRANSACTIONS

--for client order 1
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (1, 'CLIENT_ORDER_PAYMENT', 1, 'Credit Card', 17, 1, 'COMPLETED', 'TAKA', 327500);
--SHIIPPING CLIENT ORDER 1
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (2, 'SHIPPING_PAYMENT', 1, 'Credit Card', 1, 9, 'COMPLETED', 'TAKA', 1500);


--for client order 2
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (3, 'CLIENT_ORDER_PAYMENT', 2, 'Credit Card', 18, 1, 'COMPLETED', 'TAKA', 480000);
--SHIIPPING CLIENT ORDER 2
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (4, 'SHIPPING_PAYMENT', 2, 'Credit Card', 1, 9, 'COMPLETED', 'TAKA', 1500);


--for client order 3
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (5, 'CLIENT_ORDER_PAYMENT', 3, 'Credit Card', 19, 1, 'PENDING', 'TAKA', 1182500);
--SHIIPPING CLIENT ORDER 3
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (6, 'SHIPPING_PAYMENT', 3, 'Credit Card', 1, 9, 'COMPLETED', 'TAKA', 1500);

--for client order 4
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (7, 'CLIENT_ORDER_PAYMENT', 4, 'Credit Card', 21, 1, 'PENDING', 'TAKA', 70000);
--SHIIPPING CLIENT ORDER 4
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (8, 'SHIPPING_PAYMENT', 4, 'Credit Card', 1, 9, 'COMPLETED', 'TAKA', 1500);

--for client order 5
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (9, 'CLIENT_ORDER_PAYMENT', 5, 'Credit Card', 28, 1, 'COMPLETED', 'TAKA', 1186500);
--SHIIPPING CLIENT ORDER 5
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (10, 'SHIPPING_PAYMENT', 5, 'Credit Card', 1, 9, 'COMPLETED', 'TAKA', 1500);




----------------------------------------------------------------------------


--PO 1
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (11, 'PURCHASE_ORDER_PAYMENT', 6, 'Credit Card', 1, 2, 'COMPLETED', 'TAKA', 1870000);
--PO 1
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (12, 'SHIPPING_PAYMENT', 6, 'Credit Card', 1, 10, 'COMPLETED', 'TAKA', 1500);

--PO 2
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (13, 'PURCHASE_ORDER_PAYMENT', 7, 'Credit Card', 1, 3, 'COMPLETED', 'TAKA', 1385000);
--PO 2
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (14, 'SHIPPING_PAYMENT', 7, 'Credit Card', 1, 10, 'COMPLETED', 'TAKA', 1500);


--PO 3
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (15, 'PURCHASE_ORDER_PAYMENT', 8, 'Credit Card', 1, 4, 'COMPLETED', 'TAKA', 1200000);
--PO 3
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (16, 'SHIPPING_PAYMENT', 8, 'Credit Card', 1, 10, 'COMPLETED', 'TAKA', 2500);

--PO 4
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (17, 'PURCHASE_ORDER_PAYMENT', 9, 'Credit Card', 1, 5, 'PENDING', 'TAKA', 1140000);
--PO 4
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (18, 'SHIPPING_PAYMENT', 9, 'Credit Card', 1, 10, 'PENDING', 'TAKA', 2500);


--PO 5
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (19, 'PURCHASE_ORDER_PAYMENT', 10, 'Credit Card', 1, 6, 'PENDING', 'TAKA', 1200000);
--PO 5
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (20, 'SHIPPING_PAYMENT', 10, 'Credit Card', 1, 10, 'PENDING', 'TAKA', 2500);


----------------------------------------
--SR-1 P1
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (21, 'SHIPPING_PAYMENT', 11, 'Credit Card', 1, 11, 'COMPLETED', 'TAKA', 1500);
--SR-1 P2
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (22, 'SHIPPING_PAYMENT', 12, 'Credit Card', 1, 11, 'COMPLETED', 'TAKA', 1500);


----------
--SR-2 P1
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (23, 'SHIPPING_PAYMENT', 13, 'Credit Card', 1, 11, 'COMPLETED', 'TAKA', 1500);
--SR-2 P2
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (24, 'SHIPPING_PAYMENT', 14, 'Credit Card', 1, 11, 'COMPLETED', 'TAKA', 1500);

------------
--SR-3 P1
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (25, 'SHIPPING_PAYMENT', 15, 'Credit Card', 1, 11, 'COMPLETED', 'TAKA', 1500);

------------
--SR-4 P1
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (26, 'SHIPPING_PAYMENT', 16, 'Credit Card', 1, 11, 'COMPLETED', 'TAKA', 1500);
--SR-4 P2
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (27, 'SHIPPING_PAYMENT', 17, 'Credit Card', 1, 11, 'COMPLETED', 'TAKA', 1500);


------------
--SR-5 P1
INSERT INTO FINANCIAL_TRANSACTIONS (FINANCIAL_TRANSACTION_ID, TYPE, PRODUCT_TRANSACTION_ID, METHOD, FROM_ACCOUNT, TO_ACCOUNT, STATUS, CURRENCY, AMOUNT)
VALUES (28, 'SHIPPING_PAYMENT', 18, 'Credit Card', 1, 11, 'PENDING', 'TAKA', 1500);























































