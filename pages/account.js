import { auth } from "../utils/auth.js";
import { renderNavbar } from "../components/navbar.js";

export function renderAccountPage() {
  const appContent = document.getElementById("app-content");
  if (!appContent) return;

  if (!auth.isLoggedIn()) {
    window.location.hash = "#login";
    return;
  }

  const user = auth.getUser();

  const username = user?.username || "Pengguna";
  const email = user?.email || "Belum diatur";
  const joined = user?.joined || "Tidak diketahui";
  const bookmarks = user?.bookmarks?.length || 0;
  const totalRead = user?.totalRead || 0;
  const profileImage = user?.profileImage || "public/default-avatar.png";

  const getRank = (read) => {
    if (read > 200) return { name: "Comic Master", color: "text-yellow-500 dark:text-yellow-300" };
    if (read > 100) return { name: "Super Fan", color: "text-purple-600 dark:text-purple-300" };
    if (read > 50) return { name: "Fan", color: "text-blue-600 dark:text-blue-300" };
    return { name: "Reader", color: "text-gray-700 dark:text-gray-300" };
  };

  const rank = getRank(totalRead);

  appContent.className = `
    px-4 py-8 animate-[fadeIn_0.6s_ease]
    bg-gray-100 text-gray-800
    dark:bg-[#0d0f1a] dark:text-gray-200
    min-h-screen
  `;

  appContent.innerHTML = `
    <div class="w-full max-w-xl mx-auto mb-6 rounded-3xl overflow-hidden shadow-xl
        border border-black/10 dark:border-white/10">
        <img src="public/account-img.jpg" class="w-full h-32 object-cover" />
    </div>

    <div class="max-w-xl mx-auto p-8 rounded-3xl shadow-xl
        bg-white/80 backdrop-blur-xl border border-black/10
        dark:bg-white/5 dark:border-white/10">

        <div class="flex flex-col items-center text-center mb-8">

            <div class="w-28 h-28 rounded-full overflow-hidden shadow-lg ring-4 ring-purple-300/40 dark:ring-primary/30">
                <img src="${profileImage}" class="w-full h-full object-cover" />
            </div>

            <h2 class="text-3xl font-extrabold mt-5 tracking-tight text-gray-900 dark:text-white">
                ${username}
            </h2>

            <p class="mt-2 text-sm font-semibold ${rank.color}">
                ⭐ ${rank.name}
            </p>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-10">
            <div class="p-4 rounded-2xl text-center shadow-md bg-gray-200/70 dark:bg-white/5">
                <p class="text-purple-600 dark:text-purple-300 text-2xl font-bold">${bookmarks}</p>
                <p class="text-gray-600 text-xs dark:text-gray-300">Bookmark</p>
            </div>

            <div class="p-4 rounded-2xl text-center shadow-md bg-gray-200/70 dark:bg-white/5">
                <p class="text-purple-600 dark:text-purple-300 text-2xl font-bold">${totalRead}</p>
                <p class="text-gray-600 text-xs dark:text-gray-300">Dibaca</p>
            </div>

            <div class="p-4 rounded-2xl text-center shadow-md bg-gray-200/70 dark:bg-white/5">
                <p class="text-purple-600 dark:text-purple-300 text-2xl font-bold">
                    ${rank.name.split(" ")[0]}
                </p>
                <p class="text-gray-600 text-xs dark:text-gray-300">Rank</p>
            </div>
        </div>

        <div class="p-6 rounded-2xl shadow-md bg-gray-200/70 dark:bg-white/5 mb-10">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Informasi Pengguna</h3>

            <div class="space-y-4">
                <div class="flex justify-between">
                    <span>Username</span>
                    <span class="font-semibold text-purple-700 dark:text-purple-300">
                        ${username}
                    </span>
                </div>

                <div class="flex justify-between">
                    <span>Email</span>
                    <span class="font-semibold text-purple-700 dark:text-purple-300">
                        ${email}
                    </span>
                </div>

                <div class="flex justify-between">
                    <span>Tanggal Bergabung</span>
                    <span class="font-semibold">${joined}</span>
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <button id="edit-profile" class="w-full py-3 rounded-xl font-semibold bg-purple-600 text-white">
                Edit Profil
            </button>

            <button id="change-password" class="w-full py-3 rounded-xl font-semibold bg-gray-400 dark:bg-gray-700">
                Ganti Password
            </button>

            <button id="logout-button" class="w-full py-3 rounded-xl font-semibold bg-red-600 text-white">
                Logout
            </button>
        </div>

    </div>
  `;

  document.getElementById("edit-profile")?.addEventListener("click", () => {
    window.location.hash = "#edit-profile"; // FIXED HASH
  });

  document.getElementById("logout-button")?.addEventListener("click", handleLogout);
}

function handleLogout() {
  auth.logout();
  renderNavbar();
  alert("Anda telah logout.");
  window.location.hash = "#home";
}
