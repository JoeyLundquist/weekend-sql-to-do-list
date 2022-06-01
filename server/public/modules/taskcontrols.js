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

    if($('#task-name-in').val() === '' || $('#due-date-in').val() === ''){
        alert('You need a task name, and due date.')
        return false;
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