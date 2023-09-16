function loadStaticContent() {
    fetch('static_content.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById("headerTitle").textContent = data.headerTitle;

            const statement = document.getElementById("summaryStatement");
            statement.childNodes[0].textContent = data.summaryIntro + " ";
            statement.childNodes[2].textContent = " " + data.summaryAfterPrice + " ";
            statement.childNodes[4].textContent = " " + data.summaryYears + " ";
            statement.childNodes[6].textContent = " " + data.summaryElectricityCost + " ";
            statement.childNodes[8].textContent = " " + data.summaryGasPrice + " ";
            statement.childNodes[10].textContent = " " + data.summaryMPG + " ";
            statement.childNodes[12].textContent = " " + data.summaryCredits + " ";

            for (let tooltip in data.tooltips) {
                document.getElementById("tooltip-" + tooltip).setAttribute("data-tooltip", data.tooltips[tooltip]);
            }

            const glossarySection = document.querySelector("article ul");
            glossarySection.innerHTML = "";
            for (let term in data.glossary) {
                let listItem = document.createElement("li");
                listItem.innerHTML = `<strong>${term}:</strong> ${data.glossary[term]}`;
                glossarySection.appendChild(listItem);
            }
        });
}

function loadBlogPost() {
    fetch('whytesla.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('whytesla-title').textContent = data.title;
            document.getElementById('whytesla-content').textContent = data.content;
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
    document.getElementById("yearsHighlight").textContent = years + " years";
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
    loadBlogPost();
    updateStatement();
    calculateTotal();
};
