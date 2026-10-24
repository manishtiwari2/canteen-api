# Failure log
Every setup defect we actually hit. Never edited later to look competent.
## 2026-10-15 - EADDRINUSE on port 3000
- Symptom: `Error: listen EADDRINUSE: address already in use 0.0.0.0:3000`
- Diagnosis: `netstat -ano | grep 3000` showed `npm run dev` still running in another terminal.
- Fix: stopped the old process (Ctrl+C). Why it worked: only one process can bind a port.