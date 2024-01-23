-- Shipment 1
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    1,
    1,
    'Purchase Order',
    '08:30:00',
    TO_DATE('2023-02-04', 'YYYY-MM-DD'),
    '09:30:00',
    TO_DATE('2023-02-05', 'YYYY-MM-DD'),
    'ABC123',
    NULL,
    1,
    4,
    18
);

-- Shipment 2
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    2,
    1,
    'Purchase Order',
    '10:00:00',
    TO_DATE('2022-06-01', 'YYYY-MM-DD'),
    '11:00:00',
    TO_DATE('2022-06-02', 'YYYY-MM-DD'),
    'XYZ789',
    NULL,
    1,
    4,
    19
);

-- Shipment 3
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    3,
    1,
    'Purchase Order',
    '15:45:00',
    TO_DATE('2023-01-25', 'YYYY-MM-DD'),
    '16:45:00',
    TO_DATE('2023-01-26', 'YYYY-MM-DD'),
    'PQR456',
    NULL,
    1,
    4,
    20
);

-- Shipment 4
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    4,
    1,
    'Purchase Order',
    '12:15:00',
    TO_DATE('2022-08-25', 'YYYY-MM-DD'),
    '13:15:00',
    TO_DATE('2022-08-26', 'YYYY-MM-DD'),
    'LMN789',
    NULL,
    1,
    4,
    21
);

-- Shipment 5
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    5,
    1,
    'Purchase Order',
    '18:00:00',
    TO_DATE('2022-12-05', 'YYYY-MM-DD'),
    '19:00:00',
    TO_DATE('2022-12-06', 'YYYY-MM-DD'),
    'GHI123',
    NULL,
    1,
    4,
    22
);

-- Shipment 6
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    6,
    1,
    'Purchase Order',
    '08:00:00',  -- Departure Time
    TO_DATE('2023-04-01', 'YYYY-MM-DD'),  -- Departure Date
    '18:00:00',  -- Arrival Time
    TO_DATE('2023-04-02', 'YYYY-MM-DD'),  -- Arrival Date
    'DHK-1234',  -- Realistic Vehicle No
    NULL,
    1,
    4,
    23  -- Transaction ID
);

-- Shipment 7
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    7,
    1,
    'Purchase Order',
    '09:30:00',  -- Departure Time
    TO_DATE('2023-06-20', 'YYYY-MM-DD'),  -- Departure Date
    '19:30:00',  -- Arrival Time
    TO_DATE('2023-06-21', 'YYYY-MM-DD'),  -- Arrival Date
    'CTG-5678',  -- Realistic Vehicle No
    NULL,
    1,
    4,
    24  -- Transaction ID
);

-- Shipment 8
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    8,
    1,
    'Purchase Order',
    '11:00:00',  -- Departure Time
    TO_DATE('2023-09-30', 'YYYY-MM-DD'),  -- Departure Date
    '21:00:00',  -- Arrival Time
    TO_DATE('2023-10-01', 'YYYY-MM-DD'),  -- Arrival Date
    'SYL-9012',  -- Realistic Vehicle No
    NULL,
    1,
    4,
    25  -- Transaction ID
);

-- Shipment 9
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    9,
    1,
    'Purchase Order',
    '13:30:00',  -- Departure Time
    TO_DATE('2023-12-16', 'YYYY-MM-DD'),  -- Departure Date
    '23:30:00',  -- Arrival Time
    TO_DATE('2023-12-17', 'YYYY-MM-DD'),  -- Arrival Date
    'COM-3456',  -- Realistic Vehicle No
    NULL,
    1,
    4,
    26  -- Transaction ID
);

-- Shipment 10
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    10,
    2,  -- Transport Company ID 2
    'Purchase Order',
    '10:00:00',  -- Departure Time
    TO_DATE('2023-02-18', 'YYYY-MM-DD'),  -- Departure Date
    '20:00:00',  -- Arrival Time
    TO_DATE('2023-02-19', 'YYYY-MM-DD'),  -- Arrival Date
    'DAC-5678',  -- Realistic Vehicle No
    NULL,
    2,  -- Start Location 2
    4,
    27  -- Transaction ID
);

-- Shipment 11
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    11,
    2,
    'Purchase Order',
    '11:30:00',  -- Departure Time
    TO_DATE('2023-05-20', 'YYYY-MM-DD'),  -- Departure Date
    '21:30:00',  -- Arrival Time
    TO_DATE('2023-05-21', 'YYYY-MM-DD'),  -- Arrival Date
    'SYL-9012',  -- Realistic Vehicle No
    NULL,
    2,
    4,
    28  -- Transaction ID
);

-- Shipment 12
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    12,
    2,
    'Purchase Order',
    '13:00:00',  -- Departure Time
    TO_DATE('2023-09-02', 'YYYY-MM-DD'),  -- Departure Date
    '23:00:00',  -- Arrival Time
    TO_DATE('2023-09-03', 'YYYY-MM-DD'),  -- Arrival Date
    'CTG-1234',  -- Realistic Vehicle No
    NULL,
    2,
    4,
    29  -- Transaction ID
);

-- Shipment 13
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    13,
    2,
    'Purchase Order',
    '14:30:00',  -- Departure Time
    TO_DATE('2023-04-04', 'YYYY-MM-DD'),  -- Departure Date
    '00:30:00',  -- Arrival Time
    TO_DATE('2023-04-05', 'YYYY-MM-DD'),  -- Arrival Date
    'COM-3456',  -- Realistic Vehicle No
    NULL,
    2,
    4,
    30  -- Transaction ID
);

-- Shipment 14
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    14,
    2,
    'Purchase Order',
    '16:00:00',  -- Departure Time
    TO_DATE('2023-04-15', 'YYYY-MM-DD'),  -- Departure Date
    '02:00:00',  -- Arrival Time
    TO_DATE('2023-04-16', 'YYYY-MM-DD'),  -- Arrival Date
    'DAC-7890',  -- Realistic Vehicle No
    NULL,
    2,
    4,
    31  -- Transaction ID
);

-- Shipment 15
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    15,
    2,  -- Transport Company ID 2
    'Purchase Order',
    '17:30:00',  -- Departure Time
    TO_DATE('2023-05-01', 'YYYY-MM-DD'),  -- Departure Date
    '03:30:00',  -- Arrival Time
    TO_DATE('2023-05-02', 'YYYY-MM-DD'),  -- Arrival Date
    'CTG-5678',  -- Realistic Vehicle No
    NULL,
    2,  -- Start Location 2
    4,
    32  -- Transaction ID
);

-- Shipment 16
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    16,
    2,
    'Purchase Order',
    '19:00:00',  -- Departure Time
    TO_DATE('2023-05-15', 'YYYY-MM-DD'),  -- Departure Date
    '04:00:00',  -- Arrival Time
    TO_DATE('2023-05-16', 'YYYY-MM-DD'),  -- Arrival Date
    'DAC-9012',  -- Realistic Vehicle No
    NULL,
    2,
    4,
    33  -- Transaction ID
);

-- Shipment 17
INSERT INTO SHIPMENTS (
    SHIPMENT_ID,
    TRANSPORT_COMPANY_ID,
    REQUSITION_TYPE,
    DEPARTURE_TIME,
    DEPARTURE_DATE,
    ARRIVAL_TIME,
    ARRIVAL_DATE,
    VEHICLE_NO,
    CURRENT_LOCATION,
    START_LOCATION,
    DESTINATION,
    TRANSACTION_ID
) VALUES (
    17,
    2,
    'Purchase Order',
    '20:30:00',  -- Departure Time
    TO_DATE('2023-06-01', 'YYYY-MM-DD'),  -- Departure Date
    '05:30:00',  -- Arrival Time
    TO_DATE('2023-06-02', 'YYYY-MM-DD'),  -- Arrival Date
    'SYL-3456',  -- Realistic Vehicle No
    NULL,
    2,
    4,
    34  -- Transaction ID
);


UPDATE PURCHASE_ORDERS SET SHIPMENT_ID=ORDER_ID;