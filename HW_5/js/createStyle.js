/*add an event to the label, when clicked, which goes into focus*/
function phSetOnclick(){
    let phArr =  document.getElementsByClassName("placeholder-label");
    let l = phArr.length;
    for (let i = 0; i < l; i++) {
        phArr[i].onclick = (a)=>{
            a.target.previousElementSibling.focus();
        }
        phArr[i].previousElementSibling.onblur = function(a){
            if(a.target.value !== "")
                a.target.nextElementSibling.style.opacity = "0"
            else a.target.nextElementSibling.style.opacity = "1";
        }
        if(phArr[i].previousElementSibling.value !== "")
            phArr[i].style.opacity = "0"
        else phArr[i].style.opacity = "1";
    }
}
phSetOnclick();
/* END add an event to the label, when clicked, which goes into focus*/

/*hover*/

function onHover(querySelectors, styleName, value){
    let queryElem = document.querySelectorAll(querySelectors)
    let l = queryElem.length
    for(let i = 0; i < l; i++){
        console.log(queryElem[i]);
        queryElem[i].onmouseover = function(a){
            console.log(a.target.style[styleName]);
            a.target.style[styleName] = value;
            queryElem[i].onmouseout = () => addStyleByList(styleList);
        }
    }
}
onHover("form *[type=\"button\"]","background-color","#1ac4a3 ")
/*END hover*/

let styleList = {

    "*": { "box-sizing": "border-box",
        "margin": "0",
        "padding":"0"},

    ".wrap" : {"display": "flex",
        "justify-content": "center"},

    "form" : {"display": "flex",
        "flex-direction": "column",
        "align-items": "stretch",
        "background": "\#14303c",
        "color": "white",
        "height": "400px",
        "width": "400px",
        "padding": "1.5rem",
        "justify-content": "space-between"},

    "form > *" : {"display": "flex",
        "justify-content": "center"},

    "form > div input" : {"width": "100%"},

    "form *[type=\"text\"]" : { "height": "2rem",
        "padding": "0.5rem",
        "color": "inherit",
        "background-color" : "\#14303c",
        "border": "1px solid #808f95",
        "font-size": "0.9rem" },

    "form *[type=\"button\"]" : {"height": "3rem",
        "color": "inherit",
        "background-color": "\#1ab188",
        "border": "0",
        "font-size": "0.9rem" },

    "form *[type=\"button\"]:disabled" : { "background-color": "\#435259",
        "color": "\#a4aead"  },

    ".div-name" : {"margin-right": "1rem"},

    "#get-started" : {"font-size": "1.2rem",
        "letter-spacing": "0.2rem"},

    ".wrap-input" : {"position": "relative",
        "display": "inline-block"},

    ".wrap-input label" :   {"position": "absolute",
        "left": "0.5em",
        "top": "50%",
        "margin-top": "-0.5rem",
        "color": "\#8b959f"},

    ".star" :  {"content": "\"*\"",
        "color": "\#1ab188"},

    "#out" : {"font-size": "1.5rem",
        "color" : "red"}
}

function addStyleByList(styleList) {

    for(let key in styleList){

        let elem = document.querySelectorAll(key)
        let l = elem.length;

        for (let i = 0; i < l; i++) {
            for (let styleName in styleList[key]){
                elem[i].style[styleName] = styleList[key][styleName];
            }
        }

    }
}

addStyleByList(styleList);

/*add font*/

var newStyle = document.createElement('style');
newStyle.appendChild(document.createTextNode("\
@font-face {\
    font-family: orgon;\
    src: url(\"fonts/orgon-light.ttf\");\
}\
\
\
\
" + ".wrap-input > input[type=text]:focus + label {\n" +
    "    display: none;\n" +
    "}\n" +
    "\n" +
    ".placeholder-label:hover{\n" +
    "    cursor: text;\n" +
    "}\n"));
document.head.appendChild(newStyle);
document.getElementsByTagName("form")[0].style["font-family"] = "orgon"

/*END add font*/

