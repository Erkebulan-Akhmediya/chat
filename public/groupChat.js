const socket = io()

const input = document.getElementById('message')
const button = document.getElementsByTagName('button')[0]
const sender = document.getElementById('sender').innerHTML
const receiver = document.getElementById('receiver').innerHTML

button.addEventListener('click', () => {
    socket.emit('groupChatMessage', {
        from: sender, 
        to: receiver,
        message: input.value,
    })
})

socket.on('groupChatMessage', () => {
    document.location.reload(true)
})