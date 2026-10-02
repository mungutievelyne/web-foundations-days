let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

console.table(notes);

function searchNotes(word) {
  const searchWord = word.toLowerCase();

  return notes.filter((note) =>
    note.text.toLowerCase().includes(searchWord)
  );
}

console.log(searchNotes("day"));
// Expected: the Day 3 assignment note

console.log(searchNotes("xyz"));
// Expected: []

function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }

  return longest;
}



console.log(longestNote());
// Expected: { id: 2, text: "Finish the Day 3 assignment", category: "study" }

console.log(longestNote().text);
// Expected: "Finish the Day 3 assignment"



function countByCategory() {
  const counts = {};

  for (const note of notes) {
    if (counts[note.category] === undefined) {
      counts[note.category] = 0;
    }

    counts[note.category]++;
  }

  return counts;
}
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

function getSummary() {
  const counts = countByCategory();
  const total = notes.length;

  const word = total === 1 ? "note" : "notes";

  const personal = counts.personal || 0;
  const work = counts.work || 0;
  const study = counts.study || 0;

  return `${total} ${word}: ${personal} personal, ${work} work, ${study} study.`;
}
console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

function isDuplicate(text) {
  const cleanedText = text.trim().toLowerCase();

  return notes.some((note) =>
    note.text.trim().toLowerCase() === cleanedText
  );
}

console.log(isDuplicate("  BUY MILK AND BREAD  "));
// Expected: true

console.log(isDuplicate("Learn CSS Grid"));
// Expected: false


function addNote(text, category) {
  const cleanedText = text.trim();
  const validCategories = ["personal", "work", "study"];

  // Check text length
  if (cleanedText.length < 1 || cleanedText.length > 200) {
    console.log("Note rejected: text must be 1-200 characters.");
    return false;
  }

  // Check for duplicates
  if (isDuplicate(cleanedText)) {
    console.log("Note rejected: duplicate note.");
    return false;
  }

  // Check category
  if (!validCategories.includes(category)) {
    console.log("Note rejected: invalid category.");
    return false;
  }

  // Create the new note
  const newNote = {
    id: Date.now(),
    text: cleanedText,
    category: category,
  };

  notes.push(newNote);

  console.log(`Note added: "${newNote.text}"`);

  return true;
}

console.log(addNote("Practice JavaScript functions", "study"));
// Expected: true

console.log(addNote("  BUY MILK AND BREAD  ", "personal"));
// Expected: false