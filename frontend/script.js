document.addEventListener('DOMContentLoaded', function() {
    // Handle initial form
    const initialForm = document.getElementById('initialForm');
    if (initialForm) {
        initialForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const answer = document.querySelector('input[name="answer"]:checked');
            if (answer && answer.value === 'yes') {
                window.location.href = 'name.html';
            } else {
                const yesButton = document.querySelector('input[value="yes"]').parentElement;
                yesButton.style.transform = 'scale(1.2)';
                yesButton.style.transition = 'transform 0.3s';
                setTimeout(() => {
                    yesButton.style.transform = 'scale(1)';
                    alert('Terima kasih, mungkin lain kali!');
                }, 300);
            }
        });
    }

    // Handle name form
    const nameForm = document.getElementById('nameForm');
    if (nameForm) {
        nameForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            if (name) {
                localStorage.setItem('name', name);
                window.location.href = 'date.html';
            } else {
                alert('Oops! Sepertinya kamu lupa memasukkan namamu!');
            }
        });
    }

    // Handle date form
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

    // Handle spot form
    const spotForm = document.getElementById('spotForm');
    if (spotForm) {
        spotForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const selectedSpot = document.querySelector('input[name="spot"]:checked');
            let spotValue = '';

            if (selectedSpot) {
                if (selectedSpot.value === 'custom') {
                    const customSpot = document.getElementById('customSpot').value;
                    if (customSpot.trim() !== '') {
                        spotValue = customSpot;
                    } else {
                        alert('Silakan masukkan spot yang kamu inginkan!');
                        return;
                    }
                } else {
                    spotValue = selectedSpot.value;
                }

                localStorage.setItem('spot', spotValue);
                window.location.href = 'excitement.html';
            } else {
                alert('Pilih spot yang kamu suka!');
            }
        });
    }

    // Handle excitement form and send data to server
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

                const data = {
                    name: name,
                    date: date,
                    spot: spot,
                    excitement: excitement
                };

                fetch('http://localhost:3000/submit', {
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
            } else {
                alert('Berapa tingkat excitement kamu?');
            }
        });
    }

    // Enable custom spot input
    const customSpotRadio = document.getElementById('customSpotRadio');
    if (customSpotRadio) {
        customSpotRadio.addEventListener('change', function() {
            const customSpotInput = document.getElementById('customSpot ');
            customSpotInput.disabled = !this.checked;
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
            }
        });
    });
});