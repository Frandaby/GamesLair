export async function postRequest(endpoint, data) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function postReviewRequest(endpoint, data, selectedGame) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: data,
      game: selectedGame,
    }),
  });
  return res.json();
}

export async function postForumRequest(endpoint, data, userID) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: data,
      userID: userID,
    }),
  });
  return res.json();
}

export async function postFavRequest(endpoint, data, userID) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      game: {
        id: data.id,
        name: data.name,
        background_image: data.background_image,
        released: data.released,
        metacritic: data.metacritic,
      },
      userID: userID,
    }),
  });
  return res.json();
}

export async function deleteRequest(endpoint, data) {
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function putRequest(endpoint, data) {
  const res = await fetch(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const getColour = (score) => {
  if (score < 50) {
    return "red";
  } else if (score <= 75) {
    return "orange";
  } else {
    return "green";
  }
};

export const getAverageScore = (reviews) => {
  return Math.round(
    reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length,
  );
};

export const formatTag = (tag) => {
  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${date.getFullYear()} at ${String(
    date.getHours(),
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds(),
  ).padStart(2, "0")}`;
};
