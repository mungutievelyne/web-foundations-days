
const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

// Store the users so filtering does not need another request.
let allUsers = [];

// Display any array of users in the page.
function renderUsers(users) {
  usersList.innerHTML = "";

  users.forEach((user) => {
    const li = document.createElement("li");

    const name = document.createElement("h2");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = `Email: ${user.email}`;

    const city = document.createElement("p");
    city.textContent = `City: ${user.address.city}`;

    const company = document.createElement("p");
    company.textContent = `Company: ${user.company.name}`;

    li.append(name, email, city, company);
    usersList.appendChild(li);
  });
}

// Fetch users from the API.
async function loadUsers() {
  loadButton.disabled = true;
  statusText.textContent = "Loading users...";
  usersList.innerHTML = "";

  try {
    const response = await fetch(API_URL);

    // fetch does not automatically throw for HTTP errors.
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const users = await response.json();

    // Keep the original array for filtering.
    allUsers = users;

    renderUsers(allUsers);

    statusText.textContent = `Loaded ${allUsers.length} users.`;
  } catch (error) {
    statusText.textContent =
      "Could not load users. Please try again.";

    console.error("Error loading users:", error);
  } finally {
    // Re-enable the button after success or failure.
    loadButton.disabled = false;
  }
}

// Load users when the button is clicked.
loadButton.addEventListener("click", loadUsers);

// Filter the stored users as the user types.
filterInput.addEventListener("input", () => {
  const searchText = filterInput.value.trim().toLowerCase();

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchText)
  );

  renderUsers(filteredUsers);

  if (allUsers.length > 0 && filteredUsers.length === 0) {
    statusText.textContent = "No users match your filter.";
  } else if (allUsers.length > 0) {
    statusText.textContent =
      `Showing ${filteredUsers.length} of ${allUsers.length} users.`;
  }
});
