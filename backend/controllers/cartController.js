import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Get Cart
export const getCart = async (req, res) => {
    try {
        const userId = req.id;
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart) {
            return res.status(200).json({ success: true, cart: { items: [], totalPrice: 0 } });
        }
        res.status(200).json({ success: true, cart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Add To Cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, quantity = 1 } = req.body; // ✅ use quantity from frontend

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity, price: product.productPrice }], // ✅ use quantity
                totalPrice: product.productPrice * quantity
            });
        } else {
            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity; // ✅ use quantity
            } else {
                cart.items.push({ productId, quantity, price: product.productPrice }); // ✅ use quantity
            }

            cart.totalPrice = cart.items.reduce(
                (acc, item) => acc + item.price * item.quantity, 0
            );
        }

        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate("items.productId");

        res.status(200).json({ success: true, message: "Product added to cart", cart: populatedCart });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update Quantity
export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, type } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        if (type === "increase") {
            item.quantity += 1;
        } else if (type === "decrease" && item.quantity > 1) {
            item.quantity -= 1;
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();

        const updatedCart = await cart.populate("items.productId");
        return res.status(200).json({ success: true, cart: updatedCart });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Remove From Cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        await cart.save();

        const updatedCart = await cart.populate("items.productId");
        return res.status(200).json({ success: true, cart: updatedCart });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};