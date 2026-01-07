const img = document.querySelector('header img');

img.addEventListener('mousemove', (e) => {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

img.addEventListener('mouseleave', () => {
    img.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
});
