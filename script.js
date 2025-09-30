const BASE = "https://fsa-puppy-bowl.herokuapp.com/api/";
const COHORT = "/2508-FTB-ET-WEB-FT";
const RESOURCE = "/players";
const API = BASE + COHORT + RESOURCE;


// MY STATE VARIABLES
let puppies = [];
let selectedPuppies;


async function getPuppiesLists() {
    try{
        const res = await fetch(API);
        const JSON = await res.json();
        puppies = JSON.data;
        render();
    } catch(e) {
        console.error(e);
    }
}

async function getPuppy(id) {
    try {
        const res = await fetch(API + "/" + id);
        const json = await res.json();
        selectedPuppies = json.data;
        render();
    } catch(e) {
        console.error(e)
    }
}

async function addPuppy(puppy) {
    try {
        const res = fetch(API, {
            method: `POST`,
            body:JSON.stringify(puppy),
            headers:{"Content-Type": "application.json"}
        });
        const json = await res.join();
        if (json.sucess) {
            getPuppiesLists();
        }
    } catch(e) {
        console.error(e)
    }
}

async function removePuppy(id) {
    try {
        const res =await fetch(`${API}/${id}`, {
            method: "DELETE",
        });
        if (res.status === 204) {
            selectedPuppies = null;
            getPuppiesLists();
        }
    } catch(e) {
        console.error(e);
    }
}


function render() {
    const application = document.querySelector("#app");
    application.innerHTML = `
    <main>
      <section id="LIST/ADD">
        <h2>The Puppies<//h2>
        <PuppyList></PuppyList>
        <h3>Invite New Puppy</h3>
        <InvitationPuppy></InvititationPuppy>
      </section>
      <section id="DataAboutPuppies">
        <h3>Puppy Details</h3>
        <PuppyDetails></PuppyDetails>
      </section>
    </main>
    `;
}


async function init() {
    await getPuppiesLists();
    render();
}

init();