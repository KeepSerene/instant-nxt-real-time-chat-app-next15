import type { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { httpRouter } from "convex/server";

async function validatePayload(
  req: Request
): Promise<WebhookEvent | undefined> {
  const payload = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET ?? "");

  try {
    return webhook.verify(payload, svixHeaders) as WebhookEvent;
  } catch (err) {
    console.error("Clerk webhook request could not be verified:", err);

    return;
  }
}

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);

  if (!event) {
    return new Response("Could not verify Clerk webhook request!", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created": {
      const user = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });

      // If the user already exists, update the user info
      if (user) {
        console.log(
          `Updating user with ID ${event.data.id} with ${event.data}`
        );
      }

      // Else continue to the next case
    }
    case "user.updated": {
      console.log(`Updating/Creating user with ID ${event.data.id}`);

      await ctx.runMutation(internal.user.create, {
        clerkId: event.data.id,
        username: `${event.data.first_name} ${event.data.last_name}`,
        avatarUrl: event.data.image_url,
        email: event.data.email_addresses[0].email_address,
      });

      break;
    }
    default: {
      console.warn("Clerk webhook event type not supported:", event.type);
    }
  }

  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();

http.route({
  method: "POST",
  path: "/clerk-users-webhook",
  handler: handleClerkWebhook,
});

export default http;
