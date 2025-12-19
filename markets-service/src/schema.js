const typeDefs = `#graphql

type Market {
    id: ID!
    name: String!                
    description: String!         
    imageUrl: String!            
    address: String!             
    latitude: Float!           
    longitude: Float!           
    openingHours: String!       
    categories: [String!]!   
    
    # Relations
    sellers: [Seller!]!          
    ratings: [Rating!]              
    
  }
  type Seller {
    id: ID!
    full_name: String! 
    description: String
    avatar: String             
    alert: String
  }
  type Rating {
    id: ID!
    userId: String!
    marketId: ID!
    rating: Float!
  }
  type Query {
    markets: [Market!]!
    market(id: ID!): Market
  }
  type Mutation {
    addMarket(
      name: String!, 
      description: String!, 
      imageUrl: String!, 
      address: String!, 
      latitude: Float!, 
      longitude: Float!, 
      openingHours: String!,
      categories: [String!]!,
      sellers: [String!]!): Market
      

    updateMarket(
      id: ID!, 
      name: String, 
      description: String, 
      imageUrl: String, 
      address: String, 
      latitude: Float, 
      longitude: Float, 
      openingHours: String,): Market

    deleteMarket(id: ID!): Boolean 
    
    addCategoryToMarket(marketId: ID!, category: String!): Market
    removeCategoryFromMarket(marketId: ID!, category: String!): Market
  }
`;

export default typeDefs;
