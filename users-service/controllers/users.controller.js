const pino = require("pino");
const jwt = require('jsonwebtoken');
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {colorize: true}
  }
}) 

let users = [
  { id: 1, name: "Alice", email: "alice-maravilhas@gmail.com", password: 123, role: "admin" },
  { id: 2, name: "Bob", email: "bob-construtor@gmail.com", password: 456, role: "user" }
]

// GET all users
/*⚠️ 
- fetch other services if necessary
- check other errors
*/
exports.getAllUsers = (req, res) => {
    /*  
    #swagger.tags = ['Users'] 
    #swagger.responses[200] = { description: 'Users found successfully', schema: { $ref: '#/definitions/GetUser'} } 
    #swagger.responses[401] = { description: 'No access token provided'}
    #swagger.responses[403] = { description: 'You are not allowed to access this endpoint' }
    #swagger.responses[404] = { description: 'Users not found' }
    #swagger.responses[500] = { description: 'Failed to fetch users'}
    */
    try {
        logger.info(`Request: GET /users received!`);

        const { page = 1, limit = 6, order = 'asc' } = req.query;         

        // #--> Implement the order parameter
        // if (order !== 'asc' && order !== 'desc') {
        //     logger.error(`Invalid order parameter!`);
        //     return res.status(400).json({msg: "Order must be ascending or descending!"})
        // }

        logger.info(`Calling Users Service: GET /users`)

        // #--> EXPRESS QUERY
        // let users = await User.findAndCountAll({
        //     attributes: ['user_id', 'name'],
        //     limit: +limit,
        //     offset: (+page - 1) * +limit,
        //     include: [],
        //     order: [['name', order]],
        //     raw: false
        // })

        if (users.length === 0) {
            logger.warn(`No users were found!`)
            res.status(404).json({ error: "No users were found!"})
        } else {
            // # --> Fix status response

            logger.info(`Users returned sucessfully.`)
            return res.status(200).json({
                totalPages: Math.ceil( users.count / limit),
                currentPage: page ? page : 0,
                total: users
                //data: users.rows,
                //links ??
            })
        }
    } catch (err) {
        logger.error(`Error fetching users: ${err.message}`)
        res.status(500).json({ msg: "Failed to fetch users"});
    }
    
}


// GET an user by ID 
/*⚠️ 
- fetch other services if necessary
- check other errors
*/
exports.getUserById = (req, res) => {
    /*  
    #swagger.tags = ['Users'] 
    #swagger.responses[200] = { description: 'User found successfully', schema: { $ref: '#/definitions/GetUser'} } 
    #swagger.responses[401] = { description: 'No access token provided'}
    #swagger.responses[403] = { description: 'You are not allowed to access this endpoint' }
    #swagger.responses[404] = { description: 'User was not found' } 
    #swagger.responses[500] = { description: 'Failed to fetch users'}
    */
    // #--> Is this inside or outside the try...catch?
    logger.info(`Request: GET /users/${req.params.id} received!`);

    const user = users.find(user => user.id === parseInt(req.params.id));
    
    if (parseInt(req.params.id) !== req.user.id && req.user.role !== "admin") {
        logger.warn('Access denied!')
        return res.status(403).json({ error: "You are trying to access someone else's info!"})
    }

    if (!user) {
        logger.warn(`User with ID ${req.params.id} was not found!`);
        return res.status(404).json({ error: 'User not found' }) 
    }

    try {
        // Call other services (if necessary)

        logger.info(`User with ID ${req.params.id} returned sucessfully.`)
        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
        })
        
    } catch (err) {
        logger.error(`Error fetching user with ID: ${req.params.id}`)
        res.status(500).json({ error: "Failed to fetch users "});
    }
}


// Create a new user
/*⚠️ 
- check all fields required according to DB
- check connections with other services
- figure out how to get new ID
- field validations according to field length, max and min...
*/
exports.register = (req, res) => {
    /*
    #swagger.tags = ['Users'] 
    #swagger.parameters['body'] = { 
    in: 'body', 
    description: 'New user object', 
    required: true, 
    schema: { $ref: '#/definitions/CreateUser' } 
    } 
    #swagger.responses[201] = { description: 'User created successfully', schema: { $ref: '#/definitions/CreateUser'} } 
    #swagger.responses[400] = { description: 'All fields are required.' }
    #swagger.responses[409] = { description: 'Email already exists' } 
    #swagger.responses[500] = { description: 'Failed to fetch users'}
    #
     */
    try {
        logger.info(`Request: POST /register received!`);

        const { name, email, password } = req.body;
        
        // Check if any fields are missing
        let missing_fields = [];
        if ( name === undefined ) missing_fields.push('name');
        if ( email === undefined ) missing_fields.push('email');
        if (password === undefined ) missing_fields.push('password')

        if ( missing_fields.length > 0 ) {
            logger.warn(`All fields are required!`);
            return res.status(400).json({ error: `Missing fields: ${missing_fields.join(', ')}`})
        }

        users.forEach(user => {
            if (user.email === email) {
                logger.warn('Email is already being used!')
                return res.status(409).json({ error: "Email is already being used"});
            }
        })

        const new_user = { id: users.length + 1, name, email, password, role: "user" };
        users.push(new_user);

        logger.info(`New user sucessfully created!`)

        return res.status(201).json({ msg: `User successfully created! `})
    } catch (error) {
        logger.error(`Error creating user`)
        res.status(500).json({ error: "Failed to create a new user"});
    }
}


// Login user
/*⚠️ 
- check password in DB (bcrypt)
- JWT Sign
*/
exports.login = (req, res) => {
    /*  
    #swagger.tags = ['Users'] 
    #swagger.responses[200] = { description: 'User found successfully', schema: { $ref: '#/definitions/GetUser'} } 
    #swagger.responses[401] = { description: 'Invalid Credentials' } 
  */
    try {
        logger.info(`Request: POST /login received!`);
        
        const { email, password } = req.body;

        // # --> Check password in DB

        const user = users.find(user => user.email === email && user.password === password);

        if (!user) {
            logger.warn(`User not found!`);
            return res.status(401).json({ error: "Invalid Credentials"})
        }

        // # --> JWT SIGN
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role}, process.env.JWT_SECRET, { expiresIn: "1h" })

        logger.info(`User with ID ${user.id} returned sucessfully.`)

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token
        })
    } catch (err) {
        logger.error(`Error creating user`)
        res.status(500).json({ error: "Failed to create a new user"});
    }
}


// Update info from an user
/*⚠️ 
- check password in DB (bcrypt)
*/
exports.updateInfo = (req, res) => {
    /*  
    #swagger.tags = ['Users'] 
    #swagger.parameters['body'] = { 
    in: 'body', 
    description: 'Update an user', 
    required: true, 
    schema: { $ref: '#/definitions/GetUser' } 
    } 
    #swagger.responses[204] = { description: 'User info updated successfully', schema: { 
    $ref: '#/definitions/GetUser'} } 
    #swagger.responses[403] = { description: 'You are not allowed to access this endpoint' }
    #swagger.responses[404] = { description: 'User not found' } 
    #swagger.responses[409] = { description: 'Email already exists' } 
    #swagger.responses[500] = { description: 'Failed to fetch users'}
    */
    try {
        logger.info(`Request: PUT /user/${req.params.id} received!`);

        // #--> Check if ID in URL is equal to the ID of the user signed in// 409
        const { name, email, password } = req.body;

        const user = users.find(user => user.id === parseInt(req.params.id));

        if (!user) {
            logger.warn(`User not found!`);
            return res.status(404).json({ error: "User not found" })
        }

        if (parseInt(req.params.id) !== req.user.id) {
            logger.warn('Access denied')
            return res.status(403).json({ error: "You are trying to edit someone else's info!"})
        }

        logger.info(`User with ID ${user.id} found sucessfully.`)

        users.forEach(user => {
            if (user.email === email) {
                logger.warn('Email is already being used!')
                return res.status(409).json({ error: "Email is already being used"});
            }
        })

        // #--> Replace this loop with UPDATE query
        users.forEach(user => {
            if (email) {
                user.email = email
            }

            if (name) {
                user.name = name
            }

            if (password) {
                user.password = password
            }
        });

        logger.info('Info updated successfully!')

        return res.status(204).json({ msg: "Info updated" })
    } catch (err) {
        logger.error(`Error updating user`)
        res.status(500).json({ error: "Failed to update the user's info"});
    }
}


// Delete an user
exports.deleteUser = (req, res, next) => {
    /*  
    #swagger.tags = ['Users'] 
    #swagger.responses[204] = { description: 'User deleted successfully'} 
    #swagger.responses[401] = { description: 'No access token provided' }
    #swagger.responses[403] = { description: 'You are not allowed to access this endpoint' }
    #swagger.responses[404] = { description: 'User not found' } 
    #swagger.responses[500] = { description: 'Failed to fetch users'}
  */
    logger.info(`Request: DELETE /user/${req.params.id} received!`);

    const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        logger.warn(`User not found!`);
        return res.status(404).json({ error: "User not found" });
    }

    if (parseInt(req.params.id) !== req.user.id && req.user.role !== "admin") {
        logger.warn('Access denied!')
        return res.status(403).json({ error: "You are trying to access someone else's info!"})
    }

    try {
        logger.info(`User with ID ${req.params.id} found successfully.`)
        
        users = users.splice(userIndex, 1);

        logger.info(`User with ID ${req.params.id} deleted successfully.`)

        return res.status(204).json({ msg: "User successfully removed "})
    } catch (err) {
        logger.error(`Error updating user`)
        res.status(500).json({ error: "Failed to update the user's info"});
        next(err)
    }
}