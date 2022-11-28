let socket = io()

socket.on('message', () => {
    document.location.reload(true)
})