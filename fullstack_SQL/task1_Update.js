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

// U - Update user's rows 


async function updateUser(first_name, surname, title, mobile, email, addressData) {
    try {
      // Begin a transaction
      await client.query('BEGIN');
  
      // Update personal_info (Phone, Email, Title)
      const updatePersonalInfoQuery = `
        UPDATE personal_info
        SET title = $1, mobile = $2, email = $3
        WHERE first_name = $4 and surname = $5;
      `;
      const personalInfoResult = await client.query(updatePersonalInfoQuery, [title, mobile, email, first_name, surname]);
      
      // Check if any rows were affected
      if (personalInfoResult.rowCount === 0) {
        console.log('User not found'); //
        await client.query('ROLLBACK');
        return;
      }else{        
      console.log('Personal Info has been updated.');
      }
  
      // Update home_address data
      const updateHomeAddressQuery = `
        UPDATE home_address
        SET address1 = $1, address2 = $2, town = $3, county = $4, eircode = $5
        WHERE personal_id IN (
          SELECT id FROM personal_info
          WHERE first_name = $6 and surname = $7
        );
      `;
      await client.query(updateHomeAddressQuery, [addressData.address1, addressData.address2, addressData.town, addressData.county, addressData.eircode, first_name, surname]);
  
      // Commit the transaction
      await client.query('COMMIT');
      console.log('Home address has been updated.');

      
      // Update shipping_address data
      const updateShippingAddressQuery = `
        UPDATE shipping_address
        SET address1 = $1, address2 = $2, town = $3, county = $4, eircode = $5
        WHERE personal_id IN (
          SELECT id FROM personal_info
          WHERE first_name = $6 and surname = $7
        );
      `;
      await client.query(updateShippingAddressQuery, [addressData.s_address1, addressData.s_address2, addressData.s_town, addressData.s_county, addressData.s_eircode, first_name, surname]);
  
      // Commit the transaction
      await client.query('COMMIT');
      console.log('Shipping address has been updated.');         
      client.end();    

    } catch (error) {
      // Rollback in case of an error
      await client.query('ROLLBACK');
      console.error('Error updating user:', error);
    }
    
  }
  //insert below the first name and surname of existing user and the remaining details that has to be changed
  updateUser('Sarah', 'Williams', 'Dr.', '123-654-9087', 'sarah@williams.com', {
    address1: '123',
    address2: 'Main St',
    town: 'Anytown',
    county: 'CA',
    eircode: '12345',
    s_address1: '123',
    s_address2: 'Main St',
    s_town: 'Anytown',
    s_county: 'CA',
    s_eircode: '12345',
  });

  /*  DATA DUMP
  updateUser('Michael', 'Brown', 'Mr.', '234-567-8910', 'michael@brown.com', {
    address1: '456',
    address2: 'Oak St',
    town: 'Newville',
    county: 'NY',
    eircode: '67890',
    s_address1: '456',
    s_address2: 'Oak St',
    s_town: 'Newville',
    s_county: 'NY',
    s_eircode: '67890',
  });

updateUser('Emma', 'Smith', 'Ms.', '345-678-9123', 'emma@smith.com', {
    address1: '789',
    address2: 'Pine St',
    town: 'Oldtown',
    county: 'TX',
    eircode: '23456',
    s_address1: '789',
    s_address2: 'Pine St',
    s_town: 'Oldtown',
    s_county: 'TX',
    s_eircode: '23456',
  });

updateUser('David', 'Jones', 'Dr.', '456-789-0123', 'david@jones.com', {
    address1: '246',
    address2: 'Elm St',
    town: 'Springfield',
    county: 'FL',
    eircode: '34567',
    s_address1: '246',
    s_address2: 'Elm St',
    s_town: 'Springfield',
    s_county: 'FL',
    s_eircode: '34567',
  });

updateUser('Emily', 'Taylor', 'Mrs.', '567-890-1234', 'emily@taylor.com', {
    address1: '135',
    address2: 'Cedar St',
    town: 'Lakeview',
    county: 'WA',
    eircode: '45678',
    s_address1: '135',
    s_address2: 'Cedar St',
    s_town: 'Lakeview',
    s_county: 'WA',
    s_eircode: '45678',
  });

updateUser('Elizabeth', 'Wilson', 'Mr.', '678-901-2345', 'elizabeth@wilson.com', {
    address1: '864',
    address2: 'Maple St',
    town: 'Riverview',
    county: 'NJ',
    eircode: '56789',
    s_address1: '864',
    s_address2: 'Maple St',
    s_town: 'Riverview',
    s_county: 'NJ',
    s_eircode: '56789',
  }); 
  
  */