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