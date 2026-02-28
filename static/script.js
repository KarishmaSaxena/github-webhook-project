let lastEventIds = new Set();

async function fetchEvents() {
    try {
        const res = await fetch("/events");
        const data = await res.json();

        const container = document.getElementById("events");

        data.forEach(e => {
            // Skip already displayed events
            if (lastEventIds.has(e._id)) return;

            let text = "";
            let icon = "";

            if (e.action === "push") {
                icon = "📌";
                text = `${e.author} pushed to ${e.to_branch}`;
            } else if (e.action === "pull_request") {
                icon = "🔀";
                text = `${e.author} submitted a pull request from ${e.from_branch} to ${e.to_branch}`;
            } else if (e.action === "merge") {
                icon = "✅";
                text = `${e.author} merged ${e.from_branch} to ${e.to_branch}`;
            } else if (e.action.startsWith("issue")) {
                icon = "🐛";
                text = `${e.author} ${e.action.replace("issue_", "")} issue "${e.title}"`;
            }

            text += ` on ${new Date(e.timestamp).toLocaleString()}`;

            const div = document.createElement("div");
            div.className = "event new-event";
            div.innerText = `${icon} ${text}`;

            container.prepend(div);
            lastEventIds.add(e._id);
        });

    } catch (err) {
        console.error("Error fetching events:", err);
    }
}

setInterval(fetchEvents, 15000);
fetchEvents();