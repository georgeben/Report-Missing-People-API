const path = require('path');
const HOME_DIR = path.join(__dirname, '..');
const { logger } = require(path.join(HOME_DIR, "utils"));
const { oauthService, userService } = require(path.join(HOME_DIR, "services"));

/**
 * Signs in a user using Google OAUTH
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Object} next - Next middleware function
 */
async function googleSignIn(req, res, next) {
    let { id_token } = req.body;
    try {
        //Retreieve user data
        const payload = await oauthService.verifyGoogleIDToken(id_token);

        //Check if user exists
        const user = await userService.findUserByEmail(payload.email);
        if (user) {
            //User has already registered, sign user in
            return res.status(200).json({
                data: {
                    message: "This user is already registered",
                    token: "jwttoken"
                }
            })
        }
        const userData = {
            fullname: payload.name,
            firstname: payload.given_name,
            lastname: payload.family_name,
            email: payload.email,
            photoURL: payload.picture,
            googleID: payload.sub
        };
        const createdUser = await userService.createUser(userData);
        res.status(201).json({
            data: {
                message: "Successfully created user",
                id: createdUser._id,
                fullname: createdUser.fullname,
                email: createdUser.email
            }
        })

    } catch (error) {
        console.log(error)
        logger.log('error', 'Shit happens', {
            error,
        })
        res.status(500).json({
            error: 'I think I fucked up'
        })
    }
}

module.exports = {
    googleSignIn,
}