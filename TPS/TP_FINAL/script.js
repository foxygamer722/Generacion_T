
const filterButtons = document.querySelectorAll(".filter-button");
const experienceCards = document.querySelectorAll(".experience-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const selectedCategory = button.dataset.filter;
    experienceCards.forEach((card) => {
      const shouldShow = selectedCategory === "all" || card.dataset.category === selectedCategory;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const locationSelect = document.getElementById("locationSelect");
const locationDetails = document.getElementById("locationDetails");

const locations = {
  palermo: "Av. imaginaria 1340, Palermo",
  centro: "Calle ficticia 520, Microcentro",
  cordoba: "Paseo de muestra 180, Nueva Córdoba"
};

locationSelect.addEventListener("change", () => {
  locationDetails.querySelector("span:last-child").textContent = locations[locationSelect.value];
});

const reservationModal = document.getElementById("reservationModal");
const closeModalButton = document.getElementById("closeModal");
const modalExperience = document.getElementById("modalExperience");
const reservationDate = document.getElementById("reservationDate");
const reservationPeople = document.getElementById("reservationPeople");
const reservationTotal = document.getElementById("reservationTotal");
let selectedPrice = 0;

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
reservationDate.min = localDate;
reservationDate.value = localDate;

document.querySelectorAll(".reserve-button").forEach((button) => {
  button.addEventListener("click", () => {
    modalExperience.value = button.dataset.experience;
    selectedPrice = Number(button.dataset.price);
    updateReservationTotal();
    reservationModal.classList.add("open");
    reservationModal.setAttribute("aria-hidden", "false");
  });
});

function closeReservationModal() {
  reservationModal.classList.remove("open");
  reservationModal.setAttribute("aria-hidden", "true");
}

closeModalButton.addEventListener("click", closeReservationModal);
reservationModal.addEventListener("click", (event) => {
  if (event.target === reservationModal) closeReservationModal();
});

function updateReservationTotal() {
  const total = selectedPrice * Number(reservationPeople.value);
  reservationTotal.textContent = total.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });
}

reservationPeople.addEventListener("change", updateReservationTotal);

document.getElementById("reservationForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const date = reservationDate.value;
  const time = document.getElementById("reservationTime").value;
  const people = reservationPeople.value;

  if (!date || date < localDate) {
    alert("Elegí una fecha válida.");
    return;
  }

  alert(
    `¡Listo! Esta es una simulación de reserva:\\n\\n` +
    `${modalExperience.value}\\n${date} · ${time}\\n${people} persona(s)\\n` +
    `Total estimado: ${reservationTotal.textContent}\\n\\n` +
    `No se guardó ninguna reserva real.`
  );
  closeReservationModal();
});

const chatPanel = document.getElementById("chatPanel");
const openChatButton = document.getElementById("openChat");
const closeChatButton = document.getElementById("closeChat");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

function openChat() {
  chatPanel.classList.add("open");
  chatPanel.setAttribute("aria-hidden", "false");
  chatInput.focus();
}
function closeChat() {
  chatPanel.classList.remove("open");
  chatPanel.setAttribute("aria-hidden", "true");
}
openChatButton.addEventListener("click", openChat);
closeChatButton.addEventListener("click", closeChat);

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  addChatMessage(message, "user");
  chatInput.value = "";

  window.setTimeout(() => {
    addChatMessage(
      "¡Gracias por tu consulta! En esta demo puedo mostrar la interfaz, pero todavía no estoy conectado a una IA. Podés explorar las experiencias o iniciar una reserva de prueba.",
      "assistant"
    );
  }, 350);
});

function addChatMessage(message, role) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role === "user" ? "user" : ""}`;
  bubble.textContent = message;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
