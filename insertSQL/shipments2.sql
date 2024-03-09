--shipments

--FOR CLIENT ORDER 1
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, ARRIVAL_TIME, ARRIVAL_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (1, 9, 1, '12:00 PM', TO_DATE('17-FEB-23', 'DD-MON-RR'), '4:00 PM', TO_DATE('20-FEB-23', 'DD-MON-RR'), 'ABC123', 'Warehouse A', 1, 1, 1500);


--FOR CLIENT ORDER 2
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, ARRIVAL_TIME, ARRIVAL_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (2, 9, 2, '12:00 PM', TO_DATE('17-MAR-22', 'DD-MON-RR'), '4:00 PM', TO_DATE('20-MAR-22', 'DD-MON-RR'), 'ABCFD23', 'Warehouse A', 1, 19, 1500);

--FOR CLIENT ORDER 3
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (3, 9, 3, '12:00 PM', TO_DATE('5-MAR-24', 'DD-MON-RR'),  'ABCFD23', 'Warehouse A', 1, 20, 1500);

--FOR CLIENT ORDER 4
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (4, 9, 4, '12:00 PM', TO_DATE('7-MAR-24', 'DD-MON-RR'),  'ABCFD23', 'Warehouse A', 1, 22, 1500);


--FOR CLIENT ORDER 5
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, ARRIVAL_TIME, ARRIVAL_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (5, 9, 5, '12:00 PM', TO_DATE('7-JAN-23', 'DD-MON-RR'), '4:00 PM', TO_DATE('20-JAN-23', 'DD-MON-RR'), 'ABCFD23', 'Warehouse A', 1, 29, 1500);

-------NEW ABONY 9 MAR
DELETE FROM SHIPMENTS WHERE SHIPMENT_ID=2
DELETE FROM SHIPMENTS WHERE SHIPMENT_ID=3
DELETE FROM SHIPMENTS WHERE SHIPMENT_ID=4


----------------------------------------------------------------------------

--FOR PO 1
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, ARRIVAL_TIME, ARRIVAL_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (6, 10, 6, '12:00 PM', TO_DATE('7-JAN-23', 'DD-MON-RR'), '4:00 PM', TO_DATE('20-JAN-23', 'DD-MON-RR'), 'ABCFD23', 'Warehouse A', 2, 1, 1500);

--FOR PO 2
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, ARRIVAL_TIME, ARRIVAL_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (7, 10, 7, '12:00 PM', TO_DATE('7-JAN-23', 'DD-MON-RR'), '4:00 PM', TO_DATE('20-JAN-23', 'DD-MON-RR'), 'ABCFD23', 'Warehouse A', 3, 1, 1500);

--FOR PO 3
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, ARRIVAL_TIME, ARRIVAL_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (8, 10, 8, '12:00 PM', TO_DATE('7-MAY-23', 'DD-MON-RR'), '4:00 PM', TO_DATE('20-MAY-23', 'DD-MON-RR'), 'ABCFD23', 'Warehouse A', 4, 1, 2500);

--FOR PO 4
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (9, 10, 9, '12:00 PM', TO_DATE('1-MAR-24', 'DD-MON-RR'),'ABCFD23', 'https://maps.app.goo.gl/u2xsMBjzKuscQXft7', 5, 1, 2500);

--FOR PO 5
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (10, 10, 10, '12:00 PM', TO_DATE('4-MAR-24', 'DD-MON-RR'),'ABCFD23', 'https://maps.app.goo.gl/u2xsMBjzKuscQXft7', 5, 1, 2500);


---------------------------------------------------------------------------------------------------------------
--SR-1 P1
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, ARRIVAL_TIME, ARRIVAL_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (11, 11, 11, '12:00 PM', TO_DATE('1-MAR-23', 'DD-MON-RR'), '4:00 PM', TO_DATE('5-MAR-23', 'DD-MON-RR'), 'ABCFD23', 'Warehouse A', 1, 13, 1500);
--SR-1 P2
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, ARRIVAL_TIME, ARRIVAL_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (12, 11, 12, '12:00 PM', TO_DATE('10-MAR-23', 'DD-MON-RR'), '4:00 PM', TO_DATE('15-MAR-23', 'DD-MON-RR'), 'ABCFD23', 'Warehouse A', 1, 13, 1500);
--------------------
--SR-2 P1
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, ARRIVAL_TIME, ARRIVAL_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (13, 11, 13, '12:00 PM', TO_DATE('1-MAR-22', 'DD-MON-RR'), '4:00 PM', TO_DATE('5-MAR-22', 'DD-MON-RR'), 'ABCFD23', 'Warehouse A', 1, 14, 1500);
--SR-2 P2
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, ARRIVAL_TIME, ARRIVAL_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (14, 11, 14, '12:00 PM', TO_DATE('10-MAR-22', 'DD-MON-RR'), '4:00 PM', TO_DATE('15-MAR-22', 'DD-MON-RR'), 'ABCFD23', 'Warehouse A', 1, 14, 1500);

-------------
--SR-3 P1
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, ARRIVAL_TIME, ARRIVAL_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (15, 11, 15, '12:00 PM', TO_DATE('29-FEB-24', 'DD-MON-RR'), '4:00 PM', TO_DATE('2-MAR-24', 'DD-MON-RR'), 'ABCFD23', 'Warehouse A', 1, 14, 1500);
-------------
--SR-4 P1
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE, ARRIVAL_TIME, ARRIVAL_DATE, VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (16, 11, 16, '12:00 PM', TO_DATE('26-FEB-24', 'DD-MON-RR'), '4:00 PM', TO_DATE('29-FEB-24', 'DD-MON-RR'), 'ABCFD23', 'Warehouse A', 1, 15, 1500);
--SR-4 P2
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE,VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (17, 11, 17, '12:00 PM', TO_DATE('1-MAR-24', 'DD-MON-RR'), 'ABCFD23', 'https://maps.app.goo.gl/hjdTb5xiGBkLc5Zp6', 1, 15, 1500);

-------------
--SR-5 P1
INSERT INTO SHIPMENTS (SHIPMENT_ID, TRANSPORT_COMPANY_ID, PRODUCT_TRANSACTION_ID, DEPARTURE_TIME, DEPARTURE_DATE,VEHICLE_NO, CURRENT_LOCATION, START_LOCATION, DESTINATION, COST)
VALUES (18, 11, 18, '12:00 PM', TO_DATE('3-MAR-24', 'DD-MON-RR'), 'ABCFD23', 'https://maps.app.goo.gl/hjdTb5xiGBkLc5Zp6', 1, 17, 1500);
































