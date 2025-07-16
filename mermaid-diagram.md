# ScanGo Application Architecture

This document contains a Mermaid diagram that illustrates the high-level architecture of the ScanGo application. It shows how the different parts of the system—from the user's browser to the backend services and AI models—interact with each other.

```mermaid
flowchart TD
    subgraph "User"
        U[("Browser/Mobile")]
    end

    subgraph "ScanGo Application (Hosted on Vercel)"
        subgraph "Frontend (Next.js/React)"
            LP[Landing Page]
            Store[Store & Product Pages]
            Scan[AI Scan Page]
            Dashboards[User & Admin Dashboards]
        end

        subgraph "Backend (Next.js Server)"
            SA[Server Actions & API Routes]
        end

        subgraph "AI Engine (Genkit)"
            PAF[Product Analysis Flow]
            PRF[Product Recommendation Flow]
        end
    end

    subgraph "External Services"
        subgraph "Google Cloud"
            GCP[Google AI Platform<br>(Gemini Models)]
            FB_AUTH[Firebase Authentication]
            FB_FS[Firestore Database<br>(Users, Admin Products)]
        end
        FSA[Fake Store API<br>(Main Product Catalog)]
    end

    %% User Interactions
    U --> LP
    U --> Store
    U --> Scan
    U --> Dashboards

    %% Frontend to Backend Communication
    Store -- "Fetches products, manages cart" --> SA
    Scan -- "Submits image for analysis" --> SA
    Dashboards -- "Manages user/admin data" --> SA

    %% Backend Logic
    SA -- "Calls AI for insights" --> PAF
    SA -- "Gets recommendations" --> PRF
    SA -- "Authenticates users" --> FB_AUTH
    SA -- "Reads/writes user & admin data" --> FB_FS
    SA -- "Fetches product catalog" --> FSA

    %% AI Engine to Google Cloud
    PAF -- "Uses Gemini Vision model" --> GCP
    PRF -- "Uses Gemini text model" --> GCP

```

## How to Read the Diagram

-   **User:** Represents the end-user interacting with the application through their web browser.
-   **Frontend:** These are the React components and pages the user sees and interacts with, built using the Next.js App Router.
-   **Backend:** This is the server-side logic within Next.js. It handles requests from the frontend, interacts with the database, and calls the AI services.
-   **AI Engine (Genkit):** These are specialized server-side functions (flows) that handle all interactions with the generative AI models.
-   **External Services:** These are third-party platforms that provide core functionality like authentication, database storage, and the underlying AI models.
