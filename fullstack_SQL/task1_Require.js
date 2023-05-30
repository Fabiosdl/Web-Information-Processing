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
// R - Require / Select  rows 
async function searchUsers(first_name, surname) {
    try {
      const queryText = `
        SELECT personal_info.*, home_address.*,
        shipping_address.shipid AS shipping_id,
        shipping_address.address1 AS s_address1,
        shipping_address.address2 AS s_address2,
        shipping_address.town AS s_town,
        shipping_address.county AS s_county,
        shipping_address.eircode AS s_eircode        
        FROM personal_info
        JOIN home_address on personal_info.id = home_address.personal_id 
        JOIN shipping_address on personal_info.id = shipping_address.personal_id  
        WHERE personal_info.first_name = $1 AND personal_info.surname = $2;        
      `;
  
      const values = [first_name, surname];
      const result = await client.query(queryText, values);
  
      return result.rows;
    } catch (err) {
      console.error("Error searching users:", err);
      return [];
    }
}
async function Print() {
  const rows = await searchUsers('Sarah', 'Williams');
  console.log(rows);
  client.end(); // Close the connection
}
  
Print();

/*Data Dump
searchUsers('Michael', 'Brown');
searchUsers('Emma', 'Smith');
searchUsers('David', 'Jones');
searchUsers('Emily', 'Taylor');
searchUsers('Elizabeth', 'Wilson');

  
*/  
  // ====== End of Require CRUD=======================================================