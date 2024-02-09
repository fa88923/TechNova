
--locations er sequence paltay disi, so beware of inconsistency with the original sqls 
--1:own location

INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY
)
VALUES (
    1,
    '123/5 BCS Computer City, Agargaon', -- Actual street address
    '1207',            -- Actual postal code
    'Dhaka',
    NULL,           -- Actual state or province
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
    2,
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
    3,
    '114 Kazi Nazrul Islam Avenue',
    '1217',
    'Dhaka',
    NULL, -- Placeholder for STATE_PROVINCE, replace with actual value if available
    'Bangladesh'
);
-- Insert data for Dhaka, Bangladesh


-- Insert data for Mumbai, India
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
    'N.S.Phadke Road',
    '400069',
    'Mumbai',
    'Maharashtra',
    'India'
);

-- Insert data for Gurugram, India (Retrotech Business Solutions PVT LTD)
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
    'ARJUN MARG',
    '122002',
    'Gurugram',
    'Haryana',
    'India'
);

-- Insert data for Gurugram, India (BenQ India Pvt. Ltd)
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
    'DLF Cyber City',
    '122002',
    'Gurugram',
    'Haryana',
    'India'
);

-- Insert data for Beijing, China
INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY
)
VALUES (
    7,
    '789 Communication Road',
    '987654',
    'Beijing',
    NULL,
    'China'
);

-- Insert data for Guangzhou, China
INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY
)
VALUES (
    8,
    '321 Tech Park',
    '543210',
    'Guangzhou',
    'Guangdong',
    'China'
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
    9,
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
    10,
    '22-23, Kakrail, Shantinagar Road', -- Actual street address
    '1217',            -- Actual postal code
    'Dhaka',
    NULL,           -- Actual state or provinc
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
    11,
    '402, Hydrography Department, Chittagong Port Authority, Bandar Bhaban (Annex Building)',
    '4100', -- Placeholder for POSTAL_CODE, replace with actual value if available
    'Chittagong',
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
    12,
    '383, Mazar Road, Jomidar Bari,Mirpur -1',
    '1207', -- Placeholder for POSTAL_CODE, replace with actual value if available
    'Dhaka',
    NULL, -- Placeholder for STATE_PROVINCE, replace with actual value if available
    'Bangladesh'
);

--branches

INSERT INTO LOCATIONS (
    LOCATION_ID,
    STREET_ADDRESS,
    POSTAL_CODE,
    CITY,
    STATE_PROVINCE,
    COUNTRY
)
VALUES (
    13,
    '41 Kamal Ataturk Avenue, Banani',
    '1207', -- Placeholder for POSTAL_CODE, replace with actual value if available
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
    14,
    'House Building, 11 Sonargaon Janapath, Sector 7, Uttara Dhaka 1230',
    '1207', -- Placeholder for POSTAL_CODE, replace with actual value if available
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
    15,
    '428/429 Yunusco City Centre, GEC Circle',
    '4407', -- Placeholder for POSTAL_CODE, replace with actual value if available
    'Chittagong',
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
    16,
    '1st Floor, Naushin Tower, 11 K D A Avenue',
    '9208', -- Placeholder for POSTAL_CODE, replace with actual value if available
    'Khulna',
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
    17,
    '96 Jamal Super Market, Shaheb Bazar',
    '6205', -- Placeholder for POSTAL_CODE, replace with actual value if available
    'Rajshahi',
    NULL, -- Placeholder for STATE_PROVINCE, replace with actual value if available
    'Bangladesh'
);