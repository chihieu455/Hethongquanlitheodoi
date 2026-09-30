        // State Management
        let currentUser = {
            role: 'guest',
            name: 'Chưa đăng nhập',
            email: '',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        };


        // Navigation Engine
        function navigate(pageId) {
            // Hide all pages
            const pages = document.querySelectorAll('.page-view');
            pages.forEach(p => p.classList.add('hidden'));

            // Target page
            const target = document.getElementById(`page-${pageId}`);
            if (target) {
                target.classList.remove('hidden');
            } else {
                document.getElementById('page-landing').classList.remove('hidden');
            }

            // Update active nav button
            const navButtons = document.querySelectorAll('.nav-btn');
            navButtons.forEach(btn => {
                if (btn.getAttribute('data-page') === pageId) {
                    btn.classList.add('active-nav');
                } else {
                    btn.classList.remove('active-nav');
                }
            });

            // Re-render charts if specific pages opened
            if (pageId === 'lec-analytics') renderLecCharts();
            if (pageId === 'adm-reports') renderAdmCharts();
            if (pageId === 'ai-class-analytics') renderAiCharts();

            // Auto close mobile sidebar
            if (window.innerWidth < 768) {
                document.getElementById('sidebar').classList.add('-translate-x-full');
            }
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('-translate-x-full');
        }

        // Role Management Engine
        function switchRoleDemo(role) {
            currentUser.role = role;
            if (role === 'student') {
                currentUser.name = 'Nguyễn Văn A';
                currentUser.email = 'sv001@edutrack.edu.vn';
            } else if (role === 'lecturer') {
                currentUser.name = 'ThS. Trần Văn B';
                currentUser.email = 'lecturer01@edutrack.edu.vn';
            } else if (role === 'admin') {
                currentUser.name = 'Quản Trị Viên (Admin)';
                currentUser.email = 'admin@edutrack.edu.vn';
            } else {
                currentUser.name = 'Chưa đăng nhập';
                currentUser.email = '';
            }

            updateUserUI();

            // Redirect to appropriate dashboard
            if (role === 'student') navigate('std-dashboard');
            else if (role === 'lecturer') navigate('lec-dashboard');
            else if (role === 'admin') navigate('adm-dashboard');
            else navigate('landing');

            showToast(`Đã chuyển sang vai trò: ${role.toUpperCase()}`, 'info');
        }

        function handleLoginFormSubmit(e) {
            e.preventDefault();
            const role = document.getElementById('login-role').value;
            const email = document.getElementById('login-email').value;
            loginUser(role, role === 'student' ? 'Nguyễn Văn A' : (role === 'lecturer' ? 'ThS. Trần Văn B' : 'Admin System'), email);
        }

        function loginUser(role, name, email) {
            currentUser = { role, name, email, avatar: currentUser.avatar };
            document.getElementById('role-select').value = role;
            updateUserUI();

            showToast(`Đăng nhập thành công! Xin chào ${name}`, 'success');

            if (role === 'student') navigate('std-dashboard');
            else if (role === 'lecturer') navigate('lec-dashboard');
            else if (role === 'admin') navigate('adm-dashboard');
        }

        function logoutUser() {
            currentUser = { role: 'guest', name: 'Chưa đăng nhập', email: '', avatar: currentUser.avatar };
            document.getElementById('role-select').value = 'guest';
            updateUserUI();
            navigate('landing');
            showToast('Đã đăng xuất khỏi hệ thống.', 'info');
        }

        function updateUserUI() {
            // Update Profile labels
            document.getElementById('user-name').innerText = currentUser.name;
            document.getElementById('user-role-lbl').innerText = currentUser.role.toUpperCase();

            // Profile page display
            const pName = document.getElementById('profile-display-name');
            if(pName) pName.innerText = currentUser.name;

            // Nav Group Visibility
            document.querySelectorAll('.nav-role-group').forEach(el => el.classList.add('hidden'));
            document.getElementById('nav-group-ai').classList.add('hidden');
            document.getElementById('nav-btn-profile').classList.add('hidden');
            document.getElementById('btn-logout').classList.add('hidden');

            if (currentUser.role !== 'guest') {
                document.getElementById('nav-group-ai').classList.remove('hidden');
                document.getElementById('nav-btn-profile').classList.remove('hidden');
                document.getElementById('btn-logout').classList.remove('hidden');
                document.getElementById('nav-btn-login').classList.add('hidden');
                document.getElementById('nav-btn-register').classList.add('hidden');
            } else {
                document.getElementById('nav-btn-login').classList.remove('hidden');
                document.getElementById('nav-btn-register').classList.remove('hidden');
            }

            if (currentUser.role === 'student') {
                document.getElementById('nav-group-student').classList.remove('hidden');
            } else if (currentUser.role === 'lecturer') {
                document.getElementById('nav-group-lecturer').classList.remove('hidden');
            } else if (currentUser.role === 'admin') {
                document.getElementById('nav-group-admin').classList.remove('hidden');
            }
        }

        // Toast Notification System
        function showToast(message, type = 'info') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            
            let bg = 'bg-slate-800 text-white';
            let icon = 'fa-info-circle';
            if (type === 'success') { bg = 'bg-emerald-600 text-white'; icon = 'fa-circle-check'; }
            if (type === 'error') { bg = 'bg-red-600 text-white'; icon = 'fa-circle-exclamation'; }
            if (type === 'info') { bg = 'bg-brand-600 text-white'; icon = 'fa-circle-info'; }

            toast.className = `${bg} p-3.5 rounded-2xl shadow-xl border border-white/20 text-xs font-bold flex items-center gap-2.5 transition-all duration-300 pointer-events-auto transform translate-y-2 opacity-0`;
            toast.innerHTML = `<i class="fa-solid ${icon} text-base"></i> <span>${message}</span>`;

            container.appendChild(toast);

            setTimeout(() => {
                toast.classList.remove('translate-y-2', 'opacity-0');
            }, 10);

            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }

        // Modal Handlers
        function openModal(id) {
            document.getElementById(id)?.classList.remove('hidden');
        }
        function closeModal(id) {
            document.getElementById(id)?.classList.add('hidden');
        }


// ---- Nạp các trang (partials) rồi khởi động ứng dụng ----
const PAGE_FILES = [
    'pages/public.html', 'pages/student.html', 'pages/lecturer.html',
    'pages/admin.html', 'pages/ai.html', 'pages/shared.html'
];
const MODAL_FILES = ['partials/modals.html'];

async function loadFiles(files) {
    const texts = await Promise.all(files.map(f => fetch(f).then(r => {
        if (!r.ok) throw new Error(f + ' -> ' + r.status);
        return r.text();
    })));
    return texts.join('\n');
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        document.querySelector('main').insertAdjacentHTML('beforeend', await loadFiles(PAGE_FILES));
        document.getElementById('modals-root').insertAdjacentHTML('beforeend', await loadFiles(MODAL_FILES));
    } catch (err) {
        document.querySelector('main').innerHTML =
            '<div class="p-6 text-sm text-red-600 font-bold">Không tải được giao diện: ' + err.message +
            '<br>Hãy chạy bằng Live Server (VS Code) hoặc GitHub Pages, không mở trực tiếp bằng file://</div>';
        return;
    }
    updateUserUI();
    navigate('landing');
});
