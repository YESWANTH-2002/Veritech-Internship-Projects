// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Slider functionality
    let counter = 1;
    setInterval(() => {
        document.getElementById('radio' + counter).checked = true;
        counter++;
        if (counter > 4) {
            counter = 1;
        }
    }, 5000);

    // Add to cart functionality
    const cartCount = document.querySelector('.cart-count');
    let count = 0;
    document.querySelectorAll('.content-item').forEach(item => {
        item.addEventListener('click', () => {
            count++;
            cartCount.textContent = count;
        });
    });
});
