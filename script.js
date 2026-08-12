document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.querySelector("#current-year");
    const localTimeSpan = document.querySelector("#local-time");

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const updateLocalTime = () => {
        if (!localTimeSpan) {
            return;
        }
        const now = new Date();
        localTimeSpan.textContent = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    updateLocalTime();
    setInterval(updateLocalTime, 30_000);

    const contactForm = document.querySelector("#contact-form");
    const statusMessage = document.querySelector("#form-status");

    if (!contactForm || !statusMessage) {
        return;
    }

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const submitButton = contactForm.querySelector("button[type='submit']");
        const originalLabel = submitButton ? submitButton.textContent : "Send message";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        statusMessage.textContent = "";
        statusMessage.className = "form-status";

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                statusMessage.textContent = "Thank you! Your message has been sent successfully.";
                statusMessage.classList.add("success");
                contactForm.reset();
            } else {
                const data = await response.json();
                statusMessage.textContent = data?.error || "Oops! There was a problem sending your message.";
                statusMessage.classList.add("error");
            }
        } catch (error) {
            statusMessage.textContent = "Network error. Please try again later.";
            statusMessage.classList.add("error");
        }

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalLabel;
        }
    });
});
