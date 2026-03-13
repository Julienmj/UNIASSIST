# ♿ Accessibility Guide for UNIASSIST

This document outlines the accessibility features implemented in UNIASSIST to ensure the application is usable by everyone, including people with disabilities.

## 🎯 WCAG 2.1 Compliance

UNIASSIST follows **WCAG 2.1 AA** guidelines for web accessibility.

## 🔧 Implemented Features

### **📱 Screen Reader Support**

#### **ARIA Labels & Descriptions**
- **Buttons**: Descriptive `aria-label` attributes
- **Modals**: `aria-modal`, `aria-labelledby` for proper dialog handling
- **Forms**: Associated labels and descriptions
- **Navigation**: Clear landmark roles

#### **Live Regions**
- **Dynamic content**: `aria-live="polite"` for announcements
- **Loading states**: Screen reader notifications
- **Error messages**: Immediate error announcements

#### **Focus Management**
- **Focus trapping** in modals
- **Skip navigation** links
- **Logical tab order**
- **Visible focus indicators**

### **⌨️ Keyboard Navigation**

#### **Full Keyboard Access**
- **Tab navigation** through all interactive elements
- **Enter/Space** for button activation
- **Escape** to close modals
- **Arrow keys** for form navigation

#### **Focus Trapping**
- **Modals**: Focus stays within dialog
- **Auto-focus**: First element in modals
- **Restore focus**: Returns to trigger element

### **🔤 Text Size Accessibility**

#### **Text Size Control**
- **5 size levels**: Small (87.5%), Normal (100%), Large (112.5%), Extra Large (125%), Huge (150%)
- **Persistent settings**: Saved in localStorage
- **Visual control**: Dropdown in navbar with preview
- **Keyboard shortcuts**: Ctrl/Cmd + Plus/Minus/0

#### **Responsive Scaling**
- **Mobile optimization**: Adjusted scaling for smaller screens
- **Text wrapping**: Prevents overflow with larger text
- **Semantic scaling**: Headings scale proportionally

#### **Screen Reader Support**
- **Announcements**: Text size changes announced
- **Keyboard access**: Full keyboard navigation
- **ARIA labels**: Descriptive button labels

### **🎨 Visual Accessibility**

#### **High Contrast**
- **Color contrast** meets WCAG AA standards
- **Text readability** with proper sizing
- **Focus indicators** clearly visible
- **Loading states** provide feedback

#### **Semantic HTML**
- **Proper heading hierarchy** (h1, h2, h3)
- **Landmark elements** (main, nav, section)
- **Semantic buttons** and form controls
- **List structures** for navigation

## 🚀 Usage Instructions

### **For Screen Reader Users**

1. **Skip Navigation**: Press Tab when page loads to access "Skip to main content"
2. **Navigate**: Use Tab to move between interactive elements
3. **Modals**: Use Tab to navigate, Escape to close
4. **Announcements**: Listen for loading and error messages
5. **Forms**: Use standard form navigation (Tab, Shift+Tab, Enter)

### **For Keyboard Users**

1. **Tab**: Move to next interactive element
2. **Shift+Tab**: Move to previous element
3. **Enter**: Activate buttons and links
4. **Space**: Toggle checkboxes and buttons
5. **Escape**: Close modals and cancel actions

### **For Low Vision Users**

1. **Text Size Control**: Click "A" button in navbar
2. **Keyboard Shortcuts**: 
   - `Ctrl/Cmd + Plus`: Increase text size
   - `Ctrl/Cmd + Minus`: Decrease text size
   - `Ctrl/Cmd + 0`: Reset to normal
3. **Zoom**: Use browser zoom (Ctrl +) to enlarge text
4. **High Contrast**: Browser high contrast mode supported
5. **Focus**: Clear focus indicators show current element

### **Text Size Control Usage**

1. **Click the "A" button** in the navbar
2. **Use dropdown** to select text size
3. **Use +/- buttons** to adjust incrementally
4. **Keyboard shortcuts** for quick adjustment
5. **Settings persist** across sessions

## 🛠️ Technical Implementation

### **Accessibility Utilities**

```javascript
// Screen reader announcements
announceToScreenReader(message, priority)

// Focus trapping for modals
trapFocus(element)

// Generate unique IDs
generateId(prefix)

// Skip navigation link
addSkipLink()

// Text size management
setTextSize(size)
getTextSizeOptions()
increaseTextSize()
decreaseTextSize()
```

### **ARIA Patterns Used**

- **Dialog Pattern**: For modals and popups
- **Live Regions**: For dynamic content updates
- **Landmarks**: For page structure
- **Form Labels**: For form accessibility

### **Text Size Implementation**

- **CSS Variables**: `--text-scale` for dynamic scaling
- **Responsive Design**: Mobile-optimized scaling
- **LocalStorage**: Persistent user preferences
- **Keyboard Events**: Global shortcut handling

## 📊 Testing Checklist

### **Screen Reader Testing**
- [ ] All interactive elements announced correctly
- [ ] Loading states announced
- [ ] Error messages announced
- [ ] Modal dialogs announced
- [ ] Form validation announced
- [ ] Text size changes announced

### **Keyboard Testing**
- [ ] Tab navigation works throughout
- [ ] Focus is visible on all elements
- [ ] Modals trap focus correctly
- [ ] Escape closes modals
- [ ] Enter activates buttons
- [ ] Text size shortcuts work

### **Visual Testing**
- [ ] High contrast mode works
- [ ] Text zoom works to 200%
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Semantic structure clear
- [ ] Text scaling works at all levels

### **Text Size Testing**
- [ ] All 5 size levels work correctly
- [ ] Text doesn't overflow at large sizes
- [ ] Mobile scaling works properly
- [ ] Keyboard shortcuts function
- [ ] Settings persist across sessions
- [ ] Screen reader announcements work

## 🔄 Continuous Improvement

### **Future Enhancements**
- **Voice commands** support
- **Reduced motion** preferences
- **Multi-language** screen reader support
- **Advanced keyboard shortcuts**
- **Custom color themes**
- **Dyslexia-friendly fonts**

### **User Feedback**
We welcome accessibility feedback! Please report issues or suggest improvements through:
- GitHub Issues
- Accessibility feedback form
- User testing sessions

## 📞 Support

For accessibility questions or support:
- **Email**: accessibility@uniassist.edu
- **Phone**: 1-800-ACCESS
- **Live Chat**: Available on website

---

*Last Updated: March 2026*
*Version: 2.0*
