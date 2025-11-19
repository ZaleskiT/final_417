"use strict";

(function () {

    const contactForm = document.getElementById("contact-form");

    // Regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /\d/g;

    // Take the container id and error message, display it
    function setError(id, message) {
    const errorElement = document.getElementById(id);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

    // Remove all error messages
    function clearErrors() {
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach(function (el) {
      el.textContent = "";
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      // Prevent the default form submission
      event.preventDefault(); 
      clearErrors();

      const firstNameInput = document.getElementById("first-name");
      const lastNameInput = document.getElementById("last-name");
      const emailInput = document.getElementById("email");
      const phoneInput = document.getElementById("phone");
      const commentsInput = document.getElementById("comments");
      const formMessage = document.getElementById("form-message");

      const contactInputs = document.querySelectorAll(
        "input[name='contactPreference']"
      );

      const firstName = firstNameInput.value.trim();
      const lastName = lastNameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();
      const comments = commentsInput.value.trim();

      let contactPreference = "";
      contactInputs.forEach(function (input) {
        if (input.checked) {
          contactPreference = input.value;
        }
      });

      // Validation section
      let isValid = true;

      // First name required
      if (!firstName) {
        setError("first-name-error", "Required");
        isValid = false;
      }

      // Last name required
      if (!lastName) {
        setError("last-name-error", "Required");
        isValid = false;
      }

      // Contact preference required
      if (!contactPreference) {
        setError("contact-pref-error", "Select one option");
        isValid = false;
      }

      // Comments required
      if (!comments) {
        setError("comments-error", "Required");
        isValid = false;
      }

      // Phone and email validation
      if (contactPreference === "email") {
        if (!email) {
          setError("email-error", "Required");
          isValid = false;
        } else if (!emailRegex.test(email)) {
          setError("email-error", "Invalid email");
          isValid = false;
        }
      }

      if (contactPreference === "phone") {
        if (!phone) {
          setError("phone-error", "Required");
          isValid = false;
        } else {
          const justDigits = phone.match(phoneRegex);
          const digitCount = justDigits ? justDigits.length : 0;
          if (digitCount < 10) {
            setError("phone-error", "Invalid phone number, 10 digits required");
            isValid = false;
          }
        }
      }

      if (!isValid) {
        if (formMessage) {
          formMessage.textContent = "";
        }
        return;
      }

      // Handle valid form
      const customer = {
        firstName: firstName,
        lastName: lastName,
        email: email || "",
        phone: phone || "",
        comments: comments,
        contactPreference: contactPreference,
        submittedAt: new Date().toDateString(),
      };

      // Thank them, because we're nice
      if (formMessage) {
          formMessage.innerHTML ="Thank you for contacting 51% Winrate, <strong>" + customer.firstName + " " + customer.lastName + "</strong>!";
      }

      // Reset
      contactForm.reset();
    });
  }

})();