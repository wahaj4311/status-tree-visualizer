// Remove statusGrid and serviceElements references as we target fixed faces
// const statusGrid = document.getElementById('status-grid');
// let serviceElements = {};

// Get reference to log box content area (add this near the top)
const logContent = document.getElementById('log-content');
const MAX_LOG_LINES = 50; // Limit number of lines to prevent slowdown

// Helper function to add messages to the log box (add this)
function addLogMessage(message, type = 'info') {
    if (!logContent) return;

    const p = document.createElement('p');
    const timestamp = new Date().toLocaleTimeString();
    p.textContent = `[${timestamp}] ${message}`;

    // Apply class based on type for styling
    switch(type) {
        case 'warn':
            p.className = 'log-message-warn';
            break;
        case 'error':
            p.className = 'log-message-error';
            break;
        case 'info':
        default:
            p.className = 'log-message-info';
            break;
    }

    // Limit number of log lines
    while (logContent.childNodes.length >= MAX_LOG_LINES) {
        logContent.removeChild(logContent.firstChild);
    }

    logContent.appendChild(p);
    // Auto-scroll to the bottom
    logContent.scrollTop = logContent.scrollHeight;
}

// Attempt to connect to WebSocket running on the same host/port as the frontend
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsUrl = `${wsProtocol}//${window.location.host}`;
let socket;

function connectWebSocket() {
    // Add log message on attempt
    addLogMessage('Connecting WebSocket...'); 
    console.log(`Attempting to connect WebSocket to ${wsUrl}`);
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        addLogMessage('WebSocket connection established.', 'info');
        console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
        try {
            const services = JSON.parse(event.data);
            // Add log for received data
            addLogMessage(`Received status update: ${JSON.stringify(services)}`);
            console.log('Received status update:', services);
            updateTreeLeaves(services);
        } catch (error) {
            // Add log for parsing error
            addLogMessage(`Error parsing WebSocket message: ${error.message}`, 'error');
            console.error('Error parsing WebSocket message:', error);
        }
    };

    socket.onerror = (error) => {
        // Add log for WebSocket error
        addLogMessage(`WebSocket error: ${error.message || 'Unknown error'}`, 'error');
        console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
        // Add log for WebSocket close
        const reason = event.reason ? ` Reason: ${event.reason}` : '';
        addLogMessage(`WebSocket connection closed. Code: ${event.code}.${reason}`, 'warn');
        console.log('WebSocket connection closed:', event.code, event.reason);
        // Optional: Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 5000); // Reconnect every 5 seconds
    };
}

// Modified function to update tree leaf elements
function updateTreeLeaves(services) {
    services.forEach(service => {
        // Construct the ID of the leaf element
        const leafId = `service-${service.name.replace(/\s+/g, '-')}`;
        const leafDiv = document.getElementById(leafId);

        if (leafDiv) {
            // Update status class on the leaf
            leafDiv.classList.remove('status-UP', 'status-DOWN', 'status-UNKNOWN');
            leafDiv.classList.add(`status-${service.status}`);

            // Optionally update text inside leaf if needed (currently just A, B, C, D)
            // const nameSpan = leafDiv.querySelector('.service-name');
            // if (nameSpan) { nameSpan.textContent = service.name; }
        } else {
            // Add warning log if element not found
            const warnMsg = `Could not find leaf element for service: ${service.name} (ID: ${leafId})`;
            addLogMessage(warnMsg, 'warn');
            console.warn(warnMsg);
        }
    });
}

// --- Remove Animation Controls Logic ---

// Initial connection attempt
connectWebSocket(); 