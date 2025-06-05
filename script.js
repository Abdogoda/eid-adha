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

  // تشغيل التكبيرات
  const musicToggle = document.querySelector(".music-toggle");
  const audio = document.getElementById("eid-audio");
  let musicOn = localStorage.getItem("musicOn") === "true";

  if (musicOn) {
    document.addEventListener("click", function handleClick() {
      audio.play().catch((e) => console.log("Auto-play prevented:", e));
      document.removeEventListener("click", handleClick);
    });
    musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else {
    musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
  }

  musicToggle.addEventListener("click", () => {
    musicOn = !musicOn;
    if (musicOn) {
      audio.play();
      musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      audio.pause();
      musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    localStorage.setItem("musicOn", musicOn);
  });

  // Image upload functionality
  const imageUpload = document.getElementById("image-upload");
  const recipientImageInput = document.getElementById("recipient-image");
  const imagePreviewContainer = document.getElementById(
    "image-preview-container"
  );
  const imagePreview = document.getElementById("image-preview");
  const removeImageBtn = document.getElementById("remove-image");
  let recipientImageUrl = null;

  imageUpload.addEventListener("click", () => {
    recipientImageInput.click();
  });

  recipientImageInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreviewContainer.style.display = "block";
        recipientImageUrl = e.target.result;
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  removeImageBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    imagePreview.src = "#";
    imagePreviewContainer.style.display = "none";
    recipientImageInput.value = "";
    recipientImageUrl = null;
  });

  // التحقق من وجود اسم في الرابط
  const urlParams = new URLSearchParams(window.location.search);
  const nameFromUrl = urlParams.get("name");
  const recipientNameFromUrl = urlParams.get("recipient");
  const imageFromUrl = urlParams.get("image");
  const darkModeFromUrl = urlParams.get("dark") === "true";
  const musicFromUrl = urlParams.get("music") === "true";

  // تطبيق الإعدادات من الرابط
  if (darkModeFromUrl && !darkMode) {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
    darkMode = true;
    localStorage.setItem("darkMode", "true");
  }

  if (musicFromUrl && !musicOn) {
    musicOn = true;
    audio.play().catch((e) => console.log("Auto-play prevented:", e));
    musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    localStorage.setItem("musicOn", "true");
  }

  // Play music if flag is on or if there's no name to share (on page refresh)
  if (
    (musicFromUrl ||
      musicOn ||
      (!nameFromUrl && !recipientNameFromUrl)) &&
    !audio.paused
  ) {
    audio.play().catch((e) => console.log("Auto-play prevented:", e));
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
          }من ${name}\n${shareUrl}`
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