// DuluthStay.com - Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Set initial dates for the date inputs
    const checkinDate = document.getElementById('checkin-date');
    const checkoutDate = document.getElementById('checkout-date');
    const checkinDisplay = document.getElementById('checkin-display');
    const checkoutDisplay = document.getElementById('checkout-display');
    
    if (checkinDate && checkoutDate) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Set minimum date to today to prevent past date selection
        const todayString = today.toISOString().split('T')[0];
        checkinDate.min = todayString;
        checkoutDate.min = todayString;
        
        checkinDate.value = todayString;
        checkoutDate.value = tomorrow.toISOString().split('T')[0];
        
        // Update display text
        if (checkinDisplay) {
            const formattedToday = today.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            checkinDisplay.textContent = formattedToday;
        }
        
        if (checkoutDisplay) {
            const formattedTomorrow = tomorrow.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            checkoutDisplay.textContent = formattedTomorrow;
        }
        
        console.log('Date inputs set successfully');
    }
    
    // Handle date changes with validation
    if (checkinDate && checkinDisplay) {
        checkinDate.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
            
            // Validate that check-in date is not in the past
            if (selectedDate < today) {
                alert('Check-in date cannot be in the past. Please select today or a future date.');
                this.value = today.toISOString().split('T')[0];
                selectedDate.setTime(today.getTime());
            }
            
            // Update checkout minimum date to be day after check-in
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            checkoutDate.min = nextDay.toISOString().split('T')[0];
            
            // If checkout date is before or on check-in date, update it
            if (new Date(checkoutDate.value) <= selectedDate) {
                checkoutDate.value = nextDay.toISOString().split('T')[0];
                const formattedCheckout = nextDay.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });
                checkoutDisplay.textContent = formattedCheckout;
            }
            
            const formattedDate = selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            checkinDisplay.textContent = formattedDate;
        });
    }
    
    if (checkoutDate && checkoutDisplay) {
        checkoutDate.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const checkinSelectedDate = new Date(checkinDate.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Validate that checkout date is not in the past
            if (selectedDate < today) {
                alert('Check-out date cannot be in the past. Please select today or a future date.');
                const nextDay = new Date(today);
                nextDay.setDate(nextDay.getDate() + 1);
                this.value = nextDay.toISOString().split('T')[0];
                selectedDate.setTime(nextDay.getTime());
            }
            
            // Validate that checkout date is after check-in date
            if (selectedDate <= checkinSelectedDate) {
                alert('Check-out date must be after check-in date.');
                const nextDay = new Date(checkinSelectedDate);
                nextDay.setDate(nextDay.getDate() + 1);
                this.value = nextDay.toISOString().split('T')[0];
                selectedDate.setTime(nextDay.getTime());
            }
            
            const formattedDate = selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            checkoutDisplay.textContent = formattedDate;
        });
    }
    
    // Make entire date fields clickable with simple toggle functionality
    const dateFields = document.querySelectorAll('.date-field');
    console.log('Found date fields:', dateFields.length);
    
    dateFields.forEach((field, index) => {
        const dateInput = field.querySelector('input[type="date"]');
        console.log(`Field ${index} date input:`, dateInput);
        
        if (dateInput) {
            // Track if date picker is currently open
            let isPickerOpen = false;
            
            // Make the entire field clickable
            field.addEventListener('click', function(e) {
                console.log('Date field clicked!');
                e.preventDefault();
                e.stopPropagation();
                
                if (isPickerOpen) {
                    // Close the date picker
                    dateInput.blur();
                    isPickerOpen = false;
                } else {
                    // Close guests modal if it's open
                    const existingPortal = document.getElementById('guests-modal-portal');
                    if (existingPortal) {
                        existingPortal.remove();
                    }
                    
                    // Open the date picker
                    dateInput.focus();
                    dateInput.click();
                    dateInput.showPicker && dateInput.showPicker();
                    isPickerOpen = true;
                }
            });
            
            // Also make the field content clickable
            const fieldContent = field.querySelector('.field-content');
            if (fieldContent) {
                fieldContent.addEventListener('click', function(e) {
                    console.log('Field content clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (isPickerOpen) {
                        // Close the date picker
                        dateInput.blur();
                        isPickerOpen = false;
                    } else {
                        // Close guests modal if it's open
                        const existingPortal = document.getElementById('guests-modal-portal');
                        if (existingPortal) {
                            existingPortal.remove();
                        }
                        
                        // Open the date picker
                        dateInput.focus();
                        dateInput.click();
                        dateInput.showPicker && dateInput.showPicker();
                        isPickerOpen = true;
                    }
                });
            }
            
            // Reset state when picker naturally closes
            dateInput.addEventListener('blur', function() {
                setTimeout(() => {
                    isPickerOpen = false;
                }, 200);
            });
        }
    });
    
    // Guests Modal Functionality
    const guestsField = document.getElementById('guests-field');
    const guestsModal = document.getElementById('guests-modal');
    const guestsDone = document.getElementById('guests-done');
    
    // Counter elements
    const adultsCount = document.getElementById('adults-count');
    const childrenCount = document.getElementById('children-count');
    const roomsCount = document.getElementById('rooms-count');
    const adultsMinus = document.getElementById('adults-minus');
    const adultsPlus = document.getElementById('adults-plus');
    const childrenMinus = document.getElementById('children-minus');
    const childrenPlus = document.getElementById('children-plus');
    const roomsMinus = document.getElementById('rooms-minus');
    const roomsPlus = document.getElementById('rooms-plus');
    
    // Current values
    let adults = 2;
    let children = 0;
    let rooms = 1;
    
    // Open dropdown when clicking guests field
    if (guestsField && guestsModal) {
        guestsField.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Check if portal modal already exists
            const existingPortal = document.getElementById('guests-modal-portal');
            if (existingPortal) {
                // Close modal by removing it
                existingPortal.remove();
                return;
            }
            
            if (guestsModal.classList.contains('active')) {
                // Close modal
                guestsModal.classList.remove('active');
                guestsModal.style.display = 'none';
            } else {
                // Close any open date pickers
                const dateInputs = document.querySelectorAll('input[type="date"]');
                dateInputs.forEach(input => {
                    input.blur();
                });
                
                // Create and position modal completely with JavaScript
                const modalHTML = `
                    <div id="guests-modal-portal" style="
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        z-index: 99999 !important;
                        pointer-events: none !important;
                    ">
                        <div style="
                            position: absolute !important;
                            top: 75% !important;
                            left: 59% !important;
                            transform: translate(-50%, -50%) !important;
                            background: white !important;
                            border: 2px solid #1e40af !important;
                            border-radius: 12px !important;
                            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2) !important;
                            width: 300px !important;
                            max-height: 80vh !important;
                            overflow-y: auto !important;
                            pointer-events: auto !important;
                            padding: 1.25rem !important;
                        ">
                            <div style="font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem; text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.75rem;">Select guests and rooms</div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9;">
                                <span style="font-weight: 600; color: #374151;">Adults</span>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <button id="adults-minus" style="width: 30px; height: 30px; border-radius: 50%; border: 2px solid #1e40af; background: white; color: #1e40af; cursor: pointer; font-weight: bold;">-</button>
                                    <span id="adults-count" style="min-width: 20px; text-align: center; font-weight: 600;">2</span>
                                    <button id="adults-plus" style="width: 30px; height: 30px; border-radius: 50%; border: 2px solid #1e40af; background: #1e40af; color: white; cursor: pointer; font-weight: bold;">+</button>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9;">
                                <span style="font-weight: 600; color: #374151;">Children</span>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <button id="children-minus" style="width: 30px; height: 30px; border-radius: 50%; border: 2px solid #1e40af; background: white; color: #1e40af; cursor: pointer; font-weight: bold;">-</button>
                                    <span id="children-count" style="min-width: 20px; text-align: center; font-weight: 600;">0</span>
                                    <button id="children-plus" style="width: 30px; height: 30px; border-radius: 50%; border: 2px solid #1e40af; background: #1e40af; color: white; cursor: pointer; font-weight: bold;">+</button>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0;">
                                <span style="font-weight: 600; color: #374151;">Rooms</span>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <button id="rooms-minus" style="width: 30px; height: 30px; border-radius: 50%; border: 2px solid #1e40af; background: white; color: #1e40af; cursor: pointer; font-weight: bold;">-</button>
                                    <span id="rooms-count" style="min-width: 20px; text-align: center; font-weight: 600;">1</span>
                                    <button id="rooms-plus" style="width: 30px; height: 30px; border-radius: 50%; border: 2px solid #1e40af; background: #1e40af; color: white; cursor: pointer; font-weight: bold;">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Remove existing portal if any
                const existingPortal = document.getElementById('guests-modal-portal');
                if (existingPortal) {
                    existingPortal.remove();
                }
                
                // Add new portal to body
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                // Add event listeners to new buttons
                const portalModal = document.getElementById('guests-modal-portal');
                
                // Add document click listener to close modal when clicking outside
                const closeModalOnOutsideClick = (e) => {
                    if (!portalModal.contains(e.target) && !guestsField.contains(e.target)) {
                        portalModal.remove();
                        document.removeEventListener('click', closeModalOnOutsideClick);
                    }
                };
                
                // Use a small delay to prevent immediate closing
                setTimeout(() => {
                    document.addEventListener('click', closeModalOnOutsideClick);
                }, 100);
                
                // Use event delegation for the buttons
                portalModal.addEventListener('click', (e) => {
                    // Close on outside click
                    if (e.target === portalModal) {
                        portalModal.remove();
                        document.removeEventListener('click', closeModalOnOutsideClick);
                        return;
                    }
                    
                    // Handle button clicks
                    if (e.target.id === 'adults-minus') {
                        if (adults > 1) {
                            adults--;
                            e.target.nextElementSibling.textContent = adults;
                            updateGuestsCounts();
                        }
                    } else if (e.target.id === 'adults-plus') {
                        if (adults < 100) {
                            adults++;
                            e.target.previousElementSibling.textContent = adults;
                            updateGuestsCounts();
                        }
                    } else if (e.target.id === 'children-minus') {
                        if (children > 0) {
                            children--;
                            e.target.nextElementSibling.textContent = children;
                            updateGuestsCounts();
                        }
                    } else if (e.target.id === 'children-plus') {
                        if (children < 100) {
                            children++;
                            e.target.previousElementSibling.textContent = children;
                            updateGuestsCounts();
                        }
                    } else if (e.target.id === 'rooms-minus') {
                        if (rooms > 1) {
                            rooms--;
                            e.target.nextElementSibling.textContent = rooms;
                            updateGuestsCounts();
                        }
                    } else if (e.target.id === 'rooms-plus') {
                        if (rooms < 100) {
                            rooms++;
                            e.target.previousElementSibling.textContent = rooms;
                            updateGuestsCounts();
                        }
                    }
                });
            }
        });
    }
    
    // Auto-close dropdown when values change
    function autoCloseDropdown() {
        setTimeout(() => {
            if (guestsModal && guestsModal.classList.contains('active')) {
                guestsModal.classList.remove('active');
                updateGuestsDisplay();
            }
        }, 1000);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (guestsModal && guestsModal.classList.contains('active')) {
            if (!guestsField.contains(e.target) && !guestsModal.contains(e.target)) {
                guestsModal.classList.remove('active');
                updateGuestsDisplay();
            }
        }
    });
    
    
    // Counter functionality
    if (adultsMinus && adultsPlus && adultsCount) {
        adultsMinus.addEventListener('click', function() {
            if (adults > 1) {
                adults--;
                adultsCount.textContent = adults;
                updateButtons();
                autoCloseDropdown();
            }
        });
        
        adultsPlus.addEventListener('click', function() {
            if (adults < 100) {
                adults++;
                adultsCount.textContent = adults;
                updateButtons();
                autoCloseDropdown();
            }
        });
    }
    
    if (childrenMinus && childrenPlus && childrenCount) {
        childrenMinus.addEventListener('click', function() {
            if (children > 0) {
                children--;
                childrenCount.textContent = children;
                updateButtons();
                autoCloseDropdown();
            }
        });
        
        childrenPlus.addEventListener('click', function() {
            if (children < 100) {
                children++;
                childrenCount.textContent = children;
                updateButtons();
                autoCloseDropdown();
            }
        });
    }
    
    if (roomsMinus && roomsPlus && roomsCount) {
        roomsMinus.addEventListener('click', function() {
            if (rooms > 1) {
                rooms--;
                roomsCount.textContent = rooms;
                updateButtons();
                autoCloseDropdown();
            }
        });
        
        roomsPlus.addEventListener('click', function() {
            if (rooms < 100) {
                rooms++;
                roomsCount.textContent = rooms;
                updateButtons();
                autoCloseDropdown();
            }
        });
    }
    
    function updateButtons() {
        // Update minus buttons
        if (adultsMinus) adultsMinus.disabled = adults <= 1;
        if (childrenMinus) childrenMinus.disabled = children <= 0;
        if (roomsMinus) roomsMinus.disabled = rooms <= 1;
    }
    
    function updateGuestsDisplay() {
        const guestsDisplay = document.querySelector('#guests-field .date-display');
        if (guestsDisplay) {
            const totalGuests = adults + children;
            guestsDisplay.textContent = `${rooms} Room${rooms > 1 ? 's' : ''}, ${totalGuests} Guest${totalGuests !== 1 ? 's' : ''}`;
        }
    }
    
    // Update guests display when values change
    function updateGuestsCounts() {
        const totalGuests = adults + children;
        const guestsDisplay = document.querySelector('#guests-field .date-display');
        if (guestsDisplay) {
            guestsDisplay.textContent = `${rooms} Room${rooms > 1 ? 's' : ''}, ${totalGuests} Guest${totalGuests !== 1 ? 's' : ''}`;
        }
    }
    
    // Initialize
    updateButtons();
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hotel booking functionality
    const bookButtons = document.querySelectorAll('.book-btn');
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const hotelName = this.getAttribute('data-hotel');
            openBookingWidget(hotelName);
        });
    });
    
    // Favorite button functionality
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('favorited');
            const hotelName = this.getAttribute('data-hotel');
            trackEvent('hotel_favorite_toggle', {
                hotel: hotelName,
                favorited: this.classList.contains('favorited')
            });
        });
    });
    
    // Search field functionality
    const searchFields = document.querySelectorAll('.search-field');
    searchFields.forEach(field => {
        field.addEventListener('click', function() {
            searchFields.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Gallery view functionality
    const viewGalleryButtons = document.querySelectorAll('.view-gallery-btn');
    viewGalleryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showImageGallery(this.closest('.hotel-card'));
        });
    });
    
    // Thumbnail image functionality
    const thumbnailImages = document.querySelectorAll('.thumbnail-images img');
    thumbnailImages.forEach(img => {
        img.addEventListener('click', function() {
            const mainImage = this.closest('.hotel-image-gallery').querySelector('.main-image img');
            const tempSrc = mainImage.src;
            mainImage.src = this.src;
            this.src = tempSrc;
        });
    });
    
    // Booking.com widget integration
    function openBookingWidget(hotelName) {
        // In a real implementation, this would integrate with Booking.com's API
        // For now, we'll simulate the booking process
        const hotelData = {
            'canal-park-lodge': {
                name: 'Canal Park Lodge',
                location: 'Canal Park, Duluth, MN',
                price: '$189'
            },
            'fitgers-inn': {
                name: 'Fitger\'s Inn',
                location: 'Canal Park, Duluth, MN',
                price: '$149'
            },
            'radisson-duluth': {
                name: 'Radisson Hotel Duluth',
                location: 'Downtown Duluth, MN',
                price: '$129'
            },
            'comfort-inn': {
                name: 'Comfort Inn & Suites',
                location: 'Lakeside, Duluth, MN',
                price: '$89'
            },
            'super-8': {
                name: 'Super 8 by Wyndham',
                location: 'Downtown Duluth, MN',
                price: '$69'
            },
            'holiday-inn-express': {
                name: 'Holiday Inn Express',
                location: 'Canal Park, Duluth, MN',
                price: '$139'
            },
            'hampton-inn': {
                name: 'Hampton Inn & Suites',
                location: 'Lakeside, Duluth, MN',
                price: '$119'
            }
        };
        
        const hotel = hotelData[hotelName];
        if (hotel) {
            // Create booking modal
            showBookingModal(hotel);
        }
    }
    
    // Booking modal functionality
    function showBookingModal(hotel) {
        // Remove existing modal if present
        const existingModal = document.querySelector('.booking-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal HTML
        const modalHTML = `
            <div class="booking-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            ">
                <div class="modal-content" style="
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                ">
                    <h3>Redirecting to Booking.com</h3>
                    <p>You're being redirected to book <strong>${hotel.name}</strong> at ${hotel.location}</p>
                    <p>Starting from <strong>${hotel.price}/night</strong></p>
                    <div style="margin: 2rem 0;">
                        <button onclick="window.open('https://www.booking.com', '_blank')" style="
                            background: #2563eb;
                            color: white;
                            padding: 1rem 2rem;
                            border: none;
                            border-radius: 8px;
                            font-size: 1rem;
                            font-weight: 600;
                            cursor: pointer;
                            margin-right: 1rem;
                        ">Continue to Booking.com</button>
                        <button onclick="this.closest('.booking-modal').remove()" style="
                            background: #6b7280;
                            color: white;
                            padding: 1rem 2rem;
                            border: none;
                            border-radius: 8px;
                            font-size: 1rem;
                            cursor: pointer;
                        ">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Initialize Booking.com widget (placeholder)
    function initializeBookingWidget() {
        // This would be replaced with actual Booking.com widget initialization
        const widgetContainer = document.getElementById('booking-widget');
        if (widgetContainer) {
            widgetContainer.innerHTML = `
                <div style="
                    background: #f8fafc;
                    border: 2px dashed #cbd5e1;
                    padding: 2rem;
                    border-radius: 8px;
                    text-align: center;
                    color: #64748b;
                ">
                    <h4>Search Hotels in Duluth</h4>
                    <p>Booking.com search widget would be integrated here</p>
                    <button onclick="window.open('https://www.booking.com/city/us/duluth.html', '_blank')" style="
                        background: #2563eb;
                        color: white;
                        padding: 0.75rem 1.5rem;
                        border: none;
                        border-radius: 6px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-top: 1rem;
                    ">Search on Booking.com</button>
                </div>
            `;
        }
    }
    
    // Initialize the booking widget
    initializeBookingWidget();
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(function() {
            // Add any scroll-based functionality here
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#fff';
                header.style.backdropFilter = 'none';
            }
        }, 10);
    });
    
    // Back to Top Button Functionality
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Analytics tracking (placeholder for real analytics)
    function trackEvent(eventName, eventData) {
        // This would integrate with Google Analytics or similar
        console.log('Event tracked:', eventName, eventData);
    }
    
    // Track hotel clicks
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const hotelName = this.getAttribute('data-hotel');
            trackEvent('hotel_booking_click', {
                hotel: hotelName,
                timestamp: new Date().toISOString()
            });
        });
    });
    
    // SEO optimization: Add structured data
    function addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "DuluthStay.com",
            "description": "Find and book the best hotels in Duluth, Minnesota",
            "url": "https://duluthstay.com",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://duluthstay.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
    
    // Image gallery functionality
    function showImageGallery(hotelCard) {
        const hotelName = hotelCard.querySelector('h3').textContent;
        const mainImage = hotelCard.querySelector('.main-image img');
        const thumbnails = hotelCard.querySelectorAll('.thumbnail-images img');
        
        // Create gallery modal
        const modalHTML = `
            <div class="gallery-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            ">
                <div class="gallery-content" style="
                    max-width: 90%;
                    max-height: 90%;
                    position: relative;
                ">
                    <button class="gallery-close" style="
                        position: absolute;
                        top: -40px;
                        right: 0;
                        background: white;
                        border: none;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        font-size: 1.5rem;
                        cursor: pointer;
                        z-index: 10001;
                    ">×</button>
                    <img src="${mainImage.src}" alt="${hotelName} gallery" style="
                        max-width: 100%;
                        max-height: 80vh;
                        object-fit: contain;
                        border-radius: 8px;
                    ">
                    <div class="gallery-thumbnails" style="
                        display: flex;
                        gap: 0.5rem;
                        margin-top: 1rem;
                        justify-content: center;
                    ">
                        ${Array.from(thumbnails).map(img => `
                            <img src="${img.src}" alt="Gallery thumbnail" style="
                                width: 60px;
                                height: 40px;
                                object-fit: cover;
                                border-radius: 4px;
                                cursor: pointer;
                                opacity: 0.7;
                                transition: opacity 0.3s ease;
                            " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        const modal = document.querySelector('.gallery-modal');
        const closeBtn = modal.querySelector('.gallery-close');
        const galleryThumbs = modal.querySelectorAll('.gallery-thumbnails img');
        const mainGalleryImg = modal.querySelector('img');
        
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        galleryThumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainGalleryImg.src = thumb.src;
            });
        });
    }
    
    // Add structured data for SEO
    addStructuredData();
    
    // Error handling for missing elements
    function handleMissingElements() {
        const requiredElements = [
            '.hero-title',
            '.hotels-grid',
            '.footer'
        ];
        
        requiredElements.forEach(selector => {
            if (!document.querySelector(selector)) {
                console.warn(`Missing required element: ${selector}`);
            }
        });
    }
    
    handleMissingElements();
    
    // Console welcome message
    console.log('%cWelcome to DuluthStay.com! 🏨', 'color: #2563eb; font-size: 16px; font-weight: bold;');
    console.log('Find the best hotels in Duluth, Minnesota');
});

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatPrice,
        formatDate
    };
}

