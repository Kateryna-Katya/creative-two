document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     REVEAL ANIMATION
  ========================= */
  const revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
      }
    );

    revealItems.forEach(item => observer.observe(item));
  }

  /* =========================
     FORM + PHONE INPUT
  ========================= */
  const form = document.getElementById("lead-form");
  const successMessage = document.getElementById("success-message");
  const phoneInput = document.querySelector("#phone");

  if (form && successMessage && phoneInput) {
    const iti = window.intlTelInput(phoneInput, {
      initialCountry: "auto",
      geoIpLookup: callback => {
        fetch("https://ipapi.co/json")
          .then(res => res.json())
          .then(data => callback(data.country_code?.toLowerCase() || "ua"))
          .catch(() => callback("ua"));
      },
      preferredCountries: ["ua", "pl", "de"],
      separateDialCode: true,
      countrySearch: true,
      utilsScript:
        "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.12/build/js/utils.js",
    });

    form.addEventListener("submit", e => {
      e.preventDefault();

      if (!iti.isValidNumber()) {
        alert("Введи корректный номер телефона");
        phoneInput.focus();
        return;
      }

      const formData = new FormData(form);

      const lead = {
        firstName: formData.get("firstName")?.trim() || "",
        lastName: formData.get("lastName")?.trim() || "",
        email: formData.get("email")?.trim() || "",
        phone: iti.getNumber(),
        createdAt: new Date().toISOString(),
      };

      const leads = JSON.parse(localStorage.getItem("start-smart-leads") || "[]");
      leads.push(lead);
      localStorage.setItem("start-smart-leads", JSON.stringify(leads));

      console.log("Saved lead:", lead);

      form.reset();
      iti.setCountry("ua");
      successMessage.hidden = false;

      setTimeout(() => {
        successMessage.hidden = true;
      }, 4000);
    });
  }

  /* =========================
     BURGER MENU
  ========================= */
  const burger = document.querySelector(".burger");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      document.body.classList.toggle("menu-open");
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        burger.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
      });
    });

    document.addEventListener("click", e => {
      const isClickInsideMenu = mobileMenu.contains(e.target);
      const isClickBurger = burger.contains(e.target);

      if (!isClickInsideMenu && !isClickBurger) {
        burger.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
      }
    });
  }
});