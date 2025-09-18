# CityFix Dashboard

project ppt in the source root
images 1,2,3 are the website images

CityFix is a modern, intelligent SaaS platform designed to solve the deep-rooted problem of civic issue management in urban areas. It provides municipal corporations and city officials with a centralized command center to track, manage, and resolve citizen-reported issues like potholes, water logging, garbage disposal, and broken streetlights.

By leveraging AI and a transparent, data-driven approach, CityFix aims to become a crucial tool for efficient urban governance.

## The Problem

Cities are the engines of growth, but they struggle with massive operational challenges. The process for managing citizen complaints is often a chaotic mix of crowded municipal offices, unanswered phone calls, and social media posts that disappear into the void. This inefficiency leads to wasted resources, public frustration, and stalled progress in creating smarter, more livable cities.

## The Solution

CityFix replaces this chaos with a single, powerful platform that brings accountability and efficiency to municipal operations.

### Key Features:

- **Centralized Dashboard**: A real-time overview of all reported issues, with key metrics on resolution times and department performance.
- **AI-Powered Automation**:
    - **Auto-Categorization**: AI analyzes a citizen's complaint and automatically categorizes it.
    - **Auto-Assignment**: The issue is instantly routed to the correct department (e.g., PWD, Water Board, Sanitation), eliminating bureaucratic delays.
- **End-to-End Tracking**: Every issue is tracked from submission to resolution, creating a transparent audit trail.
- **Live Map**: Visualize the geographic distribution of all reported issues in real-time.
- **Data-Driven Insights**: City managers can identify recurring problems, analyze resolution times, and allocate resources more effectively.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Backend & Database**: Firebase (Firestore, Firebase Auth)
- **Generative AI**: Google's Genkit
- **Mapping**: Google Maps JavaScript API

## Project Structure

A brief overview of the key directories in this project:

```
/
├── src/
│   ├── app/                # Next.js App Router pages, layouts, and API routes
│   │   ├── (app)/          # Main application routes (dashboard, map, etc.)
│   │   ├── api/            # API routes, including the Genkit endpoint
│   │   └── login/          # Login page route
│   ├── ai/                 # Genkit AI flows and configuration
│   │   └── flows/          # Specific AI tasks (e.g., categorization, assignment)
│   ├── components/         # Reusable React components
│   │   ├── dashboard/      # Components specific to the main dashboard
│   │   ├── map/            # Google Maps related components
│   │   ├── reports/        # Components for viewing and managing reports
│   │   └── ui/             # ShadCN UI components
│   ├── lib/                # Core logic, Firebase integration, and utilities
│   ├── contexts/           # React context providers (e.g., Theme)
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
└── package.json            # Project dependencies and scripts
```

## Getting Started

Follow these instructions to get a local copy up and running.

### 1. Prerequisites

You must have the following installed on your local machine:
- Node.js (v18 or newer recommended)
- npm or yarn

### 2. Fork and Clone the Repository

First, fork this repository to your own GitHub account. Then, clone your forked repository to your local machine:

```sh
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

### 3. Install Dependencies

Install the necessary NPM packages:

```sh
npm install
```

### 4. Set Up a New Firebase Project

This project requires a Firebase backend. You will need to create your own Firebase project to run it.

1.  **Go to the Firebase Console**: Navigate to [console.firebase.google.com](https://console.firebase.google.com).
2.  **Create a New Project**: Click on "Add project" and follow the on-screen instructions. Give your project a name (e.g., "cityfix-dev").
3.  **Create a Web App**:
    *   Inside your new project, click the web icon (`</>`) to "Add an app to get started".
    *   Give your app a nickname and click "Register app".
    *   Firebase will display a `firebaseConfig` object. **Copy these values.** You will need them for the next step.
4.  **Enable Firebase Services**:
    *   In the Firebase console, go to the **Build** section in the left-hand menu.
    *   **Authentication**: Click on "Authentication" and then the "Get started" button. Select **Email/Password** from the list of providers and enable it.
    *   **Firestore Database**: Click on "Firestore Database" and then "Create database". Start in **test mode** for now. Choose a location for your database.
5.  **Enable Google APIs for the Project**:
    *   Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
    *   Ensure the project you just created in Firebase is selected.
    *   **Enable Billing**: The Google Maps API requires a billing account to be linked, though it includes a generous free tier. Go to the "Billing" section and link a billing account.
    *   Go to **APIs & Services > Library** and search for and enable the following two APIs:
        1.  **Maps JavaScript API** (for the live map feature)
        2.  **Vertex AI API** (for the Genkit AI features)

### 5. Configure Environment Variables

1.  Create a new file named `.env.local` in the root of your project.
2.  Copy the `firebaseConfig` values you saved earlier into this file, matching the variable names shown below.
3.  The `NEXT_PUBLIC_FIREBASE_API_KEY` is also used as the Google Maps API key.

Your `.env.local` file should look like this:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 6. Run the Project

Once the installation and configuration are complete, you can run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:9003](http://localhost:9003).

## How to Contribute and Push to GitHub

If you've cloned the project and want to push your own changes to your forked repository:

1.  **Initialize Git (if not already done by cloning):**
    ```sh
    git init -b main
    ```

2.  **Add all your changes to the staging area:**
    ```sh
    git add .
    ```

3.  **Commit your changes with a descriptive message:**
    ```sh
    git commit -m "feat: Add new feature or describe your changes"
    ```

4.  **Set the remote origin (if you haven't already):**
    Make sure to replace `your-username/your-repository-name.git` with your actual GitHub repository URL.
    ```sh
    git remote add origin https://github.com/your-username/your-repository-name.git
    ```

5.  **Push your commits to your remote repository:**
    ```sh
    git push -u origin main
    ```
