# ScoutPro 🔍⚽

![ScoutPro Banner](https://placehold.co/1200x400/0f172a/a3e635?text=ScoutPro+-+Next+Generation+Football+Scouting)

> Modern, AI-powered, and comprehensive football scouting and player analysis platform built with Electron, Vanilla JS, and TailwindCSS.

ScoutPro is a professional desktop application designed for football scouts, analysts, and coaches. It allows you to track players, manage your watchlist, plan match scouting trips, and educate yourself through the built-in Scout Academy. It works entirely offline and uses local storage, keeping your scouting data private and secure.

---

## 🌟 Key Features

### 📊 Comprehensive Dashboard
A bird's eye view of your scouting operations. View statistics, recently added players, upcoming matches, and quick actions right from the home screen.
![Dashboard](https://placehold.co/1000x500/1e293b/475569?text=Dashboard+Screenshot)

### 👥 Player Database & Reports
Keep a detailed and structured database of all scouted players. Filter by role, position, age, or rating. Create in-depth scouting reports including physical, technical, and mental attributes.
![Player Database](https://placehold.co/1000x500/1e293b/475569?text=Player+Database+Screenshot)

### ⭐ Watchlist & Candidate Pool
Move promising talents to your Watchlist. Track their progress, categorize them by priority (e.g., A-List, B-List), and monitor their market value changes.
![Watchlist](https://placehold.co/1000x500/1e293b/475569?text=Watchlist+Screenshot)

### 🏟️ Match Calendar & Planning
Plan your scouting trips. Schedule matches you need to attend or watch on video, assign target players to watch during specific matches, and take live notes.
![Match Calendar](https://placehold.co/1000x500/1e293b/475569?text=Match+Calendar+Screenshot)

### 🎓 Scout Academy
Built-in educational modules for aspiring scouts. Learn about modern tactical roles (e.g., Sweeper Keeper, Inverted Fullback, Regista), understand scouting ethics, and master data-driven scouting techniques.
![Scout Academy](https://placehold.co/1000x500/1e293b/475569?text=Scout+Academy+Modules)

### 🌍 Multi-language Support (i18n)
Seamlessly switch between **English** and **Turkish**. The entire UI, including Academy lessons and attribute descriptions, translates instantly without a reload.

---

## 🛠️ Technology Stack

ScoutPro is built with simplicity, performance, and modern UI/UX in mind.

- **Framework:** [Electron](https://www.electronjs.org/) (Desktop Application)
- **Frontend Logic:** Vanilla JavaScript (ES6+)
- **Styling:** [TailwindCSS](https://tailwindcss.com/) (Utility-first CSS)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Data Storage:** Local Storage / JSON (No external database required)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ScoutPro.git
   cd ScoutPro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

*(For development with live-reloading Tailwind CSS, make sure to run the tailwind watcher if applicable in your package.json).*

---

## 📂 Project Structure

```text
ScoutPro/
├── assets/
│   ├── css/
│   │   └── tailwind.css        # Compiled Tailwind styles
│   ├── img/                    # Logos, default avatars, UI graphics
│   └── js/
│       ├── core.js             # Main application state & routing
│       ├── i18n.js             # Language translation engine
│       ├── db.js               # LocalStorage database handlers
│       ├── academy.js          # Academy roadmap UI
│       ├── academy-submodules.js # Academy category selection
│       ├── lesson.js           # Academy lesson viewer logic
│       ├── players-list.js     # Database grid & filters
│       └── ...                 # Other modular feature scripts
├── index.html                  # Main application window
├── main.js                     # Electron main process
├── package.json                # Dependencies and scripts
└── README.md                   # You are here
```

---

## 💡 How to Add Your Own Screenshots

To make this README truly yours, replace the placeholder image URLs with actual paths to your screenshots!

1. Take screenshots of your app (Dashboard, Academy, etc.).
2. Save them in an `assets/screenshots/` folder.
3. Update the links in this file like so:
   ```markdown
   ![Dashboard](assets/screenshots/dashboard.png)
   ```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/yourusername/ScoutPro/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ for the beautiful game.*
