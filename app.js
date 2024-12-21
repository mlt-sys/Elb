class FahrschulApp {
    constructor() {
        this.setupEventListeners();
        this.switchView('schueler'); // Start mit Schüler-View
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.target.closest('.nav-item').dataset.view;
                this.switchView(view);
            });
        });
    }

    switchView(viewName) {
        // Alle Views ausblenden
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Gewählte View einblenden
        document.getElementById(`${viewName}-view`).classList.add('active');
        
        // Navigation aktualisieren
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewName);
        });
    }
}

// App initialisieren
const app = new FahrschulApp(); 