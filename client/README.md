# CrowdGraph Client

A modern React-based client application for CrowdGraph, a community-driven social platform built with TypeScript, Vite, and Tailwind CSS.

## Features

- **Authentication**: User login and signup functionality
- **Community Dashboard**: View and interact with community content
- **Explore**: Discover new communities and content
- **Profile Management**: User profile pages and settings
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Modern UI Components**: Built with Radix UI primitives

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Code Quality**: ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kumar-Vedant/CrowdGraph.git
   cd CrowdGraph/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the production build locally

## Project Structure

```
client/
├── public/                    # Static assets
├── src/
│   ├── _auth/                 # Authentication-related components
│   │   ├── AuthLayout.tsx     # Layout wrapper for auth pages
│   │   └── pages/
│   │       ├── Login.tsx      # User login page
│   │       └── Signup.tsx     # User registration page
│   ├── _root/                 # Main application components
│   │   ├── RootLayout.tsx     # Main layout wrapper
│   │   └── pages/
│   │       ├── CommunityDashboard.tsx  # Community dashboard page
│   │       ├── Explore.tsx             # Explore communities page
│   │       ├── Landing.tsx             # Landing/home page
│   │       ├── NotFound.tsx            # 404 error page
│   │       └── Profile.tsx             # User profile page
│   ├── components/
│   │   ├── shared/             # Reusable components across the app
│   │   │   ├── CommunityFeed.tsx       # Community content feed
│   │   │   ├── CommunityGrid.tsx       # Grid layout for communities
│   │   │   ├── Navbar.tsx              # Navigation bar
│   │   │   └── SearchBar.tsx           # Search functionality
│   │   └── ui/                 # UI component library
│   │       ├── button.tsx      # Button component
│   │       ├── card.tsx        # Card component
│   │       ├── separator.tsx   # Separator component
│   │       └── textarea.tsx    # Textarea component
│   ├── constants/              # Application constants
│   │   └── images.ts           # Image assets and constants
│   ├── context/                # React context providers
│   │   └── AuthContext.tsx     # Authentication context
│   ├── hooks/                  # Custom React hooks
│   │   └── apiHook.ts          # API-related hooks
│   ├── lib/                    # Utility libraries
│   │   └── utils.ts            # General utility functions
│   ├── schema/                 # Data schemas and types
│   │   └── index.ts            # Schema definitions
│   ├── services/               # API services and data management
│   │   ├── api.ts              # API client configuration
│   │   └── data.ts             # Data fetching and management
│   ├── App.tsx                 # Main application component
│   ├── globals.css             # Global CSS styles
│   └── main.tsx                # Application entry point
├── components.json             # Component configuration
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template
├── package.json                # Project dependencies and scripts
├── tsconfig.app.json           # TypeScript config for app
├── tsconfig.json               # Base TypeScript configuration
├── tsconfig.node.json          # TypeScript config for Node.js
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

### Directory Explanations

- **`_auth/`**: Contains authentication-related pages and layouts. The underscore prefix indicates route-based organization.
- **`_root/`**: Houses the main application pages and layout. These are the core pages users interact with after authentication.
- **`components/shared/`**: Reusable components that are used across multiple pages, such as navigation and content displays.
- **`components/ui/`**: Low-level UI components built on top of Radix UI, following a component library pattern.
- **`constants/`**: Static values and assets that don't change at runtime.
- **`context/`**: React Context providers for global state management, particularly authentication state.
- **`hooks/`**: Custom hooks for encapsulating reusable logic, especially API interactions.
- **`lib/`**: Utility functions and helper libraries.
- **`schema/`**: TypeScript interfaces, types, and validation schemas.
- **`services/`**: API client setup and data fetching logic.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.
