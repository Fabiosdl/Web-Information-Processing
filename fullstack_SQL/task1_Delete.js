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

async function deleteUser(email, mobile, first_name, surname) {
  try {
    await client.query('BEGIN');

    // Find the user ID in the personal_info table
    const findUserIdQuery = `
      SELECT id
      FROM personal_info
      WHERE email = $1 AND mobile = $2 AND first_name = $3 AND surname = $4;
    `;
    const values = [email, mobile, first_name, surname];
    const result = await client.query(findUserIdQuery, values);
    
    if (result.rowCount === 0) {
      console.log('No matching user found.');
      await client.query('ROLLBACK');
      return 0;
    }

    const userId = result.rows[0].id;

    // Delete records from home_address and shipping_address tables
    const deleteHomeAddressQuery = `DELETE FROM home_address WHERE personal_id = $1;`;
    const deleteShippingAddressQuery = `DELETE FROM shipping_address WHERE personal_id = $1;`;
    await client.query(deleteHomeAddressQuery, [userId]);
    await client.query(deleteShippingAddressQuery, [userId]);

    // Delete the record from the personal_info table
    const deletePersonalInfoQuery = `
      DELETE FROM personal_info WHERE id = $1;
    `;
    await client.query(deletePersonalInfoQuery, [userId]);

    await client.query('COMMIT');
    return result.rowCount;
  } catch (err) {
    console.error("Error deleting user:", err);
    await client.query('ROLLBACK');
    return 0;
  }
}

// Please insert data dump here for testing. The data dump is with the updated info. So it have to be runned after Update file.
(async () => {
  const deletedRowCount = await deleteUser('sarah@williams.com', '123-654-9087','Sarah', 'Williams' );
  console.log(`Deleted ${deletedRowCount} user(s)`);
  client.end();
})();

/** Data Dump
('michael@brown.com','234-567-8910','Michael', 'Brown');
('emma@smith.com', '345-678-9123','Emma', 'Smith' );  
('david@jones.com', '456-789-0123','David', 'Jones' ); 
('emily@taylor.com','567-890-1234','Emily', 'Taylor' );  
('elizabeth@wilson.com', '678-901-2345','Elizabeth', 'Wilson' );   
 

 */

