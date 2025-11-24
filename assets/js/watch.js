/* ============================================================
   WATCH.JS — MyBox Studios Dynamic Watch Page Loader
   VIDEO-ENABLED VERSION (FULL FILE)
   ============================================================ */

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// PAGE ELEMENTS
const titleEl = document.querySelector(".watch-title");
const avatarEl = document.querySelector(".creator-avatar");
const creatorNameEl = document.querySelector(".creator-name");
const descriptionTextEl = document.querySelector(".description-text");
const descriptionRowEl = document.querySelector(".description-row");
const buyBtn = document.querySelector(".btn-primary");

const videoEl = document.getElementById("watchVideo");
const videoSourceEl = document.getElementById("videoSource");

// LOAD PRODUCT
async function loadProduct() {
  try {
    const res = await fetch("data/products.json");
    const products = await res.json();

    const product = products.find(p => p.id === productId);

    if (!product) {
      titleEl.textContent = "Product Not Found";
      return;
    }

    renderProduct(product);
    loadUpNext(products, product.id);

  } catch (error) {
    console.error("Error loading product:", error);
  }
}

// RENDER PRODUCT INTO PAGE
function renderProduct(product) {

  // Title
  titleEl.textContent = product.title;

  // Creator avatar
  avatarEl.textContent = product.title.charAt(0).toUpperCase();
  creatorNameEl.textContent = "MyBox Studio Creator";

  // Description
  descriptionTextEl.textContent = product.description;

  // Meta
  descriptionRowEl.innerHTML = `
    <span>Type: <strong>${product.type.toUpperCase()}</strong></span>
    <span>•</span>
    <span>Price: <strong>$${product.price}</strong></span>
  `;

  // VIDEO SOURCE
  if (product.preview) {
    videoSourceEl.src = product.preview;
    videoEl.load();
  }

  // VIDEO POSTER
  if (product.image) {
    videoEl.setAttribute("poster", product.image);
  }

  // BUY BUTTON → CHECKOUT
  buyBtn.onclick = () => {
    window.location.href = `checkout.html?id=${product.id}`;
  };
}

// UP NEXT SIDEBAR
function loadUpNext(products, currentId) {
  const items = document.querySelectorAll(".up-next-item");

  const upNextList = products.filter(p => p.id !== currentId);

  items.forEach((item, i) => {
    const product = upNextList[i];
    if (!product) return;

    const thumb = item.querySelector(".up-next-thumb");
    const title = item.querySelector(".up-next-title");
    const meta = item.querySelector(".up-next-meta");

    // Thumbnail
    thumb.style.backgroundImage = `url('${product.image}')`;

    // Title
    title.textContent = product.title;

    // Meta label
    meta.textContent = product.type === "movie" ? "HD • Film" : "Beat / Audio";

    // Click redirect
    item.onclick = () => {
      window.location.href = `watch.html?id=${product.id}`;
    };
  });
}

loadProduct();
