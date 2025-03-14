let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

document.addEventListener('DOMContentLoaded', function () {
    const myForm = document.getElementById('form');

    myForm.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            myForm.submit();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            myForm.reset();
            console.log('Formularz zresetowany');
        }
    });
});


async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            const countryInput = document.getElementById('country');

            if (countryInput) {
                const option = [...countryInput.options].find(opt => opt.value === country);
                if (option) option.selected = true;
            }

            getCountryCode(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        return response.json();
    })
    .then(data => {        
        const countryCode = data[0].idd.root + data[0].idd.suffixes.join("")
        const countryCodeInput = document.getElementById('countryCode');

            if (countryCodeInput) {
                const option = [...countryCodeInput.options].find(opt => opt.value === countryCode);
                if (option) option.selected = true;
            }
    })
    .catch(error => {
        console.error('Wystąpił błąd:', error);
    });
}


(() => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);

    fetchAndFillCountries();

    getCountryByIP();
})()
