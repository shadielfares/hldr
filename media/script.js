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

  // Remove leading and trailing quotes, then replace \\n with actual newlines
  const cleanedResult = analysisResult.replace(/^"|"$/g, ""); // Remove leading and trailing quotes
  console.log("Cleaned Result: ", cleanedResult);
  // Typewriter effect function
  function typewriterEffect(text) {
    let index = 0;
    const typingSpeed = 50; // Adjust the typing speed (milliseconds between characters)

    function typeChar() {
      if (index < text.length) {
        historyElement.textContent += text[index];
        index++;
        setTimeout(typeChar, typingSpeed);
      }
    }

    typeChar(); // Start typing
  }

  // Add a small delay before starting the typewriter effect for the content
  setTimeout(() => {
    typewriterEffect(cleanedResult);
  }, 1000); // Adjust the delay as necessary
});
