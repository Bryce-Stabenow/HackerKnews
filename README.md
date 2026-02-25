# HackerKnews

HackerKnews is a Progressive Web App (PWA) client for HackerNews, built with **Nuxt 3** and **Vue 3**. It features a clean, card-based UI with link preview images fetched via server-side Open Graph parsing.

## Features
- **Modern Frameworks**: Built with Nuxt 3, Vue 3, and the Composition API.
- **Responsive Design**: Fully responsive and optimized for mobile and desktop.
- **Progressive Web App**: Installable with offline support and caching strategies.
- **HackerNews Integration**: Fetches data from the official HackerNews Firebase API.
- **Open Graph Previews**: Displays link previews with images and metadata.
- **Dark Mode**: Supports light and dark themes.

## Tech Stack
- **Framework**: Nuxt 3 (Vue 3, Composition API, `<script setup>`)
- **Server**: Nitro (built into Nuxt) for API routes
- **Styling**: Tailwind CSS v4
- **PWA**: `@vite-pwa/nuxt`
- **OG Parsing**: `cheerio` (server-side HTML parsing for meta tags)
- **HTTP**: `ofetch` (built into Nuxt/Nitro)
- **HackerNews API**: Official Firebase API (`https://hacker-news.firebaseio.com/v0/`)

## Project Structure
- **Layouts**: Core UI shell with a sticky top navigation bar.
- **Pages**: Dynamic routes for Top, New, and Best stories.
- **Components**: Reusable components like `StoryCard` and `StoryList`.
- **Composables**: Encapsulated logic for fetching HackerNews data.
- **Server API**: Endpoints for Open Graph image previews.
- **Utilities**: Helper functions like time formatting.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/HackerKnews.git
   cd HackerKnews
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development
Start the development server:
```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`.

### Build
To build the app for production:
```bash
npm run build
# or
yarn build
```

### Preview
To preview the production build:
```bash
npm run preview
# or
yarn preview
```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.