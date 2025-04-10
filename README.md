# Microservice Status Cube Demo

This project demonstrates a simple microservice architecture with a live 3D cube visualization for monitoring service status. It's intended as a visual demo, potentially for DevOps presentations.

## Architecture

*   **Microservices (`/microservices`)**: Contains individual Node.js/Express services.
    *   `service-a`: A simple service that includes a basic SQLite database check in its health endpoint (simulating a 3-tier component).
    *   `service-b`, `service-c`, `service-d`: Simple services that always report 'UP'.
*   **Status Aggregator (`/status-aggregator`)**: A Node.js service that:
    *   Periodically polls the `/health` endpoint of each microservice.
    *   Hosts a WebSocket server to broadcast status updates in real-time.
    *   Serves the frontend application.
*   **Frontend (`/frontend`)**: A static web page (HTML, CSS, JavaScript) that:
    *   Connects to the WebSocket server.
    *   Visualizes the status of each service on the faces of a rotating 3D cube.
    *   Includes controls to pause/play the animation.

## Technologies Used

*   Node.js
*   Express.js
*   SQLite3 (for `service-a`)
*   Axios (for HTTP requests in aggregator)
*   ws (for WebSockets)
*   HTML, CSS (with 3D Transforms), JavaScript

## Running the Application

1.  **Prerequisites**: Node.js and npm installed.
2.  **Install Dependencies**: Run `npm install` within each service directory (`microservices/service-a`, `microservices/service-b`, `microservices/service-c`, `microservices/service-d`) and the `status-aggregator` directory.
    ```bash
    cd microservices/service-a && npm install
    cd ../service-b && npm install
    cd ../service-c && npm install # Add after creating service-c
    cd ../service-d && npm install # Add after creating service-d
    cd ../../status-aggregator && npm install
    ```
3.  **Start Services**: Open separate terminals for each component:
    *   **Terminal 1 (Service A)**:
        ```bash
        cd microservices/service-a
        node server.js
        ```
    *   **Terminal 2 (Service B)**:
        ```bash
        cd microservices/service-b
        node server.js
        ```
    *   **Terminal 3 (Service C)**: (After creating)
        ```bash
        cd microservices/service-c
        node server.js
        ```
    *   **Terminal 4 (Service D)**: (After creating)
        ```bash
        cd microservices/service-d
        node server.js
        ```
    *   **Terminal 5 (Aggregator + Frontend)**:
        ```bash
        cd status-aggregator
        node server.js
        ```
4.  **View**: Open your browser and navigate to `http://localhost:3000`.

## Visualization

*   The frontend displays a rotating 3D cube.
*   Each face of the cube represents a microservice.
*   Face colors indicate the service status:
    *   Green: UP
    *   Red: DOWN
    *   Grey: UNKNOWN
*   Hover over the cube to pause the animation and zoom slightly.
*   Use the Play/Pause buttons to control the animation.
*   Service text is displayed upside down for stylistic effect. 