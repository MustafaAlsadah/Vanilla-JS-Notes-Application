class Notes{
    dbVersion = 2;
    dbName = 'myDB';
    reverseOrder = false;

    connectToDB(){
        return new Promise((resolve, reject)=> {
            const connectionRequest = indexedDB.open(this.dbName, this.dbVersion);
            connectionRequest.onupgradeneeded = () => {
                let DB = connectionRequest.result;
                if (!DB.objectStoreNames.contains("NotesStore")){
                    DB.createObjectStore("NotesStore", {keyPath:"id", autoIncrement:true});
                }
            }
            connectionRequest.onsuccess = () => resolve(connectionRequest.result);
            connectionRequest.onerror = () => reject(connectionRequest.error.message);
            connectionRequest.onblocked = () => console.log("DB is blocked");
        });
    }

    async accessNotesStore(accessType){
        let connectToDB = await this.connectToDB();
        let tx = connectToDB.transaction("NotesStore", accessType);
        return tx.objectStore("NotesStore");
    }

    async addToDB(noteObject){
        let notesStore =  await this.accessNotesStore("readwrite"); //because in add we definitely want to write, but in other cases we may not.
        return notesStore.add(noteObject);
    }

    async getAllFromDB(){
        let notesStore =  await this.accessNotesStore("readwrite"); //because in add we definitely want to write, but in other cases we may not.
        return  notesStore.openCursor(null, this.reverseOrder?"prev":"next");
    }

    async deleteFromDB(noteID){
        let notesStore = await this.accessNotesStore("readwrite");
        return  notesStore.delete(noteID);
    }

    async updateElementInDB(note){
        let notesStore = await this.accessNotesStore("readwrite");
        return notesStore.put(note);
    }

    async clearDB(){
        let notesStore = await this.accessNotesStore("readwrite");
        return notesStore.clear();
    }


}