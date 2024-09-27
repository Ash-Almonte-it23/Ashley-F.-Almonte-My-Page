// General DOMContentLoaded function for the whole page
document.addEventListener('DOMContentLoaded', function () {
    // --- General Setup ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const loadingScreen = document.getElementById('loadingScreen');
    let isAdmin = false;

    // Loading Screen Logic
    window.addEventListener('load', function () {
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 1000);
            }, 1000);
        }
    });

    // Dark Mode Toggle Logic
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            darkModeToggle.checked = true;
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function () {
            if (this.checked) {
                body.classList.add('dark-mode');
                body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.add('light-mode');
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }

    // Admin Login Functionality
    const loginButton = document.getElementById('loginButton');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');

    if (loginButton) {
        loginButton.addEventListener('click', function () {
            const username = usernameField.value.trim();
            const password = passwordField.value.trim();

            if (username === 'AAadmin' && password === '2025AAadmin') {
                alert('Login successful');
                isAdmin = true;
                document.querySelector('.upload-container').style.display = 'block';
                document.querySelectorAll('.delete-button').forEach(button => button.style.display = 'block');
                document.querySelectorAll('.preview-header').forEach(header => header.classList.add('admin-visible'));
                usernameField.value = '';
                passwordField.value = '';
                document.getElementById('adminLogin').style.display = 'none';
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }

    // Hide upload functionality and delete buttons if not logged in
    if (!isAdmin) {
        document.querySelector('.upload-container').style.display = 'none';
        document.querySelectorAll('.delete-button').forEach(button => button.style.display = 'none');
    }

    // --- Popup Toolbar Setup ---
    function setupPopupToolbar(containerId, toolbarId) {
        const container = document.getElementById(containerId);
        const toolbar = document.getElementById(toolbarId);

        if (!container || !toolbar) {
            console.error(`Element not found: containerId - ${containerId}, toolbarId - ${toolbarId}`);
            return;
        }

        container.addEventListener('mouseup', () => {
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
                const containerRect = container.getBoundingClientRect();
                toolbar.style.top = `${containerRect.top + window.scrollY - toolbar.offsetHeight - 50}px`;
                toolbar.style.left = `${containerRect.left + window.scrollX}px`;
                toolbar.style.display = 'block';
            } else {
                toolbar.style.display = 'none';
            }
        });

        toolbar.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                document.execCommand(button.title.toLowerCase(), false, null);
                toolbar.style.display = 'none';
            });
        });

        toolbar.querySelector('input[type="color"]').addEventListener('input', (event) => {
            document.execCommand('foreColor', false, event.target.value);
        });

        toolbar.querySelector('button[title="Increase Font Size"]').addEventListener('click', () => {
            document.execCommand('fontSize', false, '4');
            toolbar.style.display = 'none';
        });
        toolbar.querySelector('button[title="Decrease Font Size"]').addEventListener('click', () => {
            document.execCommand('fontSize', false, '2');
            toolbar.style.display = 'none';
        });

        document.addEventListener('mousedown', function (event) {
            if (!toolbar.contains(event.target) && !container.contains(event.target)) {
                toolbar.style.display = 'none';
            }
        });
    }

    // Apply the setupPopupToolbar function
    setupPopupToolbar('fileTitleInternships', 'popupToolbarTitleInternships');
    setupPopupToolbar('fileDescriptionInternships', 'popupToolbarDescriptionInternships');
    setupPopupToolbar('fileTitleProjects', 'popupToolbarTitleProjects');
    setupPopupToolbar('fileDescriptionProjects', 'popupToolbarDescriptionProjects');

    // --- File Upload Logic ---
    function handleFileUpload(fileUploadId, fileTitleId, fileDescriptionId, previewContainer, pageType) {
        if (!isAdmin) return; // Prevent uploading if not admin

        const fileUpload = document.getElementById(fileUploadId);
        const fileTitle = document.getElementById(fileTitleId).innerHTML.trim();
        const fileDescription = document.getElementById(fileDescriptionId).innerHTML.trim();

        if (fileUpload.files.length === 0 && fileTitle && fileDescription) {
            createPreview(null, fileTitle, fileDescription, null, previewContainer, pageType);
            savePreviewData({ fileName: null, fileTitle, fileDescription, fileUrl: null }, pageType);
            return;
        }

        Array.from(fileUpload.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const fileUrl = e.target.result;
                createPreview(file.name, fileTitle, fileDescription, fileUrl, previewContainer, pageType);
                savePreviewData({ fileName: file.name, fileTitle, fileDescription, fileUrl }, pageType);
            };

            if (file.type.startsWith('image/') || file.type.startsWith('video/') || ['video/x-matroska'].includes(file.type)) {
                reader.readAsDataURL(file);
            } else if (file.type === "text/plain") {
                reader.readAsText(file);
            } else {
                alert('Unsupported file format');
            }
        });
    }

    // Initialization for 404 Page
if (document.body.classList.contains('milkyway-theme')) {
    function createStars() {
        const starsContainer = document.querySelector('.container');
        const starEmojis = ['🌟', '✨', '⭐', '🌙', '🌈', '☁️', '💫', '🌠']; // Added more cute star options
        const colors = ['#FF69B4', '#FFC1CC', '#FFB6C1', '#87CEEB', '#F5F5F5', '#FFFFFF', '#C3B1E1', '#A9A9E0', '#B0E0E6', '#B3E5FC', '#BDB76B']; // Enhanced pastel and night shades

        // Create more stars for a denser Milky Way effect
        for (let i = 0; i < 600; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.position = 'absolute';
            star.style.fontSize = `${Math.random() * 1.8 + 1}rem`; // Slightly larger size range for variety
            star.style.top = `${Math.random() * 100}vh`;
            star.style.left = `${Math.random() * 100}vw`;
            star.style.opacity = `${Math.random() * 0.7 + 0.3}`; // More varied opacity for better twinkling
            star.style.color = colors[Math.floor(Math.random() * colors.length)];
            star.textContent = starEmojis[Math.floor(Math.random() * starEmojis.length)]; // Randomly pick an emoji

            star.style.animation = `blink ${Math.random() * 2 + 1}s infinite alternate`;
            starsContainer.appendChild(star);
        }
    }

    createStars(); // Call the function to create stars when the page loads

    // Replay functionality for regenerating stars
    const replayIcon = document.getElementById('cb-replay');
    if (replayIcon) {
        replayIcon.addEventListener('click', function () {
            const starsContainer = document.querySelector('.container');
            while (starsContainer.firstChild) {
                starsContainer.removeChild(starsContainer.firstChild);
            }
            createStars();

            replayIcon.classList.add('spin-animation');
            setTimeout(() => {
                replayIcon.classList.remove('spin-animation');
            }, 1000);
        });
    }

    // Adding a pulsating effect to the '404, page not found.' text to match the cuteness
    const errorText = document.querySelector('.copy-container p');
    if (errorText) {
        errorText.style.animation = 'pulseText 2s infinite';
    }

    // Adding custom keyframes for text pulsing
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        @keyframes blink {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        @keyframes pulseText {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        .spin-animation {
            animation: spin 1s ease-in-out;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleElement);
}

});

