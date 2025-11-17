# 🤖 AI Development Assistant Workflow

## Real-time Development Monitoring with AI

### Quick Commands for AI Assistance

#### 1. **Check Server Status**
```bash
./scripts/dev-monitor.sh status
```
*Then share the output with me for analysis*

#### 2. **Monitor Live Logs** 
```bash
./scripts/dev-monitor.sh monitor
```
*Share any errors or issues you see*

#### 3. **Test Admin Functionality**
```bash
curl -X POST http://localhost:9989/.netlify/functions/admin-auth \
  -H "Content-Type: application/json" \
  -d '{"email":"test","password":"test"}'
```
*Share the response for debugging*

#### 4. **Check Function Responses**
```bash
# Test each function
curl http://localhost:9989/.netlify/functions/db-test
curl http://localhost:9989/.netlify/functions/users
curl http://localhost:9989/.netlify/functions/content-management
```

### Development Session Workflow

1. **Start Session**: Tell me "start monitoring BiblioKit"
2. **Share Status**: Run `./scripts/dev-monitor.sh status` and share output
3. **Real-time Updates**: Share any errors, function responses, or issues
4. **Code Changes**: I'll help implement fixes immediately
5. **Testing**: We'll verify changes work in real-time

### What to Share with AI for Best Monitoring

- 🔍 **Error messages** from console/logs
- 📊 **Function response outputs** from curl commands  
- 🚨 **Browser console errors** when testing admin
- 📝 **Status output** from monitor script
- 🔧 **Specific functionality issues** you encounter

### Automated Alerts (Future Enhancement)

Could set up:
- Webhook notifications for function errors
- Log file monitoring with alerts
- Automated health checks
- Performance monitoring

### Live Development Commands

```bash
# Quick health check (Netlify Dev proxy)
curl -s http://localhost:9989 > /dev/null && echo "✅ UP" || echo "❌ DOWN"

# Function health check
curl -s http://localhost:9989/.netlify/functions/health | head -1

# View Vite logs when running full stack (npm start)
tail -n 50 -f vite.log
```

### Best Practices for AI-Assisted Development

1. **Be Specific**: "Admin login failing with 401" vs "something's broken"
2. **Share Context**: Include relevant error messages and steps taken
3. **Test Incrementally**: Small changes, test immediately
4. **Document Issues**: Keep track of what we fix for future reference
5. **Share Success**: Let me know when fixes work!
