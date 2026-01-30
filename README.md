This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Authentication

- Using Clerk Authentication

# Sales Agent

- VAPI

# ORM

- Prisma ORM

# Stream

- (Chat,feeds, Video Stream Built In Component)

# Prisma

- How to run migration
  command : npx prisma migrate dev --name init

# [ISSUE -1] : Database taking old migration

fix : with DATABASE URL add these '&pgbouncer=true&prepared_statements=false'

# [Issue-2] : prisma studio not working

command : npx prisma studio

# Stripe Connection

- from Stripe Dashboard
- get 'Publishable Key' ===>'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
- get 'Secret Key' ===> 'STRIPE_SECRET_KEY'

Packages needs to install

- npm install stripe @stripe/stripe-js

Now Need to initiase the stripe client

- make some utils in lib folder to initliase stripe client
  - initialise stripe with Secret key
  - expose publishable key

-- Setup Products that we want to use

- go to dashboard
- go to product catalog from sidebar
- add products ex: Premium Pro Basic with amounts
  - copy price id
  - make an object of priceids and expose into stripe initlizer files
