// Array of initial quotes
const quotesArray = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Inspiration",
  },
  { text: "Believe you can and you're halfway there.", category: "Confidence" },
  { text: "You miss 100% of the shots you don’t take.", category: "Action" },
];

// Function to show a random quote
function showRandomQuote() {
  const index = Math.floor(Math.random() * quotesArray.length);
  const quote = quotesArray[index];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<div class="quote"><strong>${quote.text}</strong> <em>[${quote.category}]</em></div>`;
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

// Event listener for Show Random Quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize form when the page loads
createAddQuoteForm();
