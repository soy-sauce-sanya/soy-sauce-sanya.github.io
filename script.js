// Ubuntu Desktop Environment Script

// State management
let activeWindow = null;
let windowZIndex = 1000;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Mobile detection
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth <= 768;
};

const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

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
    // Intercept resume window to open PDF instead
    if (windowId === 'resume') {
        window.open('resume/CV_Sanya_Choi_EN.pdf', '_blank', 'noopener,noreferrer');
        return;
    }

    const targetWindow = document.getElementById(`${windowId}-window`);
    if (!targetWindow) return;

    // If window is already open, just focus it
    if (targetWindow.classList.contains('active')) {
        focusWindow(targetWindow);
        return;
    }

    // On mobile, windows are always full screen (handled by CSS)
    // On desktop, position window in center or cascaded
    if (!isMobile()) {
        const windows = document.querySelectorAll('.window.active');
        const offset = windows.length * 30;
        const winWidth = 700;
        const winHeight = 500;

        const left = (window.innerWidth - winWidth) / 2 + offset;
        const top = (window.innerHeight - winHeight) / 2 + offset;

        targetWindow.style.left = `${Math.max(0, left)}px`;
        targetWindow.style.top = `${Math.max(32, top)}px`;
        targetWindow.style.width = `${winWidth}px`;
        targetWindow.style.height = `${winHeight}px`;
    } else {
        // On mobile, ensure window takes full screen
        targetWindow.style.left = '0';
        targetWindow.style.top = '32px';
        targetWindow.style.width = '100vw';
        targetWindow.style.height = 'calc(100vh - 32px)';
    }

    targetWindow.classList.add('active');
    focusWindow(targetWindow);

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
    // Disable dragging on mobile devices
    if (isMobile()) {
        return;
    }

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
        // Desktop: double-click
        icon.addEventListener('dblclick', () => {
            const windowId = icon.getAttribute('data-window');
            openWindow(windowId);
        });

        // Mobile: single tap (touch)
        if (isTouchDevice()) {
            let lastTap = 0;
            icon.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;

                // Double tap detection (within 300ms)
                if (tapLength < 300 && tapLength > 0) {
                    e.preventDefault();
                    const windowId = icon.getAttribute('data-window');
                    openWindow(windowId);
                    lastTap = 0;
                } else {
                    lastTap = currentTime;
                }
            });
        }
    });
}

// Dock functionality
function setupDock() {
    document.querySelectorAll('.dock-item').forEach(item => {
        item.addEventListener('click', () => {
            const windowId = item.getAttribute('data-window');
            const targetWindow = document.getElementById(`${windowId}-window`);

            if (targetWindow && targetWindow.classList.contains('active')) {
                // If window is active, minimize it
                minimizeWindow(targetWindow);
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
        const targetWindow = document.getElementById(`${windowId}-window`);

        if (targetWindow && targetWindow.classList.contains('active')) {
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
        { id: 'resume', title: 'Resume', description: 'Technical skills and expertise' },
        { id: 'side-projects', title: 'Side-Projects', description: 'Featured projects and work' },
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

function getDesktopSectionNames() {
    return Array.from(document.querySelectorAll('.desktop-icon'))
        .map(icon => icon.getAttribute('data-window'))
        .filter(Boolean);
}

function getContactInfoFromWindow() {
    const contactWindow = document.getElementById('contact-window');
    if (!contactWindow) {
        return 'Contact information is not available.';
    }

    const contactItems = Array.from(contactWindow.querySelectorAll('.contact-item'));
    const contactLines = contactItems.map(item => {
        const label = item.querySelector('h3')?.textContent.trim();
        const valueElement = item.querySelector('a, p');
        const value = valueElement?.textContent.trim();

        return label && value ? `${label}: ${value}` : null;
    }).filter(Boolean);

    const socialLines = Array.from(contactWindow.querySelectorAll('.social-link')).map(link => {
        const label = link.getAttribute('title')?.trim();
        const href = link.getAttribute('href')?.trim();
        const displayHref = href?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

        return label && displayHref ? `${label}: ${displayHref}` : null;
    }).filter(Boolean);

    const sections = ['Contact Information:'];

    if (contactLines.length) {
        sections.push(contactLines.join('\n'));
    }

    if (socialLines.length) {
        sections.push('', socialLines.join('\n'));
    }

    return sections.join('\n');
}

function getAboutInfoFromWindow() {
    const aboutWindow = document.getElementById('about-window');
    if (!aboutWindow) {
        return 'About information is not available.';
    }

    const heading = aboutWindow.querySelector('.about-text h2')?.textContent.trim();
    const paragraphs = Array.from(aboutWindow.querySelectorAll('.about-text p'))
        .map(paragraph => paragraph.textContent.trim().replace(/\s+/g, ' '))
        .filter(Boolean);

    return [heading, ...paragraphs].filter(Boolean).join('\n\n');
}

function getProjectsInfoFromWindow() {
    const projectCards = Array.from(document.querySelectorAll('#side-projects-window .project-card'));
    if (!projectCards.length) {
        return 'No projects are available.';
    }

    const projects = projectCards.map((card, index) => {
        const title = card.querySelector('.project-info h3')?.textContent.trim();
        const description = card.querySelector('.project-info p')?.textContent.trim().replace(/\s+/g, ' ');
        const tags = Array.from(card.querySelectorAll('.project-tags .tag'))
            .map(tag => tag.textContent.trim())
            .filter(Boolean);
        const links = Array.from(card.querySelectorAll('.project-info a, .project-image a'))
            .map(link => link.getAttribute('href')?.trim())
            .filter(Boolean);
        const uniqueLinks = Array.from(new Set(links));

        const lines = [`${index + 1}. ${title || 'Untitled Project'}`];

        if (description) {
            lines.push(`   ${description}`);
        }

        if (tags.length) {
            lines.push(`   Tags: ${tags.join(', ')}`);
        }

        uniqueLinks.forEach(link => {
            lines.push(`   Link: ${link}`);
        });

        return lines.join('\n');
    });

    return `Featured Projects:\n${projects.join('\n\n')}`;
}

// Terminal functionality
function setupTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    if (!terminalInput || !terminalOutput) return;

    const terminalContent = terminalOutput.parentElement;

    const commands = {
        help: () => {
            return `Available commands:
  help          - Show this help message
  about         - Information about Sanya
  resume        - Show resume file
  projects      - Show projects
  side-projects - Show projects
  contact       - Display contact information
  clear         - Clear terminal
  date          - Show current date and time
  echo          - Echo back text
  ls            - List available sections`;
        },
        about: () => {
            return getAboutInfoFromWindow();
        },
        resume: () => {
            return `Resume:
resume/CV_Sanya_Choi_EN.pdf`;
        },
        skills: () => {
            return commands.resume();
        },
        projects: () => {
            return getProjectsInfoFromWindow();
        },
        contact: () => {
            return getContactInfoFromWindow();
        },
        clear: () => {
            terminalOutput.innerHTML = '';
            return null;
        },
        date: () => {
            return new Date().toString();
        },
        ls: () => {
            return getDesktopSectionNames().join('  ');
        }
    };

    commands['side-projects'] = commands.projects;

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value.trim();

            // Add command to output
            const commandLine = document.createElement('div');
            commandLine.className = 'terminal-line';
            const prompt = document.createElement('span');
            prompt.className = 'terminal-prompt';
            prompt.textContent = 'sanya@ubuntu:~$';
            commandLine.appendChild(prompt);
            commandLine.append(` ${input}`);
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
            terminalContent.scrollTop = terminalContent.scrollHeight;
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

// Handle viewport changes (orientation, resize)
function setupViewportHandler() {
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Reposition windows on mobile after orientation change
            if (isMobile()) {
                document.querySelectorAll('.window.active').forEach(window => {
                    window.style.left = '0';
                    window.style.top = '32px';
                    window.style.width = '100vw';
                    window.style.height = 'calc(100vh - 32px)';
                });
            }
        }, 250);
    });
}

// Prevent default touch behaviors that might interfere
function setupTouchOptimizations() {
    if (!isTouchDevice()) return;

    // Prevent pull-to-refresh on mobile browsers
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const touchYDelta = touchY - touchStartY;

        // Prevent pull-to-refresh when at top of page
        if (touchYDelta > 0 && window.scrollY === 0) {
            // Allow scrolling within window content
            if (!e.target.closest('.window-content')) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    // Add momentum scrolling for iOS
    document.querySelectorAll('.window-content').forEach(content => {
        content.style.webkitOverflowScrolling = 'touch';
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
    setupViewportHandler();
    setupTouchOptimizations();

    // Open About window by default (with delay for smooth load)
    setTimeout(() => {
        openWindow('about');
    }, 500);

    // Log mobile status for debugging
    if (isMobile()) {
        console.log('%c📱 Mobile mode activated', 'font-size: 12px; color: #E95420;');
    }
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
