"use strict";

(function () {
    const body = document.body;
    const darklightToggleBtn = document.getElementById("darklight-toggle");
    const darklightToggleLabel = darklightToggleBtn?.querySelector(".darklight-toggle_label");

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

  // Dark & Light toggle
  function applyTheme(theme) {
    const isDark = theme === "dark";
    body.classList.toggle("dark-theme", isDark);

    if (darklightToggleLabel) {
      darklightToggleLabel.textContent = isDark ? "Dark" : "Light";
    }
  }

  function initTheme() {
    applyTheme("light"); // more logic?
  }

  if (darklightToggleBtn) {
    darklightToggleBtn.addEventListener("click", function () {
      const isCurrentlyDark = body.classList.contains("dark-theme");
      const newTheme = isCurrentlyDark ? "light" : "dark";
      applyTheme(newTheme);
    });
  }

  initTheme();

  // Cart logic
  const cartItems = {};
  const SHIPPING = 7.0;
  const TAX = 0.085; // 8.5% tax

  const productCards = document.querySelectorAll(".product-card");
  const cartItemsList = document.getElementById("cart-items");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const cartTax = document.getElementById("cart-tax");
  const cartShipping = document.getElementById("cart-shipping");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutMessage = document.getElementById("checkout-message");

  function getProductInfo(card) {
    const id = card.getAttribute("product-id");
    const name = card.querySelector("h3")?.textContent.trim() || "Product"; // Grab product name from h3
    const priceElement = card.querySelector(".product-price");
    const rawPrice =
      priceElement?.getAttribute("price") || priceElement?.textContent || "0";
    const price = parseFloat(rawPrice);

    return { id: id, name: name, price: isNaN(price) ? 0 : price };
  }


  // Increment product in cart
  function addToCart(productId) {
    if (!productId) return;
    if (!cartItems[productId]) {
      cartItems[productId] = 0;
    }
    cartItems[productId] += 1;
    updateCartDisplay();
  }

  // Decrement product in cart
  function removeFromCart(productId) {
    if (!productId || !cartItems[productId]) return;
    cartItems[productId] -= 1;
    if (cartItems[productId] < 0) {
      cartItems[productId] = 0;
    }
    updateCartDisplay();
  }

  function updateCartDisplay() {
    if (!cartItemsList || !cartSubtotal || !cartTax || !cartShipping || !cartTotal) {
      return;
    }

    // Clear the list
    cartItemsList.innerHTML = "";
    let subtotal = 0;

    // Construct the cart list by pulling info from the product cards
    Object.keys(cartItems).forEach(function (productId) {
      const quantity = cartItems[productId];
      if (quantity <= 0) {
        return;
      }

      const card = document.querySelector(
        ".product-card[product-id='" + productId + "']"
      );
      if (!card) {
        return;
      }

      const info = getProductInfo(card);
      const linePrice = info.price * quantity;
      subtotal += linePrice;

      // Display cart list
      const li = document.createElement("li");
      li.textContent =
        info.name + " x " + quantity + " – $" + linePrice.toFixed(2);
      cartItemsList.appendChild(li);
    });

    // Shipping and taxes calculated
    const shipping = subtotal > 0 ? SHIPPING : 0;
    const tax = subtotal * TAX;
    const total = subtotal + tax + shipping;

    cartSubtotal.textContent = "$" + subtotal.toFixed(2);
    cartTax.textContent = "$" + tax.toFixed(2);
    cartShipping.textContent = "$" + shipping.toFixed(2);
    cartTotal.textContent = "$" + total.toFixed(2);
  }

  // Attach event listeners
  productCards.forEach(function (card) {
    const addBtn = card.querySelector(".add");
    const removeBtn = card.querySelector(".remove");
    const info = getProductInfo(card);

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        addToCart(info.id);
        if (checkoutMessage) {
          checkoutMessage.textContent = "";
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        removeFromCart(info.id);
        if (checkoutMessage) {
          checkoutMessage.textContent = "";
        }
      });
    }
  });

  // Check out
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      if (!checkoutMessage) return;

      // Make sure there is at least one item in the cart
      let hasItems = false;
      let summaryLines = [];

      Object.keys(cartItems).forEach(function (productId) {
        const quantity = cartItems[productId];
        if (quantity > 0) {
          hasItems = true;
          const card = document.querySelector(
            ".product-card[product-id='" + productId + "']"
          );
          if (card) {
            const info = getProductInfo(card);
            summaryLines.push(info.name + " x " + quantity);
          }
        }
      });

      if (!hasItems) {
        checkoutMessage.textContent =
          "Please add at least one item to the cart before checking out.";
        return;
      }

      const subtotalText = document.getElementById("cart-subtotal")?.textContent || "$0.00";
      const taxText = document.getElementById("cart-tax")?.textContent || "$0.00";
      const shippingText = document.getElementById("cart-shipping")?.textContent || "$0.00";
      const totalText = document.getElementById("cart-total")?.textContent || "$0.00";

      checkoutMessage.innerHTML =
        "You ordered: <strong>" +
        summaryLines.join(", ") +
        "</strong>.<br>" +
        "Subtotal: " +
        subtotalText +
        "  Tax: " +
        taxText +
        "  Shipping: " +
        shippingText +
        "<br><strong>Total: " +
        totalText +
        "</strong>";

      // Remove all items from cart, there has been a checkout
      Object.keys(cartItems).forEach(function (productId) {
        cartItems[productId] = 0;
      });
      updateCartDisplay();
    });
  }

  // The initial call for displaying cart
  updateCartDisplay();
})();