const users=[]

//Adding a User
const addUser = ({id,username,chatroom}) =>{
    username=username.trim().toLowerCase()
    chatroom=chatroom.trim().toLowerCase()
   
    console.log(id)
    console.log(username)
    console.log(chatroom)

    //validation of data
    if(!username || !chatroom)
    {   
        return {
            error:'Username and chatroom are required'
        }
    }

    //check for existing user
    const existingUser= users.find((user) =>{
        return user.chatroom== chatroom && user.username==username
    })
    if(existingUser)
    {
        return{
            error:'Username already in use'
        }
    }
    //store user
    const user={ id,username,chatroom}
    users.push(user)
    console.log(user)
    return({user})
}

const deleteUser =(id) => {
    const index =users.findIndex((user) => {
        return user.id === id

    })
    if(index!==-1)
    {
       return users.splice(index,1)[0]
    }
}
  

const getUser =(id) => {
   return users.find((user) => user.id === id)
    
}
const getUsersByRoom =(room) => {
    room=room.trim().toLowerCase()
    return users.filter((user) => user.chatroom === room)
}

 


module.exports={
    addUser,
    deleteUser,
    getUser,
    getUsersByRoom
}