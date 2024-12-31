const md = window.markdownit();

document.addEventListener("DOMContentLoaded", () => {
  const historyElement = document.getElementById("history");
  if (!historyElement) {
    console.error("History element not found!");
    return;
  }

  // Get the analysisResult from the data attribute of the history element
  const analysisResult = historyElement.getAttribute("data-analysis-result");
  if (!analysisResult) {
    console.error("No analysis result found!");
    return;
  }

  const parsedHTML = md.render(analysisResult); // This will convert the Markdown to HTML
  const escapedContent = parsedHTML
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;"); // Escape single quotes
  // Typewriter effect function to display text gradually
  function typewriterEffect(text) {
    let index = 0;
    const typingSpeed = 25; // Adjust the typing speed (milliseconds between characters)

    function typeChar() {
      if (index < text.length) {
        historyElement.innerHTML = text.slice(0, index + 1); // Use innerHTML
        index++;
        setTimeout(typeChar, typingSpeed);
      }
    }

    typeChar(); // Start typing
  }

  // Add a small delay before starting the typewriter effect for the content
  setTimeout(() => {
    typewriterEffect(escapedContent);
  }, 1000);
});
