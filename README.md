# StudioSpace

StudioSpace is a peer-to-peer marketplace for creative spaces. Creators can find and book photo studios, music suites, podcast lounges, film stages and workshops by the hour, while hosts can list their own space and manage bookings in one place.

**Live site:** https://your-live-site-url.vercel.app
**Client repository:** https://github.com/your-username/studiospace-client

---

## Features

- **Hero slider and browsing:** a Swiper-powered landing page with high-resolution visuals, plus a "Browse by studio type" section and featured listings.
- **Explore with search, filters and sorting:** search by name or location, filter by category, and sort by price or rating. Filters live in the URL, so any result page can be shared.
- **Studio details with gallery:** an image slider with thumbnails, overview, specifications, amenities, host information and reviews on every listing.
- **Instant booking flow:** pick a date, start time and duration in a booking modal. The price (hourly total plus a refundable security deposit) updates live, and each booking starts as *Pending*.
- **My Bookings:** a table of all reservations with status badges. Only *Pending* bookings can be cancelled, with a confirmation dialog.
- **Host dashboard:** add a new studio, view *My Studio Listings*, and update or delete a listing.
- **Authentication and protected routes:** sign in and register with form validation, Google sign-in, and toast feedback. Dashboard pages redirect signed-out users to the login page.
- **Responsive design:** a collapsible mobile navbar, a sticky header with active-route indicators, and layouts that work from phones to wide desktops.

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js (App Router), React |
| Styling | Tailwind CSS, shadcn/ui |
| Sliders | Swiper.js |
| Authentication | Better Auth |
| Notifications | Sonner |
| Icons and dates | Lucide React, date-fns |
| Backend (separate repo) | Node.js, Express, MongoDB |

## Local Setup

**Prerequisites:** Node.js 18 or later, npm, and the StudioSpace API running locally (or a deployed API URL).

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/studiospace-client.git
   cd studiospace-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create an environment file**

   Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
   Add any authentication keys your setup needs (for example Better Auth or Firebase values) to the same file.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production (optional)**
   ```bash
   npm run build
   npm start
   ```

## Examiner Test Credentials

This project does not use an email verification step. Registration works instantly, so:

Examiner can register a new account with any email address, even a made-up one such as test123@mail.com. No confirmation email is sent and no link needs to be clicked.
After registering you are signed in automatically and redirected to the home page.

## Project Structure

```
app/
  page.jsx                  Home (hero slider, browse, featured, how it works)
  explore/                  Search, filter and sort studios
  studios/[id]/             Studio details and booking modal
  dashboard/
    studios/new/            Add a new studio
    bookings/               My bookings
  my-listings/              Host listings
  login/  register/         Authentication pages
  how-it-works/  about/     Information pages
components/                 Navbar, Footer, EmptyState, BookingModal and more
```

## Author

**Alshari**
Built as a front-end project using Next.js, shadcn/ui and Tailwind CSS.