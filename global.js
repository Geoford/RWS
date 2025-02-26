var user_location = getCookie("user_location"); 


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

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

function updateDropdownValue(location) {
    if (location) {
        let formattedLocation = capitalizeFirstLetter(location);

        // Update the hidden input field used by MetForm
        $("input[name='switch_country']").val(formattedLocation.toLowerCase());

        // Update the visible text in the dropdown
        $(".mf_select__single-value").text(formattedLocation);

        // Update any other related select elements
        $(".mf-input-select").val(formattedLocation.toLowerCase());
    }
}

  function applyStoredLocation() {
    let userLocation = getCookie("user_location");
    if (userLocation) {
      updateDropdownValue(userLocation);
    }
  }

  let checkMetFormLoaded = setInterval(function () {
    if ($(".mf_select__single-value").length > 0) {
        clearInterval(checkMetFormLoaded);
        applyStoredLocation();
    }
}, 500);


  $(document).on("click", ".user-location-setting", function () {
    let selectedLocation = $(this).attr("location");

    if (selectedLocation) {
      updateDropdownValue(selectedLocation);
    }
  });

  let lastValue = $("input[name='switch_country']").val(); // dropdown blyat
  console.log(lastValue);
  
  setInterval(function () {
    let currentValue = $("input[name='switch_country']").val();

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
}, 2000);

});
