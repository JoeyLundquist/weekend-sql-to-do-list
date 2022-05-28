$(readyNow)

function readyNow() {
    console.log('js')
    getTasks();
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

        el.append(
            `<tr data-task-item-id="${task.id}">
                <td>${task.category}</td>
                <td>${task.task}</td>
                <td>${task.priority}</td>
                <td>${dueDate.toLocaleDateString()}</td>
                <td>${dateCreated.toLocaleDateString()}</td>
                <td><button id="mark-task-as-complete" class="mark-as-complete-button">Complete</button>${completed}</td>
                <td>${dateComplete}</td>
                <td>${task.notes}</td>
                
                `
        )
    }
}