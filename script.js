const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", function () {
    const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";

    if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        themeBtn.textContent = "🌙";
        localStorage.setItem("theme", "light");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        themeBtn.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    }
});

if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeBtn.textContent = "☀️";
}