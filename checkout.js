document.addEventListener("DOMContentLoaded", function () {
    const userInfoForm = document.getElementById("user-info-form");

    userInfoForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Collect user information from the form
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        const paymentMethod = document.getElementById("payment-method").value;

        // You can also collect payment information, shipping options, etc.

        // Process the order (this is a simplified example)
        const order = {
            name,
            email,
            address,
            paymentMethod,
            // Add more order details here, such as cart items, total amount, etc.
        };

        // Send the order data to your server for processing and payment handling
        // Implement server-side logic to securely process payments and store orders

        // Redirect to a confirmation page or display a confirmation message to the user
        // You can use JavaScript to redirect or show a modal confirmation message

        alert("Order placed successfully! Thank you for shopping with us.");

        // Optionally, clear the user's cart or perform other post-order actions

        // Redirect the user to a confirmation page
        window.location.href = "confirmation.html";
    });
});
