document.addEventListener('DOMContentLoaded', () => {
    const sphere = document.querySelector('.sphere');
    const generateBtn = document.getElementById('generate-btn');
    const mainNumbersDisplay = document.querySelector('.main-numbers-display');
    const bonusNumberDisplay = document.querySelector('.bonus-number-display');
    const themeToggle = document.getElementById('checkbox');
    const body = document.body;

    const totalBalls = 45;
    let balls = [];
    let animationFrameId;

    const getNumberColor = (number) => {
        if (number <= 10) return 'linear-gradient(135deg, #f6d365, #fda085)';
        if (number <= 20) return 'linear-gradient(135deg, #84fab0, #8fd3f4)';
        if (number <= 30) return 'linear-gradient(135deg, #f093fb, #f5576c)';
        if (number <= 40) return 'linear-gradient(135deg, #d4d4d4, #a0a0a0)';
        return 'linear-gradient(135deg, #5ee7df, #b490ca)';
    };

    // Create and animate balls
    function createBalls() {
        sphere.innerHTML = '';
        balls = [];
        for (let i = 1; i <= totalBalls; i++) {
            const ball = document.createElement('div');
            ball.classList.add('ball');
            ball.textContent = i;
            ball.style.background = getNumberColor(i);

            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * 100;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            const z = (Math.random() - 0.5) * 200;

            const ballObj = {
                element: ball,
                x: x, y: y, z: z,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                vz: (Math.random() - 0.5) * 2,
                number: i
            };
            balls.push(ballObj);
            sphere.appendChild(ball);
        }
        startAnimation();
    }

    function update() {
        const sphereRadius = 125; // half of sphere width
        const friction = 0.99;

        balls.forEach(b => {
            b.x += b.vx; b.y += b.vy; b.z += b.vz;

            // Collision with sphere walls
            const dist = Math.sqrt(b.x*b.x + b.y*b.y + b.z*b.z);
            if (dist > sphereRadius - 20) {
                 const normalX = b.x / dist;
                 const normalY = b.y / dist;
                 const normalZ = b.z / dist;

                 const dotProduct = b.vx * normalX + b.vy * normalY + b.vz * normalZ;

                 b.vx = (b.vx - 2 * dotProduct * normalX) * friction;
                 b.vy = (b.vy - 2 * dotProduct * normalY) * friction;
                 b.vz = (b.vz - 2 * dotProduct * normalZ) * friction;
            }
            
            b.element.style.transform = `translate3d(${b.x}px, ${b.y}px, ${b.z}px)`;
        });

        animationFrameId = requestAnimationFrame(update);
    }

    function startAnimation() {
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(update);
        }
    }

    function stopAnimation() {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // Drawing logic
    async function drawNumbers() {
        generateBtn.disabled = true;
        mainNumbersDisplay.innerHTML = '';
        bonusNumberDisplay.innerHTML = '<h3>Bonus</h3>'; // Reset bonus display

        // Shuffle balls for drawing
        let shuffledBalls = [...balls].sort(() => 0.5 - Math.random());
        let selectedBalls = shuffledBalls.slice(0, 7);
        let mainNumbers = selectedBalls.slice(0, 6).sort((a,b) => a.number - b.number);
        let bonusNumber = selectedBalls[6];

        // Animate selection
        for (let i = 0; i < mainNumbers.length; i++) {
            await selectBall(mainNumbers[i], mainNumbersDisplay);
        }
        await selectBall(bonusNumber, bonusNumberDisplay, true);
        
        // After drawing, restart the full animation
        createBalls();
        generateBtn.disabled = false;
    }

    function selectBall(ballObj, displayContainer, isBonus = false) {
        return new Promise(resolve => {
            const ballElement = ballObj.element;
            ballElement.style.transition = 'transform 1s ease-in-out, opacity 0.5s ease';
            
            // Animate to exit pipe
            ballElement.style.transform = `translate3d(0, 100px, 0)`; 
            ballElement.style.opacity = '0.5';

            setTimeout(() => {
                ballElement.style.display = 'none';
                const resultBall = document.createElement('div');
                resultBall.classList.add('result-ball');
                resultBall.textContent = ballObj.number;
                resultBall.style.background = getNumberColor(ballObj.number);
                displayContainer.appendChild(resultBall);

                setTimeout(() => {
                    resultBall.style.transform = 'scale(1)';
                }, 50)

                resolve();
            }, 1000);
        });
    }

    // Theme Switcher
    const setDarkMode = (isDark) => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        body.classList.toggle('light-mode', !isDark);
        themeToggle.checked = !isDark;
    };

    themeToggle.addEventListener('change', () => {
        setDarkMode(!themeToggle.checked);
    });

    const currentTheme = localStorage.getItem('theme');
    setDarkMode(currentTheme === 'light' ? false : true);

    // Event Listeners
    generateBtn.addEventListener('click', () => {
        stopAnimation();
        drawNumbers();
    });

    // Initial Load
    createBalls();
});
