const cardContainer = document.querySelector(".youtube__cards");
const searchInput = document.querySelector(".youtube__search-input");
const searchButton = document.querySelector(".youtube__search-button");

const API_URL =
  "https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=500";

const cardsData = await fetchData(API_URL);

function createCard({
  id,
  thumbnail,
  title,
  channelImg = "https://yt3.googleusercontent.com/6tLBV-DRVemxhmanuezR5HkHshX2g7Y46Rq8cysyO1V-nd2SaQ2Fi8cdgVM-n6v_8XZ5BEimxXI=s160-c-k-c0x00ffffff-no-rj",
  channelName = "Hitesh Choudhary",
  viewCount,
  publishedAt,
}) {
  const element = document.createElement("a");
  element.classList.add("youtube__card");
  element.href = `https://www.youtube.com/watch?v=${id}`;

  element.innerHTML = `
    <div class="youtube__thumbnail">
      <img src="${thumbnail}" alt="${title}">
    </div>

    <div class="youtube__card-content">
      <img src="${channelImg}" alt="${channelName}" class="youtube__card-channel-img">

      <div>
        <h2 class="youtube__card-title">${title}</h2>
        <h3 class="youtube__card-channel-name">${channelName}</h3>
        <div class="youtube__card-info">
          ${viewCount} • ${timeAgo(publishedAt)}
        </div>
      </div>
    </div>
  `;

  return element;
}

async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return { success: false, message: error.message };
  }
}

function renderCards(cards = []) {
  cardContainer.innerHTML = "";
  cards.forEach(({ items }) => {
    cardContainer.appendChild(
      createCard({
        id: items?.id,
        thumbnail: items?.snippet?.thumbnails?.high?.url,
        title: items?.snippet?.localized?.title,
        viewCount: items?.statistics?.viewCount,
        publishedAt: items?.snippet?.publishedAt,
      })
    );
  });
}

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 1) return "Just now";

  const intervals = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];

  for (const [unit, value] of intervals) {
    const count = Math.floor(seconds / value);
    if (count >= 1) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
  }
};

function handleSearch() {
  const searchText = searchInput.value.trim();

  if (!searchText) {
    renderCards(cardsData?.data?.data);
    return;
  }

  const data = cardsData?.data?.data;
  const searchCards = data.filter(({ items }) => {
    return (
      items?.snippet?.localized?.title
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      items?.statistics?.viewCount == searchText ||
      items?.snippet?.channelTitle
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  });

  if (searchCards.length === 0) {
    cardContainer.innerHTML = `<div class="error">Video not Found!</div>`;
    return;
  }

  renderCards(searchCards);
}

searchButton.addEventListener("click", handleSearch);

renderCards(cardsData?.data?.data);
