const BASE = "https://fsa-puppy-bowl.herokuapp.com/api/";
const COHORT = "/2508-FTB-ET-WEB-FT";
const RESOURCE = "/players";
const API = BASE + COHORT + RESOURCE;

// MY STATE VARIABLES
let puppies = [];
let selectedPuppies;

async function getPuppies() {
  try {
    const res = await fetch(API);
    const JSON = await res.json();
    puppies = JSON.data;
    render();
  } catch (e) {
    console.error();
  }
}

async function getPuppy(id) {
  try {
    const res = await fetch(API + "/" + id);
    const json = await res.json();
    selectedPuppies = json.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

async function addPuppy(puppy) {
  try {
    const res = fetch(API, {
      method: `POST`,
      body: JSON.stringify(puppy),
      headers: { "Content-Type": "application.json" },
    });
    const json = await res.join();
    if (json.sucess) {
      getPuppiesLists();
    }
  } catch (e) {
    console.error(e);
  }
}

async function removePuppy(id) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    if (res.status === 204) {
      selectedPuppies = null;
      getPuppiesLists();
    }
  } catch (e) {
    console.error(e);
  }
}

// Inner HTML Functions that connects with the Async functions to grab the data
// and display it

function PuppyListItem(puppy) {
  const li = document.createElement("li");
  li.innerHTML = `
      <a href="#selected">${puppy.name}</a>
    `;

  li.addEventListener("click", () => getPuppy(puppy.id));
  return li;
}

function PuppyList() {
  const ul = document.createElement("ul");
  ul.classList.add("lineup");

  const puppies = puppies.map(PuppyListItem);
  ul.replaceChildren(...puppies);

  return ul;
}

function PuppyDetails() {
  if (!selectedPuppies) {
    const p = document.createElement("p");
    p.textContent = "Please select a puppy to learn more.";
    return p;
  }

  const puppy = document.createElement("section");
  artist.classList.add("puppy");
  artist.innerHTML = `
      <h3>${selectedPuppies.name} #${selectedPuppies.id}</h3>
      <figure>
        <img alt=${selectedPuppies.name} #${selectedPuppies.imageUrl} />
      </figure>
      <p>${selectedPuppies.description}</p>
      <button>Remove Puppy</button> 
    `;

  const button = puppy.querySelector("button");
  button.addEventListener("click", function () {
    removePuppy(selectedPuppies.id);
  });

  return puppy;
}

function NewPuppyForm() {
  const form = document.createElement("form");
  form.innerHTML = `
      <label>
        Name
        <input name="name" required />
      </label>
      <label>
        Description
        <input name="description" required />
      </label>
      <label>
        Profile Picture
        <input name="imageUrl" required />
      </label>
      <button>Invite puppy</button>
    `;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(form);
    addPuppy({
      name: data.get("name"),
      description: data.get("description"),
      imageUrl: data.get("imageUrl"),
    });
  });

  return form;
}

function render() {
  const application = document.querySelector("#app");
  application.innerHTML = `
    <main>
      <section>
        <h2>The Lineup<//h2>
        <PuppyList></PuppyList>
        <h3>Invite New Puppy</h3>
        <NewPuppyForm></NewPuppyForm>
      </section>
      <section id="selected">
        <h2>Puppy Details</h2>
        <PuppyDetails></PuppyDetails>
      </section>
    </main>
    `;

  application.querySelector("PuppyList").replaceWith(PuppyList());
  application.querySelector("NewPuppyForm").replaceWith(NewPuppyForm());
  application.querySelector("PuppyDetails").replaceWith(PuppyDetails());
}

async function init() {
  await getPuppies();
  render();
}

init();
