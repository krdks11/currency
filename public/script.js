document.addEventListener('DOMContentLoaded', async () => {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const amountInput = document.getElementById('amount');
    const resultInput = document.getElementById('result');
    const convertBtn = document.getElementById('convert');
    const swapBtn = document.getElementById('swap');

    // Fetch available currencies
    try {
        const response = await fetch('/currencies');
        const data = await response.json();
        const currencies = Object.entries(data.data).map(([code, info]) => ({
            code,
            ...info
        }));

        // Populate select elements
        currencies.forEach(currency => {
            const option1 = new Option(`${currency.code} - ${currency.name}`, currency.code);
            const option2 = new Option(`${currency.code} - ${currency.name}`, currency.code);
            fromSelect.add(option1);
            toSelect.add(option2);
        });

        // Set default values
        fromSelect.value = 'USD';
        toSelect.value = 'EUR';
    } catch (error) {
        console.error('Failed to fetch currencies:', error);
    }

    // Convert currency
    async function convertCurrency() {
        const amount = amountInput.value;
        const from = fromSelect.value;
        const to = toSelect.value;

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ from, to, amount })
            });
            const data = await response.json();
            resultInput.value = data.result.toFixed(2);
        } catch (error) {
            console.error('Failed to convert currency:', error);
        }
    }

    // Swap currencies
    swapBtn.addEventListener('click', () => {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
        convertCurrency();
    });

    // Convert on button click
    convertBtn.addEventListener('click', convertCurrency);

    // Initial conversion
    convertCurrency();
}); 