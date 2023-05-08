import usuarios from "../api/usuarios.js";
import team from "../api/team.js";
import skill from "../api/skill.js";
import moduloSkill from "../api/moduloSkill.js";
import evaluacion from "../api/evaluacion.js";
self.addEventListener("message", (e)=>{
    let res = usuarios[`${e.data.type}`]((e.data.arg) ? e.data.arg : undefined);
    Promise.resolve(res).then(res=>postMessage(res));
})
self.addEventListener("message", (e)=>{
    let res = team[`${e.data.type}`]((e.data.arg) ? e.data.arg : undefined);
    Promise.resolve(res).then(res=>postMessage(res));
})
self.addEventListener("message", (e)=>{
    let res = skill[`${e.data.type}`]((e.data.arg) ? e.data.arg : undefined);
    Promise.resolve(res).then(res=>postMessage(res));
})
self.addEventListener("message", (e)=>{
    let res = moduloSkill[`${e.data.type}`]((e.data.arg) ? e.data.arg : undefined);
    Promise.resolve(res).then(res=>postMessage(res));
})
self.addEventListener("message", (e)=>{
    let res = evaluacion[`${e.data.type}`]((e.data.arg) ? e.data.arg : undefined);
    Promise.resolve(res).then(res=>postMessage(res));
})