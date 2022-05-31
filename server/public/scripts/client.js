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
//This function will take in what column has a sorting button and sort it in ASC
function toggleTableSorting() {
    //Checking what column we clicked on
    let columnSort = $(this).parent().data('sorting')
    console.log(columnSort);
        //Sending POST request to give the server column name 
        $.ajax({
            url: '/todo-list/sort/' + columnSort,
            method: 'POST',
            data: columnSort
        })
        //server responds with the new Order of rows to display
        .then((response) => {
            console.log('success on sort', response)
            renderTaskList(response);
        })
        .catch((err) => {
            console.log('sort failed', err)
        })
    

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

//Function to render my task list to DOM
function renderTaskList(list) {
    let el = $('#task-list-table-body')
    //empties table
    el.empty();
    for(let task of list) {
        //Var to format my Date
        let dueDate = new Date(task.dueDate);
        //Var set empty for now, its a formatting thing
        let dateComplete;
        //Var to format date
        let dateCreated = new Date(task.dateCreated);
        //Var set to empty will change in if statement
        let project;
        //Will display nothing on DOM apposed to display "null"
        if(task.notes === null){
            task.notes = ''
        }
        //Will display nothing on DOM apposed to display "null"
        //if not null will display date completed nicely
        if(task.dateCompleted === null){ 
            dateComplete = '-'
        }
        else {
            dateComplete = new Date(task.dateCompleted).toLocaleDateString()
        }
        //Will display nothing on DOM apposed to display "null"
        //or project name 
        if(task.project === null) {
            project = ''
        }
        else {
            project = task.project
        }
        //Setting this to empty to change in next if statement
        let completed;

        //This if statement is checking if the task is still in progress to. If still in progress it will display as normal
        //If inProgress is false it will add a class on tr and on div to change text color or circle color and will
        //also disable the complete button to really show its been done!
        if(task.inProgress){
            completed = `
            <tr data-task-item-id="${task.id}">
            <td>${task.category}</td>
            <td>${project}</td>
            <td>${task.task}</td>
            <td>${task.priority}</td>
            <td>${dueDate.toLocaleDateString()}</td>
            <td>${dateCreated.toLocaleDateString()}</td>
            <td data-task-complete="${task.inProgress}">
                <button class="btn btn-success mark-as-complete-button">Complete</button>
                <div class="is-in-progress-circle"></div>   
            </td>
            <td>${dateComplete}<button class="btn btn-danger delete-task-button">Delete</button></td>
            <td class="notes-column">${task.notes}</td>
            
            `
        }
        else {
            completed = `
            <tr class="task-is-complete" data-task-item-id="${task.id}">
            <td>${task.category}</td>
            <td>${project}</td>
            <td>${task.task}</td>
            <td>${task.priority}</td>
            <td>${dueDate.toLocaleDateString()}</td>
            <td>${dateCreated.toLocaleDateString()}</td>
            <td data-task-complete="${task.inProgress}">
                <button class="btn btn-success mark-as-complete-button" disabled>Complete</button>
                <div class="is-completed-circle"></div>   
            </td>
            <td>${dateComplete}<button class="btn btn-danger delete-task-button">Delete</button></td>
            <td class="notes-column">${task.notes}</td>
            
            `
        }
        //Appends appropriate tr to DOME
        el.append(completed)
    
    }
} 
//Function to submit your task to the db for long term storage
function submitTask() {
    //Grabs inputs
    let taskToSend = {
        category: $('#category-input').val(),
        project: $('#project-input').val(),
        task: $('#task-name-in').val(),
        priority: $('#task-priority').val(),
        dueDate: $('#due-date-in').val(),
        notes: $('#notes-in').val()
    }
    //Sends HTTP POST request
    $.ajax({
        url:'/todo-list',
        method: 'POST',
        data: taskToSend
    })
    //Once server responds it will hide the input field, empty inputs, grab tasks to display on DOM with new one added.
    .then((response) => {
        console.log('POST success', response);
        toggleInputDisplay();
        emptyInputs();
        getTasks();
    })
    .catch((err) => {
        alert('Failed to add task');
        console.log('POST failed', err)
    });
}
//Empty them inputs, tried to add a class but it did not work this time and messed up my layout
function emptyInputs() {
    $('#category-input').val('');
    $('#project-input').val('');
    $('#task-name-in').val('');
    $('#due-date-in').val('');
    $('#notes-in').val('');
}

//Function to delete a task when its not longer needed
function deleteTask() {
    let tr = $(this).parents('tr');
    let taskId = tr.data('task-item-id');
    console.log('task id is', taskId);
    //Sweet alert to verify you want to delete said tasks
    Swal.fire({
        title: 'Are you sure you want to delete this task',
        text: "You will not be able to retrieve this task!",
        icon: 'warning',
        confirmButtonText: 'Yes, delete it!',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      
      })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your task has been deleted.',
            'success'
          )
          //Sends a DELETE request to server to delete the task from DB
        $.ajax({
            url: `/todo-list/${taskId}`,
            method: 'DELETE',
        })
        //once the server sends a response it retrieves the list from db to display updated list to DOM
            .then(() => {
                console.log('DELETE task successful');
                getTasks()
            })
            .catch((err) => {
                console.log(`DELETE tasks failed ${err}`)
                alert('Unable to Delete Task at this time')
            })
        }
        else{
            Swal.fire('Your task has been saved')
        }
    });
    
                

 
}
//Function to update your task list
function updateTask() {
    //Grabs task id to ensure we're completing the right one.
    let taskId = $(this).parents('tr').data('task-item-id')
    console.log('this is the task id', taskId)
    //Checks the current status of said tasks
    let inProgressData = $(this).parent().data('task-complete')
    console.log('This is in progress data', inProgressData)

    
    //set an object to send out the current status of task to server
    let inProgress = {
        inProgress: inProgressData
    }

    //HTTP request to PUT(update) if the task is complete
    $.ajax({
        url: '/todo-list/' + taskId,
        method: 'PUT',
        data: inProgress
    })
    //Once server sends a response back it will retrieve the list from server/db to display an updated version of task list to DOM
    .then(() => {
        console.log('PUT success');
        getTasks();
    })
    .catch((err) => {
        console.log('PUT failed', err)
        alert('Unable to Mark as complete at this time')
    })
}