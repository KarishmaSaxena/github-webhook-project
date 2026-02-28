async function fetchEvents() {
    try {
        const res = await fetch("/events");
        const data = await res.json();

        const container = document.getElementById("events");
        container.innerHTML = ""; // clear old events

        data.forEach(e => {
            let text = "";

            if (e.action === "push") {
                text = `${e.author} pushed to ${e.to_branch} on ${e.timestamp}`;
            } else if (e.action === "pull_request") {
                text = `${e.author} submitted a pull request from ${e.from_branch} to ${e.to_branch} on ${e.timestamp}`;
            } else if (e.action === "merge") {
                text = `${e.author} merged ${e.from_branch} to ${e.to_branch} on ${e.timestamp}`;
            }

            const div = document.createElement("div");
            div.className = "event";
            div.innerText = text;

            container.appendChild(div);
        });

    } catch (err) {
        console.error("Error fetching events:", err);
    }
}

setInterval(fetchEvents, 15000);
fetchEvents(); 