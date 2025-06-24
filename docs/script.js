
const apiKey = "e16661017ed311b0e8fed39cf5f85aae";

async function getWeather() {
  const city = document.getElementById("citySelect").value;
  if (!city) return alert("Please select a city.");

  showSpinner(true);
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found or API error");
    const data = await res.json();
    const forecast = groupByDay(data.list);

    const tbody = document.getElementById("weatherBody");
    tbody.innerHTML = "";
    forecast.forEach(day => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${day.day}</td>
        <td>${day.date}</td>
        <td><img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}" title="${day.description}"></td>
        <td>${day.temp}°C</td>
        <td>${day.wind} km/h</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    alert(err.message);
  } finally {
    showSpinner(false);
  }
}

function groupByDay(data) {
  const days = {};
  data.forEach(entry => {
    const date = new Date(entry.dt_txt);
    const shortDate = date.toLocaleDateString();
    const dayName = date.toLocaleDateString("en-US", { weekday: 'long' });

    if (!days[shortDate]) {
      days[shortDate] = {
        day: dayName,
        date: shortDate,
        temp: entry.main.temp.toFixed(1),
        icon: entry.weather[0].icon,
        description: entry.weather[0].description,
        wind: (entry.wind.speed * 3.6).toFixed(1)
      };
    }
  });
  return Object.values(days).slice(0, 7);
}

function showSpinner(show) {
  document.getElementById("loadingSpinner").style.display = show ? "block" : "none";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

window.onload = function () {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
};
