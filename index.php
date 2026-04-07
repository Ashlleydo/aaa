<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jadwal Minum Obat</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header>
            <h1><i class="fas fa-pills"></i> Jadwal Minum Obat</h1>
            <div class="header-info">
                <span id="current-time"></span>
                <button id="add-btn" class="btn-primary">
                    <i class="fas fa-plus"></i> Tambah Jadwal
                </button>
            </div>
        </header>

        <div class="stats">
            <div class="stat-card">
                <i class="fas fa-check-circle"></i>
                <div>
                    <span id="completed-today">0</span>
                    <small>Sudah diminum hari ini</small>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-clock"></i>
                <div>
                    <span id="due-soon">0</span>
                    <small>Jadwal segera</small>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-list"></i>
                <div>
                    <span id="total-schedules">0</span>
                    <small>Total jadwal</small>
                </div>
            </div>
        </div>

        <div class="filter-tabs">
            <button class="tab active" data-filter="all">Semua</button>
            <button class="tab" data-filter="today">Hari Ini</button>
            <button class="tab" data-filter="pending">Belum Dicentang</button>
            <button class="tab" data-filter="completed">Sudah Dicentang</button>
        </div>

        <div class="schedule-list" id="schedule-list">
            <div class="empty-state">
                <i class="fas fa-calendar-plus"></i>
                <h3>Tidak ada jadwal</h3>
                <p>Tambahkan jadwal minum obat pertama Anda</p>
            </div>
        </div>
    </div>

    <!-- Modal Tambah/Edit -->
    <div id="schedule-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">Tambah Jadwal Baru</h2>
                <button class="close-btn" id="close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="schedule-form">
                <input type="hidden" id="edit-id">
                
                <div class="form-group">
                    <label><i class="fas fa-prescription-bottle-alt"></i> Nama Obat</label>
                    <input type="text" id="medicine-name" placeholder="Contoh: Paracetamol 500mg" required>
                </div>

                <div class="form-group">
                    <label><i class="fas fa-clock"></i> Waktu</label>
                    <input type="time" id="schedule-time" required>
                </div>

                <div class="form-group">
                    <label><i class="fas fa-calendar-alt"></i> Tanggal Mulai</label>
                    <input type="date" id="start-date" required>
                </div>

                <div class="form-group">
                    <label><i class="fas fa-calendar-check"></i> Tanggal Berhenti</label>
                    <input type="date" id="end-date">
                </div>

                <div class="form-group">
                    <label><i class="fas fa-repeat"></i> Pengulangan</label>
                    <select id="repeat-type" required>
                        <option value="daily">Setiap Hari</option>
                        <option value="weekly">Mingguan</option>
                        <option value="monthly">Bulanan</option>
                        <option value="once">Sekali</option>
                    </select>
                </div>

                <div class="form-group">
                    <label><i class="fas fa-info-circle"></i> Catatan</label>
                    <textarea id="notes" placeholder="Dosis, cara minum, dll..."></textarea>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancel-btn">Batal</button>
                    <button type="submit" class="btn-primary">Simpan Jadwal</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Notification -->
    <div id="notification" class="notification hidden">
        <i class="fas fa-bell"></i>
        <span id="notification-text"></span>
    </div>

    <script src="script.js"></script>
</body>
</html>