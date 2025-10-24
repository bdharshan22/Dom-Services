import mongoose from "mongoose";
import Service from "./models/Service.js";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/domestic_services";
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

const sampleServices = [
  {
    name: "House Cleaning",
    description: "Professional house cleaning service including dusting, vacuuming, and sanitizing.",
    price: 500,
    category: "cleaning",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"
  },
  {
    name: "Premium Home Cleaning",
    description: "Deep cleaning for homes, including windows, appliances, and hard-to-reach areas.",
    price: 1200,
    category: "cleaning",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400"
  },
  {
    name: "Plumbing Repair",
    description: "Expert plumbing services for leaks, blockages, and installations.",
    price: 800,
    category: "plumbing",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400"
  },
  {
    name: "Electrical Work",
    description: "Licensed electrician for wiring, repairs, and installations.",
    price: 1000,
    category: "electrical",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400"
  },
  {
    name: "Gardening",
    description: "Lawn maintenance, planting, and garden care services.",
    price: 400,
    category: "gardening",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
  },
  {
    name: "Painting",
    description: "Interior and exterior painting services with premium quality paints.",
    price: 1200,
    category: "painting",
    image: "https://images.unsplash.com/photo-1562259949-e8e3a426fbf0a?w=400"
  },
  {
    name: "Kitchen Remodeling",
    description: "Full kitchen renovation and modernization",
    price: 12000,
    category: "renovation",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"
  },
  {
    name: "Carpet Cleaning",
    description: "Deep carpet cleaning and stain removal",
    price: 800,
    category: "cleaning",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"
  },
  {
    name: "Pool Maintenance",
    description: "Swimming pool cleaning and maintenance",
    price: 1500,
    category: "pool",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
  },
  {
    name: "Moving Services",
    description: "Professional moving and packing assistance",
    price: 2500,
    category: "moving",
  image: "https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?w=400"
  },
  {
    name: "AC Repair & Maintenance",
    description: "Air conditioner repair, servicing, and installation.",
    price: 1800,
    category: "appliance",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400"
  },
  {
    name: "Pest Control",
    description: "Safe and effective pest control for homes and offices.",
    price: 900,
    category: "cleaning",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400"
  },
  {
    name: "CCTV Installation",
    description: "Security camera setup and maintenance.",
    price: 3500,
    category: "security",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400"
  },
  {
    name: "Sofa Cleaning",
    description: "Professional sofa and upholstery cleaning.",
    price: 700,
    category: "cleaning",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400"
  }
];

const seedData = async () => {
  try {
    await Service.deleteMany({});
    await Service.insertMany(sampleServices);
    console.log("Database seeded with sample services.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());