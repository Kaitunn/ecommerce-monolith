import prisma from "../config/prisma.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        pid: "asc",
      },
    });

    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const pid = Number(req.params.pid);

    if (!Number.isInteger(pid)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        pid,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;

    if (!pname || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: "pname, price and quantity are required",
      });
    }

    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0 ||
      !Number.isInteger(numericQuantity) ||
      numericQuantity < 0
    ) {
      return res.status(400).json({
        message: "Invalid price or quantity",
      });
    }

    const product = await prisma.product.create({
      data: {
        pname,
        price: numericPrice,
        quantity: numericQuantity,
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const { pname, price, quantity } = req.body;

    if (!Number.isInteger(pid)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        pid,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const data = {};

    if (pname !== undefined) {
      data.pname = pname;
    }

    if (price !== undefined) {
      const numericPrice = Number(price);

      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({
          message: "Invalid price",
        });
      }

      data.price = numericPrice;
    }

    if (quantity !== undefined) {
      const numericQuantity = Number(quantity);

      if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
        return res.status(400).json({
          message: "Invalid quantity",
        });
      }

      data.quantity = numericQuantity;
    }

    const product = await prisma.product.update({
      where: {
        pid,
      },
      data,
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const pid = Number(req.params.pid);

    if (!Number.isInteger(pid)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        pid,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await prisma.product.delete({
      where: {
        pid,
      },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};