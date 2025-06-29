// Initial quotes
const quotesArray = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Inspiration",
  },
  { text: "Believe you can and you're halfway there.", category: "Confidence" },
  { text: "You miss 100% of the shots you don’t take.", category: "Action" },
];

// Load from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotesArray.length = 0;
    quotesArray.push(...JSON.parse(storedQuotes));
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotesArray));
}

// Show random quote
function showRandomQuote() {
  const index = Math.floor(Math.random() * quotesArray.length);
  const quote = quotesArray[index];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<div class="quote"><strong>${quote.text}</strong> <em>[${quote.category}]</em></div>`;
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

// Create Add Quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = "";

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";
  inputText.style.marginRight = "5px";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";
  inputCategory.style.marginRight = "5px";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);
}

// Populate category dropdown
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = Array.from(
    new Set(quotesArray.map((q) => q.category))
  ).sort();
  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    select.value = savedFilter;
    filterQuotes();
  }
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  let filteredQuotes =
    selectedCategory === "all"
      ? quotesArray
      : quotesArray.filter((q) => q.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found for this category.</p>`;
    return;
  }

  quoteDisplay.innerHTML = filteredQuotes
    .map(
      (q) =>
        `<div class="quote"><strong>${q.text}</strong> <em>[${q.category}]</em></div>`
    )
    .join("");
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotesArray.push(newQuote);
    saveQuotes();
    populateCategories();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<div class="quote"><strong>${newQuote.text}</strong> <em>[${newQuote.category}]</em></div>`;
  } else {
    alert("Please fill in both fields.");
  }
}

// Export quotes to JSON
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

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotesArray.push(...importedQuotes);
        saveQuotes();
        populateCategories();
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
document
  .getElementById("exportButton")
  .addEventListener("click", exportQuotesAsJson);
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);
document
  .getElementById("categoryFilter")
  .addEventListener("change", filterQuotes);

// Initialize
loadQuotes();
loadLastViewedQuote();
createAddQuoteForm();
populateCategories();
