$(readyNow)
//Setting up for page load
function readyNow() {
    console.log('js')
    getTasks();
    setUpClickListeners();
}
//Getting click listeners ready
function setUpClickListeners() {
    $('#submit-button').on('click', submitTask);
    $(document).on('click', '.delete-task-button', deleteTask);
    $(document).on('click', '.mark-as-complete-button', updateTask)
    $('#add-task-button').on('click', toggleInputDisplay)
    $('.table-sorting').on('click', toggleTableSorting)
}

//I set this global so it can respond accordingly to hide my input fields until a button is clicked
let invisible = true;
//function to display or hide my input fields
function toggleInputDisplay() {
   
    if(invisible) {
        $('#input-container').css('display', 'block');
        invisible = false
    }
    else {
        $('#input-container').css('display', 'none');
        invisible = true
    }
}
//Function to retrieve my task list ordered by category by default
function getTasks() {
    console.log('In GET tasks')
    //HTTP request to get task list from DB
    $.ajax({
        url:'/todo-list',
        method: 'GET'
    })
    //Once received it will render the list to the DOM
    .then((response) => {
        console.log('Success on GET', response)
        renderTaskList(response)
    })
    .catch((err) => {
        console.log('Failed to GET', err)
        alert('Unable to retrieve list');
    })

}



//Empty them inputs, tried to add a class but it did not work this time and messed up my layout
function emptyInputs() {
    $('#category-input').val('');
    $('#project-input').val('');
    $('#task-name-in').val('');
    $('#due-date-in').val('');
    $('#notes-in').val('');
}


