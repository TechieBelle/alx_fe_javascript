// Simulated server URL
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Initial quotes
const quotesArray = [
  {
    id: 1,
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Inspiration",
  },
  {
    id: 2,
    text: "Believe you can and you're halfway there.",
    category: "Confidence",
  },
  {
    id: 3,
    text: "You miss 100% of the shots you don’t take.",
    category: "Action",
  },
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
    const newQuote = {
      id: Date.now(),
      text,
      category,
    };
    quotesArray.push(newQuote);
    saveQuotes();
    populateCategories();
    postQuoteToServer(newQuote);

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

// Fetch server quotes and sync
async function syncQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();

    let conflictsResolved = false;

    serverQuotes.slice(0, 10).forEach((serverQuote) => {
      const serverId = serverQuote.id;
      const serverText = serverQuote.title;
      const serverCategory = String(serverQuote.userId);

      const existingIndex = quotesArray.findIndex((q) => q.id === serverId);

      if (existingIndex === -1) {
        quotesArray.push({
          id: serverId,
          text: serverText,
          category: serverCategory,
        });
        conflictsResolved = true;
      } else if (quotesArray[existingIndex].text !== serverText) {
        quotesArray[existingIndex].text = serverText;
        quotesArray[existingIndex].category = serverCategory;
        conflictsResolved = true;
      }
    });

    if (conflictsResolved) {
      saveQuotes();
      populateCategories();
      notifyUser("Quotes updated from server. Conflicts resolved.");
    }
  } catch (error) {
    console.error("Error syncing with server:", error);
  }
}

// Notify user of updates
function notifyUser(message) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const notification = document.createElement("div");
  notification.style.background = "#ffeb3b";
  notification.style.color = "#333";
  notification.style.padding = "10px";
  notification.style.margin = "10px auto";
  notification.style.borderRadius = "4px";
  notification.textContent = message;
  quoteDisplay.prepend(notification);
}

// Simulate posting new quotes
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify({
        title: quote.text,
        body: "",
        userId: quote.category,
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();
    console.log("Posted to server:", data);
  } catch (err) {
    console.error("Error posting quote:", err);
  }
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
syncQuotes();
setInterval(syncQuotes, 30000);
