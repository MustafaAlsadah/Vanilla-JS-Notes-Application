class NoteCard extends HTMLElement {

    connectedCallback(){
        let text = this.getAttribute("text");
        this.innerHTML = `
                <button class="deleteNoteBtn"></button>
                <button class="editNoteBtn"></button>
                <p>
                 ${text}
             </p>
        `;
    }

    static get observedAttributes(){
        return ["text"];
    }

    attributeChangedCallback(attributeName, oldVal, newVal){
        this.connectedCallback();
    }
}

customElements.define("note-card", NoteCard);