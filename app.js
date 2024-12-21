class FahrschulApp {
    constructor() {
        this.initializeDB();
        this.setupEventListeners();
        this.currentView = 'schueler';
        this.sortOrder = 'name-asc'; // Standard-Sortierung: Name aufsteigend
        this.renderSchuelerListe();
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
            
            const editId = e.target.dataset.editId;
            
            if (editId) {
                // Bearbeitung eines existierenden Schülers
                const index = this.db.schueler.findIndex(s => s.id === parseInt(editId));
                if (index !== -1) {
                    this.db.schueler[index] = {
                        ...this.db.schueler[index],
                        name: name,
                        klassen: klassen,
                        bearbeitetAm: new Date()
                    };
                }
            } else {
                // Neuer Schüler
                const neuerSchueler = {
                    id: Date.now(),
                    name: name,
                    klassen: klassen,
                    erstelltAm: new Date()
                };
                this.db.schueler.push(neuerSchueler);
            }

            this.saveData();
            this.renderSchuelerListe();
            this.closeSchuelerModal();
            e.target.reset();
            e.target.dataset.editId = '';
            document.getElementById('modal-title').textContent = 'Neuen Schüler anlegen';
        });
    }

    switchView(view) {
        this.currentView = view;
        document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
        document.querySelector(`.${view}-view`).style.display = 'block';
        
        // Aktualisiere die Liste beim Wechsel zur Schüleransicht
        if (view === 'schueler') {
            this.renderSchuelerListe();
        }
        
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

    sortSchueler(schueler) {
        const sorted = [...schueler]; // Kopie des Arrays erstellen
        
        switch(this.sortOrder) {
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.erstelltAm) - new Date(b.erstelltAm));
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
            default:
                return sorted;
        }
    }

    renderSchuelerListe() {
        const liste = document.getElementById('schueler-liste');
        
        if (this.db.schueler.length === 0) {
            liste.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-graduate"></i>
                    <h3>Keine Schüler vorhanden</h3>
                    <p>Füge deinen ersten Fahrschüler hinzu!</p>
                    <button class="btn btn-primary" onclick="app.showSchuelerModal()">
                        <i class="fas fa-plus"></i> Schüler hinzufügen
                    </button>
                </div>
            `;
        } else {
            liste.innerHTML = `
                <div class="sort-header">
                    <button class="sort-button ${this.sortOrder.startsWith('name') ? 'active' : ''}" 
                            onclick="app.toggleSort('name')">
                        Name
                        <i class="fas fa-sort${this.sortOrder === 'name-asc' ? '-up' : this.sortOrder === 'name-desc' ? '-down' : ''}"></i>
                    </button>
                    <button class="sort-button ${this.sortOrder.startsWith('date') ? 'active' : ''}"
                            onclick="app.toggleSort('date')">
                        Datum
                        <i class="fas fa-sort${this.sortOrder === 'date-asc' ? '-up' : this.sortOrder === 'date-desc' ? '-down' : ''}"></i>
                    </button>
                </div>
                ${this.sortSchueler(this.db.schueler).map(schueler => `
                    <div class="card">
                        <div class="card-content">
                            <h2 class="card-title">${schueler.name}</h2>
                            <p class="card-subtitle">
                                Klassen: ${schueler.klassen.join(', ')}
                                <br>
                                <small>Erstellt: ${new Date(schueler.erstelltAm).toLocaleDateString()}</small>
                            </p>
                        </div>
                        <div class="card-actions">
                            <button class="icon-button edit" onclick="app.editSchueler(${schueler.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="icon-button delete" onclick="app.deleteSchueler(${schueler.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}`;
        }
    }

    toggleSort(field) {
        if (this.sortOrder === `${field}-asc`) {
            this.sortOrder = `${field}-desc`;
        } else if (this.sortOrder === `${field}-desc`) {
            this.sortOrder = `${field}-asc`;
        } else {
            this.sortOrder = `${field}-asc`;
        }
        this.renderSchuelerListe();
    }

    editSchueler(id) {
        const schueler = this.db.schueler.find(s => s.id === id);
        if (!schueler) return;

        // Formular mit Daten füllen
        document.getElementById('name').value = schueler.name;
        document.querySelectorAll('input[name="klassen"]').forEach(checkbox => {
            checkbox.checked = schueler.klassen.includes(checkbox.value);
        });

        // Modal für Bearbeitung vorbereiten
        document.getElementById('schueler-form').dataset.editId = id;
        document.getElementById('modal-title').textContent = 'Schüler bearbeiten';
        this.showSchuelerModal();
    }

    deleteSchueler(id) {
        if (confirm('Schüler wirklich löschen?')) {
            this.db.schueler = this.db.schueler.filter(s => s.id !== id);
            this.saveData();
            this.renderSchuelerListe();
        }
    }
}

// App starten wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FahrschulApp();
}); 