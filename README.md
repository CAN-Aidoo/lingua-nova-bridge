# Lingua Nova Bridge

Lingua Nova Bridge is a voice-powered translation application built with React, Vite, and Supabase. It allows users to translate text and speech between different languages.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [Supabase Setup](#supabase-setup)
- [Contributing](#contributing)
- [License](#license)

## Features

- Real-time text translation
- Speech-to-text conversion
- Text-to-speech output
- Translation history tracking
- Responsive UI

## Technologies Used

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend/Database:** Supabase (PostgreSQL, Authentication, Edge Functions)
- **State Management:** React Hooks
- **Linting:** ESLint, Prettier

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v18 or higher)
- npm or Yarn (npm is recommended)
- Git
- A Supabase account and project

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/lingua-nova-bridge.git
    cd lingua-nova-bridge
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add your Supabase credentials:

    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

    You can find these keys in your Supabase project settings under `API`. Make sure to use the `anon` key for client-side access.

## Project Structure

```
lingua-nova-bridge/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── App.tsx             # Main application component
│   ├── components/         # Reusable UI components
│   │   ├── AudioControls.tsx
│   │   ├── Header.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── TextInputArea.tsx
│   │   ├── TextOutputArea.tsx
│   │   └── TranslatorInterface.tsx
│   │   └── ui/             # Shadcn UI components
│   ├── data/               # Static data (e.g., languages.ts)
│   ├── hooks/              # Custom React hooks
│   │   ├── useSpeechToText.ts
│   │   ├── useTextToSpeech.ts
│   │   └── useTranslation.ts
│   ├── integrations/       # Third-party service integrations (e.g., Supabase)
│   ├── lib/                # Utility functions (e.g., utils.ts)
│   ├── pages/              # Application pages
│   ├── types/              # TypeScript type definitions
│   └── main.tsx            # Entry point of the application
├── supabase/               # Supabase project configuration and functions
│   ├── functions/          # Supabase Edge Functions (e.g., speech-to-text, text-to-speech, translate)
│   └── migrations/         # Database migration files
├── .gitignore
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

## Running the Application

To start the development server:

```bash
npm run dev
# or yarn dev
```

The application will be accessible at `http://localhost:8080`.

## Supabase Setup

This project relies heavily on Supabase for its backend services. Follow these steps to set up your Supabase project:

1.  **Create a new Supabase project:** Go to [Supabase](https://supabase.com/) and create a new project.

2.  **Database Schema:**

    The project uses a `translations` table. You can apply the schema from the migration file located at `supabase/migrations/20250620181912-5d26ff6f-5416-485a-b016-32abf1e8d8b3.sql`.

    Alternatively, you can use the Supabase CLI to link your local project to your Supabase project and run migrations:

    ```bash
    supabase login
    supabase link --project-ref your-project-ref
    supabase db push
    ```

3.  **Edge Functions:**

    The application uses Supabase Edge Functions for `speech-to-text`, `text-to-speech`, and `translate`. These functions are located in `supabase/functions/`.

    You will need to deploy these functions to your Supabase project. Refer to the Supabase documentation for deploying Edge Functions.

    Example deployment command (from the `supabase` directory):

    ```bash
    supabase functions deploy speech-to-text --no-verify-jwt
    supabase functions deploy text-to-speech --no-verify-jwt
    supabase functions deploy translate --no-verify-jwt
    ```

    *Note: `--no-verify-jwt` is used for simplicity during development. For production, ensure proper JWT verification.*

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License.
