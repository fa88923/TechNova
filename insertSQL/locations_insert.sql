
-- CREATE SEQUENCE LOCATION_ID_SEQ
-- INCREMENT BY 1
-- START WITH 1
-- MAXVALUE 500
-- NOCYCLE;



-- Insert data into LOCATIONS table using the sequence for LOCATION_ID
INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY
)
VALUES (
    LOCATION_ID_SEQ.NEXTVAL,
    '19/2 West Panthapath',
    '1205',
    'Dhaka',
    NULL, -- Placeholder for STATE_PROVINCE, replace with actual value if available
    'Bangladesh'
);

INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY
)
VALUES (
    LOCATION_ID_SEQ.NEXTVAL,
    '114 Kazi Nazrul Islam Avenue',
    '1217',
    'Dhaka',
    NULL, -- Placeholder for STATE_PROVINCE, replace with actual value if available
    'Bangladesh'
);




-- Insert data into LOCATIONS table using the sequence for LOCATION_ID
INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY
)
VALUES (
    LOCATION_ID_SEQ.NEXTVAL,
    '402, Hydrography Department, Chittagong Port Authority, Bandar Bhaban (Annex Building)',
    '4100', -- Placeholder for POSTAL_CODE, replace with actual value if available
    'Chittagong',
    NULL, -- Placeholder for STATE_PROVINCE, replace with actual value if available
    'Bangladesh'
);
--own location

INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY
)
VALUES (
    4,
    '123/5 BCS Computer City, Agargaon', -- Actual street address
    '1207',            -- Actual postal code
    'Dhaka',
    NULL,           -- Actual state or province
    'Bangladesh'
);


INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY
)
VALUES (
    5,
    '24/25 Dilkusha Motijheel', -- Actual street address
    '1000',            -- Actual postal code
    'Dhaka',
    NULL,           -- Actual state or provinc
    'Bangladesh'
);

INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY
)
VALUES (
    6,
    '22-23, Kakrail, Shantinagar Road', -- Actual street address
    '1217',            -- Actual postal code
    'Dhaka',
    NULL,           -- Actual state or provinc
    'Bangladesh'
);