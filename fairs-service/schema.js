module.exports = `#graphql

type Fair {
  id: ID!
  name: String!
  description: String!
  address: String!
  pinpoint_location: String
  product_types: [ProductType!]!     
  fair_sellers: [Seller!]!           
}

type ProductType {
  id: ID!
  name: String!
}

type Seller {
  id: ID!
  name: String!
  email: String!
}

type Query {
  fairs: [Fair!]!
  fair(id: ID!): Fair
}

`;
