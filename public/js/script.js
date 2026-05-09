// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
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
    setTimeout(() => {
      alert.remove();
    }, 1000); 
  });
}, 5000);

//dark mod & light mod
document.addEventListener("DOMContentLoaded", () => {

  const toggleBtn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const body = document.body;

  // load saved theme
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

});

// user search option
const input = document.getElementById("searchInput");
const box = document.getElementById("suggestionsBox");

input.addEventListener("input", async () => {
  let query = input.value;

  if (query.length < 1) {
    box.style.display = "none";
    return;
  }

  let res = await fetch(`/listings/api/search?q=${query}`);
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
         style="display:block; padding:8px; text-decoration:none; color:black;">
        ${item.title}
      </a>
    `;

    box.appendChild(div);
  });

  box.style.display = "block";
});