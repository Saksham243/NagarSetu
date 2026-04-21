# PublicSetu

A comprehensive platform connecting citizens with government schemes and initiatives, featuring a public grievance portal for transparent issue reporting and community-driven prioritization.

## 🎬 Demo

[▶️ Watch the Intro Video](https://drive.google.com/file/d/17fGC9iKbtioqb8U3lQIni_ROfahVZ2vB/view?usp=sharing)

## 🌟 Features

### Government Schemes Database
- **State-wise Filtering**: Browse schemes by Indian states and union territories
- **Comprehensive Coverage**: Access information about central and state government schemes
- **Real-time Updates**: Stay informed about the latest government initiatives

### Public Grievance Portal
- **Anonymous Browsing**: View all grievances without authentication
- **Protected Submissions**: Login required to raise new issues
- **Community Voting**: Upvote grievances to prioritize important issues
- **Categorized Issues**: Organize grievances by state and category
- **Real-time Updates**: See grievance status and community engagement

### User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Intuitive Navigation**: Easy-to-use interface with clear information hierarchy
- **Secure Authentication**: Firebase-powered user management
- **Offline Support**: Local storage for anonymous interactions

## 🛠️ Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Backend**: Firebase (Firestore + Authentication)
- **Build Tool**: Vite
- **Linting**: ESLint
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Firestore and Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd publicsetu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database and Authentication
   - Copy your Firebase config to `src/services/firebase.js`

4. **Environment Configuration**
   - Update Firebase configuration in `src/services/firebase.js`
   - Configure Firestore security rules for public read access to schemes and grievances

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📁 Project Structure

```
publicsetu/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── GrievanceCard.jsx
│   │   ├── GrievanceForm.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── StateContext.jsx
│   ├── data/               # Static data and seeding scripts
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   │   ├── GrievancePage.jsx
│   │   ├── Home.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── StateDashboard.jsx
│   │   ├── CentralInitiatives.jsx
│   │   └── TopicExplorer.jsx
│   ├── services/           # External service integrations
│   │   └── firebase.js
│   ├── utils/              # Utility functions
│   │   └── stateList.js
│   ├── App.jsx             # Main application component
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── eslint.config.js
```

## 🔧 Configuration

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one

2. **Enable Services**
   - Enable Firestore Database
   - Enable Authentication (Email/Password provider)

3. **Security Rules**
   Update your Firestore rules to allow public access:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read access to schemes for everyone
       match /schemes/{schemeId} {
         allow read: if true;
       }

       // Allow read/write access to grievances for everyone
       match /grievances/{grievanceId} {
         allow read: if true;
         allow write: if true;
       }

       // Allow read/write access for authenticated users
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### Database Seeding

Run the seeding script to populate initial data:

```bash
node src/data/seed.js
```

## 🎯 Usage

### For Citizens
1. **Browse Schemes**: Navigate through state-wise government schemes
2. **View Grievances**: Read community-submitted issues and their status
3. **Upvote Issues**: Support important grievances anonymously or as a logged-in user
4. **Raise Concerns**: Login to submit new grievances with detailed information

### For Administrators
1. **Monitor Grievances**: Track community priorities through upvote counts
2. **Update Status**: Mark grievances as under review or resolved
3. **Data Management**: Maintain and update scheme information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React and Firebase
- Styled with Tailwind CSS
- Icons and UI components from various open-source libraries

## 📞 Support

For support, email [sakshamgarg24306@gmail.com] or create an issue in the repository.

---

**PublicSetu** - Bridging the gap between citizens and government services.
