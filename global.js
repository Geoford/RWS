var user_location = getCookie("user_location"); 
let lastValue = $("input[name='switch_country']").val(); // current dropdown value 


//next 3 function is the CRUD

//create / update the coockie 
function setCookie(name, value, days) {

  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + encodeURIComponent(value) + expires + "; path=/";

}

//retrieve the cookie
function getCookie(name) {

  let nameEQ = name + "=";
  let cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i];
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }

  return null;
}

//delete the cookie
function deleteCookie(name) {

  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

}

//for the popup 
jQuery(document).ready(function ($) {
  let checkElementorPopup = setInterval(function () {
    if (getCookie("user_location")) {
      clearInterval(checkElementorPopup); //stop the interval
    } else if (
      typeof elementorProFrontend !== "undefined" &&
      elementorProFrontend.modules.popup
    ) {
      elementorProFrontend.modules.popup.showPopup({ id: 454 });
      clearInterval(checkElementorPopup); 
    }
  }, 500);

  $(document).on("click", ".user-location-setting", function () {
    let selectedLocation = $(this).attr("location");

    if (selectedLocation) {
      setCookie("user_location", selectedLocation, 7);

      if (
        typeof elementorProFrontend !== "undefined" &&
        elementorProFrontend.modules.popup
      ) {
        $(".elementor-popup-modal").fadeOut(); // Hide the popup
      }
    } else {
      console.error("Invalid location selected.");
    }
  });



  //for the drop down
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

function updateDropdownValue(location) {
  if (location === "null") {
    location = getCookie("user_location"); // Retrieve cookie value if location is null
  }
  if (location && location !== "null") {
      let formattedLocation = capitalizeFirstLetter(location);

      // Update the hidden input field used by MetForm
      $("input[name='switch_country']").val(formattedLocation.toLowerCase());
      // Update the visible text in the dropdown
      $(".mf_select__single-value").text(formattedLocation);
      // Update any other related select elements
      $(".mf-input-select").val(formattedLocation.toLowerCase());
  } 
}

//   function applyStoredLocation() {
//     let userLocation = getCookie("user_location");
//     if (userLocation) {
//       updateDropdownValue(userLocation);
//     }
//   }

//   let checkMetFormLoaded = setInterval(function () {
//     if ($(".mf_select__single-value").length > 0) {
//         clearInterval(checkMetFormLoaded);
//         applyStoredLocation();
//     }
// }, 500);

  $(document).on("click", ".user-location-setting", function () {
    let selectedLocation = $(this).attr("location");

    if (selectedLocation) {
      updateDropdownValue(selectedLocation);
    }
  });

  $(document).on("focus", ".mf-input-select", function () {
    let selectedValue = $("input[name='switch_country']").val();
    console.log("Dropdown clicked, maintaining value:", selectedValue);

    if (selectedValue) {
      setTimeout(() => {
        updateDropdownValue(selectedValue);
      }, 100);
    }
  });

  let lastValue = $("input[name='switch_country']").val(); // current dropdown value 

  
  setInterval(function () {
    let currentValue = $("input[name='switch_country']").val();
    console.log("currentvalue:" + currentValue);  

    //checker if the input is default again
    if (currentValue === "null"){
      currentValue = getCookie("user_location");
    }

    if (currentValue && currentValue !== lastValue) {
        console.log("Detected location change:", currentValue);
        lastValue = currentValue;

        // Delay cookie update slightly to avoid UI race condition
        setTimeout(() => {
            deleteCookie("user_location");
            setCookie("user_location", currentValue, 7);
        }, 500); 

        // Update UI without unnecessary re-triggering
        updateDropdownValue(currentValue);
    }
}, 500);


});
