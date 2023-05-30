const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const client = new Client({
  host: "webcourse.cs.nuim.ie",
  user: "p230046",
  password: "jF6Zhf49Yod6fuL1",
  database: "cs130",
  port: 5432,

  ssl: {
    rejectUnauthorized: false
  }
});

client.connect(function (err) {
  if (err) throw err;
  console.log("Connected to Data Base!");
});

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const currentRoute = url.parse(req.url).pathname;
  const currentMethod = req.method;
  const fileExtension = path.extname(currentRoute);

  if (currentRoute === "/submit-form" && currentMethod === "POST") {
    
   
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const data = JSON.parse(body);

      try {
        await client.query("BEGIN");
      
        // Insert into personal_info
        const personalInfoQuery = `
          INSERT INTO personal_info (title, first_name, surname, mobile, email)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id;
        `;
        const personalInfoValues = [data.title, data.firstName, data.surname, data.mobile, data.email];
        const personalInfoResult = await client.query(personalInfoQuery, personalInfoValues);
        const personalInfoId = personalInfoResult.rows[0].id;
      
        // Insert into home_address
        const homeAddressQuery = `
          INSERT INTO home_address (address1, address2, town, county, eircode, personal_id)
          VALUES ($1, $2, $3, $4, $5, $6);
        `;
        const homeAddressValues = [ data.home_address1, data.home_address2, data.home_town, data.home_county, data.home_eircode, personalInfoId];
        await client.query(homeAddressQuery, homeAddressValues);
      
        // Insert into shipping_address
        const shippingAddressQuery = `
          INSERT INTO shipping_address (address1, address2, town, county, eircode, personal_id)
          VALUES ($1, $2, $3, $4, $5, $6);
        `;
        const shippingAddressValues = [data.ship_address1, data.ship_address2, data.ship_town, data.ship_county, data.ship_eircode, personalInfoId ];
        await client.query(shippingAddressQuery, shippingAddressValues);
      
        await client.query("COMMIT");
      
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "success", userId: personalInfoId }));
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "error", message: err.message }));
      }
      });

    } else if (currentRoute === "/api/users" && currentMethod === "GET") {
      res.setHeader('Content-Type', 'application/json');
      try {
        const users = await getAllUsers();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
      } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "error", message: err.message }));
      }
    } else if (fileExtension) {
      const filePath = path.join(__dirname, currentRoute);
      fs.readFile(filePath, function (err, data) {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end("404: File not found");
        } else {
          const contentType = getContentType(fileExtension);
          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        }
      });
    } else {
      fs.readFile(__dirname + "/assignment4_task2.html", function (err, data) {
        const headers = {
          "Content-Type": "text/html",
        };
        res.writeHead(200, headers);
        res.end(data);
      });
    }
  });
  
  server.listen(3000, () => {
    console.log("Server is listening on port 3000");
  });

async function getAllUsers() {
  const personalInfoQuery = 'SELECT * FROM personal_info';
  const personalInfoResult = await client.query(personalInfoQuery);

  const users = [];

  for (const personalInfo of personalInfoResult.rows) {
    const homeAddressQuery = 'SELECT * FROM home_address WHERE personal_id = $1';
    const homeAddressResult = await client.query(homeAddressQuery, [personalInfo.id]);

    const shippingAddressQuery = 'SELECT * FROM shipping_address WHERE personal_id = $1';
    const shippingAddressResult = await client.query(shippingAddressQuery, [personalInfo.id]);

    users.push({
      personal_info: personalInfo,
      home_address: homeAddressResult.rows[0],
      shipping_address: shippingAddressResult.rows[0],
    });
  }

  return users;
}
