window.onload = getAllFromDB;
const NOTES_OBJECT = new Notes();
if (parseInt(localStorage.getItem(0))>0){
    id = parseInt(localStorage.getItem(0));
}else {
    localStorage.setItem(0,0);
    id = parseInt(localStorage.getItem(0));
}

document.addEventListener("submit", (event)=>{
    event.preventDefault();
    let target = event.target;
    if (target && target.id == ("addNotesForm")){
        addNote(target, id);
        id++;
        localStorage.setItem(0, id);
    }
});

document.addEventListener("click", (event)=>{
    let target = event.target;
    if (target && target.id == "clearBtn"){
        let clearNotesConfirmation = confirm("Are you sure that you want to delete all the notes in your sapce?")
        if (clearNotesConfirmation){
            notesBoard.innerHTML = "";
            clearDB();
        }
    }
    else if(target && target.id == "to-hide"){
        if (target.dataset.state=="hide"){
            notesBoard.style.visibility = "hidden";
            target.dataset.state = "show";
        }else {
            notesBoard.style.visibility = "visible";
            target.dataset.state = "hide"
        }
    }
    else if (target && target.classList.contains("deleteNoteBtn")){
        let toDeleteNoteId = parseInt(target.dataset.id);
        deleteFromDB(toDeleteNoteId);
    }
    else if (target && target.classList.contains("editNoteBtn")){
        let toEditNoteId = parseInt(target.dataset.id);
        let toEditNote = document.getElementById("note-"+toEditNoteId);
        let oldText = toEditNote.childNodes[5].innerText;
        let form = `
            <form id="editNoteForm">
                <textarea>${oldText}</textarea>
                <button type="submit" id="submit-edits"></button>
            </form>
        `;
        toEditNote.innerHTML=form;
        editNoteForm.onsubmit = ()=>{
            let toUpdateObj = document.getElementById("note-"+toEditNoteId);
            let newText = toUpdateObj.firstElementChild.firstElementChild.value;
            let obj = {text:newText , id:toEditNoteId};
            updateElement(obj);

            toEditNote.innerHTML = `
                <button class="deleteNoteBtn" data-id="${toEditNoteId}"></button>
                <button class="editNoteBtn" data-id="${toEditNoteId}"></button>
                <p>
                 ${newText}
             </p>`;
        }
    }
    else if (target && target.id =="reverseBtn"){
        NOTES_OBJECT.reverseOrder = !NOTES_OBJECT.reverseOrder;
        notesBoard.innerHTML="";
        getAllFromDB();
    }
});






async function addNote(target, id){
    let toBeAddedNoteId = id;
    let textArea = document.querySelector("#note-text-area");
    let newNoteTextContent = textArea.value;
    let addRequest = await NOTES_OBJECT.addToDB({text: newNoteTextContent, id:toBeAddedNoteId});
    addRequest.onsuccess = ()=>{
        textArea.value = "";
    }
    let newely = document.createElement("note-card");
    newely.setAttribute("text", newNoteTextContent);
    displayNoteAfterAddition(newNoteTextContent, toBeAddedNoteId);

}

async function getAllFromDB(){
    let request = await NOTES_OBJECT.getAllFromDB();
    let resultedArray = [];
    request.onsuccess = ()=>{
        let cursor = request.result;
        if (cursor){
            resultedArray.push(cursor.value);
            cursor.continue();
        }else {
            displayNotes(resultedArray);
            return resultedArray;
        }
    }
}

async function displayNotes(notesArray){
    for (let note of notesArray){
        let noteText = note["text"];
        let noteID = note["id"];
        //--start--
        displayNoteAfterAddition(noteText, noteID);
    }
}

function displayNoteAfterAddition(textContent, noteID){
    let notesBoard = document.querySelector("#notesBoard");
    let newNoteCard = document.createElement("note-card");
    newNoteCard.id = "note-"+noteID;
    newNoteCard.setAttribute("text", textContent);
    notesBoard.append(newNoteCard);
    document.querySelector("#note-"+noteID).firstElementChild.setAttribute("data-id", noteID);
    document.querySelector("#note-"+noteID).childNodes[3].setAttribute("data-id", noteID);
}

async function deleteFromDB(id){
    document.querySelector("#note-"+id).remove();
    let deletionRequest = await NOTES_OBJECT.deleteFromDB(id);


}

async function updateElement(note){
        let updateNoteRequest = NOTES_OBJECT.updateElementInDB(note);
}
async function clearDB(){
    return NOTES_OBJECT.clearDB();
}