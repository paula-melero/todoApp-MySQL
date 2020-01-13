//document.querySelector()
// Returns the first element within the document that matches the specified selector or group of selectors
//e.g. var title = document.querySelector('#title');

/*
appendChild() -> adds a node to the end of the list of children of a specified parent node
removeChild() -> removes a child node from the DOM
createElement() -> creates the HTML elements specified by tagName
firstChild -> read-only property returns the node's first child in the tree
*/

var taskid = 1;
var form = document.querySelector('form');
var todoList = document.getElementById('taskList');
var button = document.getElementById('clear');
var taskName = document.getElementById('user-todo');
var description = document.getElementById('user-description');
var todosArray = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []; // ? is a conditional. Whatever comes after is what we do when statement is true. everything after : is what we do when the condition is false. If false, set to empty array
localStorage.setItem('todos', JSON.stringify(todosArray)); //local storage works with strings, so we need to stringify any object/data we send to the browser
var storage = JSON.parse(localStorage.getItem('todos'));//to get data from storage, we have to convert the string format into JS objects. We do this with JSON.parse

class Task {
    constructor(id, name, description){
        this.id = id,
        this.name = name.value,
        this.description = description.value,
        this.creationDate = new Date(),
        this.status = 'to do'
    }
}

//add task
form.addEventListener('submit', function(event) {
    
      event.preventDefault(); //will keep the page from refreshing (refreshing is the default action)

      var task = new Task(todosArray.length + 1, taskName, description);
      addTask(task);
      name.value = '';
      description.value = '';
    })

//delete task 
todoList.addEventListener('click', function(event) {
    console.log('ID TO DELETE', event.target.id);
    if(event.target.id){
        deleteTask(event.target.id);
    };
})

//clear list
button.addEventListener('click', function() {

    localStorage.clear();

    //while loop to empty todoList
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }

})

//1: create HTML for a task object
function createTaskElements(taskInfo) {

    return content = `
    <div class="listItem">
        <i style="float:right;" id='task${taskInfo.id}' class="fas fa-minus-circle"></i>
        <h2><strong>${taskInfo.title}</strong><h2>
        <h5>${taskInfo.description}</h5><hr>
        <p>${taskInfo.date}</p>
        <p>Status: ${taskInfo.status}</p>
    </div>
    `;
}

//2: send tasks to the DOM
function renderTasks(tasks) {
    
    todoList.innerHTML = tasks;
    
}

//AJAX

//display list items as found in server storage
function getList() {
    
    $.ajax({
        type: 'GET',
        url:'/api/tasks/',
        dataType: 'text',
        success: function(response) {
            console.log(response);
            var myArr = JSON.parse(response);
            var myTasks;
            for(i=0;i<myArr.length;i++) {
                var myObj = myArr[i];
                myTasks = myTasks + createTaskElements(myObj);
            }
            console.log(myTasks);
            renderTasks(myTasks);
        }
    });

}

//Add task to the server storage
function addTask(taskObj) {

    $.ajax({
        type: 'POST',
        url:'/api/tasks/',
        data: {"name": taskObj.name, "description": taskObj.description},
        dataType: 'text',
        success: getList()
            
    });

}

function deleteTask(id) {

    $.ajax({
        type: 'DELETE',
        url:`/api/tasks/${id}`,
        data: {delId: id},
        dataType: 'text',
        success: function(response) {
            var delTask = JSON.parse(delTask);
            alert('The task ' + delTask.name + ' has been deleted');
        }
            
    });

}




