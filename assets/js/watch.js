<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Watch | MyBox Studios</title>

  <!-- GLOBAL STYLESHEET -->
  <link rel="stylesheet" href="assets/css/styles.css" />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />

  <style>
    :root {
      --gold: #D4AF37;
      --black: #000000;
      --white: #ffffff;
      --gray: #222222;
      --light-gray: #aaaaaa;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background-color: var(--black);
      color: var(--white);
      font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    /* HEADER / TOP BAR */
    .mb-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.4);
      background: #000000;
      position: sticky;
      top: 0;
      z-index: 20;
    }

    .mb-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .mb-logo-mark {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      border: 2px solid var(--gold);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
    }

    .mb-logo-text-main {
      font-size: 16px;
    }

    .mb-logo-text-sub {
      font-size: 11px;
      color: var(--light-gray);
      text-transform: none;
      letter-spacing: normal;
    }

    .mb-nav {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
    }

    .mb-nav a {
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid transparent;
      font-weight: 500;
    }

    .mb-nav a:hover {
      border-color: rgba(212, 175, 55, 0.4);
      background-color: #111111;
    }

    .mb-nav a.active {
      border-color: var(--gold);
      background: var(--gold);
      color: var(--black);
    }

    .mb-search {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 16px;
    }

    .mb-search input {
      background: #111111;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 6px 10px;
      color: var(--white);
      font-size: 12px;
      min-width: 140px;
    }

    .mb-search input::placeholder {
      color: #666666;
    }

    .mb-search-btn {
      border-radius: 999px;
      border: 1px solid var(--gold);
      padding: 6px 10px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: transparent;
      color: var(--gold);
      cursor: pointer;
    }

    .mb-search-btn:hover {
      background: rgba(212, 175, 55, 0.12);
    }

    /* PAGE LAYOUT */
    .watch-layout {
      max-width: 1280px;
      margin: 0 auto;
      padding: 16px;
      display: flex;
      gap: 22px;
    }

    .watch-main {
      flex: 2.1;
      min-width: 0;
    }

    .watch-sidebar {
      flex: 1;
      min-width: 0;
    }

    /* VIDEO SECTION */
    .video-frame {
      background: #111111;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      overflow: hidden;
    }

    .video-wrapper {
      position: relative;
      width: 100%;
      padding-top: 56.25%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .video-progress-bar {
      height: 4px;
      background: #111111;
      position: relative;
    }

    .video-progress-fill {
      position: absolute;
      inset: 0;
      width: 32%;
      background: linear-gradient(to right, var(--gold), #ffffff);
    }

    /* TITLE & META */
    .watch-title {
      font-size: 18px;
      margin: 14px 2px 6px;
      font-weight: 700;
    }

    .watch-meta-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      font-size: 12px;
      color: var(--light-gray);
    }

    .watch-meta-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .meta-pill {
      padding: 4px 9px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .meta-pill.gold {
      border-color: var(--gold);
      color: var(--gold);
    }

    .watch-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      border-radius: 999px;
      padding: 7px 14px;
      font-size: 11px;
      border: 1px solid transparent;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      color: var(--white);
    }

    .btn-primary {
      background: var(--gold);
      color: var(--black);
      border-color: var(--gold);
      font-weight: 700;
    }

    .btn-outline {
      border-color: rgba(255, 255, 255, 0.25);
    }

    /* CREATOR STRIP */
    .creator-strip {
      margin-top: 16px;
      padding: 12px 12px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: #050505;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .creator-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--gold);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 700;
    }

    .description-card {
      margin-top: 16px;
      padding: 12px 14px;
      border-radius: 16px;
      background: #050505;
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 12px;
      line-height: 1.5;
    }

    /* COMMENTS */
    .comments-block {
      margin-top: 16px;
      font-size: 12px;
    }

    /* SIDEBAR */
    .sidebar-section {
      margin-bottom: 18px;
    }

    .sidebar-title {
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .up-next-item {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
      border-radius: 12px;
      padding: 6px;
      background: #050505;
      border: 1px solid rgba(255, 255, 255, 0.06);
      cursor: pointer;
    }

    .up-next-thumb {
      width: 120px;
      aspect-ratio: 16/9;
      border-radius: 9px;
      background-size: cover;
      background-position: center;
    }

    .up-next-title {
      font-size: 12px;
      margin-bottom: 4px;
    }

    .up-next-meta {
      font-size: 11px;
      color: var(--light-gray);
    }

    /* FOOTER */
    .mb-footer {
      max-width: 1280px;
      margin: 0 auto;
      padding: 16px;
      font-size: 11px;
      color: var(--light-gray);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
  </style>
</head>

<body>

  <!-- HEADER -->
  <header class="mb-header">
    <div class="mb-logo">
      <div class="mb-logo-mark">MB</div>
      <div>
        <div class="mb-logo-text-main">MyBox Studios</div>
        <div class="mb-logo-text-sub">Indie Movies &amp; Beats Worldwide</div>
      </div>
    </div>

    <nav class="mb-nav">
      <a href="index.html">Home</a>
      <a href="movies.html">Movies</a>
      <a href="music.html">Music</a>
      <a href="watch.html" class="active">Watch</a>
      <a href="join.html">Join</a>
    </nav>

    <div class="mb-search">
      <input type="search" placeholder="Search movies & beats..." />
      <button class="mb-search-btn">Search</button>
    </div>
  </header>

  <!-- WATCH PAGE CONTENT -->
  <div class="watch-layout">
    <main class="watch-main">
      <section class="video-frame">
        <div class="video-wrapper"></div>
        <div class="video-progress-bar">
          <div class="video-progress-fill"></div>
        </div>
      </section>

      <h1 class="watch-title">Loading…</h1>

      <div class="watch-meta-row">
        <div class="watch-meta-left">
          <div class="meta-pill gold">Official Studio Upload</div>
        </div>

        <div class="watch-actions">
          <button class="btn btn-primary">★ Buy / Download</button>
        </div>
      </div>

      <section class="creator-strip">
        <div class="creator-left">
          <div class="creator-avatar">MB</div>
          <div>
            <div class="creator-name">Studio</div>
          </div>
        </div>
      </section>

      <section class="description-card">
        <div class="description-row"></div>
        <div class="description-text">Loading description…</div>
      </section>

      <section class="comments-block">
        <h3>Comments</h3>
      </section>
    </main>

    <!-- SIDEBAR -->
    <aside class="watch-sidebar">
      <section class="sidebar-section">
        <h2 class="sidebar-title">Up Next</h2>

        <div class="up-next-item">
          <a class="up-next-thumb"></a>
          <div>
            <div class="up-next-title">Loading…</div>
            <div class="up-next-meta"></div>
          </div>
        </div>

        <div class="up-next-item">
          <a class="up-next-thumb"></a>
          <div>
            <div class="up-next-title">Loading…</div>
            <div class="up-next-meta"></div>
          </div>
        </div>

        <div class="up-next-item">
          <a class="up-next-thumb"></a>
          <div>
            <div class="up-next-title">Loading…</div>
            <div class="up-next-meta"></div>
          </div>
        </div>
      </section>
    </aside>
  </div>

  <!-- FOOTER -->
  <footer class="mb-footer">
    © 2025 MyBox Studios · Worldwide
  </footer>

  <!-- DYNAMIC WATCH PAGE SCRIPT -->
  <script src="assets/js/watch.js"></script>
</body>
</html>
