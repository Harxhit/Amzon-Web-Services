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

### Configuring X-Ray

#### How to install sdk with nodejs?

1. Install the required AWS X-Ray SDK packages

- X-Ray SDK for Node.js

```bash
npm install aws-xray-sdk
```

2. Create an AWS IAM role/user for X-Ray

- Given it permissions: AWSXRayDaemonWriteAccess

3. Configure the X-Ray Daemon

- Run the X-Ray Daemon as a sidecar container in Docker Compose and for local dev we download and run it directly.

**How to run daemon locally as well in Docker**

```bash
cd ~/Directory for xray file exists
./xray -o
```

**Added xray service in docker-compose file**

4. Initialize the X-Ray SDK in your Node.js application

- Import and configure the X-Ray SDK at the entry point of my application (e.g., app.ts)

```typescript
import AWSXRay from "aws-xray-sdk";
AWSXRay.express.openSegment("backend-service"); // Name of the service
// My existing Express app setup code here
AWSXRay.express.closeSegment();
```

5. Adding subSegments for specific operations
   When performing specific operations like database queries or external API calls, I can create subsegments to get more granular tracing information.

```typescript
const segment = AWSXRay.getSegment(); // Get the current segment
const subsegment = segment.addNewSubsegment("database-query");
// Perform database operation here
subsegment.close(); // Close the subsegment after operation
```

6. Submit traces to AWS X-Ray

- Ensure that my application has network access to the X-Ray Daemon (localhost:2000 by default)
- The SDK will automatically send trace data to the daemon, which then forwards it to the AWS X-Ray service.

**I have successfully configured AWS X-Ray tracing in my backend service locally and in docker**
