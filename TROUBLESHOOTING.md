# Troubleshooting Guide

## CSS Not Loading

If you see unstyled content (no colors, layout issues), try these steps:

### 1. Check Tailwind CSS Setup

The project uses **Tailwind CSS v4**, which has a different syntax:

**src/index.css should have:**
```css
@import "tailwindcss";
```

NOT the old v3 syntax:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. Verify PostCSS Configuration

**postcss.config.js should have:**
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 3. Clear Cache and Restart

```bash
# Stop the dev server (Ctrl+C)

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

### 4. Hard Refresh Browser

- **Windows/Linux**: Ctrl + Shift + R or Ctrl + F5
- **Mac**: Cmd + Shift + R

### 5. Check Browser Console

Open DevTools (F12) and check:
- Console tab for errors
- Network tab to see if CSS files are loading
- Elements tab to verify styles are applied

## Common Issues

### Issue: "Module not found" errors

**Solution**: Make sure all imports use `.js` extension:
```typescript
import type { MenuItem } from '../types/index.js';
```

### Issue: Port already in use

**Solution**: Vite will automatically use the next available port. Check terminal output for the actual port number.

### Issue: TypeScript errors

**Solution**: Run type checking:
```bash
npm run build
```

Fix any TypeScript errors that appear.

### Issue: Components not rendering

**Solution**: Check browser console for React errors. Common causes:
- Missing props
- Incorrect imports
- Context provider not wrapping component

## Development Server Issues

### Server won't start

1. Check if another process is using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5173

   # Mac/Linux
   lsof -i :5173
   ```

2. Kill the process or let Vite use another port

### Hot Module Replacement (HMR) not working

1. Save files with Ctrl+S / Cmd+S
2. Check terminal for error messages
3. Try restarting the dev server

## Build Issues

### Build fails

```bash
# Clean build
rm -rf dist

# Try building again
npm run build
```

### TypeScript compilation errors

Check `tsconfig.json` settings and fix type errors in your code.

## Browser Compatibility

Ensure you're using a modern browser:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Still Having Issues?

1. Check the main [README.md](README.md) for setup instructions
2. Verify all dependencies are installed: `npm install`
3. Check that you're in the correct directory: `cd plateos-demo`
4. Try deleting `node_modules` and reinstalling
5. Make sure Node.js version is 18+ : `node --version`

## Quick Reset

If all else fails, complete reset:

```bash
# Stop all servers
# Kill any running processes

# Clean everything
rm -rf node_modules package-lock.json dist

# Reinstall
npm install

# Start fresh
npm run dev
```

## Getting Help

- Check [START_HERE.md](START_HERE.md) for basic usage
- Read [FEATURES.md](FEATURES.md) to understand functionality
- Review browser console for specific errors
- Check terminal output for build errors
