class ObatReminder {
    constructor() {
        this.schedules = JSON.parse(localStorage.getItem('obatSchedules')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateClock