# Eclat Perlé — Handcrafted Lebanese Accessories

A professional e-commerce website for **Eclat Perlé**, a Lebanese small business specializing in handmade resin art, keychains, pearl jewelry, beaded accessories, and curated gift sets. Orders are placed via WhatsApp, and the shop is fully managed through a built-in admin panel — no external backend required.

---

## Features

- **Online Shop** — Browse products by category (Resin Art, Keychains, Jewelry, Kids, Gifts, Summer) with live search and filtering
- **Product Detail Pages** — Full product view with image, description, quantity selector, and add-to-cart
- **Shopping Cart** — Persistent cart with quantity controls, subtotals, and order summary
- **WhatsApp Order Integration** — Customers send their complete order directly to the business WhatsApp with one tap
- **Admin Panel** — Secure login to manage products, prices, images, WhatsApp number, and admin password
- **Image Upload** — Drag & drop or file/camera picker; works on both mobile (gallery & camera) and desktop; images are compressed client-side
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop
- **Discreet Admin Access** — Hidden lock icon in the footer for admin access without exposing the URL to customers

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) — App Router, TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) with custom brand theme (`@theme`) |
| Fonts | [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (headings) + [Lato](https://fonts.google.com/specimen/Lato) (body) via `next/font/google` |
| Icons | [lucide-react](https://lucide.dev/) |
| State Management | React Context API (cart state) |
| Data Persistence | `localStorage` — products, cart, and settings stored client-side; no backend required |
| Image Handling | Canvas API — client-side compression to max 800×800 px at JPEG 82% quality, stored as base64 |
| Auth | `sessionStorage`-based admin session |
| Order Flow | [WhatsApp API](https://wa.me/) — complete order formatted and sent as a pre-filled message |

---

## Project Structure

```
eclat-perle-website/
├── app/
│   ├── page.tsx                  # Home page (hero, collections, features, story, contact)
│   ├── layout.tsx                # Root layout (fonts, cart provider, navbar)
│   ├── globals.css               # Tailwind v4 config + brand color theme
│   ├── shop/page.tsx             # Shop page with search & category filters
│   ├── cart/page.tsx             # Cart with WhatsApp checkout
│   ├── product/[id]/page.tsx     # Product detail page
│   ├── admin/
│   │   ├── login/page.tsx        # Admin login
│   │   ├── dashboard/page.tsx    # Admin dashboard (products + settings)
│   │   └── layout.tsx            # Admin layout (hides public navbar)
│   └── not-found.tsx             # Custom 404 page
├── components/
│   ├── Navbar.tsx                # Fixed navigation with cart badge
│   ├── ConditionalNavbar.tsx     # Hides navbar on admin pages
│   ├── Footer.tsx                # Footer with social links + discreet admin access
│   └── ProductCard.tsx           # Product card with add-to-cart
├── context/
│   └── CartContext.tsx           # Cart state with localStorage persistence
├── lib/
│   ├── types.ts                  # TypeScript interfaces (Product, CartItem)
│   └── defaultProducts.ts        # Default catalog, formatPrice, localStorage helpers
└── public/                       # Static assets
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/eclat-perle-website.git
cd eclat-perle-website

# Install dependencies
npm install
```

### Run in Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To access the site from other devices on the same Wi-Fi network (e.g. to preview on your phone):

```bash
npm run dev -- --hostname 0.0.0.0
```

Then open `http://YOUR_LOCAL_IP:3000` on any device on the same network.

### Build for Production

```bash
npm run build
npm run start
```

---

## Admin Panel

Access the admin panel via the discreet lock icon in the website footer, or navigate directly to `/admin/login`.

**Default credentials:**
- Email: `admin@eclatperle.com`
- Password: `EclatAdmin2024!`

> **Important:** Change the admin password immediately after first login via **Admin → Settings**.

From the dashboard you can:
- Add, edit, or delete products
- Upload product images (drag & drop or file/camera picker)
- Set product prices in USD
- Update the WhatsApp business number
- Change the admin password

---

## Deployment (https://eclat-perle-website.vercel.app)

The recommended way to deploy is [Vercel](https://vercel.com/)

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Click **Deploy** — no additional configuration needed

You can also connect a custom domain from the Vercel dashboard at any time.

---

&copy; Eclat Perlé. All rights reserved.
