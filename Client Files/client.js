/*jshint esversion: 6 */
var socket = new WebSocket('ws://localhost:3000');
var team = "";
var roleDropdown = document.getElementById('roleDropdown')
var tasks = document.getElementById('procedureList')
tasks.addEventListener('click', function(task) {
    if (task.target.tagName === 'LI' && !task.target.classList.contains('unclickable')) { //if its a list item and isn't the "Choose your team" item
        finishTask = Array.from(tasks.children).indexOf(task.target) //Grab the index, might not align with server's task object array
        socket.emit("task-complete", JSON.stringify({"teamName":team, "taskNumber":finishTask})); //Tell server the task is done, allow server side to confirm and show task complete
    }

}, false);
socket.addEventListener("teams", (teams) => { //Initial connection packet with team list to populate dropdown
    for (var teamNum in teams) {
        let team = teams[teamNum]; //let means block scope, doesn't interfer with higher team variable
        var newTeam = document.createElement('option');
        newTeam.text = team;
        newTeam.classList.add("role");
        roleDropdown.add(newTeam);
    }
})
socket.addEventListener("task-finish", ([teamName, taskNumber]) => { //Server side event triggered from client's task-complete
    if (team === teamName) { //If the task is relevant
        document.getElementById(taskNumber).classList.toggle('completed') //Set to complete in real time
    }
    //If the task isn't for your team, the task will be in the correct state when you switch 
    //Because the task list is populated with current status from the server 

})
socket.addEventListener("tasks", (tasksObject) => {
    while (tasks.lastElementChild) {
        tasks.removeChild(tasks.lastElementChild);
    } //Remove tasks from previous team view
    tasksObject = JSON.parse(tasksObject);
    for (var taskNumber in tasksObject) {
        task = tasksObject.taskNumber;
        if (tasksObject.hasOwnProperty(taskNumber)) {
            newTask = document.createElement('li')
            newTask.appendChild(document.createTextNode(tasksObject.Task));
            if (tasksObject.Completed === 1) {
                newTask.classList.toggle('completed'); //Add completed class to completed tasks so it shows
            }
            newTask.setAttribute('id', taskNumber);
            tasks.appendChild(newTask);
        }
    }
})
roleDropdown.addEventListener('change', function(e) {
    e.preventDefault();
    team = roleDropdown.options[roleDropdown.selectedIndex].text; //sets team name
    socket.emit('role-request', team);
});