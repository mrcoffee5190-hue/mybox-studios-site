// Load product data from products.json and display on Watch Page
async function loadProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    console.error("No product ID found in URL.");
    return;
  }

  try {
    const res = await fetch("data/products.json");
    const products = await res.json();

    const product = products.find(p => p.id == productId);

    if (!product) {
      console.error("Product not found:", productId);
      return;
    }

    // Fill Watch Page with actual data
    document.querySelector(".watch-title").textContent = product.title;
    document.querySelector(".creator-name").textContent = product.creator;
    document.querySelector(".creator-avatar").textContent =
      product.creator.slice(0, 2).toUpperCase();
    document.querySelector(".description-text").textContent = product.description;
    document.querySelector(".video-wrapper").style.backgroundImage =
      `url('${product.thumbnail}')`;

    // Genre, Duration, Region
    document.querySelector(".description-row").innerHTML = `
      <span>Genre: <strong>${product.genre}</strong></span>
      <span>•</span>
      <span>Duration: <strong>${product.duration}</strong></span>
      <span>•</span>
      <span>Region: <strong>Worldwide</strong></span>
    `;

    // BUY / DOWNLOAD
    const buyBtn = document.querySelector(".btn-primary");
    buyBtn.onclick = () => {
      window.location.href = \`/checkout.html?id=\${product.id}\`;
    };

    // Load Up Next Section
    loadUpNext(products, productId);

  } catch (err) {
    console.error("Error loading product data:", err);
  }
}

// Load Up Next list
function loadUpNext(products, currentId) {
  const sidebar = document.querySelector(".watch-sidebar");
  const nextItems = products.filter(p => p.id != currentId).slice(0, 5);

  const section = sidebar.querySelector(".sidebar-section");
  const container = section.querySelectorAll(".up-next-item");

  nextItems.forEach((item, index) => {
    if (container[index]) {
      container[index].querySelector(".up-next-title").textContent = item.title;
      container[index].querySelector(".up-next-meta").innerHTML =
        \`\${item.genre} · \${item.duration}\`;
      container[index].querySelector(".up-next-thumb").style.backgroundImage =
        \`url('\${item.thumbnail}')\`;
      container[index].querySelector("a").href =
        \`watch.html?id=\${item.id}\`;
    }
  });
}

loadProduct();
