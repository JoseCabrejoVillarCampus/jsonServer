import config from "../config/config.js";
/* import usuarios from "../api/usuarios.js"; */
import {
    GET_RECLUTA_ALL,
    POST_RECLUTA,
    DELETE_RECLUTA,
    PUT_RECLUTA,
    SEARCH_RECLUTA
} from '../constants/requestTypes.js'


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
        const {
            valor
        } = e.submitter.dataset;

        if (valor === "get") {
            ws.postMessage({
                type: GET_RECLUTA_ALL,
            });
        } else if (valor === "post") {
            const callback = () => {
                ws.postMessage({
                    type: GET_RECLUTA_ALL,
                });
                this.displayDataInTable(); // Llamar a displayDataInTable después del POST
            };

            ws.postMessage({
                type: POST_RECLUTA,
                arg: data,
                callback: callback.toString()
            });
    } else if (valor === "delete") {
        ws.postMessage({
            type: DELETE_RECLUTA,
            arg: data
        });
    } else if (valor === "put") {
        ws.postMessage({
            type: PUT_RECLUTA,
            arg: data
        });
    } else if (valor === "search") {
        ws.postMessage({
            type: SEARCH_RECLUTA,
            arg: data.nombre || data.id ,
        });
    }

    ws.addEventListener("message", (e) => {
        console.log(e.data);
        this.displayDataInTable(e.data);
        ws.terminate();
    });
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
        console.log(data);

        sortedData.forEach((user) => {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = user.id;
            row.appendChild(idCell);

            const nombreCell = document.createElement("td");
            nombreCell.textContent = user.nombre || "";
            console.log(user.nombre);
            row.appendChild(nombreCell);

            const edadCell = document.createElement("td");
            edadCell.textContent = user.edad || "";
            row.appendChild(edadCell);

            const emailCell = document.createElement("td");
            emailCell.textContent = user.email || "";
            row.appendChild(emailCell);

            const direccionCell = document.createElement("td");
            direccionCell.textContent = user.direccion || "";
            row.appendChild(direccionCell);

            const fecha_de_nacimientoCell = document.createElement("td");
            fecha_de_nacimientoCell.textContent = user.fecha_de_nacimiento || "";
            row.appendChild(fecha_de_nacimientoCell);

            const numero_de_identificacionCell = document.createElement("td");
            numero_de_identificacionCell.textContent = user.numero_de_identificacion || "";
            row.appendChild(numero_de_identificacionCell);

            const fecha_de_ingreso_al_programaCell = document.createElement("td");
            fecha_de_ingreso_al_programaCell.textContent = user.fecha_de_ingreso_al_programa || "";
            row.appendChild(fecha_de_ingreso_al_programaCell);

            const id_teamCell = document.createElement("td");
            id_teamCell.textContent = user.team.nombre || "";
            console.log('display', user.team.nombre);
            row.appendChild(id_teamCell); 

            const id_notaCell = document.createElement("td");
            id_notaCell.textContent = user.evaluacion.skill.nombre || "";
            row.appendChild(id_notaCell);  

            const id_skillCell = document.createElement("td");
            id_skillCell.textContent = user.evaluacion.skill.moduloSkill.nombre || "";
            row.appendChild(id_skillCell);

            const id_modCell = document.createElement("td");
            id_modCell.textContent = user.evaluacion.nota || "";
            row.appendChild(id_modCell);

            /* const deleteCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.addEventListener("submit", () => {
                this.deleteUser(user);
            });
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            const editCell = document.createElement("td");
            const editButton = document.createElement("button");
            editButton.textContent = "Actulizar";
            editButton.addEventListener("submit", () => {
                this.putUser(user);
            });
            editCell.appendChild(editButton);
            row.appendChild(editCell); */

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