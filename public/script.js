$(function () {
    const socket = io();
    let name;
    let typing = false;
    let timeout;
    $('#nameModal').modal('show')
    $('#nameModal').on('shown.bs.modal', function () {
        $('#nameInput').focus()
    })
    $('.save').on('click', function () {
        name = $('#nameInput').val();
        $('#nameModal').modal('hide');
        $('header .name').html(name);
        socket.emit('come in', name);
    });
    $('form#login').submit(e => {
        e.preventDefault();
        $('.save').click();
    });

    $('#inputMsg').on('keydown', e => {
        

        if(!typing) {
            typing = true;
            socket.emit('typing', name);
            timeout = setTimeout(noTyping, 1000);
        }
        
    });

    function noTyping() {
        typing = false;
        socket.emit('no typing');
    }

    $('form#sendMsg').submit(function (e) {
        let inputData = $('#inputMsg').val();
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', name, inputData);
        $('#messages').append($('<li class="right">').text(inputData));
        $('#inputMsg').val('');
        return false;
    });

    socket.on('display come in', function(name) {
        $('#messages').append($('<li class="come-in">').text(name + ' comes in '));
    });

    socket.on('someone typing', function(name) {
        $('header .typing').html(name + ' is typing...');
    });

    socket.on('no one typing', function() {
        $('header .typing').html('');
    });

    socket.on('display chat message', function (name, msg) {
        $('#messages').append($('<li>').text(name + ' says: ' + msg));
    });

    socket.on('leave', function(name) {
        $('#messages').append($('<li class="leave">').text(name + ' leaves '));
    });
});