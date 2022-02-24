window.onload = getAllFromDB;
document.addEventListener("submit", (event)=>{
    event.preventDefault();

    console.log("addBtn is clicked!")
    let target = event.target;
    console.log(target.id);
    if (target && target.id == ("addNotesForm")){
        addNote(target);
    }
});

document.addEventListener("click", (event)=>{
    event.stopPropagation();
    let target = event.target;
    console.log(target.id);
    if (target && target.id == "clearBtn"){
        console.log("clearAllBtn is clicked!")
        let clearNotesConfirmation = confirm("Are you sure that you want to delete all the notes in your sapce?")
        if (clearNotesConfirmation){
            notesBoard.innerHTML = "";
            clearDB();
        }
    }
    else if(target && target.id == "to-hide"){
        console.log("hideBtn is clicked!");
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
        console.log(target.dataset.id);
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





const NOTES_OBJECT = new Notes();

async function addNote(target){
    let textArea = target.querySelector("textarea");
    let newNote = textArea.value;
    let addRequest = await NOTES_OBJECT.addToDB({text: newNote});
    addRequest.onsuccess = ()=>{
        textArea.value = "";
    }
    let newely = document.createElement("note-card");
    newely.setAttribute("text", newNote);
    notesBoard.append(newely);
    // location.reload();
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
        let newNoteCard = document.createElement("note-card");
        newNoteCard.id = "note-"+note["id"];
        newNoteCard.setAttribute("text", noteText);
        document.querySelector("#notesBoard").append(newNoteCard);
        document.querySelector("#note-"+note["id"]).firstElementChild.setAttribute("data-id", note["id"]);
        document.querySelector("#note-"+note["id"]).childNodes[3].setAttribute("data-id", note["id"]);
    }
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