# MongoDB Atlas – New cluster setup

Use this when creating a new cluster because the old one is gone or not working.

## 1. Create a new cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and sign in.
2. **Create** or select a project, then **Build a Database**.
3. Choose **M0 Free** (or another tier).
4. Pick a cloud provider and region (e.g. AWS / Frankfurt).
5. Name the cluster (e.g. `Cluster0`) and click **Create**.

## 2. Database user

1. **Database Access** → **Add New Database User**.
2. Choose **Password** and set username + password (save them).
3. **Built-in Role**: `Read and write to any database` (or at least to `personal-site`).
4. **Add User**.

## 3. Network access

1. **Network Access** → **Add IP Address**.
2. For local dev: **Allow Access from Anywhere** (`0.0.0.0/0`).
3. For production, restrict to your server’s IP(s).
4. **Confirm**.

## 4. Get the connection string

1. **Database** → **Connect** on your cluster.
2. **Drivers** (or “Connect your application”).
3. Copy the URI. It looks like:
   ```text
   mongodb+srv://<username>:<password>@cluster0.XXXXX.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your DB user (or leave placeholders and set them in env).

## 5. Configure the app

Create or edit `.env.local` in the project root:

```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.XXXXX.mongodb.net/?retryWrites=true&w=majority
```

- Use the **exact** hostname from Atlas (e.g. `cluster0.xxxxx.mongodb.net`).
- If the password has special characters, [URL-encode](https://www.urlencoder.org/) them.

Restart the dev server after changing `.env.local`.

## 6. Create the database and collection

The app uses:

- **Database:** `personal-site`
- **Collection:** `projects`

You can create them by:

- **Option A:** Run the seed script once (see below).
- **Option B:** In Atlas: **Database** → **Browse Collections** → **Create Database** → name: `personal-site`, collection: `projects`. Then add documents manually or import.

## 7. Seed script (dummy projects for design)

From the project root, run (Node 20.6+ loads `.env.local` automatically):

```bash
node --env-file=.env.local scripts/seed-projects.js
```

This inserts **9 dummy projects** (3 per category: Web Development, Software Engineering, 42Berlin) so you can work on the design. Placeholder images come from picsum.photos.

- **First run:** inserts all 9 projects.
- If the collection already has documents, the script does nothing unless you use `--replace`.

To clear the collection and re-insert the dummy data (e.g. after changing `scripts/dummy-projects.js`):

```bash
node --env-file=.env.local scripts/seed-projects.js --replace
```

On older Node or if `--env-file` fails, set `MONGODB_URI` in your shell first, then run the script (with or without `--replace`).

After seeding, run `npm run dev` or `npm run build` and open the site to see the three sections populated.
