document.addEventListener("DOMContentLoaded", function () {
   // تبديل الوضع الليلي
   const themeToggle = document.querySelector(".theme-toggle");
   let darkMode = localStorage.getItem("darkMode") === "true";
   if (darkMode) {
     document.body.classList.add("dark-mode");
     themeToggle.textContent = "☀️";
   }
 
   themeToggle.addEventListener("click", () => {
     darkMode = !darkMode;
     document.body.classList.toggle("dark-mode");
     themeToggle.textContent = darkMode ? "☀️" : "🌙";
     localStorage.setItem("darkMode", darkMode);
   });
 
// Audio Handling - Improved version
const musicToggle = document.querySelector(".music-toggle");
const audio = document.getElementById("eid-audio");

// Check URL parameters first (overrides localStorage)
const urlParams = new URLSearchParams(window.location.search);
const musicFromUrl = urlParams.get("music");

// Set initial state - default is true unless localStorage or URL says false
let musicOn = true;

if (musicFromUrl !== null) {
  musicOn = musicFromUrl === "true";
  localStorage.setItem("musicOn", musicOn);
} else if (localStorage.getItem("musicOn") !== null) {
  musicOn = localStorage.getItem("musicOn") === "true";
}

// Update toggle UI
updateMusicToggleUI();

// Function to handle audio play with fallback
function handleAudioPlay() {
  if (!musicOn) return;
  
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise.catch(e => {
      console.log("Audio play prevented, will wait for user interaction");
      // Show a subtle visual cue that audio is ready but needs interaction
      musicToggle.classList.add("needs-interaction");
    });
  }
}

// Update UI based on music state
function updateMusicToggleUI() {
  musicToggle.innerHTML = musicOn ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
  musicToggle.classList.toggle("active", musicOn);
}

// Try to play immediately (may fail in some browsers)
handleAudioPlay();

// Enable audio on any user interaction
function enableAudio() {
  if (musicOn) {
    audio.play().then(() => {
      musicToggle.classList.remove("needs-interaction");
    }).catch(e => {
      console.log("Audio play still failed:", e);
    });
  }
  document.removeEventListener('click', enableAudio);
  document.removeEventListener('keydown', enableAudio);
  document.removeEventListener('touchstart', enableAudio);
}

// Add multiple interaction listeners
document.addEventListener('click', enableAudio, { once: true });
document.addEventListener('keydown', enableAudio, { once: true });
document.addEventListener('touchstart', enableAudio, { once: true });

// Music toggle handler
musicToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  musicOn = !musicOn;
  
  if (musicOn) {
    audio.play().catch(e => {
      console.log("Audio play failed:", e);
      musicOn = false;
    });
  } else {
    audio.pause();
  }
  
  updateMusicToggleUI();
  localStorage.setItem("musicOn", musicOn);
});
 
  // Image upload and cropping functionality
  const imageUpload = document.getElementById("image-upload");
  const recipientImageInput = document.getElementById("recipient-image");
  const imagePreviewContainer = document.getElementById("image-preview-container");
  const imagePreview = document.getElementById("image-preview");
  const removeImageBtn = document.getElementById("remove-image");
  let recipientImageUrl = null;

  // Create modal for cropping
  const cropModal = document.createElement("div");
  cropModal.className = "crop-modal";
  cropModal.innerHTML = `
    <div class="crop-modal-content">
      <div class="crop-modal-header">
        <h3>قص الصورة</h3>
        <button class="close-crop">&times;</button>
      </div>
      <div class="crop-container">
        <img id="crop-image" src="" alt="صورة للقص">
      </div>
      <div class="crop-buttons">
        <button class="crop-btn" id="crop-confirm">تأكيد القص</button>
        <button class="crop-btn" id="crop-cancel">إلغاء</button>
      </div>
    </div>
  `;
  document.body.appendChild(cropModal);

  let cropper;

  imageUpload.addEventListener("click", () => {
    recipientImageInput.click();
  });

  recipientImageInput.addEventListener("change", function() {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        // Show cropping modal
        const cropImage = document.getElementById("crop-image");
        cropImage.src = e.target.result;
        cropModal.style.display = "block";
        
        // Initialize cropper
        cropper = new Cropper(cropImage, {
          aspectRatio: 1, // Square aspect ratio (1:1)
          viewMode: 1,
          autoCropArea: 0.8,
          responsive: true,
          guides: false
        });
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  // Close modal
  document.querySelector(".close-crop").addEventListener("click", closeCropModal);
  document.getElementById("crop-cancel").addEventListener("click", closeCropModal);

  function closeCropModal() {
    cropModal.style.display = "none";
    if (cropper) {
      cropper.destroy();
    }
    recipientImageInput.value = "";
  }

  // Confirm crop
  document.getElementById("crop-confirm").addEventListener("click", function() {
    if (cropper) {
      // Get cropped canvas
      const canvas = cropper.getCroppedCanvas({
        width: 300, // Set desired width
        height: 300, // Set desired height
        minWidth: 256,
        minHeight: 256,
        maxWidth: 800,
        maxHeight: 800,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      
      // Convert canvas to image
      recipientImageUrl = canvas.toDataURL("image/jpeg", 0.9);
      imagePreview.src = recipientImageUrl;
      imagePreviewContainer.style.display = "block";
      
      // Close modal
      closeCropModal();
    }
  });

  removeImageBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    imagePreview.src = "#";
    imagePreviewContainer.style.display = "none";
    recipientImageInput.value = "";
    recipientImageUrl = null;
  });

  // التحقق من وجود اسم في الرابط
  const nameFromUrl = urlParams.get("name");
  const recipientNameFromUrl = urlParams.get("recipient");
  const imageFromUrl = urlParams.get("image");
  const darkModeFromUrl = urlParams.get("dark") === "true";

  // تطبيق الإعدادات من الرابط
  if (darkModeFromUrl && !darkMode) {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
    darkMode = true;
    localStorage.setItem("darkMode", "true");
  }

  if (nameFromUrl || recipientNameFromUrl || imageFromUrl) {
    if (recipientNameFromUrl) {
      document.getElementById("recipient-name").value =
        decodeURIComponent(recipientNameFromUrl);
    }
    if (nameFromUrl) {
      document.getElementById("name").value =
        decodeURIComponent(nameFromUrl);
    }
    if (imageFromUrl) {
      imagePreview.src = decodeURIComponent(imageFromUrl);
      imagePreviewContainer.style.display = "block";
      recipientImageUrl = decodeURIComponent(imageFromUrl);
    }
    generateCard();
    document.getElementById("form-container").style.display = "none";
  }

  // إنشاء البطاقة
  document
    .getElementById("generate-btn")
    .addEventListener("click", generateCard);

  function generateCard() {
    const name = document.getElementById("name").value.trim();
    const recipientName = document
      .getElementById("recipient-name")
      .value.trim();

    if (!name && !recipientName) {
      alert("الرجاء إدخال اسم المُهدى إليه أو اسمك على الأقل");
      return;
    }

    if (name) {
        document.getElementById("display-name").textContent = name;
    }else{
        document.querySelector("p.from-name").style.display = 'none';
    }

    // Display recipient information
    const recipientDisplay = document.getElementById("recipient-display");
    recipientDisplay.innerHTML = "";

    if (recipientName || recipientImageUrl) {
      const recipientDiv = document.createElement("div");
      recipientDiv.style.margin = "15px 0";

      if (recipientImageUrl) {
        const img = document.createElement("img");
        img.src = recipientImageUrl;
        img.className = "recipient-image";
        img.alt = recipientName || "صورة المُهدى إليه";
        recipientDiv.appendChild(img);
      }

      if (recipientName) {
        const namePara = document.createElement("p");
        namePara.textContent = `${recipientName}`;
        recipientDiv.appendChild(namePara);
      }

      recipientDisplay.appendChild(recipientDiv);
    }

    const cardContainer = document.getElementById("card-container");
    cardContainer.style.display = "block";
    cardContainer.classList.add("fade-in");

    const giftButton = document.getElementById("gift-btn");

    if (recipientName.trim() !== "") {
      giftButton.style.display = "inline-block";
    } else {
      giftButton.style.display = "none";
    }

    // إزالة تأثير الحركة بعد الانتهاء منه
    setTimeout(() => {
      cardContainer.classList.remove("fade-in");
    }, 500);
  }

  // تحميل البطاقة كصورة
  document
    .getElementById("download-card")
    .addEventListener("click", function () {
      const card = document.getElementById("eid-card");
      html2canvas(card, { useCORS: true }).then((canvas) => {
        const link = document.createElement("a");
        link.download = "تهنئة-عيد-الأضحى.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    });

  // مشاركة عبر واتساب
  document
    .getElementById("whatsapp-share")
    .addEventListener("click", function () {
      const card = document.getElementById("eid-card");
      html2canvas(card).then((canvas) => {
        const name = document.getElementById("name").value.trim();
        const recipientName = document
          .getElementById("recipient-name")
          .value.trim();

        const shareUrl = `${
          window.location.href.split("?")[0]
        }?name=${encodeURIComponent(name)}&recipient=${encodeURIComponent(
          recipientName
        )}&dark=${darkMode}&music=${musicOn}${
          recipientImageUrl
            ? `&image=${encodeURIComponent(recipientImageUrl)}`
            : ""
        }`;

        const message = encodeURIComponent(
          `تهنئة عيد الأضحى المبارك ${
            recipientName ? `إلى ${recipientName} ` : ""
          } \n${shareUrl}`
        );

        // للأجهزة المحمولة
        if (
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
        ) {
          window.open(`whatsapp://send?text=${message}`);
        } else {
          // لأجهزة الكمبيوتر
          window.open(`https://api.whatsapp.com/send?text=${message}`);
        }
      });
    });

  // نسخ رابط المشاركة
  document
    .getElementById("copy-link")
    .addEventListener("click", function () {
      const name = document.getElementById("name").value.trim();
      const recipientName = document
        .getElementById("recipient-name")
        .value.trim();

      const shareUrl = `${
        window.location.href.split("?")[0]
      }?name=${encodeURIComponent(name)}&recipient=${encodeURIComponent(
        recipientName
      )}&dark=${darkMode}&music=${musicOn}${
        recipientImageUrl
          ? `&image=${encodeURIComponent(recipientImageUrl)}`
          : ""
      }`;

      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert("تم نسخ الرابط إلى الحافظة!");
        })
        .catch((err) => {
          console.error("فشل في النسخ: ", err);
          // Fallback for browsers that don't support clipboard API
          const tempInput = document.createElement("input");
          tempInput.value = shareUrl;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
          alert("تم نسخ الرابط إلى الحافظة!");
        });
    });
});