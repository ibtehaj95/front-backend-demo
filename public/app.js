"use strict";

const sbutton = document.getElementById("sub-button");
const vbutton = document.getElementById("view-button");
const sname = document.getElementById("sname");
const lat = document.getElementById("lat");
const long = document.getElementById("long");
const sbHome = document.getElementById("sbHome");
const sbReport = document.getElementById("sbReport");
const sbDatabase = document.getElementById("sbDatabase");
const sbAbout = document.getElementById("sbAbout");
// const sbElements = document.querySelectorAll(".sbElement");
const bdElements = document.querySelectorAll(".bdElement");
const bdDatabase = document.getElementById("bdDatabase");

sbutton.addEventListener("click", submitForm);
// vbutton.addEventListener("click", getData);
sbHome.addEventListener("click", navTo);
sbReport.addEventListener("click", navTo);
sbDatabase.addEventListener("click", navTo);
sbAbout.addEventListener("click", navTo);

function navTo(event){
    const button = event.path[0].id;
    const  bdElemId = `bd${button.slice(2)}`;
    bdElements.forEach((bdElement) => {
        if(bdElement.id !== bdElemId){
            bdElement.classList.add("hide");
        }
        else if (bdElement.id === bdElemId) {
            bdElement.classList.remove("hide");
        }
    });
    if(button === "sbDatabase"){
        getData();
    }
}

function getData(){
    fetch("/api")
    .then((resp) => resp.json())
    .then((data) => {
        const hasChildren = document.querySelector("#bdDatabase > table");
        if(hasChildren){
            // updateTable(data, hasChildren);
            drawTable(data, "redraw", hasChildren);
        }
        else{
            drawTable(data, "newdraw");
        }
    })
    .catch(error => {
        console.log(error);
    });
}

// function updateTable(data, table){
//     const entries = table.children.length-1;
//     console.log(entries);   //number of entries in the DOM Table (excl. header)
//     console.log(table);
//     console.log(data);
//     console.log(data.length);
//     if(entries === data.length){
//         return;
//     }
//     for(let i = entries; i < data.length; ++i){
//         // console.log(data[i]);
//         const data_row = document.createElement("tr");
//         const data_col_n = document.createElement("td");
//         data_col_n.textContent = data[i].name;
//         const data_col_lat = document.createElement("td");
//         data_col_lat.textContent = data[i].lat;
//         const data_col_lon = document.createElement("td");
//         data_col_lon.textContent = data[i].long;
//         data_row.appendChild(data_col_n);
//         data_row.appendChild(data_col_lat);
//         data_row.appendChild(data_col_lon);
//         table.appendChild(data_row);
//     }
// }

function drawTable(data, mode, tableElement){
    const table = document.createElement("table");
    table.classList.add("opsTable");
    const head_row = document.createElement("tr");
    const head_col_n = document.createElement("th");
    head_col_n.textContent = "Submitter";
    const head_col_lat = document.createElement("th");
    head_col_lat.textContent = "Latitude";
    const head_col_lon = document.createElement("th");
    head_col_lon.textContent = "Longitude";
    head_row.appendChild(head_col_n);
    head_row.appendChild(head_col_lat);
    head_row.appendChild(head_col_lon);
    table.appendChild(head_row);
    for(let i=0; i<data.length; ++i)
    {
        const data_row = document.createElement("tr");
        const data_col_n = document.createElement("td");
        data_col_n.textContent = data[i].name;
        const data_col_lat = document.createElement("td");
        data_col_lat.textContent = data[i].lat;
        const data_col_lon = document.createElement("td");
        data_col_lon.textContent = data[i].long;
        data_row.appendChild(data_col_n);
        data_row.appendChild(data_col_lat);
        data_row.appendChild(data_col_lon);
        table.appendChild(data_row);
    };
    if(mode === "redraw"){
        bdDatabase.replaceChild(table, tableElement);
    }
    else if(mode === "newdraw"){
        bdDatabase.appendChild(table);
    }
}

function submitForm(event){
    if (sname.value !== "" && lat !== "" && long !== "")
    {
        const payload = {
            name: sname.value,
            lat: lat.value,
            long: long.value
        }
        // console.log(JSON.stringify(payload));
        fetch("/api", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then((resp) => resp.json())
        .then((rbody) => {
            // console.log(rbody);
        })
        .then(() => {
            sname.value = "";
            lat.value = "";
            long.value = "";
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
    }
    else if(lat >= -90 && lat<= 90 && lon >= -180 && lon<= 180)
    {
        alert("Invalid Coordinates");
    }
    else{
        alert("No Incomplete Submissions Allowed");
    }
}