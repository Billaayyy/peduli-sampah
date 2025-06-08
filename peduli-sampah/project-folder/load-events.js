document.addEventListener("DOMContentLoaded", function () {
    fetch("events.json")
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector(".card-container");
            if (!container) return;

            data.forEach(event => {
                const card = document.createElement("a");
                card.href = event.link;
                card.className = "event-card " + event.type.toLowerCase();

                const typeDiv = document.createElement("div");
                typeDiv.className = "event-type";
                typeDiv.textContent = event.type;

                const title = document.createElement("h2");
                title.innerHTML = event.title;

                const description = document.createElement("p");
                description.textContent = event.description;

                const footer = document.createElement("div");
                footer.className = "event-footer";

                event.footer.forEach(text => {
                    const p = document.createElement("p");
                    p.innerHTML = text;
                    footer.appendChild(p);
                });
            
                card.appendChild(typeDiv);
                card.appendChild(title);
                card.appendChild(description);
                card.appendChild(footer);

                container.appendChild(card);
            });
        })
        .catch(error => console.error("Failed to load events.json:", error));
});