let socket = io()

const input = document.getElementById('message')
const button = document.getElementById('button')
const sender = document.getElementById('sender').innerHTML
const receiver = document.getElementById('receiver').innerHTML

button.addEventListener('click', () => {
    socket.emit('message', {
        from: sender,
        to: receiver,
        message: input.value,
    })
})

socket.on('message', () => {
    document.location.reload(true)
})