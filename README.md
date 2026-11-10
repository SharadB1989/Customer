# Bane Brother Tailor — Customer App

The customer-facing booking app. It is a **separate website** from the shop app,
but it talks to the **same Supabase database**, so:

- the cloths customers can tick come straight from the shop app's **Stock & types → Cloth variety** (with the photos you upload there), and
- every booking appears in the shop app's **Appointments** tab.

Customers can tick one or more cloths, enter their contact details, address and Google location, and pick a date plus a visit slot for our agent to come to their address (10am–1pm, 3pm–6pm, 6pm–9pm). Run `migration_v21.sql` from the shop app once in Supabase before using this version. They can only ever see this one page.

---

## Setup (about 10 minutes)

### 0. Before you start
Your shop app must already be set up on Supabase. In Supabase → SQL Editor, make sure these have been run (skip any you've already run):
- `migration_v8.sql` (or a fresh `schema.sql`) — customer role, Appointments, cloth photos
- `migration_v9.sql` — lets one appointment hold several ticked cloths

Both files are in the shop app's folder.

### 1. Put this app on GitHub
1. github.com → **+ → New repository** → name it `bane-customer-app` → **Create repository**.
2. Unzip this folder, click **uploading an existing file** on the new repo page, drag the unzipped contents in, then **Commit changes**.

### 2. Deploy on Vercel
1. vercel.com → **Add New → Project** → import `bane-customer-app`.
2. Under **Environment Variables**, add these two — use the **same values as your shop app** (Supabase → Project Settings → API):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon public key |

   You do **not** need the service role key here — that stays in the shop app only.
3. Click **Deploy**. You'll get an address like `bane-customer-app.vercel.app` — that's the link you give customers (print it as a QR code on your shop board, put it on WhatsApp, etc.).

### 3. Try it
1. Open the new link → **Create an account** → sign up as a test customer.
2. Tick a cloth or two, fill the details, **Book appointment**.
3. In the shop app, open **Appointments** (grant yourself the *Appointments* permission in Users if you don't see it). The booking will be there with the cloth names and photos.

---

## Good to know
- **Email confirmation:** if Supabase asks new customers to confirm their email, they'll be prompted once. To skip it: Supabase → Authentication → Providers → Email → turn off *Confirm email*.
- **Shop staff** who sign in here are told to use the shop app instead; they can't use this one.
- **What customers see in the cloth list** is exactly your Cloth variety list — including the stitching styles (Normal, Fixfold/Traffic, 6pocket) if you've kept them there. Remove or rename entries in Stock & types if you don't want them offered.
- **Changing the look or fields:** edit `components/BookingForm.js`, push to GitHub, and Vercel redeploys automatically.

## Linked to the shop app's Appointments tab

Bookings go straight into the shop app's Appointments tab, because both apps use the **same Supabase project**. When you deploy this app on Vercel, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to exactly the same values as the shop app, then redeploy.
