const database = require("../../model/database");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  const { name } = req.body;
  console.log("RTC -> Name: ", name);

  if (!cookies?.jwt)
    return res.status(401).json({ message: "There are no JWT Cookie" }); //No content

  const refreshToken = cookies.jwt;

  const q1 = `SELECT * FROM players WHERE name = '${name}'`;

  database.query(q1, async (err, data) => {
    console.log("JWT from DB => ", data[0].refreshToken);
    console.log("JWT from Cookie => ", refreshToken);
    if (err) {
      console.log(
        "Error Accured while trying to retrieve user's data to Refresh his JWT..."
      );
      return res.status(400).json(err);
    }
    console.log(
      "Does the User have a refresh token in the DB? -> ",
      data[0]?.refreshToken?.length > 6
    );

    if (data[0]?.refreshToken?.length > 6) {
      console.log(
        "Does User's Cookie JWT and the JWT in the DB Match? -> ",
        data[0]?.refreshToken === refreshToken
      );

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || name !== decoded.UserInfo.username) {
            console.log("1 Error -> ", err);
            console.log("2 Decoded Data -> ", decoded?.UserInfo?.username);
            return res.status(405).json({
              message:
                "RefreshTokenController: Error while verifying refresh token. R-JWT probably expired 😱",
              err,
            });
          }

          const accessToken = jwt.sign(
            {
              UserInfo: {
                username: name,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
          );

          res.json({ accessToken });
        }
      );
    } else {
      return res.status(403).json({
        message:
          "The User does not have an JWT Refresh Token in the DB, so can not refresh",
      }); //Forbidden
    }
  });
  // evaluate jwt
};

module.exports = { handleRefreshToken };
