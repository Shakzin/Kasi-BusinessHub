import { getDb } from "../api/queries/connection";
import { businesses, events, feedback } from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed businesses (these will be visible to any user since they're public)
  const sampleBusinesses = [
    {
      name: "The Golden Spoon Restaurant",
      category: "Restaurant",
      description: "A fine dining experience with locally sourced ingredients and an ever-changing seasonal menu. Perfect for special occasions and romantic dinners.",
      location: "123 Main Street, Downtown",
      phone: "(555) 123-4567",
      email: "hello@goldenspoon.com",
      website: "https://goldenspoon.com",
      imageUrl: "",
      ownerId: "demo_owner",
      ownerType: "local" as const,
      views: 342,
      isActive: true,
    },
    {
      name: "TechFlow Solutions",
      category: "Technology",
      description: "Custom software development and IT consulting services. We help businesses transform their digital presence with cutting-edge technology.",
      location: "456 Innovation Blvd, Tech Park",
      phone: "(555) 987-6543",
      email: "contact@techflow.io",
      website: "https://techflow.io",
      imageUrl: "",
      ownerId: "demo_owner",
      ownerType: "local" as const,
      views: 189,
      isActive: true,
    },
    {
      name: "Sunrise Yoga Studio",
      category: "Health",
      description: "Find your inner peace with our range of yoga classes from beginner to advanced. Morning flows, power yoga, and meditation sessions available.",
      location: "789 Wellness Way, Suite 100",
      phone: "(555) 234-5678",
      email: "namaste@sunriseyoga.com",
      website: "https://sunriseyoga.com",
      imageUrl: "",
      ownerId: "demo_owner",
      ownerType: "local" as const,
      views: 256,
      isActive: true,
    },
    {
      name: "Green Leaf Market",
      category: "Retail",
      description: "Your neighborhood organic grocery store featuring fresh produce, artisan goods, and sustainable products. Supporting local farmers since 2018.",
      location: "321 Organic Ave, Midtown",
      phone: "(555) 345-6789",
      email: "shop@greenleaf.market",
      website: "https://greenleaf.market",
      imageUrl: "",
      ownerId: "demo_owner",
      ownerType: "local" as const,
      views: 178,
      isActive: true,
    },
  ];

  // Insert businesses
  for (const biz of sampleBusinesses) {
    try {
      const result = await db.insert(businesses).values(biz);
      const bizId = Number(result[0].insertId);
      console.log(`Created business: ${biz.name} (ID: ${bizId})`);

      // Create events for each business
      const now = new Date();
      const eventData = [
        {
          businessId: bizId,
          title: `${biz.name} - Grand Opening Celebration`,
          description: "Join us for our grand opening celebration with special discounts, live music, and complimentary refreshments!",
          location: biz.location,
          startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
          status: "published" as const,
        },
        {
          businessId: bizId,
          title: `${biz.name} - Workshop Series`,
          description: "Learn from industry experts in this hands-on workshop designed to help you grow.",
          location: biz.location,
          startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
          endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
          status: "published" as const,
        },
      ];

      for (const evt of eventData) {
        try {
          await db.insert(events).values(evt);
          console.log(`  Created event: ${evt.title}`);
        } catch (e) {
          console.error(`  Failed to create event: ${evt.title}`, e);
        }
      }
    } catch (e) {
      console.error(`Failed to create business: ${biz.name}`, e);
    }
  }

  // Seed feedback
  const sampleFeedback = [
    {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      type: "praise" as const,
      message: "Absolutely love this platform! It made setting up my business profile so easy. The analytics dashboard is incredibly helpful for tracking engagement.",
    },
    {
      name: "Michael Chen",
      email: "mchen@example.com",
      type: "suggestion" as const,
      message: "Would be great to have social media integration for businesses. Also, a mobile app would be fantastic for managing events on the go!",
    },
    {
      name: "Emily Rodriguez",
      email: "emily@example.com",
      type: "bug" as const,
      message: "Had a small issue with image upload on the business creation form. The rest of the experience was smooth though!",
    },
  ];

  for (const fb of sampleFeedback) {
    try {
      await db.insert(feedback).values(fb);
      console.log(`Created feedback from: ${fb.name}`);
    } catch (e) {
      console.error(`Failed to create feedback from: ${fb.name}`, e);
    }
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
