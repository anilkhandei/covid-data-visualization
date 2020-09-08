let countryData;
let currentSortOrder;
let currentSortBy;
let currentPageLow;
let currentPageHigh;
document.addEventListener("DOMContentLoaded", async () => {
  const rd = await getData("https://api.covid19api.com/summary");

  console.log(rd);

  //retrieve the data
  let dataDate = new Date(rd.Date);
  let globalData = rd.Global;
  countryData = rd.Countries;

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
  ul.classList='list-group mb-2 mt-2';
  let msgCountry = `Viewing data for <span class='badge badge-secondary'>${countryCount}</span> countries.`;

  //ul.appendChild(createListItem(msgCountry));

  const countriesAffectedToday = countryData.filter((f) => f.NewConfirmed > 0)
    .length;
  msgCountry = `<span class='badge badge-danger'>${countriesAffectedToday}</span> countries reported positive covid case counts today.`;
  ul.appendChild(createListItem(msgCountry));
  msg_1.append(ul);
  currentPageLow=0;
  currentPageHigh=20;
  currentSortBy='NewConfirmed';
  currentSortOrder='asc';
  refreshCountryData("NewConfirmed");
  
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
function refreshCountryData(sortBy,sortOrder) {
    let min,max;
    min=currentPageLow;
    max=currentPageHigh;
  let sortedCountryData;
  let toggleSortOrder=()=>{
      if(currentSortBy===sortBy){
        if(currentSortOrder==='asc'){
            return 'desc';
        }
        else{
            return 'asc';
        }
      }
      else {
          return 'desc';
      }
      
  }
  
  sortOrder=toggleSortOrder();
  
  let orderByFunc=(a,b)=>{
    switch(sortOrder){
        case 'asc':
            if (a[sortBy] > b[sortBy]) {
                return 1;
              } else {
                return -1;
              }
        break;
        case 'desc':
            if (a[sortBy] < b[sortBy]) {
                return 1;
              } else {
                return 0;
              }
        break;
    }
  }
  sortedCountryData = countryData.sort((a,b)=>orderByFunc(a,b));
  const countryWiseData = document.querySelector("#countryWiseData");
  countryWiseData.innerHTML = "";
  sortedCountryData.forEach((c,i) => {
      if(i>=min &&i<=max){
        const tr = document.createElement("tr");
        //tr.appendChild(createTD(formatNum(i)));
        tr.appendChild(createTD(formatNum(c.Country)));
        tr.appendChild(createTD(formatNum(c.NewConfirmed)));
        tr.appendChild(createTD(formatNum(c.TotalConfirmed)));
        tr.appendChild(createTD(formatNum(c.NewDeaths)));
        tr.appendChild(createTD(formatNum(c.TotalDeaths)));
        tr.appendChild(createTD(formatNum(c.NewRecovered)));
        tr.appendChild(createTD(formatNum(c.TotalRecovered)));
        tr.appendChild(createTD( Math.round((c.TotalRecovered/c.TotalConfirmed)*100)));
        countryWiseData.appendChild(tr);
      }
    
  });
  currentSortOrder=sortOrder;
  currentSortBy=sortBy;
  const pagination_msg=document.querySelector('#pagination_msg');
  const msg=`<span class='text-muted'><i>Viewing ${currentPageLow} to ${currentPageHigh} of ${sortedCountryData.length} countries</i></span>`;
  //const msg_node=document.createTextNode(msg);
  pagination_msg.innerHTML=msg;
}

function displayNextCountries(){
    
    if(currentPageHigh==countryData.length){
        return;
    }
    currentPageLow=currentPageHigh;
    currentPageHigh+=20;
    refreshCountryData(currentSortBy,currentSortOrder);
}
function displayPrevCountries(){
    if(currentPageLow==0){
        return;
    }
    currentPageLow-=20;
    currentPageHigh-=20;
    refreshCountryData(currentSortBy,currentSortOrder);    
}
function addEvents(countryData){
    const tbl_countryWise = document.querySelector("#countryWise");

  tbl_countryWise.addEventListener("click", (e) => {
    const tag = e.target.tagName;
    const textContent = e.target.textContent;
    if (tag === "TH") {
      switch (textContent) {
        case "New Confirmed":
          refreshCountryData("NewConfirmed");
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
  td.style.textAlign='center';
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