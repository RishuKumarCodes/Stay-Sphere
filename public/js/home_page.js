// Destination dropdown
document.getElementById('destination').addEventListener('click', () => {
    document.getElementById('destinationDropdown').style.display = 'block';
});

document.querySelectorAll('#destinationDropdown li').forEach(item => {
    item.addEventListener('click', function () {
        document.getElementById('destination').value = this.textContent;
        document.getElementById('destinationDropdown').style.display = 'none';
    });
});

// Close dropdown if clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.matches('#destination') && !event.target.matches('#destinationDropdown li')) {
        document.getElementById('destinationDropdown').style.display = 'none';
    }
});

// Date dropdown (You can use a date picker library for more functionality)
document.getElementById('dates').addEventListener('click', () => {
    document.getElementById('dateDropdown').style.display = 'block';
});

document.querySelectorAll('.date-select').forEach(item => {
    item.addEventListener('click', function () {
        document.getElementById('dates').value = this.textContent; // Set the selected date to the input
        document.getElementById('dateDropdown').style.display = 'none';
    });
});

// Guest dropdown
document.getElementById('guests').addEventListener('click', () => {
    document.getElementById('guestDropdown').style.display = 'block';
});

// Function to update the guests input box with counts
function updateGuestsInput() {
    const adults = document.getElementById('adults-count').textContent;
    const children = document.getElementById('children-count').textContent;
    const infants = document.getElementById('infants-count').textContent;
    const pets = document.getElementById('pets-count').textContent;

    let guests = `${adults} Adults`;
    if (children > 0) guests += `, ${children} Children`;
    if (infants > 0) guests += `, ${infants} Infants`;
    if (pets > 0) guests += `, ${pets} Pets`;

    document.getElementById('guests').value = guests;
}

// Increment and Decrement buttons for guests
document.querySelectorAll('.increment').forEach(button => {
    button.addEventListener('click', function () {
        let countElement = this.previousElementSibling;
        let count = parseInt(countElement.textContent);
        countElement.textContent = count + 1;
        updateGuestsInput(); // Update the guests input after any change
    });
});

document.querySelectorAll('.decrement').forEach(button => {
    button.addEventListener('click', function () {
        let countElement = this.nextElementSibling;
        let count = parseInt(countElement.textContent);
        if (count > 0) countElement.textContent = count - 1;
        updateGuestsInput(); // Update the guests input after any change
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.matches('#guests') && !event.target.closest('#guestDropdown')) {
        document.getElementById('guestDropdown').style.display = 'none';
    }
});



// __________________________nav-bar 2 filters _____________________________________________
// JavaScript for handling filter clicks and updating the listings dynamically
document.querySelectorAll('.filters li a').forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = e.target.closest('a').href;

        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const newDocument = parser.parseFromString(html, 'text/html');

            // Get the updated listings and replace the current ones
            const updatedListings = newDocument.querySelector('.all-listings');
            document.querySelector('.all-listings').innerHTML = updatedListings.innerHTML;

            // Optionally, update the active filter state
            document.querySelectorAll('.filters li').forEach(li => li.classList.remove('active'));
            e.target.closest('li').classList.add('active');
        } catch (err) {
            console.error('Error fetching filtered listings:', err);
        }
    });
});
