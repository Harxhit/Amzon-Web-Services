### Containerization Issues and How I Resolved Them

#### 1. Vite Not Binding to 0.0.0.0

**Issue:**
Vite was started with --host but without a value.
Inside Docker this causes Vite to fail to bind to the container’s network interface.
The service port (5173) was open, but nothing listened inside → “connection reset”.

Changed the command line for frontend dockerfile

```bash
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

#### 2. Vite Restart Loop

**Issue:**
Vite constantly restarted because vite.config.ts and .env were repeatedly detected as “changed”.
This happened because files were copied into unexpected locations due to missing WORKDIR.

**Fix:**
After fixing the Dockerfile structure, Vite stopped receiving false change events.

#### 3. Permission Errors From Mixed Host/Docker Installs

**Issue:**
node_modules was created as root by Docker.
Running the frontend locally caused:

**Fix:**
Reinstall modules locally:

```bash
sudo rm -rf node_modules
npm install
```

**Final Result**:

- MongoDB connects successfully
- Vite dev server runs stably inside Docker
- No more permission issues
- No more “connection reset” or “empty reply from server” errors
- API requests work correctly across containers

### Backend Tracing through HoneyComb

**Distributed Tracing (API Tracing)**

- More specifically:
- Tracing of API requests
- Distributed tracing with OpenTelemetry
- Backend instrumentation for observability
- Tracing HTTP, DB, and internal calls
- Sending traces to Honeycomb

**What it provides:**

- Every API request becomes a trace
- Every internal operation becomes a span

**What I can see:**

- request latency
- what DB query was slow
- what external API call failed
- what part of code took longest
- end-to-end timing of the request

**This is part of:**

- Observability
- Tracing → Metrics → Logs (the OTel trio)
- Monitoring backend systems
- Root-cause debugging

**In simple terms:**
I am making my backend visible, traceable, and debuggable in Honeycomb.
