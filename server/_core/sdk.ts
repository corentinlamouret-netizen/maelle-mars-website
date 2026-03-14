import type { Request } from "express";
import type { User } from "../../drizzle/schema";

/*
  Simplified SDK with NO OAuth / Manus dependency.
  Authentication is disabled for now.
*/

class SDKServer {
  async authenticateRequest(_req: Request): Promise<User> {
    throw new Error("Authentication disabled (OAuth removed)");
  }
}

export const sdk = new SDKServer();
    return user;
  }
}

export const sdk = new SDKServer();
