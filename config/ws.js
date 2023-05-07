import usuarios from "../api/usuarios.js";

self.addEventListener("message", (e)=>{
    let res = usuarios[`${e.data.type}`]((e.data.arg) ? e.data.arg : undefined);
    Promise.resolve(res).then(res=>postMessage(res));
})