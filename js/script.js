document.addEventListener("DOMContentLoaded", function () {
  // =====================
  // HALAMAN LOGIN
  // =======================

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      //  penggunaan data Pengguna dari file data.js
      if (typeof dataPengguna !== "undefined") {
        const user = dataPengguna.find(
          (u) => u.email === email && u.password === password,
        );
        if (user) {
          localStorage.setItem("namaUser", user.nama);
          Swal.fire({
            title: "Login Berhasil",
            text: `Selamat Datang, ${user.name}!`,
            icon: "Success",
            confirmButtonColor: "blue",
            confirmButtonText: "Lanjutkan",
          }).then(() => (window.location.href = "dashboard.html"));
        } else {
          Swal.fire({
            title: "Login Gagal!",
            text: "Email atau Password salah. Silahkan coba lagi...",
            icon: "error",
            confirmButtonColor: "#1e3a8a",
            confirmButtonText: "OK",
          });
        }
      }
    });
  }

  // Lupa Password dan Buat Akun
  const forgetPassword = document.getElementById("forgetPassword");
  const registerLink = document.getElementById("registerLink");
  if (forgetPassword) {
    forgetPassword.addEventListener("click", (e) => {
      e.preventDefault();
      Swal.fire({
        title: "Lupa Password?",
        text: "Silahkan hubungi admin UT untuk reset password",
        icon: "info",
      });
    });
  }
  if (registerLink) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      Swal.fire({
        title: "Buat Akun Baru",
        text: "Kunjungi laman MyUT untuk membuat akun baru",
        icon: "question",
      });
    });
  }
  // =============================
  // HALAMAN DASHBOARD.HTML
  // =================================

  const dropDownBtn = document.querySelector(".dropdown");
  const dropDownMenu = document.querySelector(".dropdown-menu");

  if (dropDownBtn && dropDownMenu) {
    dropDownBtn.addEventListener("click", (e) => {
      dropDownMenu.classList.toggle("hidden");
      dropDownMenu.classList.toggle("flex");
    });
  }

  // Logout Button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Swal.fire({
        title: "Anda yakin ingin logout?",
        text: "Anda akan keluar dari sistem",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f97316",
        cancelButtonColor: "#d33",
        confirmButtonText: "Logout",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("namaUser");
          Swal.fire({
            title: "Logout Berhasil",
            text: "Anda telah keluar",
            icon: "info",
            confirmButtonColor: "#1e3a8a",
          }).then(() => (window.location.href = "login.html"));
        }
      });
    });

    const greeting = document.getElementById("greeting");
    if (greeting) {
      const namaUser = localStorage.getItem("namaUser");
      const hour = new Date().getHours();
      let timeOfDay =
        hour > 11
          ? "Selamat Pagi"
          : hour < 15
            ? "Selamat Siang"
            : hour < 19
              ? "Selamat sore"
              : "Selamat Malam";

      if (greeting.classList.contains("text-4xl")) {
        greeting.innerHTML = `${timeOfDay}. <span>!<br><span class="text-2xl font-normal text-gray-700"Selamat datang di Dashboard SITTA UT</span>`;
      } else {
        greeting.textContent = `${timeOfDay}, ${namaUser}! \nSelamat datang di Dashboard SITTA UT`;
      }
    }
  }

  // ==================
  // Stok.html
  // ==================
  const stokForm = document.getElementById("stokForm");
  const stockTableBody = document.getElementById("stockTableBody");

  if (stokForm && stockTableBody) {
    const renderStockRow = (item) => {
      const row = document.createElement("tr");
      row.className = "border-b border-gray-200";
      row.innerHTML = `
        <td class="p-3">${item.kodeLokasi}</td>
        <td class="p-3">${item.kodeBarang}</td>
        <td class="p-3">${item.namaBarang}</td>
        <td class="p-3">${item.jenisBarang}</td>
        <td class="p-3">${item.edisi}</td>
        <td class="p-3">${item.stok}</td>
        <td class="p-3">${item.cover}</td>
      `;
      stockTableBody.appendChild(row);
    };

    const renderStockTable = () => {
      stockTableBody.innerHTML = "";
      if (
        typeof dataBahanAjar !== "undefined" &&
        Array.isArray(dataBahanAjar)
      ) {
        dataBahanAjar.forEach(renderStockRow);
      }
    };

    renderStockTable();

    stokForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const kode = document.getElementById("kode").value.trim();
      const nama = document.getElementById("nama").value.trim();
      const stok = parseInt(document.getElementById("stok").value, 10);
      const lokasi = document.getElementById("lokasi").value.trim();
      const coverInput = document.getElementById("cover").value.trim();

      if (!kode || !nama || Number.isNaN(stok) || stok < 0 || !lokasi) {
        Swal.fire({
          title: "Data Tidak Lengkap",
          text: "Pastikan semua field terisi dengan benar.",
          icon: "warning",
          confirmButtonColor: "#f97316",
        });
        return;
      }

      const newItem = {
        kodeLokasi: lokasi,
        kodeBarang: kode,
        namaBarang: nama,
        jenisBarang: "BMP",
        edisi: "1",
        stok,
        cover: coverInput
          ? coverInput.split("\\").pop().split("/").pop()
          : "img/cover-default.jpg",
      };

      if (
        typeof dataBahanAjar !== "undefined" &&
        Array.isArray(dataBahanAjar)
      ) {
        dataBahanAjar.push(newItem);
      }

      renderStockRow(newItem);
      stokForm.reset();
      Swal.fire({
        title: "Berhasil ditambahkan",
        text: "Baris stok baru ditambahkan ke tabel.",
        icon: "success",
        confirmButtonColor: "#1e3a8a",
      });
    });
  }

  // ==================
  // Tracking.html
  // =======================

  const findBtn = document.getElementById("findBtn");
  const inputDO = document.getElementById("inputDO");
  if (findBtn && inputDO) {
    // Cari dengan tombol enter
    inputDO.addEventListener("keypress", function (e) {
      if (e.key === "Enter") findBtn.click();
    });

    findBtn.addEventListener("click", () => {
      const doNumber = inputDO.value.trim();
      const resultContainer = document.getElementById("trackingResult");

      if (!resultContainer) return;
      resultContainer.innerHTML = "";

      if (!doNumber) {
        Swal.fire({
          title: "Nomor DO Kosong",
          text: "Masukkan Nomor DO terlebih dahulu.",
          icon: "warning",
          confirmButtonColor: "#f97316",
        });
        return;
      }

      if (typeof dataTracking === "undefined") {
        Swal.fire({
          title: "Error",
          text: "Data sistem belum dimuat.",
          icon: "error",
        });
        return;
      }

      const data = dataTracking[doNumber];
      if (!data) {
        Swal.fire({
          title: "Data Tidak Ditemukan",
          text: `Nomor DO ${doNumber} tidak tersedia.`,
          icon: "error",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

      // Jika pakai desain tailwind baru
      if (resultContainer.classList.contains("max-w-3xl")) {
        const perjalananHTML = data.perjalanan
          .map(
            (item) => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <span class="text-xs font-bold text-orange-500 mb-1 block"><i class="fa-regular fa-clock mr-1"></i> ${item.waktu}</span>
                            <p class="text-sm text-gray-700">${item.keterangan}</p>
                        </div>
                    </div>
                `,
          )
          .join("");

        // Map status text to visual classes (supports custom classes added in style.css)
        const statusLower = data.status.toLowerCase();
        let statusColor = "bg-blue-100 text-blue-800 border-blue-200";
        if (statusLower.includes("dalam perjalanan")) {
          statusColor = "status-dalam-perjalanan";
        } else if (statusLower.includes("dikirim")) {
          statusColor = "status-dikirim";
        } else if (statusLower.includes("dikemas")) {
          statusColor = "status-dikemas";
        } else if (statusLower.includes("selesai")) {
          statusColor = "status-selesai";
        } else if (statusLower.includes("proses")) {
          statusColor = "status-proses";
        }

        resultContainer.innerHTML = `
                    <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-6 animate-[fadeIn_0.5s_ease-out]">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-5 mb-6 gap-4">
                            <div>
                                <h3 class="text-xl font-bold text-blue-900">Detail Pengiriman</h3>
                                <p class="text-sm text-gray-500 mt-1">Nomor DO: <span class="font-bold text-gray-800">${data.nomorDO}</span></p>
                            </div>
                            <span class="px-4 py-1.5 rounded-full text-sm font-semibold border ${statusColor}">${data.status}</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <div class="flex flex-col"><span class="text-xs text-gray-500 mb-1 uppercase font-semibold">Penerima</span><span class="text-sm font-medium text-gray-800">${data.nama}</span></div>
                            <div class="flex flex-col"><span class="text-xs text-gray-500 mb-1 uppercase font-semibold">Ekspedisi</span><span class="text-sm font-medium text-gray-800"><i class="fa-solid fa-truck text-orange-500 mr-2"></i>${data.ekspedisi}</span></div>
                            <div class="flex flex-col"><span class="text-xs text-gray-500 mb-1 uppercase font-semibold">Tanggal Kirim</span><span class="text-sm font-medium text-gray-800">${data.tanggalKirim}</span></div>
                            <div class="flex flex-col"><span class="text-xs text-gray-500 mb-1 uppercase font-semibold">Kode Paket</span><span class="text-sm font-medium text-gray-800">${data.paket}</span></div>
                            <div class="flex flex-col"><span class="text-xs text-gray-500 mb-1 uppercase font-semibold">Total Biaya</span><span class="text-sm font-medium text-gray-800">${data.total}</span></div>
                            
                        </div>
                        <h4 class="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2"><i class="fa-solid fa-route text-orange-500"></i> Riwayat Perjalanan</h4>
                        <div class="timeline">${perjalananHTML}</div>
                    </div>
                `;
      } else {
        // Jika pakai CSS lama
        const perjalananHTML = data.perjalanan
          .map(
            (item) => `
                    <li>
                        <div class="timeline-dot"></div>
                        <div class="timeline-info">
                            <span class="timeline-time">${item.waktu}</span>
                            <p class="timeline-text">${item.keterangan}</p>
                        </div>
                    </li>
                `,
          )
          .join("");

        resultContainer.innerHTML = `
                    <div class="tracking-card">
                        <h3>Detail Pengiriman</h3>
                        <div class="tracking-info">
                            <p><b>Nomor DO:</b> ${data.nomorDO}</p>
                            <p><b>Nama:</b> ${data.nama}</p>
                            <p><b>Status:</b> <span class="status">${data.status}</span></p>
                            <p><b>Ekspedisi:</b> ${data.ekspedisi}</p>
                            <p><b>Tanggal Kirim:</b> ${data.tanggalKirim}</p>
                        </div>
                        <h4>Riwayat Perjalanan</h4>
                        <ul class="timeline">${perjalananHTML}</ul>
                    </div>
                `;
      }
      // Untuk cabang CSS lama: terapkan kelas berdasarkan teks pada elemen dengan class "status"
      const statusSpanElem = resultContainer.querySelector(".status");
      if (statusSpanElem) {
        const st = statusSpanElem.textContent.trim().toLowerCase();
        if (st.includes("dalam perjalanan"))
          statusSpanElem.classList.add("status-dalam-perjalanan");
        else if (st.includes("dikirim"))
          statusSpanElem.classList.add("status-dikirim");
        else if (st.includes("dikemas"))
          statusSpanElem.classList.add("status-dikemas");
        else if (st.includes("selesai"))
          statusSpanElem.classList.add("status-selesai");
        else if (st.includes("proses"))
          statusSpanElem.classList.add("status-proses");
      }
    });
  }
  // =================
  // Tracking.html
  // =================
});
