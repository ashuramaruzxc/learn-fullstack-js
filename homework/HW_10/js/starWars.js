
let tbody = document.getElementById(`tbodySW`)

fetchToTable('https://swapi.dev/api/people/1/', tbody)


function fetchToTable(url, tbody) {
    tbody.innerHTML = ``;

/*    fetch(url)
        .then(res => res.json())*/

        myFetch(url)
        .then(luke =>{
            console.log(luke)
            for(let i  in luke){
                tbody.append(createRow(i, luke[i]))
            }
        })
        //.then(addEventOnButtons)
}


function createRow(kay, value) {
    let tr = document.createElement(`tr`);
    let td = document.createElement(`td`);
    let td2 = document.createElement(`td`);

    td.textContent = kay

    if (value instanceof Array){

        for(let i of value){
/*            let span = document.createElement(`span`)
            span.textContent = i;

            td2.append(span);
            td2.append(document.createElement(`br`))*/
            getSpanOrButtonByContext(i, td2);
        }
    } else getSpanOrButtonByContext(value, td2)

    tr.append(td);
    tr.append(td2);

    return tr
}


function getSpanOrButtonByContext(string = ``, td) {

    let element;

    if(typeof string === `string` && string.startsWith(`http://swapi.dev/api/`)){

        element = document.createElement(`button`)
        element.url = string;
        getNameByUrl(string).then(i => element.textContent = i);
        element.onclick = function(event){
            fetchToTable(event.target.url, tbody)}
    } else {

        element = document.createElement(`span`)
        element.textContent = string;
    }

    td.append(element);
   // td.append(document.createElement(`br`))
}



function getNameByUrl(url) {

   return fetch(url)
        .then(res => res.json())
      // .then(a => delay(1000, a))
        .then((json = {name:`not found`}) =>{
            return  json.name || json.title;
        })
}


function delay(t, v) {
    return new Promise(function(resolve) {
        setTimeout(resolve.bind(null, v), t)
    });
}


function myFetch(url){
    return new Promise(function (resolve, reject){
        const xhr = new XMLHttpRequest()
        xhr.open(`GET`, url);
        xhr.send()

        xhr.onload = function() {
            if(xhr.status !== 200 ){
                reject(new Error("o_O"));
            } else resolve(JSON.parse(xhr.response))
        }

    })
}