class ObatReminder {
    constructor() {
        this.schedules = JSON.parse(localStorage.getItem('obatSchedules')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateClock();
        this.renderSchedules();
        this.updateStats();
        setInterval(() => this.updateClock(), 1000);
    }

    bindEvents() {
        // Add button
        document.getElementById('add-btn').addEventListener('click', () => this.openModal());

        // Modal events
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancel-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('schedule-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Filter tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.applyFilter(e.currentTarget.dataset.filter);
            });
        });

        // Close modal on outside click
        document.getElementById('schedule-modal').addEventListener('click', (e) => {
            if (e.target.id === 'schedule-modal') this.closeModal();
        });
    }

    updateClock() {
        const now = new Date();
        document.getElementById('current-time').textContent = now.toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    openModal(editSchedule = null) {
        const modal = document.getElementById('schedule-modal');
        const form = document.getElementById('schedule-form');
        
        // Reset form
        form.reset();
        document.getElementById('edit-id').value = '';
        document.getElementById('modal-title').textContent = 'Tambah Jadwal Baru';

        if (editSchedule) {
            // Populate form for editing
            document.getElementById('edit-id').value = editSchedule.id;
            document.getElementById('medicine-name').value = editSchedule.name;
            document.getElementById('schedule-time').value = editSchedule.time;
            document.getElementById('start-date').value = editSchedule.startDate;
            document.getElementById('end-date').value = editSchedule.endDate || '';
            document.getElementById('repeat-type').value = editSchedule.repeat;
            document.getElementById('notes').value = editSchedule.notes || '';
            document.getElementById('modal-title').textContent = 'Edit Jadwal';
        }

        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('schedule-modal').classList.remove('active');
    }

    handleFormSubmit() {
        const id = document.getElementById('edit-id').value;
        const scheduleData = {
            id: id || Date.now().toString(),
            name: document.getElementById('medicine-name').value,
            time: document.getElementById('schedule-time').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value || null,
            repeat: document.getElementById('repeat-type').value,
            notes: document.getElementById('notes').value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        if (id) {
            // Update existing
            const index = this.schedules.findIndex(s => s.id === id);
            if (index !== -1) {
                this.schedules[index] = scheduleData;
                this.showNotification('Jadwal berhasil diupdate!');
            }
        } else {
            // Add new
            this.schedules.push(scheduleData);
            this.showNotification('Jadwal baru berhasil ditambahkan!');
        }

        this.saveSchedules();
        this.renderSchedules();
        this.updateStats();
        this.closeModal();
    }

    deleteSchedule(id) {
        if (confirm('Hapus jadwal ini?')) {
            this.schedules = this.schedules.filter(s => s.id !== id);
            this.saveSchedules();
            this.renderSchedules();
            this.updateStats();
            this.showNotification('Jadwal dihapus!');
        }
    }

    toggleComplete(id) {
        const schedule = this.schedules.find(s => s.id === id);
        if (schedule) {
            schedule.completed = !schedule.completed;
            this.saveSchedules();
            this.renderSchedules();
            this.updateStats();
            this.showNotification(schedule.completed ? 'Obat sudah dicentang!' : 'Jadwal dibatalkan centang');
        }
    }

    editSchedule(id) {
        const schedule = this.schedules.find(s => s.id === id);
        if (schedule) {
            this.openModal(schedule);
        }
    }

    applyFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        this.renderSchedules();
    }

    getFilteredSchedules() {
        let filtered = [...this.schedules];

        // Sort by time
        filtered.sort((a, b) => a.time.localeCompare(b.time));

        switch (this.currentFilter) {
            case 'today':
                const today = new Date().toISOString().split('T')[0];
                filtered = filtered.filter(s => {
                    const start = new Date(s.startDate);
                    return start.toISOString().split('T')[0] === today;
                });
                break;
            case 'pending':
                filtered = filtered.filter(s => !s.completed);
                break;
            case 'completed':
                filtered = filtered.filter(s => s.completed);
                break;
        }

        return filtered;
    }

    renderSchedules() {
        const container = document.getElementById('schedule-list');
        const filteredSchedules = this.getFilteredSchedules();

        if (filteredSchedules.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <h3>Tidak ada jadwal</h3>
                    <p>Tambahkan jadwal minum obat pertama Anda</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredSchedules.map(schedule => {
            const now = new Date();
            const scheduleDateTime = new Date(`${schedule.startDate}T${schedule.time}`);
            const isOverdue = scheduleDateTime < now && !schedule.completed;
            const isDueSoon = scheduleDateTime < new Date(now.getTime() + 30*60*1000) && !schedule.completed;

            return `
                <div class="schedule-item ${schedule.completed ? 'completed' : ''}" data-id="${schedule.id}">
                    <div class="schedule-header">
                        <div>
                            <div class="medicine-name">${schedule.name}</div>
                            <div class="schedule-details">
                                <span class="status-badge ${isDueSoon ? 'status-due-soon' : isOverdue ? 'status-overdue' : ''}">
                                    ${isOverdue ? 'Terlambat' : isDueSoon ? 'Segera' : 'Belum waktunya'}
                                </span>
                                ${schedule.endDate ? `Sampai ${new Date(schedule.endDate).toLocaleDateString('id-ID')}` : ''}
                            </div>
                        </div>
                        <div class="time-display">${schedule.time}</div>
                    </div>
                    
                    <div class="schedule-actions">
                        <button class="btn-small btn-success" onclick="app.toggleComplete('${schedule.id}')">
                            <i class="fas ${schedule.completed ? 'fa-undo' : 'fa-check'}"></i>
                            ${schedule.completed ? 'Belum' : 'Centang'}
                        </button>
                        <button class="btn-small btn-edit" onclick="app.editSchedule('${schedule.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-small btn-delete" onclick="app.deleteSchedule('${schedule.id}')">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>

                    ${schedule.notes ? `
                        <div class="notes">
                            <i class="fas fa-info-circle"></i> ${schedule.notes}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        // Re-bind onclick events (since dynamically created)
        window.app = this;
    }

    updateStats() {
        const today = new Date().toISOString().split('T')[0];
        const todaySchedules = this.schedules.filter(s => {
            const start = new Date(s.startDate).toISOString().split('T')[0];
            return start === today;
        });
        
        const completedToday = todaySchedules.filter(s => s.completed).length;
        const dueSoon = this.schedules.filter(s => {
            const scheduleTime = new Date(`${s.startDate}T${s.time}`);
            const now = new Date();
            return !s.completed && scheduleTime < new Date(now.getTime() + 30*60*1000);
        }).length;
        
        document.getElementById('completed-today').textContent = completedToday;
        document.getElementById('due-soon').textContent = dueSoon;
        document.getElementById('total-schedules').textContent = this.schedules.length;
    }

    saveSchedules() {
        localStorage.setItem('obatSchedules', JSON.stringify(this.schedules));
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        const text = document.getElementById('notification-text');
        text.textContent = message;
        notification.classList.remove('hidden', 'show');
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.classList.add('hidden'), 400);
        }, 3000);
    }
}

// Initialize app when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ObatReminder();
});
