
// FUNCTIONS //

// Displays the result of the message submission (successful or failed)
function displaySubmitStatus(status) {
    var submitMsg, submitColor;

    if (status === 'success') {
        submitMsg = 'Your secret message has been successfully submitted!';
        submitColor = 'green';
    } else if (status === 'fail') {
        submitMsg = 'Your secret message failed to submit. <br> Please try again.';
        submitColor = 'red';
    } else {
        alert('INVALID SUBMIT STATUS! CONTACT THE DEVELOPER!');
        return;
    }

    document.getElementById('resultMsg').innerHTML = submitMsg;
    document.getElementById('resultMsg').style.color = submitColor;

    document.getElementById('postLabel').style.display = 'none';
    document.getElementById('post').style.display = 'none';
    document.getElementById('post').value = '';
    document.getElementById('submitPost').style.display = 'none';

    document.getElementById('resultMsg').style.display = 'block';

    setTimeout(() => {
        document.getElementById('closePostWindow').click();

        document.getElementById('resultMsg').style.display = 'none';
        document.getElementById('postLabel').style.display = 'block';
        document.getElementById('post').style.display = 'block';

        document.getElementById('post').style.marginLeft = '30%';
        document.getElementById('post').style.marginTop = '-1.5%';
        document.getElementById('submitPost').style.marginTop = '-0.5%';

        if (status === 'success') {
            location.reload();
        }
    }, 1000);
}

// Displays the anonymous messages fetched from the database
function displayMessages(posts) {
    var message, date, card, cardBody, cardTitle, cardText, post;

    for (var i = posts.length - 1; i >= 0; i--) {
        post = posts[i];

        message = post.message;
        date = post.date;

        card = document.createElement('DIV');
        card.className = 'card border-0';

        cardBody = document.createElement('DIV');
        cardBody.className = 'card-body rounded';

        cardTitle = document.createElement('DIV');
        cardTitle.className = 'card-title';
        cardTitle.innerHTML = "<p style='color: white; font-weight: bold;'>" + date + "</p>";

        cardText = document.createElement('DIV');
        cardText.className = 'card-text';
        cardText.innerHTML = "<p style='font-weight: bold;'>" + message + "</p>";



        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        card.appendChild(cardBody);

        document.getElementById('messages').appendChild(card);
        document.getElementById('messages').appendChild(document.createElement('BR'));
    }
}
// END OF FUNCTIONS //


// EVENTS //

window.onload = () => {
    var xhttp = new XMLHttpRequest();


    xhttp.open('GET', 'http://localhost/anonpost/requests.php?type=getMessages', true);

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                var posts = JSON.parse(xhttp.responseText);
                displayMessages(posts);
            } else {
                // Do stuff if request fails.
            }
        }
    }

    xhttp.send(null);
}

document.getElementById('openPostWindow').addEventListener('click', () => {
    document.getElementById('postWindow').style.display = 'block';
});


document.getElementById('closePostWindow').addEventListener('click', () => {
    document.getElementById('postWindow').style.display = 'none';
});


document.getElementById('post').addEventListener('keyup', e => {
    var text = e.target.value.replace(/\s/g, '');

    if (text !== '' && text !== null) {
        document.getElementById('submitPost').style.display = 'block';
    } else {
        document.getElementById('submitPost').style.display = 'none';
    }
});


document.getElementById('submitPost').addEventListener('click', () => {
    var data = 'message=' + document.getElementById('post').value;
    var xhttp = new XMLHttpRequest();

    xhttp.open('POST', 'http://localhost/anonpost/requests.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                // Post submitted!
                console.log('successful!');
                displaySubmitStatus('success');
            } else {
                console.log('fail!');
                displaySubmitStatus('fail');
            }
        }
    };

    xhttp.send(data);
});

// END OF EVENTS //
