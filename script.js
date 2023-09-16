function loadStaticContent() {
    fetch('whytesla.md')
        .then(response => response.text())
        .then(data => {
            document.getElementById("whytesla-title").textContent = "Why Tesla?";
            document.getElementById("whytesla-content").innerHTML = marked(data);

            return fetch('static_content.json');
        })
        .then(response => response.json())
        .then(jsonData => {
            document.getElementById("headerTitle").textContent = jsonData.headerTitle;

            for (let tooltip in jsonData.tooltips) {
                document.getElementById("tooltip-" + tooltip).setAttribute("data-tooltip", jsonData.tooltips[tooltip]);
            }

            const glossarySection = document.getElementById("glossary");
            glossarySection.innerHTML = "";
            for (let term in jsonData.glossary) {
                let listItem = document.createElement("li");
                listItem.innerHTML = `<strong>${term}:</strong> ${jsonData.glossary[term]}`;
                glossarySection.appendChild(listItem);
            }
        });
}

function updateStatement() {
    const carPrice = parseFloat(document.getElementById("carPrice").value).toFixed(2);
    const years = document.getElementById("years").value;
    const milesPerYear = parseFloat(document.getElementById("milesPerYear").value).toFixed(2);
    const electricityCost = parseFloat(document.getElementById("electricityCost").value).toFixed(2);
    const gasPrice = parseFloat(document.getElementById("gasPrice").value).toFixed(2);
    const mpg = parseFloat(document.getElementById("mpg").value).toFixed(2);
    const federalCredit = parseFloat(document.getElementById("federalCredit").value).toFixed(2);
    const referralCredit = parseFloat(document.getElementById("referralCredit").value).toFixed(2);
    const totalCredits = (parseFloat(federalCredit) + parseFloat(referralCredit)).toFixed(2);

    document.getElementById("basePrice").textContent = "$" + carPrice;
    document.getElementById("yearsHighlight").textContent = years;
    document.getElementById("milesYearHighlight").textContent = milesPerYear + " miles";
    document.getElementById("electricityCostHighlight").textContent = "$" + electricityCost;
    document.getElementById("gasPriceHighlight").textContent = "$" + gasPrice;
    document.getElementById("mpgHighlight").textContent = mpg + " MPG";
    document.getElementById("totalCreditsHighlight").textContent = "$" + Math.abs(totalCredits);
}

function calculateTotal() {
    const initialCost = calculateAffordability();
    const fuelSavings = calculateFuelSavings();
    const electricityCost = calculateElectricityCost();
    const totalCredits = calculateCredits();
    const resultingCost = initialCost + electricityCost - fuelSavings + totalCredits;

    document.getElementById("totalValue").textContent = "$" + resultingCost.toFixed(2);
}

function calculateAffordability() {
    const carPrice = parseFloat(document.getElementById("carPrice").value);
    const federalCredit = parseFloat(document.getElementById("federalCredit").value);
    const referralCredit = parseFloat(document.getElementById("referralCredit").value);
    const destinationFee = parseFloat(document.getElementById("destinationFee").value);
    return carPrice + federalCredit + referralCredit + destinationFee;
}

function calculateFuelSavings() {
    const years = parseFloat(document.getElementById("years").value);
    const milesPerYear = parseFloat(document.getElementById("milesPerYear").value);
    const gasPrice = parseFloat(document.getElementById("gasPrice").value);
    const mpg = parseFloat(document.getElementById("mpg").value);
    const totalMiles = years * milesPerYear;
    const totalGallons = totalMiles / mpg;
    return totalGallons * gasPrice;
}

function calculateElectricityCost() {
    const years = parseFloat(document.getElementById("years").value);
    const milesPerYear = parseFloat(document.getElementById("milesPerYear").value);
    const electricityCost = parseFloat(document.getElementById("electricityCost").value);
    const teslaMileKwh = 25.0 / 100;
    const totalMiles = years * milesPerYear;
    const totalKWh = totalMiles * teslaMileKwh;
    return totalKWh * electricityCost;
}

function calculateCredits() {
    const federalCredit = parseFloat(document.getElementById("federalCredit").value);
    const referralCredit = parseFloat(document.getElementById("referralCredit").value);
    return Math.min(federalCredit, 0) + Math.min(referralCredit, 0);
}

function toggleTheme() {
    const theme = document.documentElement.getAttribute("data-theme");
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
    }
}

window.onload = function () {
    const inputs = document.querySelectorAll("input, select");
    for (let input of inputs) {
        input.addEventListener("input", function () {
            updateStatement();
            calculateTotal();
        });
    }
    loadStaticContent();
    updateStatement();
    calculateTotal();
};
