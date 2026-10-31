try {
  const stored = localStorage.getItem("careerchive-theme");
  const theme = stored === "dark" || stored === "light" ? stored : "dark";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
} catch {
  document.documentElement.dataset.theme = "dark";
  document.documentElement.style.colorScheme = "dark";
}
