import 'dotenv/config';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { MongoDBInstrumentation } from '@opentelemetry/instrumentation-mongodb';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),  
  instrumentations: [getNodeAutoInstrumentations() , new MongoDBInstrumentation()],
});

sdk.start();