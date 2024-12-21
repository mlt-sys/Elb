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

        // Modal öffnen
        document.getElementById('add-schueler').addEventListener('click', () => {
            this.showSchuelerModal();
        });

        // Formular absenden
        document.getElementById('schueler-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const name = formData.get('name');
            const klassen = formData.getAll('klassen');
            
            const neuerSchueler = {
                id: Date.now(),
                name: name,
                klassen: klassen,
                erstelltAm: new Date()
            };

            this.db.schueler.push(neuerSchueler);
            this.saveData();
            this.renderSchuelerListe();
            this.closeSchuelerModal();
            e.target.reset();
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

    showSchuelerModal() {
        document.getElementById('schueler-modal').style.display = 'block';
    }

    closeSchuelerModal() {
        document.getElementById('schueler-modal').style.display = 'none';
    }

    renderSchuelerListe() {
        const liste = document.getElementById('schueler-liste');
        liste.innerHTML = this.db.schueler.map(schueler => `
            <div class="card">
                <h2 class="card-title">${schueler.name}</h2>
                <p class="card-subtitle">Klassen: ${schueler.klassen.join(', ')}</p>
            </div>
        `).join('');
    }
}

// App starten wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FahrschulApp();
}); 