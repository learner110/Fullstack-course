const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const startServer = async (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => {
      const auth = req.headers.authorization
      let currentUser = null
      if (auth && auth.startsWith('Bearer ')) {
        const token = auth.substring(7)
        try {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
          currentUser = await User.findById(decodedToken.id)
        } catch (e) {
        }
      }
      return { currentUser }
    },
  })

  console.log(`Server ready at ${url}`)
}

module.exports = startServer