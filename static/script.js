async function fetchEvents() {

    const res = await fetch("/events");
    const data = await res.json();

    const container = document.getElementById("events");
    container.innerHTML = "";

    data.forEach(e => {

        let text = "";

        if (e.action === "push") {
            text = `${e.author} pushed to ${e.to_branch} on ${e.timestamp}`;
        }

        if (e.action === "pull_request") {
            text = `${e.author} submitted a pull request from ${e.from_branch} to ${e.to_branch} on ${e.timestamp}`;
        }

        if (e.action === "merge") {
            text = `${e.author} merged ${e.from_branch} to ${e.to_branch} on ${e.timestamp}`;
        }

        const div = document.createElement("div");
        div.className = "event";
        div.innerText = text;

        container.appendChild(div);

    });

}

// refresh every 15 sec
setInterval(fetchEvents, 15000);
fetchEvents();