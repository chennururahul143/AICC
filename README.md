# AI Intelligence Command Center

Frontend workspace. Pages load the catalog from the API at `http://127.0.0.1:8001`. Bookmarks, follows, and saved views stay in the browser until you sign in at `/login`, then sync via the API. The assistant page calls the API-backed RAG endpoint.

Start the API first, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
