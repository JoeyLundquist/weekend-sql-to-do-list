$(readyNow)

function readyNow() {
    console.log('js')

}

function getTasks() {
    console.log('In GET tasks')


    $.ajax({
        url:'/todo-list',
        method: 'GET'
    })
    .then((response) => {
        console.log('Success on GET')
        renderTaskList(response)
    })
    .catch((err) => {
        console.log('Failed to GET', err)
    })

}


function renderTaskList(task) {
    
}