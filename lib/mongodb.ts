import { MongoClient } from "mongodb";
import crypto from "crypto";
import tls from "tls";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

// Work around TLS "internal error" / "unsafe legacy renegotiation disabled" on Windows with Node 17+ (OpenSSL 3).
// Windows only: the option re-enables insecure legacy renegotiation, so everywhere else keeps Node's defaults.
const options: import("mongodb").MongoClientOptions =
  process.platform === "win32"
    ? { secureContext: tls.createSecureContext({ secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT ?? 0 }) }
    : {};

let client;
let clientPromise: Promise<MongoClient>;

// A paused or deleted Atlas cluster only surfaces as "querySrv ENOTFOUND", so say what to check.
const connect = (c: MongoClient) =>
  c.connect().catch((e: Error) => {
    throw new Error(
      `Could not connect to MongoDB (${e.message}). Check MONGODB_URI and that the Atlas cluster is running, not paused.`
    );
  });

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = connect(client);
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = connect(client);
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
