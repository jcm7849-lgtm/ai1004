const mainNumbersContainer = document.querySelector('.main-numbers-container');
const bonusNumberContainer = document.querySelector('.bonus-number-container');
const generateBtn = document.getElementById('generate-btn');

const generateLottoNumbers = () => {
    const numbers = new Set();
    while (numbers.size < 7) { // Generate 7 unique numbers first
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    const allNumbers = Array.from(numbers);
    const mainNumbers = allNumbers.slice(0, 6).sort((a, b) => a - b);
    const bonusNumber = allNumbers[6];

    return { mainNumbers, bonusNumber };
};

const getNumberColor = (number) => {
    if (number <= 10) return 'linear-gradient(135deg, #f6d365, #fda085)'; // Yellow
    if (number <= 20) return 'linear-gradient(135deg, #84fab0, #8fd3f4)'; // Blue
    if (number <= 30) return 'linear-gradient(135deg, #f093fb, #f5576c)'; // Red
    if (number <= 40) return 'linear-gradient(135deg, #d4d4d4, #a0a0a0)'; // Gray
    return 'linear-gradient(135deg, #5ee7df, #b490ca)'; // Green/Purple
};


const displayNumbers = (mainNumbers, bonusNumber) => {
    mainNumbersContainer.innerHTML = ''; // Clear previous numbers
    bonusNumberContainer.innerHTML = '<p>Bonus</p>'; // Clear previous bonus number but keep the title

    mainNumbers.forEach((number, index) => {
        setTimeout(() => {
            const numberElement = document.createElement('div');
            numberElement.classList.add('number-ball');
            numberElement.textContent = number;
            numberElement.style.background = getNumberColor(number);
            numberElement.style.transform = 'translateY(50px) scale(0)';
            mainNumbersContainer.appendChild(numberElement);

            setTimeout(() => {
                numberElement.style.transform = 'translateY(0) scale(1)';
            }, 50);

        }, index * 150); // Stagger the animation
    });

    setTimeout(() => {
        const bonusElement = document.createElement('div');
        bonusElement.classList.add('number-ball');
        bonusElement.textContent = bonusNumber;
        bonusElement.style.background = getNumberColor(bonusNumber);
        bonusElement.style.transform = 'translateY(50px) scale(0)';
        bonusNumberContainer.appendChild(bonusElement);

        setTimeout(() => {
            bonusElement.style.transform = 'translateY(0) scale(1)';
        }, 50);
    }, mainNumbers.length * 150);
};

generateBtn.addEventListener('click', () => {
    const { mainNumbers, bonusNumber } = generateLottoNumbers();
    displayNumbers(mainNumbers, bonusNumber);
});

// Initial generation
setTimeout(() => {
    generateBtn.click();
}, 500);
