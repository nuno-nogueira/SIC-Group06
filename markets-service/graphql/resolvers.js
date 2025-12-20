import logger from '../utils/logger.js';
import axios from 'axios';
//db
import db from '../models/db.js';
//auth middleware
import { authorizeRole } from '../middlewares/auth.middleware.js';

const resolvers = {
    Query: {
        markets: async () => {
            try {

                logger.info("Fetching all markets from database");
                return await db.Market.find();

            } catch (error) {
                throw new Error("Error fetching markets");
            }
        },

        market: async (_, { id }) => {
            try {
                logger.info("Fetching market by ID: " + id);
                return await db.Market.findById(id);
            } catch (error) {
                throw new Error("Market not found");
            }
        },
    },
    Market: {
        //connect to users-service to get sellers info
        sellers: async (market) => {
            if (!market.sellers || market.sellers.length === 0) return [];
            try {
                const requests = market.sellers.map(id => axios.get(`http://localhost:3000/users/sellers/${id}`));
                const responses = await Promise.all(requests);
                logger.info(`Fetched ${responses.length} sellers for market ID: ${market._id}`);
                return responses.map(res => (
                    {
                        id: res.data.id,
                        full_name: res.data.full_name,
                        description: res.data.description,
                        avatar: res.data.avatar,
                        alert: res.data.alert

                    }));
            } catch (error) {
                logger.error("Error connecting to Users-Service:", error.response?.status || error.message);
                return [];
            }
        }
    },
    Mutation: {
        addMarket: async (_, args, context) => {
            try {
                authorizeRole(context.user, 'admin');// Only admin can add markets
                logger.info(`Adding new market...`);
                const existingMarket = await db.Market.findOne({ name: args.name, address: args.address })
                if (existingMarket) {
                    logger.warn(`Validation failed: Market '${args.name}' at '${args.address}' already exists.`);
                    throw new Error("Market with this name and address already exists.");
                }
                const new_market = await new db.Market(args).save();

                logger.info(`Market created successfully with ID: ${new_market._id}`);
                return new_market;

            } catch (error) {
                logger.error(`Error creating market: ${error.message}`);
                throw new Error(`Error creating market: ${error.message}`);
            }
        },
        updateMarket: async (_, { id, ...args }) => {
            try {
                authorizeRole(context.user, 'admin');// Only admin can update markets
                const updatedMarket = await db.Market.findByIdAndUpdate(id, { $set: args }, { new: true });
                if (!updatedMarket) {
                    logger.warn(`Market with ID ${id} not found for update.`);
                    throw new Error(`Market with ID ${id} not found.`);
                }
                logger.info(`Market with ID ${id} updated successfully.`);
                return updatedMarket;
            } catch (error) {
                logger.error("Error updating market: " + error.message);
                throw new Error("Error updating market: " + error.message);
            }
        },
        deleteMarket: async (_, { id }) => {
            authorizeRole(context.user, 'admin');// Only admin can delete markets
            logger.info(`Deleting market with ID: ${id}`);
            try {
                const deletedMarket = await db.Market.findByIdAndDelete(id);
                if (!deletedMarket) {
                    logger.info(`Market with ID ${id} not found for deletion.`);
                    throw new Error(`Market with ID ${id} not found.`);
                }
                logger.info(`Market with ID ${id} deleted successfully.`);
                return true;
            } catch (error) {
                logger.error("Error deleting market: " + error.message);
                throw new Error("Error deleting market: " + error.message);
            }
        },

        addCategoryToMarket: async (_, { marketId, category }) => {
            try {
                authorizeRole(context.user, 'admin');// Only admin can modify categories
                logger.info(`Adding category '${category}' to market ID: ${marketId}`);
                return await db.Market.findByIdAndUpdate(
                    marketId,
                    { $addToSet: { categories: category } },
                    { new: true }
                );
            } catch (error) {
                logger.error("Error adding category to market: " + error.message);
                throw new Error("Error adding category" + error.message);
            }
        },
        removeCategoryFromMarket: async (_, { marketId, category }) => {
            try {
                authorizeRole(context.user, 'admin');// Only admin can modify categories
                logger.info(`Removing category '${category}' from market ID: ${marketId}`);
                return await db.Market.findByIdAndUpdate(
                    marketId,
                    { $pull: { categories: category } },
                    { new: true }
                );
            } catch (error) {
                logger.error("Error removing category from market: " + error.message);
                throw new Error("Error removing category" + error.message);
            }
        }
    }
};

export default resolvers;