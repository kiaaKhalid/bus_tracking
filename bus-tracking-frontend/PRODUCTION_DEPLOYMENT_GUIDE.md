# Production Deployment Guide - Bus Tracking Dashboard

## Overview
This guide covers the complete process to prepare the Bus Tracking Dashboard for production deployment, including integration testing, performance testing, error handling verification, and the production build process.

---

## Phase 1: Integration Testing

### 1.1 Complete User Flow Test
Test the entire application flow from login to logout:

**Test Scenario: Admin User Complete Journey**
\`\`\`
1. Login Flow
   - Navigate to /login
   - Enter valid admin credentials (email: admin@example.com, password: test123)
   - Verify successful authentication and redirect to /dashboard
   - Check token is stored in localStorage
   - Verify user info is displayed in header

2. Dashboard Visualization
   - Verify dashboard loads with stats cards
   - Check live feed displays recent movements
   - Verify all charts render correctly
   - Check responsive design on mobile/tablet

3. Bus Tracking
   - Navigate to /movement-journal
   - Verify movements table loads with virtualization
   - Click on a movement to view details
   - Verify movement detail modal opens with all data
   - Test plaque correction form
   - Verify images load correctly

4. Operations Management
   - Navigate to /buses
   - Test create bus functionality
   - Test edit bus functionality
   - Test delete bus with confirmation
   - Verify all CRUD operations work

5. Schedule Management
   - Navigate to /schedules
   - Test create schedule
   - Test edit schedule
   - Test delete schedule
   - Verify date/time pickers work correctly

6. Payment Management
   - Navigate to /payments
   - Test payment filters (status, date range, bus)
   - Test "Mark as Paid" action
   - Verify payment status updates

7. Reports (AI)
   - Navigate to /rapports
   - Test report generation form
   - Select different report types (PERFORMANCE, AFFLUENCE, ANOMALIE)
   - Test date range selection
   - Verify report list displays generated reports
   - Click on report to view details and visualizations

8. User Management
   - Navigate to /configuration/utilisateurs
   - Test invite user functionality
   - Test edit user role
   - Test delete user with confirmation
   - Verify user list updates

9. System Configuration
   - Navigate to /configuration/systeme
   - Test camera management (add, edit, delete)
   - Test station information update
   - Verify all changes persist

10. Logout
    - Click logout button
    - Verify redirect to login page
    - Verify localStorage is cleared
    - Verify cannot access protected routes
\`\`\`

### 1.2 CRUD Operations Verification

**Buses Module**
- [ ] Create: Add new bus with all fields
- [ ] Read: Display bus list with pagination
- [ ] Update: Edit bus details and verify changes
- [ ] Delete: Remove bus with confirmation dialog

**Schedules Module**
- [ ] Create: Add schedule with date/time validation
- [ ] Read: Display schedules with filters
- [ ] Update: Modify schedule details
- [ ] Delete: Remove schedule with confirmation

**Payments Module**
- [ ] Read: Display payments with filters
- [ ] Update: Mark payment as paid (status change)
- [ ] Filter: By status, date range, bus

**Users Module**
- [ ] Create: Invite new user with role selection
- [ ] Read: Display user list
- [ ] Update: Change user role
- [ ] Delete: Remove user with confirmation

**Cameras Module**
- [ ] Create: Add camera with location and IP
- [ ] Read: Display camera list
- [ ] Update: Edit camera configuration
- [ ] Delete: Remove camera with confirmation

**Station Information**
- [ ] Update: Modify station details (name, address, capacity)
- [ ] Verify: Changes persist after page reload

---

## Phase 2: Performance Testing

### 2.1 Table Virtualization Testing

**Movements Table (/movement-journal)**
\`\`\`javascript
// Test with large dataset
Test Cases:
1. Load 10,000+ movements
   - Verify table renders without lag
   - Check scroll performance is smooth
   - Monitor memory usage (should stay under 100MB)
   - Verify virtualization is working (only visible rows rendered)

2. Filter operations
   - Apply filters and verify table updates
   - Check filter performance with large dataset
   - Verify pagination works correctly

3. Detail view
   - Click on movement to open detail
   - Verify modal opens quickly
   - Check image loading performance
\`\`\`

**Performance Metrics to Monitor:**
- Initial load time: < 2 seconds
- Scroll performance: 60 FPS
- Memory usage: < 150MB
- Filter response: < 500ms

### 2.2 API Response Time Testing

**Test Endpoints:**
\`\`\`
GET /api/movements - Should respond in < 500ms
GET /api/buses - Should respond in < 300ms
GET /api/payments - Should respond in < 400ms
GET /api/users - Should respond in < 300ms
POST /api/buses - Should respond in < 1000ms
PUT /api/buses/:id - Should respond in < 1000ms
DELETE /api/buses/:id - Should respond in < 800ms
\`\`\`

---

## Phase 3: Error Handling & Resilience Testing

### 3.1 API Failure Scenarios

**Test Case 1: Backend Service Down**
\`\`\`
Scenario: Backend API is completely unavailable
Expected Behavior:
- [ ] Error message displays: "Unable to connect to server"
- [ ] User can still navigate to other pages
- [ ] Retry button appears in error state
- [ ] No infinite loading spinners
- [ ] Console shows clear error logs
\`\`\`

**Test Case 2: Network Timeout**
\`\`\`
Scenario: API request times out (> 30 seconds)
Expected Behavior:
- [ ] Timeout error displays after 30 seconds
- [ ] User can retry the operation
- [ ] Loading state is cleared
- [ ] No memory leaks from pending requests
\`\`\`

**Test Case 3: Invalid Response**
\`\`\`
Scenario: API returns malformed JSON
Expected Behavior:
- [ ] Error message displays
- [ ] Application doesn't crash
- [ ] User can navigate away
- [ ] Error is logged for debugging
\`\`\`

**Test Case 4: Authentication Failure**
\`\`\`
Scenario: Token expires or becomes invalid
Expected Behavior:
- [ ] User is redirected to login page
- [ ] Session data is cleared
- [ ] Error message: "Session expired. Please login again"
- [ ] Cannot access protected routes
\`\`\`

**Test Case 5: Authorization Failure**
\`\`\`
Scenario: User tries to access admin-only page without permission
Expected Behavior:
- [ ] User is redirected to dashboard
- [ ] Error message: "You don't have permission to access this page"
- [ ] No sensitive data is exposed
\`\`\`

### 3.2 Form Validation Testing

**Test Case 1: Invalid Email**
\`\`\`
- [ ] Email field shows validation error
- [ ] Submit button is disabled
- [ ] Error message is clear and helpful
\`\`\`

**Test Case 2: Missing Required Fields**
\`\`\`
- [ ] Form shows which fields are required
- [ ] Submit button is disabled
- [ ] Error messages appear on blur
\`\`\`

**Test Case 3: Invalid IP Address**
\`\`\`
- [ ] IP address field validates format
- [ ] Error message: "Invalid IP address format"
- [ ] Submit button is disabled
\`\`\`

### 3.3 Data Validation Testing

**Test Case 1: Duplicate Entry**
\`\`\`
Scenario: Try to create bus with existing license plate
Expected Behavior:
- [ ] API returns 409 Conflict error
- [ ] Toast notification shows: "Bus with this plate already exists"
- [ ] Form remains open for correction
\`\`\`

**Test Case 2: Invalid Date Range**
\`\`\`
Scenario: End date is before start date
Expected Behavior:
- [ ] Form validation catches error
- [ ] Error message: "End date must be after start date"
- [ ] Submit button is disabled
\`\`\`

---

## Phase 4: Browser Compatibility Testing

### 4.1 Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### 4.2 Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Mobile

### 4.3 Responsive Design
- [ ] Mobile (320px - 480px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1920px+)

---

## Phase 5: Security Testing

### 5.1 Authentication Security
- [ ] Tokens are stored securely (localStorage with httpOnly consideration)
- [ ] Tokens are cleared on logout
- [ ] Session timeout works correctly (24 hours)
- [ ] CSRF protection is in place

### 5.2 Authorization Security
- [ ] Users can only access their role-appropriate pages
- [ ] API endpoints validate user permissions
- [ ] Sensitive data is not exposed in responses
- [ ] Role-based access control works correctly

### 5.3 Input Validation
- [ ] All user inputs are validated
- [ ] XSS attacks are prevented
- [ ] SQL injection is prevented (via API)
- [ ] File uploads are validated

---

## Phase 6: Production Build

### 6.1 Build Process

**Step 1: Install Dependencies**
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

**Step 2: Run Build**
\`\`\`bash
npm run build
# or
yarn build
# or
pnpm build
\`\`\`

**Expected Output:**
\`\`\`
✓ 1234 modules transformed
✓ built in 45.23s
dist/
  ├── index.html
  ├── assets/
  │   ├── index-abc123.js (minified)
  │   ├── index-def456.css (minified)
  │   └── vendor-ghi789.js (minified)
  └── ...
\`\`\`

### 6.2 Build Verification

**Check Build Output:**
\`\`\`bash
# Verify build directory exists
ls -la dist/

# Check file sizes (should be minified)
du -sh dist/

# Verify no source maps in production
ls dist/assets/ | grep -i map
# Should return nothing
\`\`\`

**Expected File Sizes:**
- Main JS bundle: < 500KB (gzipped)
- CSS bundle: < 100KB (gzipped)
- Total: < 1MB (gzipped)

### 6.3 Local Production Testing

**Test Production Build Locally:**
\`\`\`bash
# Build the application
npm run build

# Serve production build locally
npm run preview
# or
npx serve dist

# Open http://localhost:4173 in browser
\`\`\`

**Verify:**
- [ ] All pages load correctly
- [ ] No console errors
- [ ] All functionality works
- [ ] Images load properly
- [ ] Styles are applied correctly
- [ ] API calls work with correct base URL

---

## Phase 7: Environment Configuration

### 7.1 Environment Variables

**Production Environment Variables:**
\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Error Tracking
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
\`\`\`

**Verify Environment Variables:**
\`\`\`bash
# Check that NEXT_PUBLIC_API_URL is set correctly
echo $NEXT_PUBLIC_API_URL

# Verify it's not pointing to localhost
grep -r "localhost" dist/
# Should return nothing
\`\`\`

### 7.2 API Configuration

**Verify API Endpoints:**
\`\`\`bash
# Test API connectivity
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.yourdomain.com/api/buses

# Should return 200 OK with bus data
\`\`\`

---

## Phase 8: Deployment Checklist

### Pre-Deployment
- [ ] All integration tests passed
- [ ] Performance tests completed
- [ ] Error handling verified
- [ ] Security testing completed
- [ ] Browser compatibility verified
- [ ] Production build created successfully
- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] Database backups created
- [ ] Rollback plan documented

### Deployment
- [ ] Deploy to staging environment first
- [ ] Run smoke tests on staging
- [ ] Get approval from stakeholders
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Monitor performance metrics
- [ ] Verify all features work

### Post-Deployment
- [ ] Monitor application for 24 hours
- [ ] Check error logs for issues
- [ ] Verify user feedback
- [ ] Monitor performance metrics
- [ ] Document any issues
- [ ] Create incident report if needed

---

## Phase 9: Monitoring & Maintenance

### 9.1 Error Monitoring
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor console errors
- Track API errors
- Alert on critical errors

### 9.2 Performance Monitoring
- Monitor page load times
- Track API response times
- Monitor memory usage
- Track user interactions

### 9.3 User Monitoring
- Track active users
- Monitor user sessions
- Track feature usage
- Gather user feedback

---

## Troubleshooting Guide

### Issue: Build Fails
**Solution:**
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear build cache
rm -rf dist/
npm run build
\`\`\`

### Issue: API Calls Fail in Production
**Solution:**
\`\`\`bash
# Verify API URL is correct
echo $NEXT_PUBLIC_API_URL

# Check CORS headers from API
curl -i https://api.yourdomain.com/api/buses

# Verify authentication token is being sent
# Check Network tab in DevTools
\`\`\`

### Issue: Styles Not Applied
**Solution:**
\`\`\`bash
# Verify CSS is bundled
ls dist/assets/ | grep css

# Check for CSS import errors in console
# Verify Tailwind CSS is configured correctly
\`\`\`

### Issue: Images Not Loading
**Solution:**
\`\`\`bash
# Verify image paths are correct
# Check public/ directory exists
# Verify image URLs in code

# For external images, check CORS headers
\`\`\`

---

## Performance Optimization Tips

1. **Code Splitting**: Already implemented with dynamic imports
2. **Image Optimization**: Use next/image for automatic optimization
3. **Caching**: Configure cache headers on CDN
4. **Compression**: Enable gzip compression on server
5. **Minification**: Automatically done by build process
6. **Tree Shaking**: Unused code is removed automatically

---

## Rollback Plan

If issues occur in production:

1. **Immediate Rollback**
   \`\`\`bash
   # Revert to previous version
   git revert HEAD
   npm run build
   # Deploy previous version
   \`\`\`

2. **Database Rollback**
   - Restore from backup created before deployment
   - Verify data integrity

3. **Communication**
   - Notify users of issue
   - Provide ETA for fix
   - Document incident

---

## Support & Documentation

- **API Documentation**: See `/docs/api.md`
- **Architecture Guide**: See `/docs/architecture.md`
- **Troubleshooting**: See `/docs/troubleshooting.md`
- **Team Contact**: See `/docs/team.md`

---

## Sign-Off

- [ ] Development Team: _______________  Date: _______
- [ ] QA Team: _______________  Date: _______
- [ ] DevOps Team: _______________  Date: _______
- [ ] Product Manager: _______________  Date: _______
