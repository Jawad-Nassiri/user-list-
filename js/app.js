const $ = document,
  tableBody = $.querySelector(".table-body"),
  paginationContainer = $.querySelector(".pagination"),
  nextBtn = document.getElementById("next-btn"),
  preBtn = document.getElementById("previous-btn"),
  preBtnIcon = document.querySelector(".fa-angle-left"),
  nextBtnIcon = document.querySelector(".fa-angle-right"),
  modalScreen = document.querySelector(".modal-screen"),
  modal = document.querySelector(".modal");

let page = 1;
let productPerPage = 7;
let products = [];

// Toast notification function
const showToast = (message, type = "success") => {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
};

// fetch data
const fetchData = async () => {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();
  products = data.products;
  renderUsers();
  generatePaginationBtn();
};

fetchData();

//Render data
const renderUsers = () => {
  let startIndex = (page - 1) * productPerPage;
  let lastIndex = startIndex + productPerPage;
  let shownProducts = products.slice(startIndex, lastIndex);
  tableBody.innerHTML = "";

  shownProducts.forEach((pro) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `
                <tr class="tableRow" data-id="${pro.id}">
                    <td class="product-title">${
                      pro.brand ? pro.brand : "Chanel"
                    }</td>
                    <td class="product-price">${pro.price}</td>
                    <td class="product-category">${pro.category}</td>
                    <td class="product-availabilityStatus">${
                      pro.availabilityStatus
                    }</td>
                    <td>
                        <div class="product-manage">
                            <button class="edit-btn"><i class="fas fa-edit"></i></button>
                            <button class="remove-btn"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>


            `
    );
  });
};

// generate pagination buttons
const generatePaginationBtn = () => {
  // Reset buttons
  paginationContainer.innerHTML = `
        <button class="page" id="previous-btn"><i class="fas fa-angle-left"></i></button>
        <button class="page" id="next-btn"><i class="fas fa-angle-right"></i></button>
    `;

  const nextBtn = document.getElementById("next-btn");

  let paginationCount = Math.ceil(products.length / productPerPage);

  for (let i = 1; i <= paginationCount; i++) {
    nextBtn.insertAdjacentHTML(
      "beforebegin",
      `<button class="page ${i === page ? "active" : ""}">${i}</button>`
    );
  }
};

// detect active page
const detectActivePage = (e) => {
  const target = e.target.closest(".page");
  if (!target) return;
  // Handle number buttons
  if (e.target.textContent && !isNaN(e.target.textContent)) {
    const activeElem = document.querySelector(".pagination .active");
    page = Number(e.target.textContent);

    if (activeElem) activeElem.classList.remove("active");
    e.target.classList.add("active");
    renderUsers();
  }
  // Handle next button
  else if (e.target.id === "next-btn" || e.target.closest("#next-btn")) {
    nextBtnHandler();
  }
  // Handle previous button
  else if (
    e.target.id === "previous-btn" ||
    e.target.closest("#previous-btn")
  ) {
    prevBtnHandler();
  }
};

// next button handler
const nextBtnHandler = () => {
  const activeElem = document.querySelector(".pagination .active");
  const totalPages = Math.ceil(products.length / productPerPage);

  if (activeElem && page < totalPages) {
    activeElem.classList.remove("active");
    const nextElem = activeElem.nextElementSibling;
    if (nextElem) {
      nextElem.classList.add("active");
      page++;
      renderUsers();
    }
  }
};

// previous button handler
const prevBtnHandler = () => {
  const activeElem = document.querySelector(".pagination .active");

  if (activeElem && page > 1) {
    activeElem.classList.remove("active");
    const previousElem = activeElem.previousElementSibling;
    if (previousElem) {
      previousElem.classList.add("active");
      page--;
      renderUsers();
    }
  }
};

//show modal screen handler
const showModalScreen = () => {
  modalScreen.classList.remove("hidden");
};

//hide modal screen handler
const hideModalScreen = () => {
  modalScreen.classList.add("hidden");
};

// delete product
const deleteProduct = (e) => {
  showModalScreen();
  modal.innerHTML = "";
  modal.innerHTML = `
           <i class="ui-border top red"></i>
           <i class="ui-border bottom red"></i>
           <header class="modal-header">
               <h3>Delete Product</h3>
               <button class="close-modal">
                   <i class="fas fa-times"></i>
               </button>
           </header>
           <main class="modal-content">
               <p class="remove-text">Are you sure you want to delete this product?</p>
           </main>
           <footer class="modal-footer">
               <button class="cancel">Cancel</button>
               <button class="submit confirm">Confirm</button>
           </footer>
       `;

  let confirmDeletion = document.querySelector(".confirm");

  confirmDeletion.addEventListener("click", async () => {
    let mainProductId = e.target.closest(".tableRow").dataset.id;

    const res = await fetch(`https://dummyjson.com/products/${mainProductId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      products = products.filter((pro) => pro.id !== +mainProductId);
      let pageCount = Math.ceil(products.length / productPerPage);

      if (page > pageCount) {
        page = pageCount;
      }
      renderUsers();
      generatePaginationBtn();
      showToast("Product Deleted Successfully !");
      hideModalScreen();
    }
  });
};

//edit products functionality
const editProductHandler = (e) => {
  let mainParentElem = e.target.closest(".tableRow");
  let proTitle = mainParentElem.querySelector(".product-title").textContent;
  let proPrice = mainParentElem.querySelector(".product-price").textContent;
  let proCategory =
    mainParentElem.querySelector(".product-category").textContent;
  let proAvailabilityStatus = mainParentElem.querySelector(
    ".product-availabilityStatus"
  ).textContent;
  let mainProductId = mainParentElem.dataset.id;

  showModalScreen();
  modal.innerHTML = "";
  modal.innerHTML = `
        <i class="ui-border top blue"></i>
        <i class="ui-border bottom blue"></i>
        <header class="modal-header">
            <h3>Edit Product</h3>
            <button class="close-modal">
                <i class="fas fa-times"></i>
            </button>
        </header>
        <main class="modal-content">
            <form class="edit-form">
                <input type="text" class="modal-input" id="edit-brand" placeholder="Brand" value="${
                  proTitle || ""
                }">
                <input type="number" class="modal-input" id="edit-price" placeholder="Price" value="${proPrice}">
                <input type="text" class="modal-input" id="edit-category" placeholder="Category" value="${proCategory}">
                <select class="modal-input" id="edit-status">
                    <option value="In Stock" ${
                      proAvailabilityStatus === "In Stock" ? "selected" : ""
                    }>In Stock</option>
                    <option value="Out of Stock" ${
                      proAvailabilityStatus === "Out of Stock" ? "selected" : ""
                    }>Out of Stock</option>
                </select>
            </form>
        </main>
        <footer class="modal-footer">
            <button class="cancel">Cancel</button>
            <button class="submit save">Save Changes</button>
        </footer>
    `;

  let saveChangesElem = document.querySelector(".save");

  saveChangesElem.addEventListener("click", async () => {
    let newProTitle = document.querySelector("#edit-brand").value;
    let newProPrice = document.querySelector("#edit-price").value;
    let newProCategory = document.querySelector("#edit-category").value;
    let newAvailabilityStatus = document.querySelector("#edit-status").value;

    let updatedValues = {
      brand: newProTitle,
      price: newProPrice,
      category: newProCategory,
      availabilityStatus: newAvailabilityStatus,
    };

    let updatedProduct = products.find((pro) => pro.id === +mainProductId);

    updatedProduct.brand = newProTitle;
    updatedProduct.price = newProPrice;
    updatedProduct.category = newProCategory;
    updatedProduct.availabilityStatus = newAvailabilityStatus;

    const res = await fetch(`https://dummyjson.com/products/${mainProductId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedValues),
    });

    if (res.ok) {
      renderUsers();
      generatePaginationBtn();
      showToast("Product Edited Successfully !");
      hideModalScreen();
    }
  });
};

// add product
const addProductHandler = () => {
  showModalScreen();
  modal.innerHTML = "";
  modal.innerHTML = `
        <i class="ui-border top green"></i>
        <i class="ui-border bottom green"></i>
        <header class="modal-header">
            <h3>Add New Product</h3>
            <button class="close-modal">
                <i class="fas fa-times"></i>
            </button>
        </header>
        <main class="modal-content">
            <form class="add-form">
                <input type="text" class="modal-input" id="add-brand" placeholder="Brand" required>
                <input type="number" class="modal-input" id="add-price" placeholder="Price" required>
                <input type="text" class="modal-input" id="add-category" placeholder="Category" required>
                <select class="modal-input" id="add-status" required>
                    <option value="">Select Status</option>
                    <option value="In Stock" selected>In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>
            </form>
        </main>
        <footer class="modal-footer">
            <button class="cancel">Cancel</button>
            <button class="submit add">Add Product</button>
        </footer>
    `;

  let confirmAddProductBtn = document.querySelector(".add");

  confirmAddProductBtn.addEventListener("click", async () => {
    let newProTitle = document.querySelector("#add-brand").value;
    let newProPrice = document.querySelector("#add-price").value;
    let newProCategory = document.querySelector("#add-category").value;
    let newAvailabilityStatus = document.querySelector("#add-status").value;

    if (newProTitle && newProPrice && newProCategory && newAvailabilityStatus) {
      let newProduct = {
        brand: newProTitle,
        price: +newProPrice,
        category: newProCategory,
        // availabilityStatus: newAvailabilityStatus
      };

      const res = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      data.availabilityStatus = newAvailabilityStatus;
      products.push(data);
      renderUsers();
      generatePaginationBtn();
      showToast("Product Added Successfully!");
      hideModalScreen();
    }
  });
};

document.addEventListener("click", (e) => {
  // delete product
  if (e.target.closest(".remove-btn")) {
    deleteProduct(e);
  }

  //hide modal screen
  if (e.target.closest(".close-modal")) {
    hideModalScreen();
  }

  //hide modal screen
  if (e.target.classList.contains("cancel")) {
    hideModalScreen();
  }

  //edit products functionality
  if (e.target.closest(".edit-btn")) {
    editProductHandler(e);
  }

  // add new product
  if (e.target.closest("#create-product")) {
    addProductHandler();
  }
});

paginationContainer.addEventListener("click", detectActivePage);
