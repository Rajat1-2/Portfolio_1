document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const originalTitle = document.title;

    document.title = 'Sending your message...';

    let formData = new FormData(this);
    formData.append('submitbtn', 'true'); 

    // Send form data using Fetch API
    fetch('assets/php/sendmail.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            Swal.fire('Success!', 'Message sent successfully.', 'success').then(() => {
                window.location.href = 'index.html'; // Redirect after success
            });
        } else {
            Swal.fire('Oops...', 'Message could not be sent.', 'error');
        }
    })
    .catch(error => {
        Swal.fire('Oops...', 'Request failed!', 'error');
    })
    .finally(() => {
        document.title = originalTitle;
    });
});
