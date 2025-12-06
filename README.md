# Course Explorer - React Application

A modern, accessible course exploration platform built with React, featuring hierarchical course navigation, search functionality, progress tracking, and responsive design.

## 📋 Overview

Course Explorer is a comprehensive learning management interface that allows users to:
- Browse courses organized in a hierarchical structure (Course → Topic → Subtopic)
- Search across courses, topics, and subtopics with real-time filtering
- Track learning progress with checkboxes and visual progress indicators
- View detailed content with markdown support
- Access an admin panel for user management

## ✨ Key Features

### 1. **Hierarchical Navigation**
- Three-level structure: Courses → Topics → Subtopics
- Expandable/collapsible navigation tree
- Breadcrumb navigation for easy tracking
- Keyboard navigation support (Arrow keys, Home, End, Enter, Space)

### 2. **Advanced Search**
- Real-time search with 300ms debounce
- Searches across course names, topic names, and subtopic names
- Highlights matching text with yellow background
- Auto-expands courses/topics containing matches
- Filters out non-matching items

### 3. **Progress Tracking**
- Checkbox for each subtopic to mark completion
- Progress bars for topics and courses
- Dynamic percentage calculation based on completed subtopics
- LocalStorage persistence - progress saved automatically
- Visual feedback: completed items shown in grey

### 4. **Accessibility (WCAG 2.1 Compliant)**
- Skip-to-content link
- Proper ARIA roles and attributes
- Keyboard navigation throughout
- Screen reader support
- Focus indicators for all interactive elements
- Semantic HTML structure

### 5. **Responsive Design**
- Mobile-first approach
- Collapsible sidebar on mobile devices
- Menu button to toggle sidebar on small screens
- Auto-hide sidebar when content is selected on mobile
- Independent scrolling for sidebar and main content

### 6. **Theme Support**
- Light and dark mode
- Smooth theme transitions
- Theme preference persists

### 7. **Admin Panel**
- User management interface
- Displays user roles (student/teacher)
- Shows enrollment and progress data
- Responsive table design

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   The application will be available at `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Course navigation sidebar
│   │   ├── MainContent.jsx      # Main content display area
│   │   └── SearchBar.jsx        # Search input component
│   ├── contexts/
│   │   ├── SelectedContext.jsx  # Manages selected course/topic/subtopic
│   │   └── ProgressContext.jsx  # Manages progress tracking
│   ├── pages/
│   │   └── Admin.jsx            # Admin panel page
│   ├── utils/
│   │   ├── searchHelpers.js     # Search utilities (debounce, highlight)
│   │   └── normalizeCourses.js  # Course data normalization
│   ├── data/
│   │   ├── courses.json         # Course data
│   │   └── users.json           # User data
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── public/                       # Static assets
├── package.json                 # Dependencies and scripts
└── README.md                     # This file
```

## 🎯 Functionality Details

### Navigation Flow

1. **Select a Course**: Click on a course card to expand and view its topics
2. **Select a Topic**: Click on a topic to expand and view its subtopics
3. **Select a Subtopic**: Click on a subtopic to view its content in the main area
4. **Breadcrumbs**: Use breadcrumbs to navigate back to previous levels

### Search Functionality

- Type in the search bar to filter courses, topics, and subtopics
- Matching text is highlighted in yellow
- Courses/topics with matches are automatically expanded
- Non-matching items are hidden
- Search is debounced (300ms delay) for performance

### Progress Tracking

- **Check subtopics**: Click the circular checkbox before each subtopic
- **Progress bars**: 
  - Topic progress bar shows completion percentage for that topic
  - Course progress bar shows overall course completion
- **Persistence**: Progress is automatically saved to localStorage
- **Visual feedback**: Completed subtopics appear in grey

### Keyboard Shortcuts

- **Arrow Keys (↑↓)**: Navigate between items in the sidebar
- **Home/End**: Jump to first/last item
- **Enter/Space**: Select/activate item
- **Escape**: Clear search (when focused on search bar)
- **Tab**: Navigate through interactive elements

## 🛠️ Technologies Used

- **React 19** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Markdown** - Markdown rendering
- **LocalStorage API** - Progress persistence

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
  - Sidebar hidden by default
  - Menu button to toggle sidebar
  - Stacked layout

- **Tablet/Desktop**: ≥ 768px
  - Sidebar always visible
  - Side-by-side layout
  - Full navigation tree

## 🎨 Theme System

The application supports light and dark themes:
- Toggle via the theme button in the navigation bar
- Theme preference is maintained during the session
- Smooth color transitions

## 🔧 Customization

### Adding New Courses

Edit `src/data/courses.json` to add new courses, topics, or subtopics. The structure should follow:

```json
{
  "courses": [
    {
      "title": "Course Title",
      "subtitle": "Course Subtitle",
      "description": "Course description",
      "topics": [
        {
          "title": "Topic Title",
          "description": "Topic description",
          "subtopics": [
            {
              "title": "Subtopic Title",
              "content": "Markdown content here"
            }
          ]
        }
      ]
    }
  ]
}
```

### Styling

- Global styles: `src/index.css`
- Component styles: Inline Tailwind classes
- CSS variables for theming: Defined in `index.css`

## 🐛 Troubleshooting

### Issue: Progress not saving
- Check browser localStorage is enabled
- Clear browser cache and try again

### Issue: Search not working
- Ensure you're typing in the search bar
- Check browser console for errors

### Issue: Sidebar not visible on mobile
- Click the hamburger menu button (☰) in the top-left
- Ensure viewport width is less than 768px

## 📝 Development Notes

- The application uses React Context for state management
- Progress is stored in browser localStorage with key `courseProgress`
- All calculations are dynamic - no hardcoded values
- The app is fully accessible and keyboard navigable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of a React assignment.

## 👤 Author

Developed as part of a React course assignment.

---

**Happy Learning! 🎓**
