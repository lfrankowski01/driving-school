    // DRIVING SCHOOL BOOKING APP JS

    //DOM Element Selection
    const form = document.getElementById("bookingForm");
    const bookingList = document.getElementById("bookingList");
    const summaryText = document.getElementById("summaryText");
    const summaryBox = document.getElementById("summary");
    const slotsContainer = document.getElementById("slots");
    const dateInput = document.getElementById("date");

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];  //Array of all bookings
    let bookedSlots = JSON.parse(localStorage.getItem("bookedSlots")) || {};    //Object to track booked slots by date
    let selectedTime = null;    //Currently selected time slot
    
    const timeSlots = [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00"
    ];  //Available time slots

    //FUNCTION: RENDER TIME SLOTS
    //Dynamically generates time slots buttons based on selected date and availability
    function renderTimeSlots(selectedDate) {
        slotsContainer.innerHTML = ""; //Clear previous slots

        timeSlots.forEach(function (time) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = time;

            const bookedForDate = bookedSlots[selectedDate] || [];

            if (bookedForDate.includes(time)) { //Disable button if time slot booked
                button.classList.add("booked");
                button.disabled = true;
            }

            button.addEventListener("click",    //Select time when user clicks
                function () {
                    document.querySelectorAll("#slots button")
                            .forEach(btn => 
                                btn.classList.remove("selected"));

                                button.classList.add("selected");
                                selectedTime = time;
                });

        slotsContainer.appendChild(button);
        });
    }

    //EVENT: DATE CHANGE
    //When user selects a date, reset selected time and render available slots
    dateInput.addEventListener("change",
        function () {
            selectedTime = null;
            renderTimeSlots(this.value);
        });

    //FUNCTION: DISPLAY BOOKINGS
    //Show all bookings in booking list with cancel button
    function displayBookings() {
        bookingList.innerHTML = ""; //Clear previous list
        
        if (bookings.length === 0) {
            bookingList.innerHTML = "<li>No Bookings Yet</li>";
            return;
        }
        
        bookings.forEach(function (booking, index) {
            const li = document.createElement("li");

            const text = document.createElement("div");
            text.className = "booking-text";
            text.textContent = `${booking.name} | ${booking.date} | ${booking.time} | ${booking.lesson}`;   //Booking text

            const cancelBtn = document.createElement("button");
            cancelBtn.className = "cancel-btn";
            cancelBtn.textContent = "Cancel";

            cancelBtn.addEventListener("click", 
                function () {
                    if (confirm("Cancel this booking")) {
                        cancelBooking(index);
                    }
                });

                li.appendChild(text);
                li.appendChild(cancelBtn);
                bookingList.appendChild(li);
        });
    }

    //FUNCTION: CANCEL BOOKING
    //Removes booking and frees up associated time slot
    function cancelBooking(index) {
        const booking = bookings[index];
        const date = booking.date;
        const time = booking.time;

        //Remove time from bookedSlots
        bookedSlots[date] = bookedSlots[date].filter(bookedTime => bookedTime !== time);
        if (bookedSlots[date].length === 0) {
            delete bookedSlots[date];
        }

        bookings.splice(index, 1);  //Remove booking from array

        localStorage.setItem("bookings", JSON.stringify(bookings)); //Updates localStorage
        localStorage.setItem("bookedSlots", JSON.stringify(bookedSlots));

        displayBookings();  //Update UI
        if (dateInput.value === date) {
            renderTimeSlots(date);
        }
    }

    //EVENT: USER CLICKS CLEAR ALL
    //Removes all bookings from storage
    document.getElementById("clearBookings").addEventListener("click",
        function () {
            localStorage.removeItem("bookings");
            localStorage.removeItem("bookedSlots");
            bookings = [];
            bookedSlots = {};
            displayBookings();
            slotsContainer.innerHTML = "";

    });

    //EVENT: FORM SUBMIT
    //Handles booking creation, validation and saving
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const date = dateInput.value;
        const lesson = document.getElementById("lessonType").value;
        const lessonName = lesson === "Manual" ? "Manual" : "Automatic";
        const price = lesson === "Manual" ? 30 : 35;
        
        if (!name || !date || !lesson || !selectedTime) {
            alert("Please fill in all fields and select time slot.");
            return;
        }

        const booking = {   //Create booking object
            name,
            date,
            time: selectedTime,
            lesson: lessonName,
            price
        }

        bookings.push(booking); //Save booking in state and localStorage
        localStorage.setItem("bookings", JSON.stringify(bookings));

        if (!bookedSlots[date]) {   //Save booked time slot
            bookedSlots[date] = [];
        }
        bookedSlots[date].push(selectedTime);
        localStorage.setItem("bookedSlots", JSON.stringify(bookedSlots));

        summaryText.textContent =
            `Name: ${name} | Date: ${date} | Time: ${selectedTime} | Lesson: ${lessonName} | Price: £${price}`;
        summaryBox.classList.remove("hidden");
        displayBookings();
        form.reset();   //Reset form and selection
        selectedTime = null;
        renderTimeSlots(date);  //Re-render slots to reflect booking

    });

    //INITIALIZE UI
    //Display any saved bookings and reset UI on page reload
    document.addEventListener("DOMContentLoaded", function () {
        displayBookings();
    });

        

    





