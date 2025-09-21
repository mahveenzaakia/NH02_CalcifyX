# NH02_CalcifyX
createxyz-project/
│
├── apps/
│   └── web/                     # Main frontend application
│       ├── package.json          # Dependencies (React, Tailwind, Vite, etc.)
│       ├── tailwind.config.js    # Tailwind CSS customization
│       ├── tsconfig.json         # TypeScript configuration
│       ├── vite.config.ts        # Vite bundler setup
│       ├── postcss.config.js     # PostCSS (for Tailwind processing)
│       ├── bun.lock              # Lockfile (dependency versions for Bun runtime)
│       ├── test/                 # Testing setup (Vitest framework)
│       │   └── setupTests.ts
│       ├── plugins/              # Custom Vite plugins (unique!)
│       │   ├── layouts.ts
│       │   ├── console-to-parent.ts
│       │   ├── loadFontsFromTailwindSource.ts
│       │   ├── restart.ts
│       │   ├── nextPublicProcessEnv.ts
│       │   ├── aliases.ts
│       │   ├── restartEnvFileChange.ts
│       │   └── addRenderIds.ts
│       ├── __create/             # Internal tooling for dynamic routes
│       │   ├── get-html-for-error-page.ts
│       │   ├── route-builder.ts
│       │   ├── adapter.ts
│       │   ├── index.ts
│       │   └── is-auth-action.ts
│       └── src/                  # Main source code
│           ├── index.css         # Global CSS
│           ├── auth.js           # Authentication logic
│           ├── app/              # Core application code
│           │   ├── routes.ts     # Routes configuration
│           │   ├── global.css    # Global styles
│           │   ├── page.jsx      # Landing page
│           │   ├── root.tsx      # Root React component
│           │   ├── layout.jsx    # Application layout
│           │   └── api/          # API routes
│           │       └── auth/
│           │           ├── token/route.js
│           │           └── expo-web-success/route.js
