// Security Lab Engine & Vulnerability Simulation Matrix
// Mengelola 8 skenario kerentanan keamanan siber untuk modul latihan praktikum kampus fiktif.

const LAB_STORAGE_KEY = 'siakad_security_lab_v1';
const REVOKED_TOKENS_KEY = 'siakad_revoked_tokens_v1';
const FAILED_LOGINS_KEY = 'siakad_failed_logins_v1';

export const VULNERABILITY_KEYS = {
  SQLI: 'sqli',
  XSS: 'xss',
  IDOR: 'idor',
  CSRF: 'csrf',
  BRUTE_FORCE: 'brute_force',
  FILE_UPLOAD: 'file_upload',
  BROKEN_SESSION: 'broken_session',
  PRIV_ESC: 'priv_esc'
};

export const INITIAL_LAB_STATE = {
  // 1. SQL Injection
  [VULNERABILITY_KEYS.SQLI]: {
    id: VULNERABILITY_KEYS.SQLI,
    title: 'SQL Injection',
    category: 'A03:2021-Injection',
    mode: 'vulnerable', // 'vulnerable' | 'secure'
    exploited: false,
    description: 'Penyusupan sintaks SQL berbahaya ke dalam query database akibat konkatenasi string tanpa parameterisasi.',
    scenario: 'Form Login Portal SIAKAD & Pencarian KHS Mahasiswa.',
    payloadExample: "' OR '1'='1' --",
    targetEndpoint: 'POST /api/auth/login'
  },
  // 2. Stored XSS
  [VULNERABILITY_KEYS.XSS]: {
    id: VULNERABILITY_KEYS.XSS,
    title: 'Stored XSS (Cross-Site Scripting)',
    category: 'A03:2021-Injection',
    mode: 'vulnerable',
    exploited: false,
    description: 'Skrip berbahaya (JavaScript) tersimpan secara permanen di basis data forum/profil dan dieksekusi di browser korban.',
    scenario: 'Forum Diskusi Kuliah dan Kolom Bio Profil Mahasiswa.',
    payloadExample: "<img src=x onerror=\"window.labTriggerXss('XSS Stored Terpicu di Forum!')\" />",
    targetEndpoint: 'POST /api/discussions/reply'
  },
  // 3. IDOR / kontrol akses lemah
  [VULNERABILITY_KEYS.IDOR]: {
    id: VULNERABILITY_KEYS.IDOR,
    title: 'IDOR / Kontrol Akses Lemah',
    category: 'A01:2021-Broken Access Control',
    mode: 'vulnerable',
    exploited: false,
    description: 'Akses langsung ke objek data (KHS, nilai, berkas tugas mahasiswa lain) hanya dengan mengganti parameter ID tanpa verifikasi kepemilikan.',
    scenario: 'Pemeriksaan Lembar KHS Nilai & Pengunduhan Berkas Tugas.',
    payloadExample: "Ganti ?student_id=usr_mhs_02 saat login sebagai Mahasiswa 1",
    targetEndpoint: 'GET /api/grades/:student_id'
  },
  // 4. CSRF
  [VULNERABILITY_KEYS.CSRF]: {
    id: VULNERABILITY_KEYS.CSRF,
    title: 'CSRF (Cross-Site Request Forgery)',
    category: 'A01:2021-Broken Access Control',
    mode: 'vulnerable',
    exploited: false,
    description: 'Pemaksaan eksekusi aksi sensitif (ganti kata sandi/email) pada akun pengguna yang terautentikasi tanpa verifikasi token Anti-CSRF.',
    scenario: 'Modul Pengaturan Ganti Kata Sandi Mahasiswa / Dosen.',
    payloadExample: "Trigger simulasi POST submit form eksternal tanpa X-CSRF-Token",
    targetEndpoint: 'POST /api/user/change-password'
  },
  // 5. Percobaan sandi tanpa pembatasan
  [VULNERABILITY_KEYS.BRUTE_FORCE]: {
    id: VULNERABILITY_KEYS.BRUTE_FORCE,
    title: 'Percobaan Sandi Tanpa Pembatasan',
    category: 'A07:2021-Identification and Authentication Failures',
    mode: 'vulnerable',
    exploited: false,
    description: 'Tidak adanya batas percobaan login (rate limiting/lockout), memungkinkan serangan brute force atau kamus kata sandi otomatis.',
    scenario: 'Halaman Login Portal SIAKAD.',
    payloadExample: "Melakukan 10+ tebakan sandi berturut-turut tanpa jeda lockout",
    targetEndpoint: 'POST /api/auth/login'
  },
  // 6. Validasi berkas lemah
  [VULNERABILITY_KEYS.FILE_UPLOAD]: {
    id: VULNERABILITY_KEYS.FILE_UPLOAD,
    title: 'Validasi Berkas Lemah',
    category: 'A04:2021-Insecure Design',
    mode: 'vulnerable',
    exploited: false,
    description: 'Pengunggahan berkas tanpa validasi ekstensi, MIME type, atau konten berbahaya (.php, .exe, .sh, .html webshell).',
    scenario: 'Form Unggah Tugas Kuliah Mahasiswa.',
    payloadExample: "shell.php, exploit.html, script.sh",
    targetEndpoint: 'POST /api/assignments/upload'
  },
  // 7. Sesi tetap aktif setelah logout atau pergantian sandi
  [VULNERABILITY_KEYS.BROKEN_SESSION]: {
    id: VULNERABILITY_KEYS.BROKEN_SESSION,
    title: 'Sesi Tetap Aktif Pasca-Logout / Ganti Sandi',
    category: 'A07:2021-Identification and Authentication Failures',
    mode: 'vulnerable',
    exploited: false,
    description: 'Token otorisasi atau sesi lama tidak dinonaktifkan (revocation list) saat pengguna keluar atau mengubah kata sandi.',
    scenario: 'Alur Logout dan Riwayat Sesi Token Otorisasi.',
    payloadExample: "Gunakan token lama yang sudah di-logout untuk mengakses data privat",
    targetEndpoint: 'POST /api/auth/logout'
  },
  // 8. Eskalasi hak akses
  [VULNERABILITY_KEYS.PRIV_ESC]: {
    id: VULNERABILITY_KEYS.PRIV_ESC,
    title: 'Eskalasi Hak Akses (Privilege Escalation)',
    category: 'A01:2021-Broken Access Control',
    mode: 'vulnerable',
    exploited: false,
    description: 'Manipulasi data profil atau payload (misal: menyisipkan parameter role: "admin") sehingga akun biasa naik kelas menjadi administrator.',
    scenario: 'Form Sunting Profil Pengguna & Akses Menu Administrator.',
    payloadExample: 'Sisipkan parameter { "role": "admin" } pada data profil',
    targetEndpoint: 'PUT /api/user/profile'
  }
};

export const SecurityLabEngine = {
  getState() {
    const raw = localStorage.getItem(LAB_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(INITIAL_LAB_STATE));
      return INITIAL_LAB_STATE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_LAB_STATE;
    }
  },

  saveState(state) {
    localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(state));
  },

  toggleVulnerabilityMode(vulnKey) {
    const state = this.getState();
    if (state[vulnKey]) {
      state[vulnKey].mode = state[vulnKey].mode === 'vulnerable' ? 'secure' : 'vulnerable';
      this.saveState(state);
    }
    return state;
  },

  setAllModes(mode = 'vulnerable') {
    const state = this.getState();
    Object.keys(state).forEach((k) => {
      state[k].mode = mode;
    });
    this.saveState(state);
    return state;
  },

  markExploited(vulnKey, details = '') {
    const state = this.getState();
    if (state[vulnKey]) {
      state[vulnKey].exploited = true;
      state[vulnKey].lastExploitTime = new Date().toISOString();
      state[vulnKey].lastExploitDetails = details;
      this.saveState(state);
    }
    return state;
  },

  resetProgress() {
    localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(INITIAL_LAB_STATE));
    localStorage.removeItem(REVOKED_TOKENS_KEY);
    localStorage.removeItem(FAILED_LOGINS_KEY);
    return INITIAL_LAB_STATE;
  },

  // 1. EVALUASI SQL INJECTION
  evaluateSqlLogin(username, password, allUsers) {
    const state = this.getState();
    const isVulnerable = state[VULNERABILITY_KEYS.SQLI].mode === 'vulnerable';

    const cleanUser = (username || '').trim();
    const cleanPass = (password || '').trim();

    // Deteksi tanda-tanda payload SQL injection
    const sqliRegex = /('|--|#|\/\*|\*\/|union|select|or\s+['"\d\w]+=['"\d\w]+|or\s+1=1)/i;
    const isSqliAttempt = sqliRegex.test(cleanUser) || sqliRegex.test(cleanPass);

    if (isVulnerable) {
      // Simulasikan string concatenation query:
      // SELECT * FROM users WHERE username = '${cleanUser}' AND password = '${cleanPass}'
      if (
        cleanUser.includes("' OR '1'='1") ||
        cleanUser.includes("' OR 1=1") ||
        cleanUser.includes("' or 1=1") ||
        cleanUser.includes("' or '1'='1") ||
        cleanUser.includes("'--") ||
        cleanPass.includes("' OR '1'='1")
      ) {
        this.markExploited(
          VULNERABILITY_KEYS.SQLI,
          `Bypass otentikasi menggunakan payload: "${cleanUser}"`
        );
        // SQL injection bypass returns the first admin or user
        const targetUser = allUsers.find(u => u.role === 'admin') || allUsers[0];
        return {
          success: true,
          user: targetUser,
          isSqliBypass: true,
          message: 'SQL Injection berhasil! Otentikasi database berhasil dilewati via string concatenation query.'
        };
      }

      // Normal exact matching if not injected
      const found = allUsers.find(
        u => u.username.toLowerCase() === cleanUser.toLowerCase() && u.password === cleanPass
      );
      if (found) return { success: true, user: found, isSqliBypass: false };
      return { success: false, message: 'Nama pengguna atau kata sandi tidak valid.' };
    } else {
      // Mode Secure: Parameterized query simulation
      if (isSqliAttempt) {
        return {
          success: false,
          isSqliBlocked: true,
          message: 'Akses ditolak: Parameterized Query menolak karakter SQL berbahaya.'
        };
      }
      const found = allUsers.find(
        u => u.username.toLowerCase() === cleanUser.toLowerCase() && u.password === cleanPass
      );
      if (found) return { success: true, user: found };
      return { success: false, message: 'Nama pengguna atau kata sandi tidak valid.' };
    }
  },

  // 2. EVALUASI STORED XSS
  sanitizeOrExposeXss(rawContent) {
    const state = this.getState();
    const isVulnerable = state[VULNERABILITY_KEYS.XSS].mode === 'vulnerable';

    const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|onerror\s*=|onload\s*=|javascript:|alert\(|<img|<iframe|<svg/i;
    const hasXss = xssPattern.test(rawContent);

    if (isVulnerable) {
      if (hasXss) {
        this.markExploited(
          VULNERABILITY_KEYS.XSS,
          `Payload XSS tersimpan dalam basis data: "${rawContent.substring(0, 45)}..."`
        );
      }
      return {
        isVulnerable: true,
        renderedHtml: rawContent, // Rendered unsanitized
        hasXssDetected: hasXss
      };
    } else {
      // Secure mode: HTML entity encoding / sanitization
      const cleanHtml = (rawContent || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

      return {
        isVulnerable: false,
        renderedHtml: cleanHtml,
        hasXssDetected: false
      };
    }
  },

  // 3. EVALUASI IDOR
  evaluateIdorAccess(currentUser, targetUserId) {
    const state = this.getState();
    const isVulnerable = state[VULNERABILITY_KEYS.IDOR].mode === 'vulnerable';

    const isOwnData = currentUser && currentUser.id === targetUserId;
    const isPrivileged = currentUser && (currentUser.role === 'dosen' || currentUser.role === 'admin');

    if (isVulnerable) {
      if (!isOwnData && !isPrivileged) {
        this.markExploited(
          VULNERABILITY_KEYS.IDOR,
          `Pengguna ${currentUser.nama} mengakses data privat milik ${targetUserId}`
        );
      }
      return {
        allowed: true,
        isIdorBreach: !isOwnData && !isPrivileged,
        message: !isOwnData && !isPrivileged
          ? 'Kerentanan IDOR Terbuka: Mahasiswa dapat mengintip rekaman akademik pengguna lain.'
          : 'Akses diizinkan.'
      };
    } else {
      // Secure mode: Strict ownership and RBAC enforcement
      if (isOwnData || isPrivileged) {
        return { allowed: true, isIdorBreach: false, message: 'Akses terverifikasi.' };
      }
      return {
        allowed: false,
        isIdorBreach: false,
        message: '403 Forbidden: Kontrol akses ketat mencegah Anda melihat KHS mahasiswa lain.'
      };
    }
  },

  // 4. EVALUASI CSRF
  evaluateCsrfAction(headers, currentCsrfToken) {
    const state = this.getState();
    const isVulnerable = state[VULNERABILITY_KEYS.CSRF].mode === 'vulnerable';

    const providedToken = headers?.['X-CSRF-Token'] || headers?.['csrf-token'];

    if (isVulnerable) {
      // Mode vulnerable: no token check!
      if (!providedToken) {
        this.markExploited(
          VULNERABILITY_KEYS.CSRF,
          'Aksi sensitif (ganti sandi/email) diproses tanpa Anti-CSRF Token'
        );
      }
      return {
        success: true,
        isCsrfExploit: !providedToken,
        message: !providedToken
          ? 'Kerentanan CSRF Terbukti: Permintaan tanpa token Anti-CSRF berhasil diproses server!'
          : 'Aksi diproses.'
      };
    } else {
      // Secure mode: CSRF Token must match
      if (!providedToken || providedToken !== currentCsrfToken) {
        return {
          success: false,
          isCsrfBlocked: true,
          message: '403 Forbidden: CSRF Token tidak valid atau hilang. Permintaan ditolak!'
        };
      }
      return { success: true, message: 'Otorisasi CSRF valid.' };
    }
  },

  // 5. EVALUASI RATE LIMITING (BRUTE FORCE)
  evaluateLoginRateLimit(ipOrUsername) {
    const state = this.getState();
    const isVulnerable = state[VULNERABILITY_KEYS.BRUTE_FORCE].mode === 'vulnerable';

    const key = `fail_${ipOrUsername}`;
    const rawFails = localStorage.getItem(FAILED_LOGINS_KEY);
    let failsMap = rawFails ? JSON.parse(rawFails) : {};

    if (isVulnerable) {
      // Unlimited attempts!
      const count = (failsMap[key]?.count || 0) + 1;
      failsMap[key] = { count, lastAttempt: Date.now() };
      localStorage.setItem(FAILED_LOGINS_KEY, JSON.stringify(failsMap));

      if (count >= 5) {
        this.markExploited(
          VULNERABILITY_KEYS.BRUTE_FORCE,
          `Percobaan sandi tanpa pembatasan terdeteksi: ${count} kali percobaan gagal tanpa penguncian.`
        );
      }
      return {
        allowed: true,
        count,
        isRateLimitWarning: count >= 5,
        message: `Percobaan ke-${count}. Mode Rentan: Tidak ada batasan login / CAPTCHA.`
      };
    } else {
      // Secure mode: Lockout after 5 attempts for 60 seconds
      const record = failsMap[key] || { count: 0, lockoutUntil: 0 };
      const now = Date.now();

      if (record.lockoutUntil > now) {
        const remainingSec = Math.ceil((record.lockoutUntil - now) / 1000);
        return {
          allowed: false,
          isLocked: true,
          remainingSec,
          message: `Akun dikunci sementara akibat 5 kegagalan berturut-turut. Tunggu ${remainingSec} detik.`
        };
      }

      record.count += 1;
      if (record.count >= 5) {
        record.lockoutUntil = now + 60000; // 60s lockout
        record.count = 0;
      }
      failsMap[key] = record;
      localStorage.setItem(FAILED_LOGINS_KEY, JSON.stringify(failsMap));

      if (record.lockoutUntil > now) {
        return {
          allowed: false,
          isLocked: true,
          remainingSec: 60,
          message: 'Batas percobaan terlampaui. Akun dikunci selama 60 detik demi keamanan.'
        };
      }

      return {
        allowed: true,
        count: record.count,
        message: `Sisa percobaan sebelum akun dikunci: ${5 - record.count}`
      };
    }
  },

  resetFailedLogins(ipOrUsername) {
    const rawFails = localStorage.getItem(FAILED_LOGINS_KEY);
    if (!rawFails) return;
    const failsMap = JSON.parse(rawFails);
    delete failsMap[`fail_${ipOrUsername}`];
    localStorage.setItem(FAILED_LOGINS_KEY, JSON.stringify(failsMap));
  },

  // 6. EVALUASI FILE UPLOAD
  evaluateFileUpload(fileName, fileSizeMb, mimeType) {
    const state = this.getState();
    const isVulnerable = state[VULNERABILITY_KEYS.FILE_UPLOAD].mode === 'vulnerable';

    const ext = (fileName.split('.').pop() || '').toLowerCase();
    const dangerousExtensions = ['php', 'phtml', 'exe', 'sh', 'bash', 'py', 'js', 'html', 'svg', 'jsp', 'cgi'];
    const isDangerous = dangerousExtensions.includes(ext);

    if (isVulnerable) {
      // Accepts anything!
      if (isDangerous) {
        this.markExploited(
          VULNERABILITY_KEYS.FILE_UPLOAD,
          `Pengunggahan berkas berbahaya berhasil lolos: "${fileName}" (Ekstensi .${ext})`
        );
      }
      return {
        accepted: true,
        isDangerousAccepted: isDangerous,
        message: isDangerous
          ? `Peringatan Keamanan Lab: Berkas berbahaya .${ext} berhasil diunggah tanpa validasi!`
          : 'Berkas berhasil diunggah.'
      };
    } else {
      // Secure mode: Whitelist only .pdf, .docx, .zip
      const allowedWhitelist = ['pdf', 'docx', 'zip'];
      if (!allowedWhitelist.includes(ext) || fileSizeMb > 15) {
        return {
          accepted: false,
          isDangerousBlocked: true,
          message: `Gagal: Kebijakan keamanan hanya mengizinkan berkas (.pdf, .docx, .zip) dengan batas maksimal 15MB.`
        };
      }
      return { accepted: true, message: 'Validasi berkas ketat terpenuhi.' };
    }
  },

  // 7. EVALUASI BROKEN SESSION MANAGEMENT
  revokeSessionToken(token) {
    const raw = localStorage.getItem(REVOKED_TOKENS_KEY);
    const tokens = raw ? JSON.parse(raw) : [];
    if (!tokens.includes(token)) {
      tokens.push(token);
      localStorage.setItem(REVOKED_TOKENS_KEY, JSON.stringify(tokens));
    }
  },

  evaluateSessionToken(token) {
    const state = this.getState();
    const isVulnerable = state[VULNERABILITY_KEYS.BROKEN_SESSION].mode === 'vulnerable';

    const raw = localStorage.getItem(REVOKED_TOKENS_KEY);
    const revokedTokens = raw ? JSON.parse(raw) : [];
    const isRevoked = revokedTokens.includes(token);

    if (isVulnerable) {
      // Vulnerable: Old session token still accepted even after logout or password change!
      if (isRevoked) {
        this.markExploited(
          VULNERABILITY_KEYS.BROKEN_SESSION,
          `Replay token kedaluwarsa berhasil: Token pasca-logout tetap diizinkan server.`
        );
      }
      return {
        valid: true,
        isReplayAccepted: isRevoked,
        message: isRevoked
          ? 'Kerentanan Sesi Terbuka: Token sesi lama pasca-logout masih dapat digunakan!'
          : 'Sesi aktif.'
      };
    } else {
      // Secure: Revoked tokens are immediately rejected
      if (isRevoked) {
        return {
          valid: false,
          isSessionRevoked: true,
          message: '401 Unauthorized: Sesi telah kedaluwarsa atau dinonaktifkan pasca-logout.'
        };
      }
      return { valid: true, message: 'Sesi valid.' };
    }
  },

  // 8. EVALUASI ESKALASI HAK AKSES
  evaluatePrivilegeEscalation(currentUser, updatePayload) {
    const state = this.getState();
    const isVulnerable = state[VULNERABILITY_KEYS.PRIV_ESC].mode === 'vulnerable';

    const targetRole = updatePayload?.role;
    const isElevating = targetRole && targetRole !== currentUser.role && targetRole === 'admin';

    if (isVulnerable) {
      if (isElevating) {
        this.markExploited(
          VULNERABILITY_KEYS.PRIV_ESC,
          `Akun ${currentUser.nama} berhasil menaikkan status menjadi Administrator via Mass Assignment.`
        );
      }
      return {
        allowed: true,
        isPrivEscExploited: isElevating,
        updatedRole: isElevating ? 'admin' : (targetRole || currentUser.role),
        message: isElevating
          ? 'Eskalasi Hak Akses Berhasil: Parameter role "admin" diterima tanpa otorisasi bertingkat!'
          : 'Profil diperbarui.'
      };
    } else {
      // Secure: Role field is strictly immutable by end-users
      if (isElevating) {
        return {
          allowed: false,
          isBlocked: true,
          updatedRole: currentUser.role,
          message: '403 Forbidden: Anda tidak memiliki otoritas mengubah hak akses (Privilege Escalation ditolak).'
        };
      }
      return {
        allowed: true,
        updatedRole: currentUser.role,
        message: 'Profil berhasil diperbarui dengan aman.'
      };
    }
  }
};
