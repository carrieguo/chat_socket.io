$(function () {
    const socket = io();
    let username;
    let typing = false;
    let selectedUser = 'Public';
    $('#nameModal').modal('show');
    $('#nameModal').on('shown.bs.modal', function () {
        $('#nameInput').focus();
    });
    $('.save').on('click', function () {
        username = $('#nameInput').val();
        $('#nameModal').modal('hide');
        $('header .name').html(username);
        socket.emit('come in', username);
    });
    $('form#login').submit(e => {
        e.preventDefault();
        $('.save').click();
    });

    $('#inputMsg').on('keydown', e => {
        if(!typing) {
            typing = true;
            socket.emit('typing', username);
            timeout = setTimeout(noTyping, 1000);
        }
    });

    function noTyping() {
        typing = false;
        socket.emit('no typing');
    }

    $('.dropup').on('show.bs.dropdown', function() {
        $('.dropdown-menu li').on('click', function(e) {
            selectedUser = $(e.currentTarget).data('user');
            $('#sendtoList span.selected-user').html(selectedUser);
        });
    });

    $('form#sendMsg').submit(function (e) {
        let inputData = $('#inputMsg').val();
        e.preventDefault(); // prevents page reloading
        if(selectedUser === "Public") {
            socket.emit('chat message', username, inputData);
            $('#messages').append($('<li class="right">').text(inputData));
        } else {
            socket.emit('private', username, inputData, selectedUser);
            $('#messages').append($('<li class="right">').html('send to' + selectedUser + ': ' + inputData));
        }
        
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

    socket.on('private msg', function(data) {
        $('#messages').append($('<li class="private">').html('from' + data.from + ': ' + data.msg));
    });

    socket.on('leave', function(name) {
        $('#messages').append($('<li class="leave">').text(name + ' leaves '));
    });

    socket.on('onlineListUpdate', function(list) {
        var onlineText = 'online list: ';
        var sendtoHtml = '<li data-user="Public"><a>Public</a></li>';
        list.map(function(name) {
            if(name !== username) {
                onlineText += name + ', ';
                sendtoHtml += '<li data-user="' + name + '"><a>' + name + '</a></li>';
            }
        });
        $('.online-list label').html(onlineText);
        $('#sendMsg ul.dropdown-menu').html(sendtoHtml);
    });

    socket.emit()
});