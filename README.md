# Interactive Comments Section

<!-- screenshots here -->

A challenge from [frontendmentor.io](https://www.frontendmentor.io/)

## Overview

### Links

- [Live Site](https://your-live-site-url.com)
- [Solution](https://your-solution-url.com)

### The challenge

Users should be able to:

- View the optimal layout for the site depending on their device's screen size
- See hover states for all interactive elements on the page
- Create the background shape using code

## My process

### Built with

- Semantic HTML5 markup
- Flexbox
- Mobile-first workflow
- Tailwind CSS
- Next JS
- Prisma

### What I learned

1. I learnt to use Prisma

   prisma is ...
   get the public postgresql connect url from railway

   ```
   yarn add --dev prisma
   ```

   ```
   npx prisma migrate dev
   ```

   ```
   npx prisma studio
   ```

   Create prisma client

   ```ts
   // lib/prisma.ts
   import { PrismaClient } from '@prisma/client'

   let prisma: PrismaClient

   declare global {
     var prisma: any
   }

   if (process.env.NODE_ENV === 'production') {
     prisma = new PrismaClient()
   } else {
     if (!global.prisma) {
       global.prisma = new PrismaClient()
     }
     prisma = global.prisma
   }

   export default prisma
   ```

   - relations fields : https://www.prisma.io/docs/concepts/components/prisma-schema/relations
   - rename fields : https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/customizing-migrations

2. I learnt how to use useSWR

### Useful Resources

## Acknowledgments

Thank you very much to everyone who gave me feedback on my solution. It greatly assists me in improving my frontend development skills.
