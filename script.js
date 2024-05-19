document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const message = document.getElementById('message');

    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        message.textContent = 'Please enter a valid email address.';
        return;
    }

    // Disable form and show loading indicator
    const submitButton = document.querySelector('#loginForm button[type="submit"]');
    submitButton.disabled = true;
    message.textContent = 'Sending magic link...';

    try {
        const response = await fetch('http://localhost:3000/send-magic-link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const result = await response.json();
        if (response.ok) {
            message.textContent = 'Magic link has been sent to your email.';
        } else {
            message.textContent = result.message;
        }
    } catch (error) {
        message.textContent = 'An error occurred. Please try again.';
    } finally {
        // Re-enable the form
        submitButton.disabled = false;
    }
});
