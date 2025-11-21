import { auth } from "../utils/auth.js";
import { renderAccountPage } from "./account.js";

export function renderEditProfilePage() {
    const app = document.getElementById("app-content");
    if (!app) return;

    const user = auth.getUser();

    if (!user) {
        window.location.hash = "#login";
        return;
    }

    const currentImage = user.profileImage || "public/default-avatar.png";

    app.innerHTML = `
        <div class="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl">
            <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit Profil</h2>

            <div class="flex justify-center mb-4">
                <img id="profile-preview"
                     src="${currentImage}"
                     class="w-28 h-28 rounded-full object-cover border shadow">
            </div>

            <label class="block mb-4">
                <span class="text-gray-700 dark:text-gray-300">Foto Profil</span>
                <input id="edit-image" type="file" accept="image/*"
                       class="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white">
            </label>

            <div class="space-y-4">

                <label class="block">
                    <span class="text-gray-700 dark:text-gray-300">Username</span>
                    <input id="edit-username"
                           type="text"
                           class="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
                           value="${user.username}">
                </label>

                <label class="block">
                    <span class="text-gray-700 dark:text-gray-300">Email</span>
                    <input id="edit-email"
                           type="email"
                           class="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
                           value="${user.email}">
                </label>

                <div class="flex gap-3 pt-2">
                    <button id="save-profile"
                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Simpan
                    </button>

                    <button id="cancel-edit"
                        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        Batal
                    </button>
                </div>
            </div>
        </div>
    `;

    const imageInput = document.getElementById("edit-image");
    const preview = document.getElementById("profile-preview");

    imageInput.onchange = () => {
        const file = imageInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            preview.src = reader.result;
        };
        reader.readAsDataURL(file);
    };

    document.getElementById("cancel-edit").onclick = () => {
        window.location.hash = "#edit-profile";
        window.location.hash = "#akun";
        renderAccountPage();
    };

    document.getElementById("save-profile").onclick = () => {
        const newName = document.getElementById("edit-username").value.trim();
        const newEmail = document.getElementById("edit-email").value.trim();

        if (newName.length < 3) {
            alert("Username minimal 3 karakter.");
            return;
        }
        if (!newEmail.includes("@")) {
            alert("Email tidak valid.");
            return;
        }

        let profileImage = user.profileImage || null;

        if (imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                profileImage = reader.result;
                saveProfile(newName, newEmail, profileImage);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            saveProfile(newName, newEmail, profileImage);
        }
    };

    function saveProfile(name, email, img) {
        const updated = {
            ...user,
            username: name,
            email: email,
            profileImage: img,
        };

        localStorage.setItem("komikita-user", JSON.stringify(updated));

        window.location.hash = "#akun";
        renderAccountPage();
    }
}
