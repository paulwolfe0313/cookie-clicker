let cookieCount = 0;
let cookiesPerSecond = 0;

const cookieCounterDisplay = document.getElementById('cookie-counter');
const perSecondDisplay = document.getElementById('per-second');
const cookieClicker = document.getElementById('cookie-clicker');
const upgradesOwnedContainer = document.getElementById('upgrades-owned');

let upgrades = {
    click: { baseCost: 50, purchased: 0, purchaseLimit: 10, title: "Cookie Idle" }
};


cookieClicker.addEventListener('click', () => {
    cookieCount++;
    updateDisplay();
});

setInterval(() => {
    cookieCount += cookiesPerSecond;
    updateDisplay();
}, 1000);

function updateDisplay() {
    cookieCounterDisplay.textContent = `${cookieCount} cookies`;
    perSecondDisplay.textContent = `per second: ${cookiesPerSecond}`;
    updateStore();
}

function updateStore() {
    Object.keys(upgrades).forEach(type => {
        const upgrade = upgrades[type];
        const newCost = Math.ceil(upgrade.baseCost * Math.pow(1.5, upgrade.purchased));
        const buyButton = document.querySelector(`#${type}-upgrade .buy-button`);
        
        // Check if the maximum number of upgrades has been reached
        if (upgrade.purchased >= upgrade.purchaseLimit) {
            buyButton.textContent = "Maxed Out";
            buyButton.classList.add('disabled');
            buyButton.disabled = true;
        } else {
            buyButton.textContent = `Buy for ${newCost} cookies`;
            if (cookieCount < newCost) {
                buyButton.classList.add('disabled');
                buyButton.disabled = true; // Disable the button's functionality
            } else {
                buyButton.classList.remove('disabled');
                buyButton.disabled = false; // Enable the button's functionality
            }
        }
    });
}



function buyUpgrade(type) {
    const upgrade = upgrades[type];
    const cost = Math.ceil(upgrade.baseCost * Math.pow(1.5, upgrade.purchased));
    if (cookieCount >= cost && upgrade.purchased < upgrade.purchaseLimit) {
        cookieCount -= cost;
        upgrade.purchased++;
        cookiesPerSecond++; // Increment cookies per second as needed
        updateDisplay();
        updateOwnedUpgradesDisplay();
    }
}

function updateOwnedUpgradesDisplay() {
    upgradesOwnedContainer.innerHTML = ''; // Clear current list
    Object.keys(upgrades).forEach(type => {
        const upgrade = upgrades[type];
        if (upgrade.purchased > 0) {
            const upgradeDiv = document.createElement('div');
            upgradeDiv.textContent = `${upgrade.title} (Max ${upgrade.purchaseLimit}) Owned: ${upgrade.purchased}`;
            upgradesOwnedContainer.appendChild(upgradeDiv);
        }
    });
}
function getRandomBonus(minPercent, maxPercent, currentCookies) {
    return Math.ceil(currentCookies * (Math.random() * (maxPercent - minPercent) + minPercent) / 100);
}

function createFallingCookie() {
    const cookie = document.createElement('img');
    cookie.src = './styles/img/money.png'; // Replace with the path to your cookie image
    cookie.classList.add('falling-cookie');
    cookie.onclick = function() {
        const bonus = getRandomBonus(5, 15, cookieCount);
        cookieCount += bonus;
        updateDisplay();
        document.body.removeChild(cookie);
    };

    document.body.appendChild(cookie);

    // Animate the cookie falling
    let start = Date.now();
    const interval = setInterval(function() {
        let timePassed = Date.now() - start;
        let windowHeight = window.innerHeight;
        cookie.style.top = `${Math.min(windowHeight, (timePassed / 4000) * windowHeight)}px`;
        if (timePassed > 8000) {
            clearInterval(interval);
            if (document.body.contains(cookie)) {
                document.body.removeChild(cookie);
            }
        }
    }, 20);
}

// Call createFallingCookie at random intervals between 10 and 30 seconds
function startRandomFallingCookies() {
    const minInterval = 15000; // 15 seconds
    const maxInterval = 45000; // 45 seconds

    function createCookieWithRandomInterval() {
        const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;
        setTimeout(() => {
            createFallingCookie();
            createCookieWithRandomInterval();
        }, randomInterval);
    }

    createCookieWithRandomInterval();
}

updateOwnedUpgradesDisplay(); // Initial display update
startRandomFallingCookies();
