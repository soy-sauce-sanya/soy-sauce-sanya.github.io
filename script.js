// Ubuntu Desktop Environment Script

// State management
let activeWindow = null;
let windowZIndex = 1000;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Update clock
function updateClock() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    document.getElementById('clock').textContent = `${day} ${month} ${date} ${hours}:${minutes}`;
}

updateClock();
setInterval(updateClock, 1000);

// Window management functions
function openWindow(windowId) {
    const window = document.getElementById(`${windowId}-window`);
    if (!window) return;

    // If window is already open, just focus it
    if (window.classList.contains('active')) {
        focusWindow(window);
        return;
    }

    // Position window in center or cascaded
    const windows = document.querySelectorAll('.window.active');
    const offset = windows.length * 30;

    window.style.left = `${100 + offset}px`;
    window.style.top = `${100 + offset}px`;
    window.style.width = '700px';
    window.style.height = '500px';

    window.classList.add('active');
    focusWindow(window);

    // Update dock
    updateDock();
}

function closeWindow(window) {
    window.classList.remove('active');
    window.classList.remove('maximized');
    updateDock();
}

function minimizeWindow(window) {
    window.classList.remove('active');
    updateDock();
}

function maximizeWindow(window) {
    if (window.classList.contains('maximized')) {
        window.classList.remove('maximized');
    } else {
        window.classList.add('maximized');
    }
}

function focusWindow(window) {
    // Remove active state from all windows
    document.querySelectorAll('.window').forEach(w => {
        if (w !== window) {
            w.style.zIndex = Math.min(parseInt(w.style.zIndex) || 100, windowZIndex - 1);
        }
    });

    // Set this window as active
    window.style.zIndex = ++windowZIndex;
    activeWindow = window;

    // Update app menu
    const windowTitle = window.querySelector('.window-title').textContent;
    document.querySelector('.current-app').textContent = windowTitle;
}

// Dragging functionality
function setupWindowDragging() {
    document.querySelectorAll('.window').forEach(window => {
        const titlebar = window.querySelector('.window-titlebar');

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-btn')) return;
            if (window.classList.contains('maximized')) return;

            isDragging = true;
            activeWindow = window;
            focusWindow(window);

            const rect = window.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            titlebar.style.cursor = 'grabbing';
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !activeWindow) return;

        const x = e.clientX - dragOffset.x;
        const y = Math.max(32, e.clientY - dragOffset.y); // Don't go above panel

        activeWindow.style.left = `${x}px`;
        activeWindow.style.top = `${y}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.querySelectorAll('.window-titlebar').forEach(tb => {
                tb.style.cursor = 'move';
            });
        }
    });
}

// Window control buttons
function setupWindowControls() {
    document.querySelectorAll('.window').forEach(window => {
        const closeBtn = window.querySelector('.close-btn');
        const minimizeBtn = window.querySelector('.minimize-btn');
        const maximizeBtn = window.querySelector('.maximize-btn');

        closeBtn.addEventListener('click', () => closeWindow(window));
        minimizeBtn.addEventListener('click', () => minimizeWindow(window));
        maximizeBtn.addEventListener('click', () => maximizeWindow(window));

        // Focus window when clicked anywhere
        window.addEventListener('mousedown', () => focusWindow(window));
    });
}

// Desktop icons
function setupDesktopIcons() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const windowId = icon.getAttribute('data-window');
            openWindow(windowId);
        });
    });
}

// Dock functionality
function setupDock() {
    document.querySelectorAll('.dock-item').forEach(item => {
        item.addEventListener('click', () => {
            const windowId = item.getAttribute('data-window');
            const window = document.getElementById(`${windowId}-window`);

            if (window.classList.contains('active')) {
                // If window is active, minimize it
                minimizeWindow(window);
            } else {
                // Otherwise, open or restore it
                openWindow(windowId);
            }
        });
    });
}

function updateDock() {
    document.querySelectorAll('.dock-item').forEach(item => {
        const windowId = item.getAttribute('data-window');
        const window = document.getElementById(`${windowId}-window`);

        if (window && window.classList.contains('active')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Activities overview
function setupActivities() {
    const activitiesBtn = document.getElementById('activitiesBtn');
    const activitiesOverview = document.getElementById('activitiesOverview');

    activitiesBtn.addEventListener('click', () => {
        activitiesOverview.classList.toggle('active');
        updateActivitiesGrid();
    });

    // Close activities when clicking outside or pressing Escape
    activitiesOverview.addEventListener('click', (e) => {
        if (e.target === activitiesOverview) {
            activitiesOverview.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            activitiesOverview.classList.remove('active');
        }
    });
}

function updateActivitiesGrid() {
    const grid = document.getElementById('activitiesWindowGrid');
    grid.innerHTML = '';

    const windows = [
        { id: 'about', title: 'About Me', description: 'Learn more about Sanya' },
        { id: 'skills', title: 'Skills', description: 'Technical skills and expertise' },
        { id: 'projects', title: 'Projects', description: 'Featured projects and work' },
        { id: 'contact', title: 'Contact', description: 'Get in touch' },
        { id: 'terminal', title: 'Terminal', description: 'Command line interface' }
    ];

    windows.forEach(win => {
        const preview = document.createElement('div');
        preview.className = 'activities-window-preview';
        preview.innerHTML = `
            <h4>${win.title}</h4>
            <p>${win.description}</p>
        `;
        preview.addEventListener('click', () => {
            openWindow(win.id);
            document.getElementById('activitiesOverview').classList.remove('active');
        });
        grid.appendChild(preview);
    });
}

// Terminal functionality
function setupTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');

    if (!terminalInput || !terminalOutput) return;

    const commands = {
        help: () => {
            return `Available commands:
  help       - Show this help message
  about      - Information about Sanya
  skills     - List technical skills
  projects   - Show projects
  contact    - Display contact information
  clear      - Clear terminal
  date       - Show current date and time
  echo       - Echo back text
  ls         - List available sections`;
        },
        about: () => {
            return `Sanya - Web Developer & Designer
I'm passionate about creating beautiful and functional websites.
Specializing in modern web technologies.`;
        },
        skills: () => {
            return `Technical Skills:
• Frontend: HTML, CSS, JavaScript, React, Vue.js
• Backend: Node.js, Python, PHP
• Databases: MySQL, PostgreSQL, MongoDB
• Tools: Git, GitHub, GitLab, Figma, Adobe XD`;
        },
        projects: () => {
            return `Featured Projects:
1. E-Commerce Platform (React, Node.js, MongoDB)
2. Task Management App (Vue.js, Firebase, Tailwind)
3. Portfolio Generator (JavaScript, CSS, API)`;
        },
        contact: () => {
            return `Contact Information:
Email: your.email@example.com
Phone: +1 (234) 567-890
Location: Your City, Country

GitHub: github.com/soy-sauce-sanya
LinkedIn: linkedin.com/in/tsoy-choi-sanya-aleksandr`;
        },
        clear: () => {
            terminalOutput.innerHTML = '';
            return null;
        },
        date: () => {
            return new Date().toString();
        },
        ls: () => {
            return `about  skills  projects  contact`;
        }
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value.trim();

            // Add command to output
            const commandLine = document.createElement('div');
            commandLine.className = 'terminal-line';
            commandLine.innerHTML = `<span class="terminal-prompt">sanya@ubuntu:~$</span> ${input}`;
            terminalOutput.appendChild(commandLine);

            // Process command
            if (input) {
                const parts = input.split(' ');
                const cmd = parts[0].toLowerCase();
                const args = parts.slice(1);

                let output;
                if (cmd === 'echo') {
                    output = args.join(' ');
                } else if (commands[cmd]) {
                    output = commands[cmd]();
                } else if (cmd) {
                    output = `Command not found: ${cmd}. Type 'help' for available commands.`;
                }

                if (output !== null && output !== undefined) {
                    const outputLine = document.createElement('div');
                    outputLine.className = 'terminal-line';
                    outputLine.textContent = output;
                    outputLine.style.whiteSpace = 'pre-wrap';
                    terminalOutput.appendChild(outputLine);
                }
            }

            // Add blank line
            const blankLine = document.createElement('div');
            blankLine.className = 'terminal-line';
            blankLine.innerHTML = '&nbsp;';
            terminalOutput.appendChild(blankLine);

            // Clear input and scroll to bottom
            terminalInput.value = '';
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });

    // Focus terminal input when terminal window is clicked
    const terminalWindow = document.getElementById('terminal-window');
    if (terminalWindow) {
        terminalWindow.addEventListener('click', () => {
            terminalInput.focus();
        });
    }
}

// Contact form
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

// Power button
function setupPowerButton() {
    const powerBtn = document.getElementById('powerBtn');
    powerBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to shut down?')) {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 1s';
            setTimeout(() => {
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:white;font-size:24px;">System shut down</div>';
                document.body.style.opacity = '1';
            }, 1000);
        }
    });
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Super key (Windows key) for activities
        if (e.key === 'Meta') {
            e.preventDefault();
            document.getElementById('activitiesOverview').classList.toggle('active');
            updateActivitiesGrid();
        }

        // Ctrl+Alt+T for terminal
        if (e.ctrlKey && e.altKey && e.key === 't') {
            e.preventDefault();
            openWindow('terminal');
        }
    });
}

// Initialize everything
function init() {
    setupWindowDragging();
    setupWindowControls();
    setupDesktopIcons();
    setupDock();
    setupActivities();
    setupTerminal();
    setupContactForm();
    setupPowerButton();
    setupKeyboardShortcuts();

    // Open About window by default
    setTimeout(() => {
        openWindow('about');
    }, 500);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add some fun console messages
console.log('%c🐧 Ubuntu Desktop Environment', 'font-size: 20px; font-weight: bold; color: #E95420;');
console.log('%cWelcome to Sanya\'s Portfolio!', 'font-size: 14px; color: #772953;');
console.log('%cKeyboard shortcuts:', 'font-size: 12px; font-weight: bold;');
console.log('%c  Ctrl+Alt+T - Open Terminal', 'font-size: 11px;');
console.log('%c  Esc - Close Activities Overview', 'font-size: 11px;');
