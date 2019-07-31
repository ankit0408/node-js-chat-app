const path =require('path')
const http =require('http')
const express =require('express')
const socketio =require('socket.io')
const {generateMessage}= require('../src/utils/messages')
const {generateLocation}= require('../src/utils/messages')
const {addUser, deleteUser,getUser,getUsersByRoom} =require('./utils/users')

const app= express()
const server = http.createServer(app)
const io = socketio(server)
const port= process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')



app.use (express.static(publicDirectoryPath))



io.on('connection' , (socket) => {
    console.log('New Websocket Connection!')

    socket.on('join',(options,callback) => {
        const {error ,user}= addUser({id:socket.id ,...options})
        if(error){
            
            return callback(error)
        }
        if(socket.join(user.chatroom))
        socket.emit('message',generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.chatroom).emit('message',generateMessage('Admin',`${user.username} is Connected!`))
        io.to(user.chatroom).emit('roomData',{
            room:user.chatroom,
            users:getUsersByRoom(user.chatroom)
          })
        callback()
    
    })
    socket.on('sendMessage' , (message, callback) => {
        const user=getUser(socket.id)
        if(user){
            io.to(user.chatroom).emit('message',generateMessage(user.username,message))
        callback('Okay!')
        }
        
        })

        socket.on('disconnect' , () => {
            const user = deleteUser(socket.id)
            if(user){
                io.to(user.chatroom).emit('message',generateMessage( 'Admin' ,`${user.username} is disconnected!`))
                io.to(user.chatroom).emit('roomData',{
                    room:user.chatroom,
                    users:getUsersByRoom(user.chatroom)
                  })
                }
           
            })
    socket.on('sendLocation' , (coordinates, callback) => {
        const user = getUser(socket.id)
        if(user){
            io.to(user.chatroom).emit('locationMessage',generateLocation( user.username,`https://google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`))
        callback()

        }
        
        })
    
   
})


server.listen(port , () =>
{
    console.log('server is ready')
})