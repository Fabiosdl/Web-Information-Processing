const {Client} = require('pg');
const client = new Client({
    host: "webcourse.cs.nuim.ie",
    user: "p230046",
    password: "jF6Zhf49Yod6fuL1",
    database:"cs130",
    port: 5432,

    ssl: {
        rejectUnauthorized: false
    }
});

client.connect(function(err) {
    if (err) throw err;
    console.log ("Connected to Data Base!");
});
// C - Create / Insert new rows into the tables personal_info, home_address, and shipping_address

// As I have to insert data in three different tables, I've decided to use async function to use the command
// await, so I could make three different queries (one after the other, and I could use the primary key from personal_info
// to use it to fetch the corresponding addresses queries), and use a separete function to insert data to all the tables.

//function to insert the personal info
async function insertPersonalInfo(title, first_name, surname, mobile, email) { 
    try {
        const query = `
            INSERT INTO personal_info (title, first_name, surname, mobile, email)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;
        const values = [title, first_name, surname, mobile, email];
        const result = await client.query(query, values);
        console.log('Personal Info inserted successfully.');
        return result.rows[0].id;

    } catch (err) {
        console.error('Error inserting data:', err);
    }
}
 
// function witht the query to insert home address
async function insertHomeAddress(address1, address2, town, county, eircode, personal_id) { 
    try {
        const query = `
            INSERT INTO home_address (address1, address2, town, county, eircode, personal_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [address1, address2, town, county, eircode, personal_id];
        const result = await client.query(query, values);
        console.log('Home Address inserted successfully.');
    } catch (err) {
        console.error('Error inserting data:', err);
    }
}

// function witht the query to insert shipping address
async function insertShippingAddress(address1, address2, town, county, eircode, personal_id) { 
    try {
        const query = `
            INSERT INTO shipping_address (address1, address2, town, county, eircode, personal_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [address1, address2, town, county, eircode, personal_id];
        const result = await client.query(query, values);
        console.log('Shipping Address inserted successfully.');
    } catch (err) {
        console.error('Error inserting data:', err);
    }
}
// Please insert the data below. this function inserts the personal info first, 
//wait until it is finished and then insert the home_address, with the personal_id as a foreign key, 
// from the personal_info id table, so it can be used to join the tables.

(async () => { 
    const personalInfoId = await insertPersonalInfo('Mrs.', 'Sarah', 'Williams', '123-456-78902', 'sarah.williams@example.com');
    await insertHomeAddress('666', 'malibu street', 'tampa_bay', 'florida', 'f12 4545', personalInfoId);
    await insertShippingAddress('666', 'malibu street', 'tampa_bay', 'florida', 'f12 4545', personalInfoId);        
    client.end();
})();


/* Data Dump

insertPersonalInfo ('Dr.', 'Michael', 'Brown', '345-678-9012', 'michael.brown@example.com');
await insertHomeAddress('56328', 'oak street', 'ballina', 'mayo', 'f12 x345', personalInfoId);
await insertShippingAddress ('730', 'main street', 'ballina', 'mayo', 'f12 x763', personalInfoId);

insertPersonalInfo ('Ms.', 'Emma', 'Smith', '456-789-0123', 'emma.smith@example.com');
await insertHomeAddress ('67291', 'elm drive', 'athlone', 'westmeath', 'n23 y467', personalInfoId);
await insertShippingAddress('67291', 'elm drive', 'athlone', 'westmeath', 'n23 y467', personalInfoId);

insertPersonalInfo ('Mr.', 'David', 'Jones', '567-890-1234', 'david.jones@example.com');
await insertHomeAddress ('78456', 'maple avenue', 'ennis', 'clare', 'v34 z890', personalInfoId);
await insertShippingAddress('78456', 'maple avenue', 'ennis', 'clare', 'v34 z890', personalInfoId);

insertPersonalInfo ('Miss', 'Emily', 'Taylor', '678-901-2345', 'emily.taylor@example.com');
await insertHomeAddress ('89873', 'birch lane', 'carlow', 'carlow', 'r45 w123', personalInfoId);
await insertShippingAddress('327', 'main street', 'carlow', 'carlow', 'r45 w987', personalInfoId);

insertPersonalInfo ('Mx.', 'Elizabeth', 'Wilson', '789-012-3456', 'elizabeth.wilson@example.com');
await insertHomeAddress ('91234', 'pine crescent', 'dundalk', 'louth', 'a56 b789', personalInfoId);
await insertShippingAddress ('91234', 'pine crescent', 'dundalk', 'louth', 'a56 b789', personalInfoId);

 */