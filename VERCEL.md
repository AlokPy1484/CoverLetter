# Vercel services

The root `vercel.json` defines two independently built services:

| Service | Directory | Public routing |
| --- | --- | --- |
| `app` | `.` | All public paths (`/(.*)`) |
| `stick-figure-lottie` | `stick-figure-lottie` | Internal; no public rewrite |

This routing is a draft awaiting confirmation. The Lottie player is not accessible
to visitors with this configuration. `animated-chart` is a local video-authoring
project and is not configured as a deployed service.

Both services install from their npm lockfiles with `npm ci` and build with
`npm run build`. The Vite service outputs `dist`. Build settings belong to each
service; public routing belongs to the root configuration.

## Calls and bindings

Neither application calls the other, so no bindings or injected URL variables
are declared. The Lottie player's relative fetches target its own scene assets
and development-only editor endpoints, not the Next.js service. Production
playback uses the generated scene index and static assets. The filesystem editor
endpoints exist only in its Vite development server.

If the Lottie player should become public at a prefix, first align its Vite base,
Solid router base, scene index, asset URLs, and editor URLs with that prefix;
then add its top-level rewrite before the app catch-all. Vercel service rewrites
preserve the original request path.

If server-side calls between services are introduced, declare all four binding
fields (`type`, `service`, `format`, `env`) on the caller and read the injected
variable at function runtime. Do not define the variable yourself or use it in
builds, middleware, or browser code.

## Local testing and deployment

Run `vercel dev -L` from the repository root to test both services locally
without Vercel Cloud authentication. For linked project settings, use
`vercel dev`. Confirm the service names, exposure, and bindings before deploying.

Configure the Vercel project's Root Directory as this repository root.
