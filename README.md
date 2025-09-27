# Naviora - Next.js Boilerplate

A comprehensive, production-ready Next.js boilerplate with modern tooling and best practices.

## 🚀 Features

- **Next.js 15** - Latest version with App Router and server components
- **shadcn/ui** - Beautiful, accessible UI components
- **TypeScript** - Full type safety throughout the application
- **React Hook Form** - Performant forms with minimal re-renders
- **Zod** - Type-safe schema validation
- **TanStack Query** - Powerful data fetching and state management
- **Axios** - HTTP client with interceptors and error handling
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Sonner** - Beautiful toast notifications

## � Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── forms/            # Form examples
│   └── globals.css       # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── animations/       # Animation components
├── hooks/                 # Custom React hooks
│   └── api/              # API-related hooks
├── lib/                  # Utility libraries
│   ├── api/              # API client
│   ├── constants/        # App constants & error codes
│   ├── utils/            # Utility functions
│   └── validations/      # Zod schemas
├── providers/            # Context providers
├── types/                # TypeScript type definitions
└── services/             # External services
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd naviora-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create environment file:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Available Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start development server     |
| `npm run build`      | Build for production         |
| `npm run start`      | Start production server      |
| `npm run lint`       | Run ESLint                   |
| `npm run lint:fix`   | Fix ESLint issues            |
| `npm run type-check` | Run TypeScript type checking |
| `npm run format`     | Format code with Prettier    |
| `npm run clean`      | Clean build artifacts        |
| `npm run ui:add`     | Add shadcn/ui components     |

## 🧩 Key Components

### Forms with Validation

- React Hook Form integration
- Zod schema validation
- shadcn/ui form components
- Error handling and display

### Data Fetching

- TanStack Query hooks
- Axios HTTP client
- Request/response interceptors
- Error handling and retries

### Animations

- Framer Motion components
- Page transitions
- Stagger animations
- Modal/drawer transitions

### API Layer

- Type-safe API client
- Generic CRUD hooks
- Error handling
- Request/response transformations

## 📝 Usage Examples

### Creating a Form

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return <Form {...form}>{/* Form fields */}</Form>;
}
```

### Using TanStack Query

```tsx
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.get("/users"),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render users */}</div>;
}
```

### Adding Animations

```tsx
import { FadeIn, SlideIn } from "@/components/animations/fade-slide-scale";

export function AnimatedComponent() {
  return (
    <FadeIn>
      <SlideIn direction='up'>
        <div>This content will animate in</div>
      </SlideIn>
    </FadeIn>
  );
}
```

## 🌐 Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Add other environment variables as needed
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Connect to Vercel
3. Deploy automatically

### Other Platforms

1. Build the application: `npm run build`
2. Start the server: `npm run start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Happy coding!** 🎉

## 🚨 Error Handling & Constants

### Constants System

The application uses a comprehensive constants system for error codes, messages, and configuration:

#### Error Codes (`lib/constants/codes.ts`)

```typescript
import { ERROR_CODES, SUCCESS_CODES, HTTP_STATUS } from "@/lib/constants";

// Usage example
if (error.code === ERROR_CODES.INVALID_CREDENTIALS) {
  // Handle invalid credentials
}
```

#### Error Messages (`lib/constants/messages.ts`)

```typescript
import { ERROR_MESSAGES, getErrorMessage } from "@/lib/constants";

// Get user-friendly error message
const message = getErrorMessage("INVALID_CREDENTIALS");
```

#### Configuration (`lib/constants/config.ts`)

```typescript
import { API_CONFIG, QUERY_KEYS, ROUTES } from "@/lib/constants";

// API configuration
const baseUrl = API_CONFIG.BASE_URL;

// Query keys for TanStack Query
const userQuery = useQuery({
  queryKey: QUERY_KEYS.CURRENT_USER,
  // ...
});

// Route navigation
router.push(ROUTES.DASHBOARD);
```

### Error Handler Utility

The `ErrorHandler` class provides comprehensive error management:

```typescript
import { ErrorHandler } from "@/lib/utils/error-handler";

// Get user-friendly error message
const message = ErrorHandler.getErrorMessage(error);

// Check error types
if (ErrorHandler.isAuthError(error)) {
  // Redirect to login
}

if (ErrorHandler.isValidationError(error)) {
  // Show validation errors
}

// Log errors in development
ErrorHandler.logError(error, "User Registration");
```

### API Error Response Format

All API responses follow a standardized format:

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
  };
  success: boolean;
  timestamp: string;
}
```

### Available Error Categories

- **Authentication**: Invalid credentials, token expired, unauthorized access
- **Validation**: Required fields, invalid formats, password strength
- **User Management**: User not found, email in use, creation failed
- **Resources**: Not found, access denied, CRUD operation failures
- **Network**: Connection errors, timeouts, rate limiting
- **System**: Internal errors, maintenance mode, configuration issues
