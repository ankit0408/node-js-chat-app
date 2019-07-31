const socket = io()


//elements
const $messageForm = document.querySelector('#message-form')
const $messageInput = document.querySelector('input')
const $sendButton = document.querySelector('button')
const $locationButton = document.querySelector('#location')
const $messages =document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Option
const { username, chatroom}=Qs.parse(location.search ,{ignoreQueryPrefix:true})
//autoscroll

const autoscroll=() =>{
    //new message elemet
    const $newMessage= $messages.lastElementChild

    //new message height
    const newmessageStyle=getComputedStyle($newMessage)
    const newmessageBottomMargin=parseInt(newmessageStyle.marginBottom)
    const newmessageTopMargin=parseInt(newmessageStyle.marginTop)
    const newmessageHeight=$newMessage.offsetHeight + newmessageBottomMargin + newmessageTopMargin

    //visible height
    const visibleHeight=$messages.offsetHeight

    //height of message container
    const containerHeight= $messages.scrollHeight

    //how my i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newmessageHeight <= scrollOffset ){
        $messages.scrollTop= $messages.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        //message:message
        //as both are same we can use the shorthand
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a ')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

//location message
socket.on('locationMessage',(message)=>{
    console.log(message)
    const html = Mustache.render(locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a ')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
    
})

socket.on('roomData',({room ,users})=>{
   console.log(room)
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
        
    })
    document.querySelector('#sidebar').innerHTML=html
})




//sending the message
$messageForm.addEventListener('submit', (e)=>{
    
    e.preventDefault()
    // const message=document.querySelector('input').value
    const message = e.target.elements.message.value
    
    //disabling the form
    $sendButton.setAttribute('disabled','disabled')
    
    socket.emit('sendMessage',message , (callback) => {
        
        
        $sendButton.removeAttribute('disabled')
        $messageInput.value=''
        $messageInput.focus()
        console.log('Message Delivered!',callback)
    })
})

//sending the location
$locationButton.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Your browser does not support this function')
    }
    $locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition( (position) => {
        console.log(position)
        
        socket.emit('sendLocation' ,{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },() => {
            $locationButton.removeAttribute('disabled')
            $messageInput.focus()
            console.log('Location is recieved')
           
        })

        
        

    })
    
})

socket.emit('join',{username,chatroom},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})
