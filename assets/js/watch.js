/* ============================================================
   WATCH.JS — MyBox Studios Dynamic Watch Page Loader
   Loads the correct product based on ?id= in the URL
   ============================================================ */

// 1. Get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// 2. Select all page elements we need to control
const videoWrapper = document.querySelector(".video-wrapper");
const titleEl = document.querySelector(".watch-title");
const avatarEl = document.querySelector(".creator-avatar");
const creatorNameEl = document.querySelector(".creator-name");
const descriptionTextEl = document.querySelector(".description-text");
const descriptionRowEl = document.querySelector(".description-row");
const buyBtn = document.querySelector(".btn-primary");

// 3. Load product.json dynamically
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

// 4. Render product into the page
function renderProduct(product) {
  // Title
  titleEl.textContent = product.title;

  // Background image for video area
  if (product.image) {
    videoWrapper.style.backgroundImage = `url('${product.image}')`;
  }

  // Creator initials
  avatarEl.textContent = product.title.charAt(0).toUpperCase();

  // Creator name (temporary until studios are dynamic)
  creatorNameEl.textContent = "MyBox Studio Creator";

  // Description
  descriptionTextEl.textContent = product.description || "No description available.";

  // Description row (movie or music meta)
  descriptionRowEl.innerHTML = `
    <span>Type: <strong>${product.type.toUpperCase()}</strong></span>
    <span>•</span>
    <span>Price: <strong>$${product.price}</strong></span>
  `;

  // BUY BUTTON — sends product to checkout
  buyBtn.onclick = () => {
    window.location.href = `checkout.html?id=${product.id}`;
  };
}

// 5. Load UP NEXT sidebar
function loadUpNext(allProducts, currentId) {
  const sidebarItems = document.querySelectorAll(".up-next-item");

  // Remove current product from list
  const upNextList = allProducts.filter((p) => p.id !== currentId);

  sidebarItems.forEach((item, index) => {
    const product = upNextList[index];
    if (!product) return;

    const thumb = item.querySelector(".up-next-thumb");
    const title = item.querySelector(".up-next-title");
    const meta = item.querySelector(".up-next-meta");

    // Thumbnail
    if (product.image) {
      thumb.style.backgroundImage = `url('${product.image}')`;
    }

    // Title
    title.textContent = product.title;

    // Meta
    meta.textContent = product.type === "movie" ? "HD • Film" : "Beat / Audio";

    // Click → load next product
    item.onclick = () => {
      window.location.href = `watch.html?id=${product.id}`;
    };
  });
}

// 6. Auto-load page on start
loadProduct();
