/**
 * Backend for a procedure checlitst Web app for uORocketry
 * 
 * 
 * Check tasks.json for example format, team names are passed based on top-level JSON objects.
 *
 */

const express = require("express")
const app = express();
const http = require("http");
const webServer = http.createServer(app);
const { Server } = require("socket.io");
const socketServer = new Server(webServer);
const path = require("path");
const fs = require('fs');

app.use(express.static(__dirname));

const tasks = JSON.parse(fs.readFileSync('tasks.json')); //For now, an example file with Star Trek references
var teamList = [] //Passed on intiial connection to the client to populate their dropdown

//Converts Teams' tasks to an object with complete status
//Possible to add key/values like priority, person responsible
for (teams in tasks) {
    teamList.push(teams)
    if (tasks.hasOwnProperty(teams)) {
        for (task in tasks[teams]) {
            if (teams.hasOwnProperty(task)) {
                tasks[teams][task] = { "Task": tasks[teams][task], "Completed": 0 }
            } else {
                console.log(task)
            }
        }
    }
}
//console.log(tasks)
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html") //Sends checklist web page when client connects
});
//handles all the client events, including asking for a team's tasks and fihsing tasks.
socketServer.on("connection", (socket) => {
    socket.emit('teams', teamList); //Needed to populate client dropdown
    socket.on('role-request', (role) => { //Received when Client selects a team from the dropdown
            socket.emit("tasks", tasks[role]) //send task object based on their team name, this is why the dropdown is populated from tasks.json
        })
        //When a client signals they have finished a task, they send the task and task number
        //Task number should be it's position in the task array BUT
        //By standard JSONs are ordered, this MAY not be the case, should investigate ordering.
    socket.on('task-complete', ([teamName, taskNumber]) => {
        //console.log("Task completed " + teamName + taskNumber);
        //Little toggle, if someone clicks a finished task it should revert to incomplete. 
        if (tasks[teamName][taskNumber]['Completed'] == 0) { tasks[teamName][taskNumber]['Completed'] = 1 } else { tasks[teamName][taskNumber]['Completed'] = 0 }
        socketServer.emit('task-finish', [teamName, taskNumber]) //Alerts all connected clients that this task is finished
    })
})
webServer.listen(3000, () => { //3000 for testing, 80 if HTTP 443 if HTTPS
    console.log('Server running on Port 3000');
});