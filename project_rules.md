# Project Rules and Guidelines: Lingua Nova Bridge

This document outlines the essential rules, coding standards, and best practices for contributing to the Lingua Nova Bridge project. Adhering to these guidelines ensures code quality, consistency, and maintainability across the codebase.

## 1. General Principles

-   **Readability:** Write code that is easy to understand for others and your future self.
-   **Modularity:** Break down complex problems into smaller, manageable components.
-   **Reusability:** Design components and functions to be reusable where appropriate.
-   **Performance:** Consider performance implications, especially for real-time features.
-   **Security:** Always prioritize security, especially when dealing with API keys, user data, and Supabase interactions.

## 2. Coding Standards

### TypeScript/React

-   **Naming Conventions:**
    -   Components: PascalCase (e.g., `AudioControls`, `LanguageSelector`).
    -   Functions/Variables: camelCase (e.g., `handleInputChange`, `translationHistory`).
    -   Constants: UPPER_SNAKE_CASE (e.g., `API_KEY`, `DEFAULT_LANGUAGE`).
    -   Type Interfaces: PascalCase, often prefixed with `I` or `T` (e.g., `ITranslation`, `LanguageType`).
-   **Component Structure:**
    -   Keep components small and focused on a single responsibility.
    -   Use functional components with React Hooks.
    -   Props should be clearly typed using TypeScript interfaces.
-   **Hooks Usage:**
    -   Follow the [Rules of Hooks](https://react.dev/warnings/rules-of-hooks).
    -   Use `useEffect` for side effects, `useMemo` for expensive computations, and `useCallback` for memoizing functions passed to child components.
-   **Error Handling:**
    -   Implement robust error handling for API calls and external integrations.
    -   Use `try-catch` blocks for asynchronous operations.
    -   Provide meaningful error messages to the user via toasts or UI feedback.

### Tailwind CSS / Styling

-   **Utility-First:** Prefer Tailwind's utility classes for styling.
-   **Component-Based Styling:** For complex or reusable styles, consider creating custom components or using `@apply` within CSS files sparingly.
-   **Responsive Design:** Use Tailwind's responsive prefixes (e.g., `sm:`, `md:`, `lg:`) to ensure responsiveness.
-   **Shadcn UI:** Utilize Shadcn UI components for consistent and accessible UI elements. Customize them via `tailwind.config.ts` or by extending their styles.

### Supabase

-   **Client-Side Interactions:** Use the Supabase JavaScript client library (`@supabase/supabase-js`) for all interactions.
-   **Row Level Security (RLS):** Always enable and configure RLS for your database tables to protect data.
-   **Edge Functions:** Use Edge Functions for server-side logic, API integrations, or sensitive operations that should not be exposed client-side.
-   **Migrations:** Manage database schema changes using Supabase migrations (`supabase/migrations`).

## 3. Version Control (Git) Guidelines

-   **Commit Messages:**
    -   Use clear, concise, and descriptive commit messages.
    -   Start with a verb in the imperative mood (e.g., "Add feature", "Fix bug", "Refactor code").
    -   Keep the subject line short (50-72 characters).
    -   Provide a more detailed body if necessary, explaining *what* and *why* the change was made.
    -   Reference relevant issue numbers (e.g., `Fix #123`).
-   **Branching:** Follow the Git workflow outlined in `plan.md`.
-   **Pull Requests:**
    -   Ensure your branch is up-to-date with the `develop` or `main` branch before creating a PR.
    -   Address all review comments before merging.

## 4. Code Review Process

-   **Be Constructive:** Provide helpful and actionable feedback.
-   **Be Respectful:** Maintain a positive and collaborative tone.
-   **Focus on Code:** Review the code, not the person.
-   **Approve Changes:** Approve PRs once all concerns are addressed and the code meets standards.

## 5. Testing

-   **Unit Tests:** Write unit tests for critical functions and components.
-   **Integration Tests:** Ensure different parts of the system work together correctly.
-   **Manual Testing:** Perform manual testing for UI/UX and end-to-end flows.

## 6. Documentation

-   **README.md:** Keep the main `README.md` updated with project overview, setup instructions, and deployment steps.
-   **Inline Comments:** Use comments sparingly for complex logic or non-obvious code.
-   **Markdown Files:** Maintain `task.md` and `plan.md` for project management and future reference.

## 7. Tools and Linters

-   **ESLint:** Adhere to the ESLint rules defined in `eslint.config.js`.
-   **Prettier:** Use Prettier for code formatting to ensure consistent style across the project. Configure your IDE to format on save.
-   **TypeScript:** Leverage TypeScript's type checking to catch errors early.

By following these rules, we can maintain a high-quality codebase and foster an efficient development environment.