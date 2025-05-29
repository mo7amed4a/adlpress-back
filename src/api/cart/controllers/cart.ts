/**
 * cart controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::cart.cart",
  ({ strapi }) => ({
    async create(ctx) {
      const userId = ctx.state.user?.id;

      if (!ctx.request.body.data) {
        return ctx.badRequest("No data provided");
      }

      if (!userId) {
        return ctx.unauthorized("User not authenticated");
      }

      const [cart] = await strapi.entityService.findMany("api::cart.cart", {
        filters: {
          user: {
            id: userId,
          },
        },
        populate: ["products", "user"],
      });

      if (!cart) {
        const cartCreate = await strapi.entityService.create("api::cart.cart", {
          data: {
            user: userId,
          },
        });
        await strapi.entityService.create("api::product-o-fcart.product-o-fcart", {
          data: {
            product: ctx.request.body.data.products,
            quantity: ctx.request.body.data.quantity,
            cart: cartCreate.documentId,
            user: userId
          }   
        })
        return {
          message: "Cart created successfully start",
          status: 200,
          cart: cartCreate,
        };
      }

      const addProduct = await strapi.entityService.create("api::product-o-fcart.product-o-fcart", {
        data: {
          product: ctx.request.body.data.products,
          quantity: ctx.request.body.data.quantity,
          cart: cart.documentId,
          user: userId
        }
      })
      
      return {
        message: "Cart created successfully end",
        status: 200,
        cart: addProduct,
      };
    },

    async find(ctx) {
      const userId = ctx.state.user?.id;

      if (!userId) {
        return ctx.unauthorized("User not authenticated");
      }
      const [cart] = await strapi.entityService.findMany("api::cart.cart", {
        filters: {
          user: {
            id: userId,
          },
        },
        populate: {"products": {
          populate: {"product": {
            populate:["image", "child_lasts"] 
          }}
        }},
      });

      if (!cart) {
        const cartCreate = await strapi.entityService.create("api::cart.cart", {
          data: {
            products: [] as any,
            user: userId,
          },
          populate: {"products": {
            populate: {"product": {
              populate: ["image", "child_lasts"]
            }}
          }},         
        });
        return cartCreate;
      }

      return {
        message: "Cart get successfully ",
        status: 200,
        cart,
      };
    },

    async delete(ctx) {
      const userId = ctx.state.user?.id;
      const { id } = ctx.params; // Product ID to delete
    
      // Validate inputs
      if (!id) {
        return ctx.badRequest("No product ID provided");
      }
    
      if (!userId) {
        return ctx.unauthorized("User not authenticated");
      }
    
      // Find the user's cart
      const [product] = await strapi.entityService.findMany("api::product-o-fcart.product-o-fcart", {
        filters: {
          documentId: id,
          user: {
            id: userId,
          },
        }
      });
    
      // Get current product IDs in the cart
      // @ts-ignore
      // const idsProducts = cart.products.map((product) => product.documentId);
    
      // Check if the product ID exists in the cart
      if (!product) {
        return ctx.badRequest("Product not found in cart");
      }

      await strapi.entityService.delete("api::product-o-fcart.product-o-fcart", product.id);
    
    
      return {
        message: "Product removed from cart successfully",
        status: 200,
      };
    },

    async update(ctx) {
      const userId = ctx.state.user?.id;
      const { id } = ctx.params; // Product ID to delete
    
      // Validate inputs
      if (!id) {
        return ctx.badRequest("No product ID provided");
      }
    
      if (!userId) {
        return ctx.unauthorized("User not authenticated");
      }
    
      // Find the user's cart
      const [product] = await strapi.entityService.findMany("api::product-o-fcart.product-o-fcart", {
        filters: {
          documentId: id,
          user: {
            id: userId,
          },
        }
      });
    
      // Get current product IDs in the cart
      // @ts-ignore
      // const idsProducts = cart.products.map((product) => product.documentId);
    
      // Check if the product ID exists in the cart
      if (!product) {
        return ctx.badRequest("Product not found in cart");
      }

      await strapi.entityService.update("api::product-o-fcart.product-o-fcart", product.id, {
        data: {
          quantity: ctx.request.body.data.quantity
        }
      })

      return {
        message: "Product quantity updated successfully",
        status: 200,
      };
    }
  })
);
