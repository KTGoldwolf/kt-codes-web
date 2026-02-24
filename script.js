const img = document.querySelector('header img');
const holoWrap = document.querySelector('.holo-wrap');

// Check if device supports orientation
const supportsOrientation = 'DeviceOrientationEvent' in window;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

function applyTilt(rotateX, rotateY) {
    const target = holoWrap || img;
    target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function applyHolo(xPct, yPct, intensity) {
    if (!holoWrap) return;
    const angle = 90 + (xPct - 50) * 0.6; // rotates ±30deg with horizontal position
    holoWrap.style.setProperty('--holo-pos-x', `${xPct}%`);
    holoWrap.style.setProperty('--holo-pos-y', `${yPct}%`);
    holoWrap.style.setProperty('--holo-angle', `${angle}deg`);
    holoWrap.style.setProperty('--holo-opacity', intensity);
}

// Mouse-based tilt for desktop
img.addEventListener('mousemove', (e) => {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    applyTilt(rotateX, rotateY);
    applyHolo((x / rect.width) * 100, (y / rect.height) * 100, 0.8);
});

img.addEventListener('mouseleave', () => {
    applyTilt(0, 0);
    applyHolo(50, 50, 0.25);
});


if (supportsOrientation && !(isIOS && typeof DeviceOrientationEvent.requestPermission === 'function')) {
    enableGyroscope();
}

function enableGyroscope() {
    window.addEventListener('deviceorientation', (e) => {
        // beta: front-to-back tilt (-180 to 180), forward is positive
        // gamma: left-to-right tilt (-90 to 90), right is positive

        const beta = e.beta;   // -180 to 180
        const gamma = e.gamma; // -90 to 90

        // Normalize to similar range as mouse (-15 to 15 degrees)
        // Clamp beta to -30 to 30 range for more natural feel
        const clampedBeta = Math.max(-30, Math.min(30, beta));
        const clampedGamma = Math.max(-30, Math.min(30, gamma));

        const rotateX = (clampedBeta / 30) * -15;
        const rotateY = (clampedGamma / 30) * 15;

        applyTilt(rotateX, rotateY);

        const xPct = ((clampedGamma + 30) / 60) * 100;
        const yPct = ((clampedBeta + 30) / 60) * 100;
        applyHolo(xPct, yPct, 0.7);
    });
}
