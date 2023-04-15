
async function getPrayersTime() {
  const storedCity = localStorage.getItem('city');
  const storedCountry = localStorage.getItem('country');
if(!storedCity || !storedCountry) return;
  const currentDate = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
  const url = `https://api.aladhan.com/v1/timingsByCity/${currentDate}?city=${storedCity}&date=${currentDate}&country=${storedCountry}&method=${localStorage.getItem('method') || 4}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data;
    })
  }
getPrayersTime().then(data => {
  const timings = data.data.timings;
  const current_time = new Date().toLocaleTimeString('en-GB', {hour12: false});
  const prayer_times = Object.values(timings).slice(0, 5);
  const next_index = prayer_times.findIndex(time => time > current_time);
  let nearest_index = next_index === -1 ? 0 : next_index;
  if (next_index !== 0) {
    const next_diff = getTimeDifference(current_time, prayer_times[next_index]);
    const prev_diff = getTimeDifference(current_time, prayer_times[next_index - 1]);
    nearest_index = prev_diff < next_diff ? next_index - 1 : next_index;
  }
  let i = 0;
  Object.entries(timings).forEach(([prayer, time],index) => {
    if(i == 5) return;
    let prayers = [{en:'Fajr',ar:'الفجر'},{en:'Dhuhr',ar:'الظهر'},{en:'Asr',ar:'العصر'},{en:'Maghrib',ar:'المغرب'},{en:'Isha',ar:'العشاء'}];
    if (prayers.filter((p) => p.en == prayer)) {
      const element = document.getElementById('prayers');
      let div = document.createElement('a');
      div.classList = `flex flex-none text-center ${index === nearest_index ? 'font-semibold text-[#D4AF37]' : ''}`;
      const language = localStorage.getItem('language') || 'en';
if(language == 'en') div.innerHTML = `${prayers[i].en} <br> ${convertTimeTo12HrFormat(timings[`${prayers[i].en}`])}`;
else div.innerHTML = `${prayers[i].ar} <br> ${convertTimeTo12HrFormat(timings[`${prayers[i].en}`])}`;
      element.appendChild(div);
      i++;

    }
  });
}).catch(error => {
  const storedCity = localStorage.getItem('city');
  const element = document.getElementById('prayers');
  let div = document.createElement('a');
  const language = localStorage.getItem('language') || 'en';
  div.classList = `text-[#151000] text-sm`;
  if(language !== 'en') div.innerText = `عذرًا , لم يتم العثور على مواقيت الصلاة في ${storedCity}`;
  else div.innerText = `Sorry, no prayer times were found in ${storedCity}`;
  element.appendChild(div);
});

function getTimeDifference(time1, time2) {
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2 ? time2.split(':').map(Number) : [0, 0];
  const time1_ms = hours1 * 60 * 60 * 1000 + minutes1 * 60 * 1000;
  const time2_ms = hours2 * 60 * 60 * 1000 + minutes2 * 60 * 1000;
  return Math.abs(time2_ms - time1_ms);
}


var citySearchInput = document.querySelector('.select-container input');
var cityResultsList = document.querySelector('.select-container ul');
var displayedCities = {};

var city = localStorage.getItem('city');
if (city) {
  var [city, countryShort] = city.split(', ');
  citySearchInput.value = city;
}



citySearchInput.addEventListener('input', function() {
  var query = this.value;
  var limit = 10;
  const language = localStorage.getItem('language') || 'en';
  var apiKey = '609c5e1c516a4acdafd52f2e07783a97';
    var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.opencagedata.com/geocode/v1/json?q=' + query + '&language=' + language + '&limit=' + limit + '&key=' + apiKey);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var results = JSON.parse(xhr.responseText).results;
      const datalist = document.querySelector('datalist');
      datalist.innerHTML = '';
      displayedCities = {};

      for (var i = 0; i < results.length; i++) {
        var city = results[i].components.city || results[i].components.town || results[i].components.village || '';
        var country = results[i].components.country;
        console.log(results[i].components);
    if (city && !displayedCities[city]) {
          displayedCities[city] = true;
          const datalist = document.querySelector('datalist');
          const option = document.createElement('option');
          option.value = city + ', ' + country;
          datalist.appendChild(option);
        }
      }
    } else {
      return
    }
  };
  xhr.send();
});

document.addEventListener('click', function(event) {
  if (!event.target.closest('.select-container')) {
    const datalist = document.querySelector('datalist');
    datalist.innerHTML = '';
}
});
document.addEventListener('DOMContentLoaded',function(event) {
  const language = localStorage.getItem('language') || 'en';
  const city = localStorage.getItem('city');
  if(!city) {
    document.getElementById('collapse_box').click();
  }
if(language == 'ar') {
  document.getElementById('select_method').innerHTML += `
  <option value="1">جامعة العلوم الإسلامية بكراتشي</option>
  <option value="2">الجمعية الإسلامية في أمريكا الشمالية</option>
  <option value="3">رابطة العالم الإسلامي</option>
  <option value="4">جامعة أم القرى في مكة المكرمة</option>
  <option value="5">الهيئة العامة للمساحة بمصر</option>
  <option value="7">معهد الجيوفيزياء، جامعة طهران</option>
  <option value="8">المنطقة الخليجية</option>
  <option value="9">الكويت</option>
  <option value="10">قطر</option>
  <option value="11">مجلس أُمغَما إسلام سنغافورة</option>
  <option value="12">منظمة الإتحاد الإسلامي في فرنسا</option>
  <option value="13">رئاسة الشؤون الدينية التركية</option>
  <option value="14">الإدارة الروحية لمسلمي روسيا</option>
  <option value="15">دبي (غير رسمي)</option>
`
  document.body.style.direction = 'rtl';
} else {
  document.getElementById('select_method').innerHTML += `
  <option value="1">University of Islamic Sciences, Karachi</option>
  <option value="2">Islamic Society of North America</option>
  <option value="3">Muslim World League</option>
  <option value="4">Umm Al-Qura University, Makkah</option>
  <option value="5">Egyptian General Authority of Survey</option>
  <option value="7">Institute of Geophysics, University of Tehran</option>
  <option value="8">Gulf Region</option>
  <option value="9">Kuwait</option>
  <option value="10">Qatar</option>
  <option value="11">Majlis Ugama Islam Singapura, Singapore</option>
  <option value="12">Union Organization islamic de France</option>
  <option value="13">Diyanet İşleri Başkanlığı, Turkey</option>
  <option value="14">Spiritual Administration of Muslims of Russia</option>
  <option value="15">Dubai (unofficial)</option>
`
}
  getPrayersTime();
  const now = new Date();

const hijriFormatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const hijriDate = hijriFormatter.format(now);

const georgianFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const georgianDate = georgianFormatter.format(now);

const hijriFormatterAR = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const hijriDateAR = hijriFormatterAR.format(now);

const georgianFormatterAR = new Intl.DateTimeFormat('ar-SA', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const georgianDateAR = georgianFormatterAR.format(now);
const datediv = document.getElementById('date');
const citydiv = document.getElementById('city');
const methoddiv = document.getElementById('method');
if(language == 'en') {
  datediv.innerText = `${hijriDate} - ${georgianDate}`;
  citydiv.innerText = `City`;
  methoddiv.innerText = `Based On`
}
else {
   datediv.innerText = `${hijriDateAR} - ${georgianDateAR}`;
   citydiv.innerText = `المدينة`;
   methoddiv.innerText = `المصدر`
}
const methodInput = document.getElementById('select_method');
methodInput.value = Number(localStorage.getItem('method') || 4);
methodInput.addEventListener('input', () => {
  localStorage.setItem('method',methodInput.value);
  window.location.reload();
});

const languageButton = document.querySelector('#select_language');
languageButton.innerHTML = `${localStorage.getItem('language').replace('en','E').replace('ar','ع')}`;
languageButton.addEventListener('click', () => {
  if(languageButton.innerText == `ع`) {
    localStorage.setItem('language','en');
  } else {
    localStorage.setItem('language','ar');
  }
  window.location.reload();
});
const inputField = document.querySelector('#city_input');
inputField.addEventListener('input', () => {
  const selectedOption = document.querySelector(`#suggestions option[value="${inputField.value}"]`);
  if (selectedOption) {
    localStorage.setItem('city', selectedOption.value.split(',')[0]);
    localStorage.setItem('country',selectedOption.value.split(',')[1]);
    window.location.reload();
}
});

});

function convertTimeTo12HrFormat(time) {
  let hour = parseInt(time.substr(0, 2));
  let minute = time.substr(3, 2);
  const language = localStorage.getItem('language') || 'en';
  let ampm;
  if(language !== 'en') {
    ampm = hour >= 12 ? 'مساءً' : 'صباحًا';
  } else {
  ampm = hour >= 12 ? 'pm' : 'am';
  }
  hour = hour % 12 || 12;
  return hour + ':' + minute + ' ' + `${ampm}`;
}