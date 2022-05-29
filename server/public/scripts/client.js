$(readyNow)

function readyNow() {
    console.log('js')
    getTasks();
    setUpClickListeners();
}

function setUpClickListeners() {
    $('#submit-button').on('click', submitTask);
    $(document).on('click', '.delete-task-button', deleteTask);
    $(document).on('click', '.mark-as-complete-button', updateTask)
    $('#add-task-button').on('click', toggleInputDisplay)
    $('.table-sorting').on('click', toggleTableSorting)
}

function toggleTableSorting() {
    let columnSort = $(this).parent().data('sorting')
    console.log(columnSort);
        
        $.ajax({
            url: '/todo-list/sort/' + columnSort,
            method: 'POST',
            data: columnSort
        })
        .then((response) => {
            console.log('success on sort', response)
            renderTaskList(response);
        })
        .catch((err) => {
            console.log('sort failed', err)
        })
    

}
let invisible = true;

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

function getTasks() {
    console.log('In GET tasks')
    $.ajax({
        url:'/todo-list',
        method: 'GET'
    })
    .then((response) => {
        console.log('Success on GET', response)
        renderTaskList(response)
    })
    .catch((err) => {
        console.log('Failed to GET', err)
    })

}


function renderTaskList(list) {
    let el = $('#task-list-table-body')
    el.empty();
    for(let task of list) {
        let dueDate = new Date(task.dueDate);
        let dateComplete;
        let dateCreated = new Date(task.dateCreated);
        let project;
        if(task.notes === null){
            task.notes = ''
        }

        if(task.dateCompleted === null){ 
            dateComplete = '-'
        }
        else {
            dateComplete = new Date(task.dateCompleted).toLocaleDateString()
        }

        if(task.project === null) {
            project = ''
        }
        else {
            project = task.project
        }

        let completed;

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
            <td>${task.notes}</td>
            
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
            <td>${task.notes}</td>
            
            `
        }

        el.append(completed)
    
    }
} 

function submitTask() {
    let taskToSend = {
        category: $('#category-input').val(),
        project: $('#project-input').val(),
        task: $('#task-name-in').val(),
        priority: $('#task-priority').val(),
        dueDate: $('#due-date-in').val(),
        notes: $('#notes-in').val()
    }

    $.ajax({
        url:'/todo-list',
        method: 'POST',
        data: taskToSend
    })
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

function emptyInputs() {
    $('#category-input').val('');
    $('#project-input').val('');
    $('#task-name-in').val('');
    $('#task-priority').val('');
    $('#due-date-in').val('');
    $('#notes-in').val('');
}

function deleteTask() {
    let tr = $(this).parents('tr');
    let taskId = tr.data('task-item-id');
    console.log('task id is', taskId);

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
        $.ajax({
            url: `/todo-list/${taskId}`,
            method: 'DELETE',
        })
            .then(() => {
                console.log('DELETE task successful');
                getTasks()
            })
            .catch((err) => {
                console.log(`DELETE tasks failed ${err}`)
            })
        }
        else{
            Swal.fire('Your task has been saved')
        }
    });
    
                

 
}

function updateTask() {
    let taskId = $(this).parents('tr').data('task-item-id')
    console.log('this is the task id', taskId)

    let inProgressData = $(this).parent().data('task-complete')
    console.log('This is in progress data', inProgressData)

    

    let inProgress = {
        inProgress: inProgressData
    }


    $.ajax({
        url: '/todo-list/' + taskId,
        method: 'PUT',
        data: inProgress
    })
    .then(() => {
        console.log('PUT success');
        getTasks();
    })
    .catch((err) => {
        console.log('PUT failed', err)
    })
}