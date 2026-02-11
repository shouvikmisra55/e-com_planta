import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Product Routes
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.products.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteProduct(Number(req.params.id));
    res.sendStatus(204);
  });

  // Seed Data
  const existing = await storage.getProducts();
  if (existing.length === 0) {
    await storage.createProduct({
      name: "Monstera Deliciosa",
      description: "A popular tropical plant with large, split leaves.",
      price: "45.00",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1vbnN0ZXJhJTIwcGxhbnR8ZW58MHx8MHx8fDA%3D",
      category: "Indoor",
    });
    await storage.createProduct({
      name: "Snake Plant",
      description: "Hardy and low-maintenance, perfect for beginners.",
      price: "25.00",
      imageUrl: "https://images.unsplash.com/photo-1572688484204-5936a8af9054?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c25ha2UlMjBwbGFudHxlbnwwfHwwfHx8MA%3D%3D",
      category: "Indoor",
    });
    await storage.createProduct({
      name: "Fiddle Leaf Fig",
      description: "A stunning statement plant with large, violin-shaped leaves.",
      price: "60.00",
      imageUrl: "https://images.unsplash.com/photo-1613524669567-5d55b08dc227?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmlkZGxlJTIwbGVhZiUyMGZpZ3xlbnwwfHwwfHx8MA%3D%3D",
      category: "Indoor",
    });
    await storage.createProduct({
      name: "Succulent Mix",
      description: "A variety of small, colorful succulents.",
      price: "15.00",
      imageUrl: "https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VjY3VsZW50c3xlbnwwfHwwfHx8MA%3D%3D",
      category: "Succulents",
    });
    await storage.createProduct({
      name: "Lavender",
      description: "Fragrant herb suitable for sunny outdoor spots.",
      price: "12.00",
      imageUrl: "https://images.unsplash.com/photo-1563242207-6c39e2501a4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGF2ZW5kZXJ8ZW58MHx8MHx8fDA%3D",
      category: "Outdoor",
    });
  }

  return httpServer;
}
