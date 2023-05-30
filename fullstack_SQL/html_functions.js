// FUNCTION TO SHOW UP OTHER TITLE ONLY IF THE OPTION OTHER IS SELECTED IN THE DROP-DOWN LIST.
function showOtherTitle() {
  var titleSelect = document.getElementById("Title");
  var otherTitleDiv = document.getElementById("otherTitleDiv");

  if (titleSelect.value == "Other") {
      otherTitleDiv.style.display = "block";
  } else {
      otherTitleDiv.style.display = "none";
  }
}

// FUNCTION TO SHOW UP SHIPPING ADDRES ONLY IF THE CHECK BOX IS CLICKED.
function shippingaddress() {
  var homeAddressFields = {
    address1: document.getElementById("h_address1"),
    address2: document.getElementById("h_address2"),
    town: document.getElementById("h_town"),
    county: document.getElementById("h_county"),
    eircode: document.getElementById("h_eircode")
  };

  var shippingAddressFields = {
    address1: document.getElementById("s_address1"),
    address2: document.getElementById("s_address2"),
    town: document.getElementById("s_town"),
    county: document.getElementById("s_county"),
    eircode: document.getElementById("s_eircode")
  };

  var shippingAddressContainer = document.getElementById("shippingaddress");
  var yesSelect = document.getElementById("checkaddress-0");

  if (yesSelect.checked) {
    shippingAddressFields.address1.value = homeAddressFields.address1.value;
    shippingAddressFields.address2.value = homeAddressFields.address2.value;
    shippingAddressFields.town.value = homeAddressFields.town.value;
    shippingAddressFields.county.value = homeAddressFields.county.value;
    shippingAddressFields.eircode.value = homeAddressFields.eircode.value;
    shippingAddressContainer.style.display = "block";
  } else{
    shippingAddressFields.address1.value = "";
    shippingAddressFields.address2.value = "";
    shippingAddressFields.town.value = "";
    shippingAddressFields.county.value = "";
    shippingAddressFields.eircode.value = "";
    shippingAddressContainer.style.display = "none";
  }
}

//send an AJAX request to the server when the form is submitted.


async function submitForm(event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById("personalInfoForm"));
  const data = Object.fromEntries(formData.entries());

  try {
      const response = await fetch("http://localhost:3000/submit-form", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
      });

      if (response.ok) {
          const result = await response.json();
          console.log(result);
          alert("Form submitted successfully!");
      } else {
          alert("Error submitting form. Please try again.");
      }
  } catch (error) {
      console.error("Error:", error);
      alert("Error submitting form. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
document.getElementById("personalInfoForm").addEventListener("submit", submitForm);
});


 

