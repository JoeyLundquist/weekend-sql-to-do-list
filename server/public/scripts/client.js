$(readyNow)

function readyNow() {
    console.log('js')
    getTasks();
    setUpClickListeners();
}

function setUpClickListeners() {
    $('#submit-button').on('click', submitTask)
    $(document).on('click', '.delete-task-button', deleteTask)
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
        let completed;
        let project;
        if(task.inProgress){
            completed = 'No'
        }
        else { 
            completed = 'Yes'
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

        el.append(
            `<tr data-task-item-id="${task.id}">
                <td>${task.category}</td>
                <td>${project}</td>
                <td>${task.task}</td>
                <td>${task.priority}</td>
                <td>${dueDate.toLocaleDateString()}</td>
                <td>${dateCreated.toLocaleDateString()}</td>
                <td><button id="mark-task-as-complete" class="mark-as-complete-button">Complete</button>${completed}</td>
                <td>${dateComplete}<button class="delete-task-button">Delete</button></td>
                <td>${task.notes}</td>
                
                `
        )
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

    $.ajax({
        url: '/todo-list/' + taskId,
        method: 'DELETE'
    })
        .then(() => {
            console.log('DELETE task successful');
            getTasks()
        })
        .catch((err) => {
            console.log(`DELETE tasks failed ${err}`)
        })
}