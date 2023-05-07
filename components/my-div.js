import config from "../config/config.js";
/* import usuarios from "../api/usuarios.js"; */
import {
    GET_USER_ALL,
    POST_USER,
    DELETE_USER,
    PUT_USER,
    SEARCH_USER
} from '../constants/requestTypes.js'

document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
    const tableBody = this.shadowRoot.querySelector("#myData");
    let plantilla=``
}); //va por fuera de la clase

export default class myTabla extends HTMLElement {
    static url =
        import.meta.url
    static async components() {
        return await (await fetch(config.uri(myTabla.url))).text();
    }
    constructor() {
        console.log('constructor running')

        super();
        this.attachShadow({
            mode: "open"
        });
        this.content(
            Promise.resolve(myTabla.components()).then(html => {

                console.log('constructor')
                this.shadowRoot.innerHTML = html;
                this.form = this.shadowRoot.querySelector("#myForm");
                this.form.addEventListener("submit", this.handleEvent.bind(this))
            }))
    }



    _shadowRoot = () => {
        let asyncContent = null
        let content = null
        return async (html) => {
            if (content) return content
            if (!asyncContent) {
                asyncContent = html
                return null
            }
            content = await asyncContent
            return content
        }

    }

    content = this._shadowRoot()

    handleEvent(e) {
        e.preventDefault();
        (e.type === "submit") ? this.myworker(e): undefined;
    }
    myworker(e) {
        let ws = new Worker("../config/ws.js", {
            type: "module"
        });
        let data = Object.fromEntries(new FormData(e.target));
        switch (e.submitter.dataset.valor) {
            case "get":
                ws.postMessage({
                    type: GET_USER_ALL
                });
                break;
            case "post":
                ws.postMessage({
                    type: POST_USER,
                    arg: data
                });
                break;
            case "delete":
                ws.postMessage({
                    type: DELETE_USER,
                    arg: data
                });
                break;
            case "put":
                ws.postMessage({
                    type: PUT_USER,
                    arg: data
                });
                break;
            case "search":
                ws.postMessage({
                    type: SEARCH_USER,
                    arg: data.nombre,
                });
                break;
            default:
                break;
        }
        ws.addEventListener("message", (e) => {
            console.log(e.data);
            this.displayDataInTable(e.data);
            ws.terminate();
        })
    }

    async displayDataInTable(data) {
        try {
            await this.content()
            const tableBody = this.shadowRoot.querySelector("#myData");
            console.log('display: ', this.shadowRoot)
            /* tableBody.innerHTML = ""; */

            if (!Array.isArray(data)) {
                throw new Error("Datos inválidos proporcionados. Se esperaba un array.");
            }

            const sortedData = data.sort((a, b) => a.id - b.id);
            sortedData.forEach((user) => {
                const row = document.createElement("tr");

                const idCell = document.createElement("td");
                idCell.textContent = user.id;
                row.appendChild(idCell);

                const nombreCell = document.createElement("td");
                nombreCell.textContent = user.nombre || "";
                row.appendChild(nombreCell);

                const apellidoCell = document.createElement("td");
                apellidoCell.textContent = user.apellido || "";
                row.appendChild(apellidoCell);

                const edadCell = document.createElement("td");
                edadCell.textContent = user.edad || "";
                row.appendChild(edadCell);

                const deleteCell = document.createElement("td");
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Eliminar";
                deleteButton.addEventListener("click", () => {
                    this.deleteUser(user);
                });
                deleteCell.appendChild(deleteButton);
                row.appendChild(deleteCell);

                const editCell = document.createElement("td");
                const editButton = document.createElement("button");
                editButton.textContent = "Actulizar";
                editButton.addEventListener("click", () => {
                    this.putUser(user);
                });
                editCell.appendChild(editButton);
                row.appendChild(editCell);

                tableBody.appendChild(row);
            });
        } catch (error) {
            console.log(error);
        }

    }

    static get observedAttributes() {
        return ['data-accion'];
    }
    attributeChangedCallback(name, old, now) {
        console.log(name, old, now);
        console.log(this.dataset.accion);
    }
    connectedCallback() {
        /* const table = new myTabla();
        table.displayDataInTable(); */
        /* Promise.resolve(myTabla.components()).then((html) => {
            this.shadowRoot.innerHTML = html;
            this.form = this.shadowRoot.querySelector("#myForm");
            this.form.addEventListener("submit", this.handleEvent.bind(this));
        });

         */
    }

}
customElements.define(config.name(myTabla.url), myTabla);