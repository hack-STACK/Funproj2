document.addEventListener('DOMContentLoaded', function() {
    // Initialize forms
    initFormHandlers();

    // Display date message and start confetti
    displayDateMessage();
    startConfetti();
    const dateSound = document.getElementById('dateSound');
    dateSound.play();

    // Show GIF immediately after confetti
    setTimeout(showGif, 3000); // Wait 3 seconds after confetti
});

function initFormHandlers() {
    handleInitialForm();
    handleNameForm();
    handleDateForm();
    handleSpotForm();
    handleExcitementForm();
    enableCustomSpotInput();
}

function handleInitialForm() {
    const initialForm = document.getElementById('initialForm');
    if (initialForm) {
        initialForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const answer = document.querySelector('input[name="answer"]:checked');
            if (answer && answer.value === 'yes') {
                window.location.href = 'name.html';
            } else {
                enlargeYesButton();
            }
        });
    }
}

let yesButtonScale = 1;

function enlargeYesButton() {
    const yesButton = document.querySelector('input[value="yes"]').parentElement;
    yesButtonScale += 0.2; // Increase the scale factor
    yesButton.style.transform = `scale(${yesButtonScale})`;
    yesButton.style.transition = 'transform 0.3s';
    alert('Ayo, pencet "Yes" dong! 😄');
}

function handleNameForm() {
    const nameForm = document.getElementById('nameForm');
    if (nameForm) {
        nameForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value.trim();
            if (name) {
                localStorage.setItem('name', name);
                window.location.href = 'date.html';
            } else {
                alert('Oops! Sepertinya kamu lupa memasukkan namamu!');
            }
        });
    }
}

function handleDateForm() {
    const dateForm = document.getElementById('dateForm');
    if (dateForm) {
        dateForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const date = document.getElementById('date').value;
            if (date) {
                localStorage.setItem('date', date);
                window.location.href = 'spot.html';
            } else {
                alert('Jangan lupa pilih tanggalnya, ya!');
            }
        });
    }
}

function handleSpotForm() {
    const spotForm = document.getElementById('spotForm');
    if (spotForm) {
        spotForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const selectedSpot = document.querySelector('input[name="spot"]:checked');
            let spotValue = '';
            let imageUrl = '';

            if (selectedSpot) {
                if (selectedSpot.value === 'custom') {
                    const customSpot = document.getElementById('customSpot').value.trim();
                    const customSpotImageURL = document.getElementById('customSpotImageURL').value.trim();
                    if (customSpot !== '' && customSpotImageURL !== '') {
                        spotValue = customSpot;
                        imageUrl = customSpotImageURL;
                    } else {
                        alert('Silakan masukkan spot dan URL gambar yang kamu inginkan!');
                        return;
                    }
                } else {
                    spotValue = selectedSpot.value;
                }

                localStorage.setItem('spot', spotValue);
                localStorage.setItem('imageUrl', imageUrl);
                window.location.href = 'excitement.html';
            } else {
                alert('Pilih spot yang kamu suka!');
            }
        });
    }
}

function handleExcitementForm() {
    const excitementForm = document.getElementById('excitementForm');
    if (excitementForm) {
        excitementForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const excitement = document.getElementById('excitement').value;
            if (excitement) {
                localStorage.setItem('excitement', excitement);

                // Collect all data from localStorage
                const name = localStorage.getItem('name');
                const date = localStorage.getItem('date');
                const spot = localStorage.getItem('spot');
                const imageUrl = localStorage.getItem('imageUrl');

                const data = {
                    name: name,
                    date: date,
                    spot: spot,
                    imageUrl: imageUrl,
                    excitement: excitement
                };

                sendDataToServer(data);
            } else {
                alert('Berapa tingkat excitement kamu?');
            }
        });
    }
}

function sendDataToServer(data) {
    fetch('https://dateserver.vercel.app/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'thankyou.html';
        } else {
            alert('Terjadi kesalahan saat mengirim data.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat mengirim data.');
    });
}

function enableCustomSpotInput() {
    const customSpotRadio = document.getElementById('customSpotRadio');
    if (customSpotRadio) {
        customSpotRadio.addEventListener('change', function() {
            const customSpotInput = document.getElementById('customSpot');
            const customSpotImageURLInput = document.getElementById('customSpotImageURL');
            customSpotInput.disabled = !this.checked;
            customSpotImageURLInput.disabled = !this.checked;
            if (this.checked) {
                customSpotInput.focus();
            }
        });
    }

    // Disable custom spot input when other options are chosen
    document.querySelectorAll('input[name="spot"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            if (this.value !== 'custom') {
                document.getElementById('customSpot').disabled = true;
                document.getElementById('customSpotImageURL').disabled = true;
            }
        });
    });
}

function displayDateMessage() {
    const name = localStorage.getItem('name');
    const date = localStorage.getItem('date');
    const spot = localStorage.getItem('spot');
    const imageUrl = localStorage.getItem('imageUrl');
    const excitement = localStorage.getItem('excitement');

    const dateMessage = `
        <strong>Hai ${name}!</strong><br>
        Kita akan bertemu pada <strong>${date}</strong> di <strong>${spot}</strong>.<br>
        Tingkat excitement kamu adalah <strong>${excitement}</strong> dari 100!<br>
        Tidak sabar untuk bertemu denganmu! 😊
    `;

    document.getElementById('dateMessage').innerHTML = dateMessage;

    if (imageUrl) {
        const imageElement = document.getElementById('customSpotImage');
        imageElement.src = imageUrl;
        imageElement.style.display = 'block';
        const dateSound = document.getElementById('dateSound');
        dateSound.play();
        
    }

    const dateSound = document.getElementById('dateSound');
    dateSound.play();
}

function startConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function showGif() {
    const gif = document.getElementById('cuteGif');
    gif.style.display = 'block';
    // Add a simple animation effect when the GIF appears
    gif.classList.add('animate-gif');
}