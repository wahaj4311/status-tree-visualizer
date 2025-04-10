# Microservice Status Tree Visualizer

This project demonstrates a simple microservice architecture with a live tree visualization for monitoring service status. It's intended as a visual demo, potentially for DevOps presentations.

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
    *   Visualizes the status of each service as leaves on a stylized tree.
    *   Shows live logs of service status changes.

## Technologies Used

*   Node.js
*   Express.js
*   SQLite3 (for `service-a`)
*   Axios (for HTTP requests in aggregator)
*   ws (for WebSockets)
*   HTML, CSS (with animations and transforms), JavaScript

## Running the Application

1.  **Prerequisites**: Node.js and npm installed.
2.  **Install Dependencies**: Run `npm install` within each service directory (`microservices/service-a`, `microservices/service-b`, `microservices/service-c`, `microservices/service-d`) and the `status-aggregator` directory.
    ```bash
    cd microservices/service-a && npm install
    cd ../service-b && npm install
    cd ../service-c && npm install
    cd ../service-d && npm install
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
    *   **Terminal 3 (Service C)**:
        ```bash
        cd microservices/service-c
        node server.js
        ```
    *   **Terminal 4 (Service D)**:
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

## Running with Docker

The application is also containerized with Docker for easier deployment and consistent environments.

1. **Prerequisites**: Docker and Docker Compose installed.

2. **Build and Start**: Run the following command in the project root:
   ```bash
   docker compose up --build
   ```
   This will build all service images and start containers for each service.

3. **View**: Access the frontend at `http://localhost:3000`.

4. **Stop**: Press `Ctrl+C` in the terminal, or run:
   ```bash
   docker compose down
   ```

5. **Development Mode**: To mount source code from the host for live development:
   ```bash
   docker compose up --build -d
   ```
   Changes to the source code will be reflected in the containers. You may need to restart the affected containers.

6. **Individual Services**: To manage specific services:
   ```bash
   # Start only certain services
   docker compose up service-a service-b

   # Rebuild a single service
   docker compose build status-aggregator

   # Restart a service
   docker compose restart service-c
   ```

## Visualization

*   The frontend displays a stylized tree structure.
*   Branches grow from a central trunk, each ending in a circular leaf representing a microservice (labeled A, B, C, D).
*   Leaf colors and appearance indicate the service status:
    *   **Green & Larger:** Service UP (with a subtle glow).
    *   **Red & Smaller:** Service DOWN (appears slightly wilted/desaturated).
    *   **Grey & Normal Size:** Status UNKNOWN.
*   The entire tree has a gentle, continuous swaying animation.
*   A live log box in the bottom-left corner shows WebSocket events and status updates.
*   The legend in the bottom-right corner clarifies the status colors. 