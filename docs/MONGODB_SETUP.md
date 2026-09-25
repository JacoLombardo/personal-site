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

## 6. Load the content

The site reads the `personal-site` database:

- `projects`: one document per project
- `technologies`: the technologies section
- `content`: the `intro`, `about-me`, `contact` and `cv` documents

All of it comes from [public/projects.json](../public/projects.json). After editing that file, push it with:

```bash
npm run push-json
```

This replaces the `projects` and `technologies` collections and the four `content` documents with what is in the JSON file. It reads `MONGODB_URI` from `.env.local`.

## 7. Rebuild

Everything is read at build time, so changes show up after the next build: `npm run build` locally, or the next Vercel deploy in production.

If MongoDB can't be reached, the build fails with "Could not connect to MongoDB (…)" instead of deploying empty pages. A free cluster that Atlas has paused fails this way: resume it in Atlas, wait for it to come up, and build again.
