
// Array of initial quotes
const quotesArray = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Inspiration",
  },
  { text: "Believe you can and you're halfway there.", category: "Confidence" },
  { text: "You miss 100% of the shots you don’t take.", category: "Action" },
];

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotesArray.length = 0; // clear current
    quotesArray.push(...JSON.parse(storedQuotes));
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotesArray));
}

// Function to show a random quote
function showRandomQuote() {
  const index = Math.floor(Math.random() * quotesArray.length);
  const quote = quotesArray[index];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<div class="quote"><strong>${quote.text}</strong> <em>[${quote.category}]</em></div>`;

  // Save to sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Load last viewed quote
function loadLastViewedQuote() {
  const stored = sessionStorage.getItem("lastViewedQuote");
  if (stored) {
    const quote = JSON.parse(stored);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<div class="quote"><strong>${quote.text}</strong> <em>[${quote.category}]</em></div>`;
  }
}

// Function to create the Add Quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  // Clear any existing content
  formContainer.innerHTML = "";

  // Create input for quote text
  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";
  inputText.style.marginRight = "5px";

  // Create input for category
  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";
  inputCategory.style.marginRight = "5px";

  // Create button to add quote
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  // Append all elements
  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);
}

// Function to add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotesArray.push(newQuote);

    // Save to localStorage
    saveQuotes();




    // Clear inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Show confirmation
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<div class="quote"><strong>${newQuote.text}</strong> <em>[${newQuote.category}]</em></div>`;

  } else {
    alert("Please fill in both fields.");
  }
}
// Export quotes to JSON file
function exportQuotesAsJson() {
  const dataStr = JSON.stringify(quotesArray, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotesArray.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format. Expected an array.");
      }
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportButton").addEventListener("click", exportQuotesAsJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// Initialize app
loadQuotes();
loadLastViewedQuote();
createAddQuoteForm();
