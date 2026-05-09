// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add('was-validated')
    }, false)
  })
})()

// flash
setTimeout(() => {
  let alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    alert.style.transition = "opacity 1s ease";
    alert.style.opacity = "0";
    setTimeout(() => alert.remove(), 1000);
  });
}, 5000);

// dark mode & light mode
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
      localStorage.setItem("theme", "dark");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
      localStorage.setItem("theme", "light");
    }
  });

  // ✅ search wrapped in null check so it doesn't crash on other pages
  const input = document.getElementById("searchInput");
  const box = document.getElementById("suggestionsBox");

  if (input && box) {
    input.closest("form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    input.addEventListener("input", async () => {
      let query = input.value.trim();

      if (query.length < 1) {
        box.style.display = "none";
        return;
      }

      try {
        let res = await fetch(`/listings/api/search?q=${encodeURIComponent(query)}`);
        let data = await res.json();

        box.innerHTML = "";

        if (data.length === 0) {
          box.style.display = "none";
          return;
        }

        data.forEach(item => {
          let div = document.createElement("div");
          div.innerHTML = `
            <a href="/listings/${item._id}"
               style="display:block; padding:10px 16px; text-decoration:none; color:#222; font-size:14px; border-bottom:1px solid #f0f0f0;">
              <i class="fa-solid fa-magnifying-glass" style="color:#aaa; margin-right:8px; font-size:12px;"></i>
              ${item.title}
              <span style="color:#aaa; font-size:12px;">— ${item.location}</span>
            </a>
          `;
          box.appendChild(div);
        });

        box.style.display = "block";
      } catch (err) {
        console.log("Search error:", err);
      }
    });

    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !box.contains(e.target)) {
        box.style.display = "none";
      }
    });
  }
});