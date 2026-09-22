  const todoForm = document.getElementById("todoForm");
  const updateTodoBtn = document.getElementById("updateTodoBtn");


let todosArray = JSON.parse(localStorage.getItem("todosArray")) || [];
function setLocalStorage(){
  localStorage.setItem("todosArray", JSON.stringify(todosArray));
}

function snackBar(msg){
  Swal.fire({
    text: msg,
    icon: "success",
    timer : 3000
  });
}
// read
function renderTodos(arr){
  const todosContainer = document.getElementById("todosContainer");
  let res = ``;
  arr.forEach(todo => {
    res += `
      <li class="list-group-item d-flex justify-content-between" id="${todo.id}">
                <strong>${todo.todoItem}</strong>
                <div>
                  <button onclick="onEdit(this)" class="btn btn-sm btn-info mr-2">Edit</button>
                  <button onclick="onDelete(this)" class="btn btn-sm btn-danger">Delete</button>
                </div>
        </li>
    `
  });
  todosContainer.innerHTML = res;
}

renderTodos(todosArray);

//create
function onFormSubmit(event){
  const todoInput = document.getElementById("todoItem");
  const todosContainer = document.getElementById("todosContainer");
  event.preventDefault();
  const newTodoObj = {
    todoItem : todoInput.value,
    id : crypto.randomUUID()
  }
  todoForm.reset();
  todosArray.push(newTodoObj);
  setLocalStorage();
  let newLi = document.createElement("li");
  newLi.id = newTodoObj.id;
  newLi.className = "list-group-item d-flex justify-content-between";
  newLi.innerHTML = `
    <strong>${newTodoObj.todoItem}</strong>
                <div>
                  <button onclick="onEdit(this)" class="btn btn-sm btn-info mr-2">Edit</button>
                  <button onclick="onDelete(this)" class="btn btn-sm btn-danger">Delete</button>
                </div>
  `
  todosContainer.append(newLi);
  snackBar(`Todo added successfully...`);
}

//edit
function onEdit(ele){
  const todoInput = document.getElementById("todoItem");
  const addTodoBtn = document.getElementById("addTodoBtn");
  const updateTodoBtn = document.getElementById("updateTodoBtn");

  const editId = ele.closest("li").id;
  localStorage.setItem("updateId", editId);
  const editObj = todosArray.find( todo => todo.id === editId);
  todoInput.value = editObj.todoItem;
  addTodoBtn.classList.add("d-none");
  updateTodoBtn.classList.remove("d-none");
}

//update
function onUpdate(){
  const todoInput = document.getElementById("todoItem");
  const updateId = localStorage.getItem("updateId");
  localStorage.removeItem("updateId");
  const updatedObject = {
    todoItem : todoInput.value,
    id : updateId
  }
  todoForm.reset();
  const updateIndex = todosArray.findIndex(todo => todo.id === updateId);
  todosArray[updateIndex] = updatedObject;
  setLocalStorage();
  let udpateLi = document.getElementById(updateId);
  udpateLi.querySelector("strong").innerText = updatedObject.todoItem;
  addTodoBtn.classList.remove("d-none");
  updateTodoBtn.classList.add("d-none");
  snackBar(`Todo updated successfully...`);
}

//delete
function onDelete(ele){
  const deleteId = ele.closest("li").id;
  Swal.fire({
  title: "Are you sure?",
  text: "You want to delete this todo?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    const deleteIndex = todosArray.findIndex( todo => todo.id === deleteId);
    todosArray.splice(deleteIndex,1);
    setLocalStorage();
    ele.closest("li").remove();
    Swal.fire({
    title: "Deleted!",
    text: "Your file has been deleted.",
    icon: "success"
  });
  } 
});
}
todoForm.addEventListener("submit",onFormSubmit);
updateTodoBtn.addEventListener("click", onUpdate);

