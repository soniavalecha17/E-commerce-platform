import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileonCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.models.js";

const createProduct = asyncHandler(async (req, res) => {
    const { description, name, price, stock, category } = req.body;

    // 1. Validation
    if ([description, name, category].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All required fields must be provided");
    }

    // 2. Check User & Role (Assuming your auth middleware adds user to req)
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized access");
    }

    // Optional: Check if user is an artisan
    // if (user.role !== "ARTISAN") { throw new ApiError(403, "Only artisans can create products"); }

    // 3. Handle File Upload
    const productImageLocalPath = req.files?.productImage?.[0]?.path;

    if (!productImageLocalPath) {
        throw new ApiError(400, "Product image is required");
    }

    const productImage = await uploadFileonCloudinary(productImageLocalPath);

    if (!productImage) {
        throw new ApiError(500, "Image upload failed");
    }

    // 4. Create Product
    const product = await Product.create({
        description,
        name,
        price,
        stock,
        category,
        productImage: productImage.url,
        owner: user._id // Link product to the logged-in user
    });

    return res.status(201).json(
        new ApiResponse(201, "Product created successfully", product)
    );
});

const getProducts = asyncHandler(async (req, res) => {
    // We use .populate() to get owner details instead of just the ID
    const products = await Product.find()
        .populate("owner", "username email");

    return res.status(200).json(
        new ApiResponse(200, "Products fetched successfully", products)
    );
});

const getOneProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id).populate("owner", "username email");

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Product found successfully", product)
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Check if the person updating is the owner
    if (product.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to update this product");
    }

    // Update fields only if they are provided in the body
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;

    // Optional: Handle updating the product image if a new file is uploaded
    if (req.files?.productImage?.[0]?.path) {
        const newImagePath = req.files.productImage[0].path;
        const uploadedImage = await uploadFileonCloudinary(newImagePath);
        if (uploadedImage) {
            product.productImage = uploadedImage.url;
        }
    }

    const updatedProduct = await product.save();

    return res.status(200).json(
        new ApiResponse(200, "Product updated successfully", updatedProduct)
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Security: Only the owner can delete
    if (product.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this product");
    }

    await Product.findByIdAndDelete(id);

    // Note: In a real app, you'd also call a function here to 
    // delete the image from Cloudinary using product.productImage URL/PublicID

    return res.status(200).json(
        new ApiResponse(200, "Product deleted successfully")
    );
});

const getArtisanProducts = asyncHandler(async (req, res) => {
    // req.user._id is populated by your verifyJWT middleware
    const products = await Product.find({ owner: req.user?._id });

    if (!products || products.length === 0) {
        // Return an empty array so the frontend can show a "No products yet" message
        return res.status(200).json(
            new ApiResponse(200, [], "No products found for this artisan")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, "Artisan products fetched successfully", products)
    );
});

export { 
    createProduct, 
    getProducts, 
    getOneProduct, 
    updateProduct, 
    deleteProduct,
    getArtisanProducts
};