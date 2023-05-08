let headers = new Headers({
    "Content-Type": "application/json"
});
let puerto = 4001;

const postRecluta = async (arg) => {
    arg.id = (arg.id) ? arg.id : Date.now();
    let config = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(arg)
    };
    return await (await fetch(`http://localhost:${puerto}/reclutas`, config)).json();
}
const getReclutaAll = async () => {
    let config = {
        method: "GET",
        headers: headers
    };
    return await (await fetch(`http://localhost:${puerto}/reclutas`, config)).json();
}
const deleteRecluta = async (arg) => {
    let config = {
        method: "DELETE",
        headers: headers,
    };
    return await (await fetch(`http://localhost:${puerto}/reclutas/${arg.id}`, config)).json();
}
const putRecluta = async (arg) => {
    let config = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(arg)
    };
    return await (await fetch(`http://localhost:${puerto}/reclutas/${arg.id}`, config)).json();
}
const searchRecluta = async (arg) => {
    const response = await fetch(`http://localhost:${puerto}/reclutas`);
    const data = await response.json();

    if (response.ok) {
        const filteredData = data.filter(user => user.nombre === arg);
        return filteredData;
    } else {
        console.error("Error al obtener los usuarios del servidor.");
        return [];
    }
};
export default {
    postRecluta,
    getReclutaAll,
    deleteRecluta,
    putRecluta,
    searchRecluta
}