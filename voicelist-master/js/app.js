const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

let LIST
let id;

async function getDatabaseItems(){
    const response = await fetch('http://localhost:8080/items');
    const json = await response.json();
    console.log(json);
    return json;
    
}

const data = getDatabaseItems().then((data) => {
    if(data){
        LIST = data;
        id = LIST.length;
        console.log(LIST)
        loadList(LIST);
    }
    else{
        LIST = [];
        id = 0;
    }
});

function loadList(array){
    array.forEach(function(item){
        addToDo(item.title, item.id, item.done, item.trash);
    })
}

clear.addEventListener("click", function(event){
    const refreshIcon = event.target;
    const ul = refreshIcon.parentNode.parentNode.parentNode.children[1].children[0];
    console.log(ul);
    /*
    for(let i = 1; i < LIST.length+1; i++){
        removeToDo()
    }
    */
    //location.reload();
})

const options = {weekday: "long", month: "short", day: "numeric"};
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

function addToDo(toDo, id, done, trash){
    if(trash){return; }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";
    const item = `
        <li class="item">
        <i class="fa ${DONE} co" job="complete" id="${id}"></i>
        <button class ="btn btn-format" style="font-size:24px" id="${id}">edit</button>
        <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
        <p class="text ${LINE}">${toDo}</p>
        </li>
    `;
    const position = "beforeend";
    list.insertAdjacentHTML(position, item);
}


document.addEventListener("keyup", function(event){
    
    if(event.keyCode == 13){
        const toDo = input.value;
        if(toDo){
            todoItem = {
                title: toDo,
                body: "body"
            }
            postData("http://localhost:8080/items", todoItem)
            addToDo(toDo, id, false, false);
            LIST.push({
                title: toDo,
                id: id,
                done: false,
                trash: false
            });
            
            id++;
        }
        input.value = "";
    }
});

async function postData(url, data) {
    await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    
}
  

function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    const data = {
        title: "title",
        body: "body"
    }
    deleteData(`http://localhost:8080/items/${element.id}`, data);
    
}
async function deleteData(url, data) {
    await fetch(url, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    
}


let val = 0;
list.addEventListener("click", function(event){
    const element = event.target;
    console.log(element);
    let elementJob;

    if(element.getAttribute("Job") === 'undefined')
    {
        elementJob = "edit";
    }
    else if (element.getAttribute("Job"))
    {
        elementJob = element.attributes.job.value;
    }

    if(elementJob == "complete"){
        completeToDo(element);
    }

    
    const editBtn = event.target;
    console.log(editBtn);
        
    if(editBtn.getAttribute("class") === 'btn btn-format') {
        if(editBtn.textContent === 'edit')
        {
            console.log("test btn");
            const para = editBtn.parentNode.lastElementChild;
            const li = editBtn.parentNode.parentNode;
            console.log(para);
            console.log(li);
            console.log(para.textContent);
            const input = document.createElement('input');
            input.id = "edit-input";
            input.type = 'text';
            input.value = para.textContent;
            console.log("start");
            console.log(element.id);
            li.children[element.id - 1].insertBefore(input, para);
            val = input;
            console.log(input.value);
            li.children[element.id - 1].removeChild(para);
            console.log("finish");
            editBtn.textContent = 'save';
            console.log("done");
            
        } 
        else if(editBtn.textContent === 'save') {
            console.log("running");
            const li = editBtn.parentNode;
            const input = val;
            console.log(val);
            const para2 = document.createElement('p');
            para2.textContent = input.value;
            para2.id = "edit-input";
            li.insertBefore(para2, input);
            li.removeChild(input);
            editBtn.textContent = 'edit';
            console.log(element.id);
            const data = {
                title: input.value,
                body: "body"
            }
            console.log(data.title)
            editData(`http://localhost:8080/items/${element.id}`, data)

        }
    }
  
      
    else if(elementJob == "delete"){
        removeToDo(element);
    }

});

async function editData(url, data) {
    await fetch(url, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    
}