# StudioSpace

StudioSpace is a peer-to-peer marketplace for creative spaces. Creators can find and book photo studios, music suites, podcast lounges, film stages and workshops by the hour, while hosts can list their own space and manage bookings in one place.

**Live site:** https://studio-space-ivory.vercel.app
**Client repository:** https://github.com/mdalshaharia/StudioSpace

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

Examiner can register a new account with any email address. No confirmation email is sent and no link needs to be clicked.
After registering you are signed in automatically and redirected to the home page.

## Project Structure

```
 src/
      app/
          about/
              page.jsx
          add-studio/
              layout.js
              page.jsx
          api/
              auth/
                  [...all]/
                      route.js
          contact/
              page.jsx
          dashboard/
              page.jsx
          how-it-works/
              page.jsx
          lib/
              auth.js
              auth-client.js
              categories.js
              getTokenFromClient.js
              getTokenFromServer.js
              uploadImage.js
          my-bookings/
              page.jsx
          my-listings/
              page.jsx
          privacy/
              page.jsx
          signin/
              page.jsx
          signup/
              page.jsx
          studios/
              [slug]/
                  layout.js
                  loading.jsx
                  page.jsx
              edit/
                  [slug]/
                      loading.jsx
                      page.jsx
              page.jsx
          terms/
              page.jsx
          upload-image/
              page.jsx
          favicon.ico
          globals.css
          layout.js
          not-found.jsx
          page.js
      components/
          Banner/
              Banner.jsx
          BookingWorks/
              BookingWorks.jsx
          ByCategory/
              ByCategory.jsx
          Card/
              BookingsCard/
                  BookingsCard.jsx
              ListingCard/
                  ListingCard.jsx
          EmptyState/
              EmptyState.jsx
          Featured/
              Featured.jsx
              FeaturedCard.jsx
          Footer/
              Footer.jsx
          Hero/
              Hero.jsx
          Modal/
              BookingModal.jsx
          Navbar/
              Navbar.jsx
          Preview/
              Preview.jsx
          Skeletons/
              index.js
              Skeletons.jsx
          theme/
              theme-provider.jsx
              theme-toggle.jsx
          TrustSafety/
              TrustSafety.jsx
          ui/
              accordion.jsx
              alert.jsx
              alert-dialog.jsx
              avatar.jsx
              badge.jsx
              button.jsx
              calendar.jsx
              card.jsx
              carousel.jsx
              checkbox.jsx
              dialog.jsx
              dropdown-menu.jsx
              input.jsx
              label.jsx
              popover.jsx
              select.jsx
              separator.jsx
              sheet.jsx
              skeleton.jsx
              sonner.jsx
              table.jsx
              tabs.jsx
              textarea.jsx
      context/
          productContext.jsx
      lib/
          utils.js
      proxy.js
```

## Author

**Alshari**
Built as a front-end project using Next.js, shadcn/ui and Tailwind CSS.