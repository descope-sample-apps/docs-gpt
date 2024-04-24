![Redme Logo](https://github.com/descope-sample-apps/nextjs-demo-app-router/assets/46854522/6f95c078-c944-4b72-bced-92742fbf7ff3)

# Welcome to the ChatGPT for your Docs Sample App
This is a sample consumer app built by Descope to showcase the Descope Flows functionality with NextJS.


## One-click Deploy

You can deploy this template to Vercel with the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdescope-sample-apps%2Fnextjs-demo-app-router&env=NEXT_PUBLIC_DESCOPE_PROJECT_ID)


## Technology Stack and Capabilities

### Core Frameworks

- [Next.js](https://nextjs.org/): A React framework designed for building high-performance applications with an exceptional developer experience.
- [Descope](https://descope.com): Use no-code workflows to easily add authentication, authorization, and identity management to any customer-facing app.

### Deployment Platforms

- [Vercel](https://vercel.com/): Provides a seamless way to preview and deploy changes directly from git repositories.

### User Interface (UI)

- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework that accelerates the process of UI development.
- [Lucide](https://lucide.dev/): Offers a collection of simple and precise icons for web projects.
- [`next/font`](https://nextjs.org/docs/basic-features/font-optimization): Enables custom font optimization, eliminating the need for external network requests, thereby boosting performance.

### React Hooks and Utility Functions

- `useIntersectionObserver`: A React hook to detect when an element becomes visible or hidden in the viewport.
- `useLocalStorage`: Enables the persistent storage of data within the browser's local storage.
- `useScroll`: A React hook to monitor scroll events and positions within an application.
- `nFormatter`: Simplifies the display of numbers by adding suffixes (e.g., `1.2k` for 1200).
- `capitalize`: A utility function to capitalize the first letter of a string for improved readability.
- `truncate`: Allows for the shortening of strings to a specific length, useful for creating concise text previews.
- [`use-debounce`](https://www.npmjs.com/package/use-debounce): Debounces function calls or state updates, helping to optimize performance and reduce unnecessary processing.

### Ensuring Code Quality

- [TypeScript](https://www.typescriptlang.org/): A static type-checking tool offering end-to-end type safety for robust development.

## Set up
In order to launch this app:

#### 1. Clone the repo 
```
git clone git@github.com:descope-sample-apps/nextjs-demo-app-router.git
```

#### 2. Set up environment variables in `.env` file
```
DESCOPE_PROJECT_ID="YOUR PROJECT ID" // Required for Descope authentication
OPENAI_ASSISTANT_ID="YOUR OPENAI ASSISTANT ID" // With vector store attached
OPENAI_API_KEY="YOUR OPENAI API KEY"
```
_You can get your project-id [here](https://app.descope.com/settings/project)_.

#### 3. Install dependencies 
```
npm i
```

#### 4. Start the app

Run this command to start the app:

```
npm run dev
```

#### 5. Open the app
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

