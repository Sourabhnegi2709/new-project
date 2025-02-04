(() => {
    "use strict";
  
    const forms = document.querySelectorAll(".needs-validation");
  
    // Loop over them and prevent submission
    Array.from(forms).forEach((form) => {
      form.addEventListener("submit", (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
  
        form.classList.add("was-validated");
      },
      false
    );
    });
  })

  ();

 
  document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const closeSidebar = document.getElementById("closeSidebar");
    const overlay = document.getElementById("overlay");

    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.add("active");
      overlay.classList.add("active");
    });

    closeSidebar.addEventListener("click", function () {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });

    overlay.addEventListener("click", function () {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
  });