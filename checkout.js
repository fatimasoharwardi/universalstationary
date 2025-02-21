document.addEventListener('DOMContentLoaded', function() {
    // Check if coming from Buy Now or Cart
    const checkoutItems = JSON.parse(sessionStorage.getItem('checkoutItems')) || 
                         JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (checkoutItems.length === 0) {
        showEmptyCart();
        return;
    }

    // Update UI
    displayCartItems(checkoutItems);
    updateOrderSummary(checkoutItems);
    
    // If it's a Buy Now checkout, prefill quantity
    if (checkoutItems.length === 1 && sessionStorage.getItem('checkoutItems')) {
        const quantity = checkoutItems[0].quantity;
        if (quantity > 1) {
            document.getElementById('quantity').value = quantity;
            updateTotalPrice(quantity);
        }
    }
});

function displayCartItems(items) {
    const cartItemsContainer = document.getElementById('cart-items');
    const itemsCount = document.getElementById('items-count');
    
    // Update items count
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    itemsCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''} in cart`;

    // Display items
    cartItemsContainer.innerHTML = items.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <div class="item-price-details">
                    <p>Unit Price: $${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p class="item-subtotal">Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function updateOrderSummary(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = items.length > 0 ? 5.00 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    // Add animation to total
    document.getElementById('total').classList.add('price-update');
    setTimeout(() => {
        document.getElementById('total').classList.remove('price-update');
    }, 300);
}

// Add this function to handle empty cart state
function showEmptyCart() {
    const emptyMessage = document.querySelector('.empty-cart-message');
    const orderSummary = document.querySelector('.order-summary-section');
    const checkoutForm = document.querySelector('.checkout-form-section');
    
    if (emptyMessage) emptyMessage.style.display = 'flex';
    if (orderSummary) orderSummary.style.display = 'none';
    if (checkoutForm) checkoutForm.style.display = 'none';
}

// Add promo code functionality
function applyPromoCode() {
    const promoInput = document.querySelector('.promo-input');
    const promoCode = promoInput.value.trim().toUpperCase();
    const promoMessage = document.getElementById('promo-message');
    
    // Example promo codes
    const promoCodes = {
        'WELCOME10': 10,
        'SAVE20': 20,
        'SPECIAL50': 50
    };

    if (promoCodes[promoCode]) {
        const discount = promoCodes[promoCode];
        const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace('$', ''));
        const discountAmount = (subtotal * discount) / 100;
        
        // Update discount display
        document.getElementById('discount').textContent = `-$${discountAmount.toFixed(2)}`;
        document.getElementById('discount-row').style.display = 'flex';
        
        // Recalculate total
        updateOrderTotal(discountAmount);
        
        // Show success message
        promoMessage.textContent = `${discount}% discount applied!`;
        promoMessage.className = 'promo-message success';
        promoInput.disabled = true;
        document.querySelector('.promo-btn').disabled = true;
    } else {
        // Show error message
        promoMessage.textContent = 'Invalid promo code';
        promoMessage.className = 'promo-message error';
    }
}

function updateOrderTotal(discount = 0) {
    const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace('$', ''));
    const shipping = parseFloat(document.getElementById('shipping').textContent.replace('$', ''));
    const tax = (subtotal - discount) * 0.1;
    const total = subtotal + shipping + tax - discount;

    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Add animation
    document.getElementById('total').classList.add('price-update');
    setTimeout(() => {
        document.getElementById('total').classList.remove('price-update');
    }, 300);
}
