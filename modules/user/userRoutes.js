const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { hash } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const {authSecretKey} = require("../../config/index");
const {authenticateToken} = require('../../middleware/auth');


require("dotenv").config();

// Register API
router.post("/register", async (req, res) => {
  let { fullName, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email: email, deletedAt: null } });
    // console.log("user",user)
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    let salt = await bcrypt.genSalt(10);
    console.log("salt", salt);

    let hashpassword = await hash(password, salt);
    console.log("Chack", hashpassword);

    // let fields = {
    //     fullName: fullName,
    //     email: email,
    //     password: bcrypt.hashSync(password, salt)
    //   }

    let newUser = new User({
      fullName,
      email,
      password: hashpassword,
      token: await hash(email, salt),
    });

    await newUser.save();

    const payload = {
      user: {
        id: newUser.id,
      },
    };
    console.log("payload", payload);
    jwt.sign(
      payload,
      authSecretKey.secretKey,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json("your Account is Created. Go to login page ");
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email);

  try {
    let user = await User.findOne({
      where: {
        email: email,
        deletedAt: null,
      },
    });
    console.log("user", user);
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    const payload = {
      user: {
        id: user.id,
        id: user.email,
      },
    };

    const token = await jwt.sign(payload, authSecretKey.secretKey, {
      expiresIn: "1h",
    });

    await user.update({ token });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/get-all-users", authenticateToken, async (req, res) => {
  try {
    let users = await User.findAll();
    users.map((users)=>{
    console.log('password :', users.password);
    return users.password = "*****", users.token = "*****"
      
    })
    if (users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }
    return res.status(200).json({ msg: "Users found", users });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/get-one-user/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;

  console.log('id:',id);
  try {
    let user = await User.findOne({ where: { id: id, deletedAt: null } });
    user.password = "*****";
    user.token = "*****";
    if (user.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }
    return res.status(200).json({ msg: "User found", user });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.put("/update-user/:id", authenticateToken, async (req, res) => {
  let userId = req.params.id;

  let { fullName, email } = req.body;

  try {
    let user = await User.findOne({ where: { id: userId, deletedAt: null } });
    console.log("user",user)
    if (!user) {
      return res.status(400).json({ msg: "User not exists" });
    }

    let newData = user.set({
      fullName,
      email,
    });

    let result = await newData.save();
    result.password = "*****"
    result.token = "*****"
   
    return res.status(200).json({ msg: " User data updated",result });
      
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/delete-user/:id", authenticateToken, async (req, res) => {
  const userid = req.params.id;

  console.log('id:',userid);
  try {
    let user = await User.findOne({ where: { id: userid, deletedAt: null } });
    // console.log('user :', user);
    if (!user) {
      return res.status(400).json({ msg: "User not exists" });
    }
     user = await User.destroy({ where: { id: userid } });
    
    return res.status(200).json({ msg: "User Deleted", userid });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
