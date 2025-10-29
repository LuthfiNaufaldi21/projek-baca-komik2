const sunIcon = `
<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
</svg>
`;

const moonIcon = `
<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
</svg>
`;

let themeToggleButton = document.getElementById('theme-toggle-button');
if (!themeToggleButton) {
    themeToggleButton = document.createElement('button');
    themeToggleButton.setAttribute('id', 'theme-toggle-button');
    themeToggleButton.setAttribute('title', 'Ganti Tema');
    themeToggleButton.className = 'p-1.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800';
}


function updateButtonIcon(isDarkMode) {
    if (themeToggleButton) {
        themeToggleButton.innerHTML = isDarkMode ? sunIcon : moonIcon;
    }
}

function handleThemeToggle() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateButtonIcon(isDark);
}

export function initializeThemeToggle(navbarElement) {
    if (!navbarElement || !themeToggleButton) return;

    themeToggleButton.removeEventListener('click', handleThemeToggle);
    themeToggleButton.addEventListener('click', handleThemeToggle);


    const isDarkMode = document.documentElement.classList.contains('dark');
    updateButtonIcon(isDarkMode);

    const buttonContainer = navbarElement.querySelector('.flex.items-center.space-x-6');

    if (buttonContainer && !buttonContainer.contains(themeToggleButton)) {
        const profileLink = buttonContainer.querySelector('a[title="Akun Saya"]');
        if (profileLink) {
             buttonContainer.insertBefore(themeToggleButton, profileLink);
        } else {
             buttonContainer.appendChild(themeToggleButton);
        }
    }
}