/* ============================================================
   WATCH.JS — MyBox Studios Dynamic Watch Page Loader
   Video-enabled version
   ============================================================ */

// 1. Get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// 2. Select page elements
const videoEl = document.getElementById("watchVideo");
const videoSource = document.getElementById("videoSource");
const titleEl = document.querySelector(".watch-title");
const avatarEl = document.querySelector(".creator-avatar");
const creatorNameEl = document.querySelector(".creator-name");
const descriptionTextEl = document.querySelector(".description-text");
const descriptionRowEl = document.querySelector(".description-row");
const buyBtn = document.querySelector(".btn-primary");

// 3. Load product.json
async function loadProduct() {
  try {
    const response = await fetch("data/products.json");
    const products = await response.json();

    const product = products.find((p) => p.id === productId);

    if (!product) {
      titleEl.textContent = "Product Not Found";
      return;
    }

    renderProduct(product);
    loadUpNext(products, product.id);

  } catch (err) {
    console.error("Failed to load products.json:", err);
    titleEl.textContent = "Error loading product";
  }
}

// 4. Populate the page with product data
function renderProduct(product) {
  // Title
  titleEl.textContent = product.title;

  // Creator avatar initials
  avatarEl.textContent = product.title.charAt(0).toUpperCase();
  creatorNameEl.textContent = "MyBox Studio Creator";

  // Description
  descriptionTextEl.textContent = product.description || "No description available.";

  // Meta row
  descriptionRowEl.innerHTML = `
    <span>Type: <strong>${product.type.toUpperCase()}</strong></span>
    <span>•</span>
    <span>Price: <strong>$${product.price}</strong></span>
  `;

  // 🔥 Load PLAYABLE VIDEO or MP3
  if (product.preview) {
    videoSource.src = product.preview;
    videoEl.load();
  }

  // Thumbnail poster
  if (product.image) {
    videoEl.setAttribute("poster", product.image);
  }

  // BUY BUTTON → checkout
  buyBtn.onclick = () => {
    window.location.href = `checkout.html?id=${product.id}`;
  };
}

// 5. Load Up Next sidebar
function loadUpNext(allProducts, currentId) {
  const sidebarItems = document.querySelectorAll(".up-next-item");

  const upNextList = allProducts.filter((p) => p.id !== currentId);

  sidebarItems.forEach((item, index) => {
    const product = upNextList[index];
    if (!product) return;

    const thumb = item.querySelector(".up-next-thumb");
    const title = item.querySelector(".up-next-title");
    const meta = item.querySelector(".up-next-meta");

    if (product.image) {
      thumb.style.backgroundImage = `url('${product.image}')`;
    }

    title.textContent = product.title;

    meta.textContent = product.type === "movie" ? "HD • Film" : "Beat / Audio";

    item.onclick = () => {
      window.location.href = `watch.html?id=${product.id}`;
    };
  });
}

loadProduct();
