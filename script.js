const apiurl = 'https://67cafd683395520e6af3e8e4.mockapi.io/api/users';

const contactContainer = document.getElementById("contactcontainer");
const inputs = document.querySelectorAll(".inp");
const addButton = document.querySelector(".btn");

async function fetchContacts() {
    try {
        const response = await fetch(apiurl);
        if (!response.ok) throw new Error("Ошибка при получении данных");

        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

function displayContacts(contacts) {
    contactContainer.innerHTML = "";
    contacts.forEach(contact => {
        const card = document.createElement("div");
        card.classList.add("contact-card");
        card.innerHTML = `
            <h2>Имя: ${contact.name}</h2>
            <p>Телефон: ${contact.phone}</p>
            <button onclick="editContact(${contact.id}, '${contact.name}', '${contact.phone}')">Изменить</button>
            <button onclick="editContact(${contact.id})">Удалить</button>

            '

        `;
        contactContainer.appendChild(card);
    });
}

addButton.addEventListener("click", async () => {
    const name = inputs[0].value.trim();
    const phone = inputs[1].value.trim();

    if (!name || !phone) {
        alert("Введите имя и телефон!");
        return;
    }

    try {
        const response = await fetch(apiurl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone })
        });

        if (!response.ok) throw new Error("Ошибка при добавлении контакта");

        inputs[0].value = "";
        inputs[1].value = "";
        fetchContacts();
    } catch (error) {
        console.error("Ошибка:", error);
    }
});

// Функция для изменения контакта
async function editContact(id, oldName, oldPhone) {
    const newName = prompt('Enter your name:', oldName);
    const newPhone = prompt('Enter your phone:', oldPhone);

    if (!newName || !newPhone) return;

    try {
        const response = await fetch(`${apiurl}/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, phone: newPhone })
        });

        if (response.ok) {
            fetchContacts(); 
        }
    } catch (error) {  
        console.error("Error updating contact:", error);
    }
}


async function editContact(id) {
    try {
        const response = await fetch(`${apiurl}/${id}`, { method: 'DELETE' }); 

        if (response.ok) {
            fetchContacts(); 
        }
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
}

fetchContacts();