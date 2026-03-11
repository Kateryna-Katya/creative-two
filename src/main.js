const revealItems = document.querySelectorAll(".reveal");

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

const form = document.getElementById("lead-form");
const successMessage = document.getElementById("success-message");

if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(form);

    const lead = {
      name: formData.get("name"),
      contact: formData.get("contact"),
      email: formData.get("email"),
      createdAt: new Date().toISOString(),
    };

    const leads = JSON.parse(localStorage.getItem("start-smart-leads") || "[]");
    leads.push(lead);
    localStorage.setItem("start-smart-leads", JSON.stringify(leads));

    form.reset();
    successMessage.hidden = false;

    setTimeout(() => {
      successMessage.hidden = true;
    }, 4000);
  });
}

const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");

if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
    });
  });
}