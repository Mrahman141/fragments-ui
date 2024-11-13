# fragments-ui

Fragments UI web app built using Next.js

## Dependencies

- **@hookform/resolvers**: Integrates various validation libraries with `react-hook-form` for easy form validation. Version: ^3.9.1
- **@radix-ui/react-dialog**: A component library for building accessible dialogs in React. Version: ^1.1.2
- **@radix-ui/react-dropdown-menu**: A component for building dropdown menus with accessibility in mind. Version: ^2.1.2
- **@radix-ui/react-icons**: A collection of icons for Radix UI components. Version: ^1.3.0
- **@radix-ui/react-label**: A label component for accessible form elements. Version: ^2.1.0
- **@radix-ui/react-select**: A component for creating customizable and accessible select menus. Version: ^2.1.2
- **@radix-ui/react-slot**: A utility component for composition in Radix UI. Version: ^1.1.0
- **@radix-ui/react-tabs**: An accessible tabs component for managing tabbed interfaces. Version: ^1.1.1
- **@radix-ui/react-toast**: A toast notification component for showing transient messages. Version: ^1.2.2
- **aws-amplify**: A library for integrating AWS services like Cognito, S3, and AppSync into your JavaScript applications. Version: ^5.3.21
- **class-variance-authority**: A utility for managing conditional class names in React components. Version: ^0.7.0
- **clsx**: A utility for constructing className strings conditionally. Version: ^2.1.1
- **date-fns**: A library for handling date manipulations in JavaScript. Version: ^4.1.0
- **js-yaml**: A library for parsing and stringifying YAML. Version: ^4.1.0
- **lucide-react**: A collection of responsive and customizable icons for React. Version: ^0.439.0
- **next**: The Next.js framework for building React applications with server-side rendering and static site generation. Version: 14.2.9
- **react**: A JavaScript library for building user interfaces. Version: ^18.3.1
- **react-dom**: Provides DOM-specific methods for React. Version: ^18.3.1
- **react-hook-form**: A library for building forms in React with validation. Version: ^7.53.2
- **tailwind-merge**: A utility to merge Tailwind CSS class names with minimal hassle. Version: ^2.5.2
- **tailwindcss-animate**: Tailwind CSS plugin to handle animations. Version: ^1.0.7
- **zod**: A TypeScript-first schema declaration and validation library. Version: ^3.23.8

## Dev Dependencies

- **eslint**: A linter for identifying and fixing potential issues in JavaScript code. Version: ^8
- **eslint-config-next**: ESLint configuration for Next.js projects. Version: 14.2.9
- **postcss**: A tool for transforming CSS with JavaScript plugins. Version: ^8
- **prettier**: A code formatter for maintaining consistent code style. Version: ^3.3.3
- **tailwindcss**: A utility-first CSS framework for rapidly building custom designs. Version: ^3.4.1


# Running the Application

- To start the application in development mode, run:

```
npm run dev
```

- Use this command when you're preparing to deploy your application:

```
npm run build
```

- For production, simply run:

```
npm start
```

# Linting

- To check for code issues using ESLint, run:

```
npm run lint
```

# Prettier

- To format the code using Prettier, run:

```
npm run format
```

# Shadcn/ui

- This app uses shadcn/ui for its designed components. The link to the documentation can be found [here](https://ui.shadcn.com/docs).

# Environment Variables

This file contains the environment variables needed for configuring the application. Make sure to fill in the appropriate values before starting the server.

- **`NEXT_PUBLIC_API_URL`**:  
  The URL of the Fragments microservice API. Ensure you are using the correct port for your local or production environment.

- **`NEXT_PUBLIC_AWS_COGNITO_POOL_ID`**:  
  The Amazon Cognito User Pool ID for your AWS setup. This is required for user authentication.

- **`NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID`**:  
  The Client App ID for your AWS Cognito User Pool. This is used to identify the client app within Cognito.

- **`NEXT_PUBLIC_AWS_COGNITO_HOSTED_UI_DOMAIN`**:  
  The domain for the hosted AWS Cognito User Pool UI, used for OAuth authentication. This should only be the domain, not the full URL.

- **`NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL`**:  
  The redirect URL used after successful OAuth sign-in. Ensure the port matches the one used by your Fragments UI web app.

- **`NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL`**:  
  The redirect URL used after the user signs out of the app. Again, make sure the port matches your Fragments UI web app.

# Routes

### Home Page

- Route: `/`
- Description: A welcome page for the user to login and create a new account via AWS cognito Hosted UI. Once Logged in the user can see their username and will be able to access authorized userdata. The user can also logout from the home page. This page now has a form to add a text/plain type fragment to the database. The user can also see a list of their fragments metadata. The Fragment can be updated, deleted and converted to an available extension.
