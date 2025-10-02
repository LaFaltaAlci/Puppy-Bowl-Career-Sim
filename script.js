const BASE = "https://fsa-puppy-bowl.herokuapp.com/api/";
const COHORT = "/2508-FTB-ET-WEB-FT";
const RESOURCE = "/players";
const API = BASE + COHORT + RESOURCE;

// MY STATE VARIABLES
let players = [];
let selectedPlayer;



async function getPlayers() {
  try {
    const res = await fetch(API);
    const result = await res.json();
    players = result.data.players;
    render();
  } catch (err) {
    console.log(err);
  }
}

async function getPlayer(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    const result = await res.json();
    selectedPlayer = result.data.player;
    render();
  } catch (err) {
    console.log(err);
  }
}

async function addPlayer(player) {
  try {
    const res = await fetch(API, {
      method: "POST",
      body: JSON.stringify(player),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (json.success) {
      await getPlayers();
    }
  } catch (err) {
    console.log(err);
  }
}

async function removePlayer(id) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    if (res.status === 204) {
      selectedPlayer = null;
      await getPlayers();
    }
  } catch (err) {
    console.log(err);
  }
}

// Inner HTML Functions that connects with the Async functions to grab the data
// and display it

function PlayerListItem(player) {
  const li = document.createElement("li");
  li.innerHTML = `
      <a href="#selected"> <img alt="${player.name}" src="${player.imageUrl}" width=15%> ${player.name}</a>
    `;

  li.addEventListener("click", () => getPlayer(player.id));
  return li;
}

function PlayerList() {
  const ul = document.createElement("ul");
  ul.classList.add("lineup");

  const items = players.map(PlayerListItem);
  ul.replaceChildren(...items);

  return ul;
}

function PlayerDetails() {
  if (!selectedPlayer) {
    const p = document.createElement("p");
    p.textContent = "Please select a player to learn more.";
    return p;
  }

  const playerInfo = document.createElement("section");
  playerInfo.innerHTML = `
      <h3>${selectedPlayer.name} #${selectedPlayer.id}</h3>
      <figure>
        <img alt="${selectedPlayer.name}" src="${selectedPlayer.imageUrl}" width=60% />
      </figure>
      <p>${selectedPlayer.breed}</p>
      <p>${selectedPlayer.status}</p>
      <p>${selectedPlayer.teamId}</p>
      <button>Remove Player</button> 
    `;

  const button = playerInfo.querySelector("button");
  button.addEventListener("click", function () {
    removePlayer(selectedPlayer.id);
  });

  return playerInfo;
}

function NewPlayerForm() {
  const form = document.createElement("form");
  form.innerHTML = `
      <label>
        Name
        <input name="name" required />
      </label>
      <label>
        Breed
        <input name="breed" required />
      </label>
      <label>
        Status
        <select name="status">
          <option value="field">Field</option>
          <option value="bench">Bench</option>
        </select>
      </label>
      <label>
        ImageUrl
        <input name="imageUrl" required />
      </label>
      <button>Invite Player</button>
    `;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(form);
    addPlayer({
      name: data.get("name"),
      breed: data.get("breed"),
      status: data.get("status"),
      imageUrl: data.get("imageUrl"),
    });
    form.reset();
  });

  return form;
}

function render() {
  const application = document.querySelector("#app");
  application.innerHTML = `
    <main>
      <section>
        <h2>Player Lineup</h2>
        <div id= "player-list"></div>
        <h3>Invite a New Player</h3>
        <div id= "new-player-form"></div>
      </section>
      <section id= "selected">
        <h2>Player Details</h2>
        <div id= "player-details"></div>
      </section>
    </main>
    `;

  application.querySelector("#player-list").replaceWith(PlayerList());
  application.querySelector("#new-player-form").replaceWith(NewPlayerForm());
  application.querySelector("#player-details").replaceWith(PlayerDetails());
}

async function init() {
  await getPlayers();

  render();
}

init();
