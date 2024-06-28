// Website Loading
document.addEventListener('DOMContentLoaded', () => {

    noteSection.style.display="none"

    homeSectionBtn.classList.add("toggle-section-btn-click")

    setTimeout(() => {
        const loader = document.getElementById('pageLoadWrapper');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 3000);
});

const homeSection = document.getElementById("homeSection")
const noteSection = document.getElementById("noteSection")

const homeSectionBtn = document.getElementById("homeSectionBtn")
const noteSectionBtn = document.getElementById("noteSectionBtn")

homeSectionBtn.addEventListener("click", 
    () => {
        homeSection.style.display="grid"
        noteSection.style.display="none"

        homeSectionBtn.classList.add("toggle-section-btn-click")
        noteSectionBtn.classList.remove("toggle-section-btn-click")
    }
)

noteSectionBtn.addEventListener("click", 
    () => {
        noteSection.style.display="block"
        homeSection.style.display="none"

        noteSectionBtn.classList.add("toggle-section-btn-click")
        homeSectionBtn.classList.remove("toggle-section-btn-click")
    }
)

// Note Section Scripting
let noteTitle = document.getElementById("noteTitle");
let noteBody = document.getElementById("noteBody");

const noteIcons = {
    bold: document.querySelector(".bold-btn"),
    italic: document.querySelector(".italic-btn"),
    underline: document.querySelector(".underline-btn"),
    unOrderedList: document.querySelector(".ul-list-btn"),
    save: document.querySelector(".save-btn")
};

function formatText(noteIconEvent) { // For bold, italic, underline and ul-list rich text format

    const selection = window.getSelection();
    selection.getRangeAt(0)

    if (noteIconEvent === "bold") {
        document.execCommand("bold")
    }
    else if (noteIconEvent === "italic") {
        document.execCommand("italic");
    } 
    else if (noteIconEvent === "underline") {
        document.execCommand("underline");
    } 
    else if (noteIconEvent === "insertUnorderedList") {
        document.execCommand("insertUnorderedList");
    }

    noteBody.focus()
};
noteBody.addEventListener("keydown", function(e) { // For adding Unordered Lists

    if (e.key === "Tab") {
        e.preventDefault();
        const range = window.getSelection().getRangeAt(0);
        const tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
        range.insertNode(tabNode);

        // Move the cursor after the tab character
        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
});

noteIcons.bold.addEventListener("click", () => {formatText("bold")});
noteIcons.italic.addEventListener("click", () => {formatText("italic")});
noteIcons.underline.addEventListener("click", () => {formatText("underline")});
noteIcons.unOrderedList.addEventListener("click", () => {formatText("insertUnorderedList")});

// Getting localStorage notes if the notes exist, else it passes an empty array to "Notes" in local storage 
// The empty array passed is a new note which will be gotten from Note Title and Note Body
const noteStorage = JSON.parse(localStorage.getItem("Notes") || "[]");

function displayNotes() {

    document.querySelectorAll(".home-content-wrapper").forEach((ev) => {ev.remove()}) // Removes all the hard code notes in html
    noteStorage.forEach(
        
        (note, noteIndex) => {

            let noteElements = `
                <div class="home-content-wrapper">

                    <div class="home-top-content">
                        <h6 class="home-title">${note.title}</h6>
                    </div>

                    <div class="home-bottom-content">

                        <span>${note.date}</span>
                        <div class="home-content-settings">
                            <span onclick="clickNote(${noteIndex}, '${note.title}', '${note.body}')" class="fa-solid fa-pen"></span>
                            <span onclick="deleteNotes(${noteIndex})" class="fa-solid fa-trash"></span>
                        </div>
                    </div>
                </div>
            `
            homeSection.insertAdjacentHTML("afterbegin", noteElements)
        }
    )
}
displayNotes()

let readNote = false, updateNote // For Note Editing and updating

noteIcons.save.addEventListener("click", 
    () => {
      
      if (noteTitle || noteBody) {
        const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        let noteDates = new Date(),
        month = monthName[noteDates.getMonth()],
        day = noteDates.getDate(),
        year = noteDates.getFullYear()

        const noteInfo = {
            title: noteTitle.value || "No Title",
            body: noteBody.innerHTML,
            date: `${month} ${day}, ${year}`
        };
        
        if (!readNote) {
        noteStorage.push(noteInfo) // Adding new notes to noteStorage
        }
        else {
            readNote = false
            noteStorage[updateNote] = noteInfo
        }

        // Clearing input fields for new notes
        noteTitle.value = ""
        noteBody.innerText = ""

        // Saving notes to the browser's localStorage
        localStorage.setItem("Notes", JSON.stringify(noteStorage))
        
        displayNotes()

        noteSection.style.display="none"
        noteSectionBtn.classList.remove("toggle-section-btn-click")

        homeSection.style.display="grid"
        homeSectionBtn.classList.add("toggle-section-btn-click")
      }
    }
)

// Opening, reading and editing of notes
function clickNote(noteId, title, body) {
    readNote = true;
    updateNote = noteId;

    noteTitle.value = title;
    noteBody.innerHTML = body;  // Use innerHTML to retain formatting

    noteSection.style.display = "block";
    noteSectionBtn.classList.add("toggle-section-btn-click");

    homeSection.style.display = "none";
    homeSectionBtn.classList.remove("toggle-section-btn-click");

    noteBody.focus();
}

// Deleting Notes
function deleteNotes(noteId) {
    noteStorage.splice(noteId, 1)

    localStorage.setItem("Notes", JSON.stringify(noteStorage)) // Saving the remaining notes to localStorage
    displayNotes()
}

// Search Notes Start
// The search will focus on the note title only
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function() {
    const query = searchInput.value.toLowerCase();
    filterNotes(query);
});

function filterNotes(myNotes) {
    // Clear the displayed notes
    document.querySelectorAll(".home-content-wrapper").forEach((ev) => ev.remove());

    // Filter notes based on the query
    const filteredNotes = noteStorage.filter(note => 
        note.title.toLowerCase().includes(myNotes)
    );

    // Display filtered notes
    filteredNotes.forEach((note, noteIndex) => {
        let noteElements = `
            <div class="home-content-wrapper">
                <div class="home-top-content">
                    <h6 class="home-title">${note.title}</h6>
                </div>
                <div class="home-bottom-content">
                    <span>${note.date}</span>
                    <div class="home-content-settings">
                        <span onclick="clickNote(${noteIndex}, '${note.title}', '${note.body}')" class="fa-solid fa-pen"></span>
                        <span onclick="deleteNotes(${noteIndex})" class="fa-solid fa-trash"></span>
                    </div>
                </div>
            </div>
        `;
        homeSection.insertAdjacentHTML("afterbegin", noteElements);
    });
}
// Search Notes End

// Different User Background Images and Colors Scripting
const navBar = document.querySelector(".navbar")
const mainTag = document.querySelector(".main-section")
const noteContainer = document.querySelector(".note-container")
const logo = document.querySelector(".logo")
const settingsMenu = document.querySelector(".settings-menu")
const offCanvas = document.querySelector(".offcanvas")
const offCanvasLogo = document.getElementById("offLogo")
const offCanvasCloseBtn = document.getElementById("offClose")
const dropDownBtn = document.getElementById("dropDownBtn")

const lightBgBtn = document.querySelector(".light-bg-btn")
const darkBgBtn = document.querySelector(".dark-bg-btn")

const bgImages = {
    beachBg: document.getElementById("beachBg"),
    villaBg: document.getElementById("villaBg"),
    nightBg: document.getElementById("nightBg")
}

function lightBgBtnClick() {
    mainTag.classList.add("lightBg")
    mainTag.classList.remove("darkBg")
    mainTag.classList.remove("villaBg-img")
    mainTag.classList.remove("nightBg-img")

    navBar.style.backgroundColor="#fff"
    logo.style.color="slateblue"
    offCanvas.style.backgroundColor="#fff"

    settingsMenu.style.backgroundColor="transparent"
    offCanvasLogo.style.color="slateblue"
    offCanvasCloseBtn.style.backgroundColor="transparent"
    lightBgBtn.style.backgroundColor ="slateblue"
    lightBgBtn.style.color="black"
    darkBgBtn.style.backgroundColor ="slateblue"
    darkBgBtn.style.color="black"
    dropDownBtn.style.color="black"
}

function darkBgBtnClick() {
    mainTag.classList.add("darkBg")
    mainTag.classList.remove("lightBg")
    mainTag.classList.remove("villaBg-img")
    mainTag.classList.remove("nightBg-img")

    navBar.style.backgroundColor="black"
    logo.style.color="slateblue"
    offCanvas.style.backgroundColor="black"

    settingsMenu.style.backgroundColor="slateblue"
    offCanvasLogo.style.color="slateblue"
    offCanvasCloseBtn.style.backgroundColor="slateblue"
    lightBgBtn.style.backgroundColor ="slateblue"
    lightBgBtn.style.color="black"
    darkBgBtn.style.backgroundColor ="slateblue"
    darkBgBtn.style.color="black"
    dropDownBtn.style.color="slateblue"
}

function villaBgClick() {
    mainTag.classList.add("villaBg-img")
    mainTag.classList.remove("darkBg")
    mainTag.classList.remove("lightBg")
    mainTag.classList.remove("nightBg-img")

    navBar.style.backgroundColor="#EBC3BB"
    logo.style.color="black"
    offCanvas.style.backgroundColor="#EBC3BB"

    settingsMenu.style.backgroundColor="transparent"
    offCanvasLogo.style.color="black"
    offCanvasCloseBtn.style.backgroundColor="transparent"
    lightBgBtn.style.backgroundColor ="black"
    lightBgBtn.style.color="#EBC3BB"
    darkBgBtn.style.backgroundColor ="black"
    darkBgBtn.style.color="#EBC3BB"
    dropDownBtn.style.color="black"
}

function nightBgClick() {
    mainTag.classList.add("nightBg-img")
    mainTag.classList.remove("villaBg-img")

    navBar.style.backgroundColor="#0C1210"
    logo.style.color="dodgerblue"
    offCanvas.style.backgroundColor="#0C1210"

    settingsMenu.style.backgroundColor="dodgerblue"
    offCanvasLogo.style.color="dodgerblue"
    offCanvasCloseBtn.style.backgroundColor="dodgerblue"
    lightBgBtn.style.backgroundColor ="dodgerblue"
    lightBgBtn.style.color="black"
    darkBgBtn.style.backgroundColor ="dodgerblue"
    darkBgBtn.style.color="black"
    dropDownBtn.style.color="dodgerblue"
}

lightBgBtn.addEventListener("click", () => {lightBgBtnClick()})
darkBgBtn.addEventListener("click", () => {darkBgBtnClick()})

bgImages.villaBg.addEventListener("click", () => {villaBgClick()})
bgImages.nightBg.addEventListener("click", () => {nightBgClick()})