document.addEventListener('DOMContentLoaded', function() {
  const images = [
    "images/image1.jpg", // Replace with your image URLs
    "images/image2.jpg",
    "images/image3.jpg",
    "images/image4.jpg"
  ];

  const pageSpecificText = {
    1: "Hello World" // Text for page 2 (index 1)
  };

  let currentImageIndex = 0;
  const currentImage = document.getElementById("currentImage");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const sidebarLinks = document.querySelectorAll(".sidebar ul li");
  const pageTextDiv = document.getElementById("pageText");
  const currentPageDiv = document.getElementById("currentPage"); // Added current page element

  function updateImage() {
    currentImage.src = images[currentImageIndex];
    updateSidebar();
    updatePageText();
    updateCurrentPageDisplay(); // Update current page display
  }

  function updateSidebar() {
    sidebarLinks.forEach((link, index) => {
      if (index === currentImageIndex) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  function updatePageText() {
    const text = pageSpecificText[currentImageIndex + 1] || ""; // +1 because page numbers start from 1
    pageTextDiv.textContent = text;
  }

  function updateCurrentPageDisplay() {
    currentPageDiv.textContent = `Page: ${currentImageIndex + 1}`; // Display current page number
  }

  prevButton.addEventListener("click", () => {
    currentImageIndex--;
    if (currentImageIndex < 0) {
      currentImageIndex = images.length - 1;
    }
    updateImage();
  });

  nextButton.addEventListener("click", () => {
    currentImageIndex++;
    if (currentImageIndex >= images.length) {
      currentImageIndex = 0;
    }
    updateImage();
  });

  sidebarLinks.forEach((link, index) => {
    link.addEventListener("click", () => {
      currentImageIndex = index;
      updateImage();
    });
  });

  // Initial image load and sidebar update
  updateImage();
});