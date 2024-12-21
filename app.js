class FahrschulApp {
    constructor() {
        this.initializeDB();
        this.setupEventListeners();
        this.currentView = 'schueler'; // Standard-Ansicht
    }

    initializeDB() {
        // Lokaler Speicher für Schüler und Fahrstunden
        this.db = {
            schueler: JSON.parse(localStorage.getItem('schueler') || '[]'),
            fahrstunden: JSON.parse(localStorage.getItem('fahrstunden') || '[]')
        };
    }

    setupEventListeners() {
        // Navigation Event Listener
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.getAttribute('data-view');
                this.switchView(view);
            });
        });
    }

    switchView(view) {
        this.currentView = view;
        document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
        document.querySelector(`.${view}-view`).style.display = 'block';
        
        // Update aktive Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if(item.getAttribute('data-view') === view) {
                item.classList.add('active');
            }
        });
    }

    saveData() {
        localStorage.setItem('schueler', JSON.stringify(this.db.schueler));
        localStorage.setItem('fahrstunden', JSON.stringify(this.db.fahrstunden));
    }
}

// App starten wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FahrschulApp();
}); 