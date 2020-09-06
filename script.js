document.addEventListener("DOMContentLoaded", async () => {
  const rd = await getData("https://api.covid19api.com/summary");

  console.log(rd);

  //retrieve the data
  let dataDate = new Date(rd.Date);
  let globalData = rd.Global;
  let countryData = rd.Countries;

  //format the data

  //render the data
  const dateSpan = document.getElementById("dataDate");
  dateSpan.innerText = dataDate.toLocaleDateString();

  //global stats
  displayGlobalStats(globalData);

  //country wise data

  const countryCount = countryData.length;
  const msg_1 = document.querySelector("#msg_1");
  const ul = document.createElement("ul");
  ul.classList='list-group mb-5 mt-2';
  let msgCountry = `Viewing data for <span class='badge badge-secondary'>${countryCount}</span> countries.`;

  ul.appendChild(createListItem(msgCountry));

  const countriesAffectedToday = countryData.filter((f) => f.NewConfirmed > 0)
    .length;
  msgCountry = `<span class='badge badge-danger'>${countriesAffectedToday}</span> countries reported positive covid case counts today.`;
  ul.appendChild(createListItem(msgCountry));
  msg_1.append(ul);

  refreshCountryData(countryData, "NewConfirmed");
  addEvents(countryData);
});
function displayGlobalStats(globalData){
  const newConfirmed = document.querySelector("#newConfirmed");
  newConfirmed.value = formatNum(globalData.NewConfirmed);
  const totalConfirmed = document.querySelector("#totalConfirmed");
  totalConfirmed.value =formatNum( globalData.TotalConfirmed);
  const newDeaths = document.querySelector("#newDeaths");
  newDeaths.value = formatNum(globalData.NewDeaths);
  const totalDeaths = document.querySelector("#totalDeaths");
  totalDeaths.value = formatNum(globalData.TotalDeaths);
  const newRecovered = document.querySelector("#newRecovered");
  newRecovered.value = formatNum(globalData.NewRecovered);
  const totalRecovered = document.querySelector("#totalRecovered");
  totalRecovered.value =formatNum( globalData.TotalRecovered);
}
function refreshCountryData(countryData, sortBy) {
  let sortedCountryData = countryData.sort((f) => sortBy);
  let orderByTotalConfirmed = sortedCountryData.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return 1;
    } else {
      return 0;
    }
  });
  const countryWiseData = document.querySelector("#countryWiseData");
  countryWiseData.innerHTML = "";
  orderByTotalConfirmed.forEach((c) => {
    const tr = document.createElement("tr");
    tr.appendChild(createTD(formatNum(c.Country)));
    tr.appendChild(createTD(formatNum(c.NewConfirmed)));
    tr.appendChild(createTD(formatNum(c.TotalConfirmed)));
    tr.appendChild(createTD(formatNum(c.NewDeaths)));
    tr.appendChild(createTD(formatNum(c.TotalDeaths)));
    tr.appendChild(createTD(formatNum(c.NewRecovered)));
    tr.appendChild(createTD(formatNum(c.TotalRecovered)));
    tr.appendChild(createTD( Math.round((c.TotalRecovered/c.TotalConfirmed)*100)));
    countryWiseData.appendChild(tr);
  });
}

function addEvents(countryData){
    const tbl_countryWise = document.querySelector("#countryWise");

  tbl_countryWise.addEventListener("click", (e) => {
    const tag = e.target.tagName;
    const textContent = e.target.textContent;
    if (tag === "TH") {
      switch (textContent) {
        case "New Confirmed":
          refreshCountryData(countryData, "NewConfirmed");
          break;
        case "Total Confirmed":
          refreshCountryData(countryData, "TotalConfirmed");
          break;
        case "New Deaths":
          refreshCountryData(countryData, "NewDeaths");
          break;
        case "Total Deaths":
          refreshCountryData(countryData, "TotalDeaths");
          break;
        case "New Recovered":
          refreshCountryData(countryData, "NewRecovered");
          break;
        case "Total Recovered":
          refreshCountryData(countryData, "TotalRecovered");
          break;
        default:
          refreshCountryData(countryData, "NewConfirmed");
          break;
      }
    }
  });
}

function createListItem(text) {
  const li = document.createElement("li");
  li.className='list-group-item';
  li.innerHTML = text;
  return li;
}

function createTD(text) {
  const td = document.createElement("td");
  const textNode = document.createTextNode(text);
  td.appendChild(textNode);
  return td;
}
async function getData(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const rawData = await response.json();
      return rawData;
    }
  } catch (error) {
    console.error(`HTTP Error occured ${error}`);
  }
}
function formatNum(num){
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,'$1,');
}