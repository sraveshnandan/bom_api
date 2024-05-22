import express from "express";
const createShop = (req: express.Request, res: any) => {
  try {
    const { name, description, address } = req.body;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createShop };
