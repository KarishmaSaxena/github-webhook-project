let lastEventIds = new Set();

async function fetchEvents() {
    try {
        const res = await fetch("/events");
        const data = await res.json();

        const container = document.getElementById("events");
        container.innerHTML = "";

        data.forEach(e => {
            let text = "";

            if (e.action === "push") {
                text = `📌 ${e.author} pushed to ${e.to_branch} on ${e.timestamp}`;
            } else if (e.action === "pull_request") {
                text = `📌 ${e.author} submitted a pull request from ${e.from_branch} to ${e.to_branch} on ${e.timestamp}`;
            } else if (e.action === "merge") {
                text = `📌 ${e.author} merged ${e.from_branch} to ${e.to_branch} on ${e.timestamp}`;
            }

            const div = document.createElement("div");
            div.className = "event";
            div.innerText = text;

            // Highlight new events
            if (!lastEventIds.has(e._id)) {
                div.classList.add("new-event");
            }

            container.appendChild(div);
        });

        lastEventIds = new Set(data.map(e => e._id));

    } catch (err) {
        console.error("Error fetching events:", err);
    }
}

setInterval(fetchEvents, 15000);
fetchEvents();