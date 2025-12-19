import logger from '../logger.js';
//db
import db from '../models/db.js';

const resolvers = {
    Query: {
        fairs: async() => {
            try {
                logger.info("Fetching all fairs from database");
                return await db.Fair.find();
                
            } catch (error) {
                throw new Error("Error fetching fairs");    
            }
        },

        fair: async (_, { id }) => {
            try {
                logger.info("Fetching fair by ID: " + id);
                return await db.Fair.findById(id);
            } catch (error) {
                throw new Error("Fair not found");  
            }
        },
    },
    Mutation: {
        addFair: async (_, args) => {
            try {
                logger.info(`Adding new fair...`);
                const existingFair = await db.Fair.findOne({name: args.name, address: args.address})
                if (existingFair) {
                    logger.warn(`Validation failed: Fair '${args.name}' at '${args.address}' already exists.`);
                    throw new Error("Fair with this name and address already exists.");
                }
                const new_fair = await new db.Fair(args).save();

                logger.info(`Fair created successfully with ID: ${new_fair._id}`);
                return new_fair;
                
            } catch (error) {
                logger.error("Error creating fair: " + error.message);
                throw new Error("Error creating fair"+error.message);                
            }
        },
        updateFair: async (_, {id,...args} ) => { 
        try {
            const updatedFair = await db.Fair.findByIdAndUpdate(id, { $set: args }, { new: true });
            if (!updatedFair) {
                    logger.warn(`Fair with ID ${id} not found for update.`);
                    throw new Error(`Fair with ID ${id} not found.`);
                }
            logger.info(`Fair with ID ${id} updated successfully.`);   
            return updatedFair;
        } catch (error) {
            logger.error("Error updating fair: " + error.message);
            throw new Error("Error updating fair: " + error.message);
        }
        },
        deleteFair: async (_, { id }) => {
            logger.info(`Deleting fair with ID: ${id}`);
            try {
                const deletedFair = await db.Fair.findByIdAndDelete(id);
                if (!deletedFair) {
                    logger.info(`Fair with ID ${id} not found for deletion.`);
                    throw new Error(`Fair with ID ${id} not found.`);
                }
                logger.info(`Fair with ID ${id} deleted successfully.`);
                return true;
            } catch (error) {
                logger.error("Error deleting fair: " + error.message);
                throw new Error("Error deleting fair: " + error.message);
            }
        },

        addCategoryToFair: async(_, { fairId, category }) => {
            try {
                logger.info(`Adding category '${category}' to fair ID: ${fairId}`); 
                return await db.Fair.findByIdAndUpdate(
                    fairId,
                    { $addToSet: { categories: category } },
                    { new: true }
                );
            } catch (error) {
                logger.error("Error adding category to fair: " + error.message);
                throw new Error("Error adding category" + error.message); 
            }
        },
        removeCategoryFromFair: async (_, { fairId, category }) => {
            try {
                logger.info(`Removing category '${category}' from fair ID: ${fairId}`);
                return await db.Fair.findByIdAndUpdate(
                    fairId,
                    { $pull: { categories: category } },
                    { new: true }
                );
            } catch (error) {
                logger.error("Error removing category from fair: " + error.message);
                throw new Error("Error removing category"+error.message); 
            }
        }
    }};

export default resolvers;