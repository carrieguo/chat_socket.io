$(function () {
    const socket = io();
    let name;
    $('#nameModal').modal('show')
    $('#nameModal').on('shown.bs.modal', function () {
        $('#nameInput').focus()
    })
    $('.save').on('click', function () {
        name = $('#nameInput').val();
        $('#nameModal').modal('hide');
        socket.emit('come in', name);
    });

    $('form').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', name, $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('display come in', function(name) {
        $('#messages').append($('<li class="come-in">').text(name + ' comes in '));
    });

    socket.on('display chat message', function (name, msg) {
        $('#messages').append($('<li>').text(name + ' says: ' + msg));
    });

    socket.on('leave', function(name) {
        $('#messages').append($('<li class="leave">').text(name + ' leaves '));
    });
});