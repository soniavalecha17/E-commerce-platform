import { Cart } from "../models/cart.models.js";

// --- EXISTING FUNCTIONS ---

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });

    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity: 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }
      await cart.save();
    }
    res.status(200).json({ message: "Added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.status(200).json({ data: cart }); // Wrapped in data for frontend consistency
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NEW FUNCTIONS TO FIX YOUR BUTTONS ---

export const decreaseQuantity = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        // If quantity is 1 and they hit minus, remove the item
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();
      return res.status(200).json({ message: "Quantity decreased", cart });
    }
    
    res.status(404).json({ message: "Product not in cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Filter out the item to remove it
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    
    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};