import { User } from "../models/userModel.js"
import { Session } from "../models/sessionModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { verifyEmail } from "../emailVerify/verifyEmail.js"
import { sendOTPMail } from "../emailVerify/sendOTPMail.js"
import cloudinary from "../utils/cloudinary.js"

/* ===========================
   REGISTER
=========================== */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      firstName, lastName, email, password: hashedPassword
    })

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    )

    newUser.token = token
    await newUser.save()

    const emailSent = await verifyEmail(token, email)
    if (!emailSent) {
      console.warn('⚠️ Email sending failed but user was registered')
    }

    return res.status(201).json({
      success: true,
      message: "Registered successfully! Please check your email to verify your account."
    })

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/* ===========================
   VERIFY EMAIL
=========================== */
export const verify = async (req, res) => {
  try {
    const token = req.params.token  // ← changed from req.query.token to req.params.token

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is missing"
      })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.name === "TokenExpiredError"
          ? "Verification link has expired. Please request a new one."
          : "Invalid verification token"
      })
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" })
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified" })
    }

    user.token = null
    user.isVerified = true
    await user.save()

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now login."
    })

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/* ===========================
   RE-VERIFY EMAIL
=========================== */
export const reVerify = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" })
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User already verified" })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    )

    await verifyEmail(token, email)

    user.token = token
    await user.save()

    return res.status(200).json({
      success: true,
      message: "Verification email sent again successfully"
    })

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/* ===========================
   LOGIN
=========================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return res.status(400).json({ success: false, message: "Invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" })
    }

    if (!existingUser.isVerified) {
      return res.status(400).json({ success: false, message: "Verify your account before login" })
    }

    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" }
    )

    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    )

    const existingSession = await Session.findOne({ userId: existingUser._id })
    if (existingSession) {
      await Session.deleteOne({ userId: existingUser._id })
    }

    await Session.create({ userId: existingUser._id })

    existingUser.isLoggedIn = true
    await existingUser.save()

    return res.status(200).json({
      success: true,
      message: `Welcome back ${existingUser.firstName}`,
      user: existingUser,
      accessToken,
      refreshToken
    })

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/* ===========================
   LOGOUT
=========================== */
export const logout = async (req, res) => {
  try {
    const userId = req.id
    await Session.deleteMany({ userId })
    await User.findByIdAndUpdate(userId, { isLoggedIn: false })
    return res.status(200).json({ success: true, message: 'User Logged Out Successfully' })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/* ===========================
   FORGOT PASSWORD
=========================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    user.otp = otp
    user.otpExpiry = otpExpiry
    await user.save()

    await sendOTPMail(otp, email)

    return res.status(200).json({ success: true, message: "OTP sent to email successfully" })

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/* ===========================
   VERIFY OTP
=========================== */
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body
    const email = req.params.email

    if (!otp) {
      return res.status(400).json({ success: false, message: 'OTP is required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" })
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'OTP not generated or already verified' })
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired, please request a new one" })
    }

    if (otp !== user.otp) {
      return res.status(400).json({ success: false, message: 'OTP is invalid' })
    }

    user.otp = null
    user.otpExpiry = null
    await user.save()

    return res.status(200).json({ success: true, message: 'OTP verified successfully' })

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/* ===========================
   CHANGE PASSWORD
=========================== */
export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body
    const { email } = req.params

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" })
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Both password fields are required" })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    return res.status(200).json({ success: true, message: "Password changed successfully" })

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/* ===========================
   ALL USERS
=========================== */
export const allUser = async (_, res) => {
  try {
    const users = await User.find()
    return res.status(200).json({ success: true, users })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/* ===========================
   GET USER BY ID
=========================== */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId).select("-password -otp -otpExpiry -token")
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    return res.status(200).json({ success: true, user })

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/* ===========================
   UPDATE USER
=========================== */
export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id
    const loggedInUser = req.user
    const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body

    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "You are not allowed to update this profile" })
    }

    let user = await User.findById(userIdToUpdate)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    let profilePicUrl = user.profilePic
    let profilePicPublicId = user.profilePicPublicId

    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId)
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        stream.end(req.file.buffer)
      })

      profilePicUrl = uploadResult.secure_url
      profilePicPublicId = uploadResult.public_id
    }

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.address = address || user.address
    user.city = city || user.city
    user.zipCode = zipCode || user.zipCode
    user.phoneNo = phoneNo || user.phoneNo
    user.role = role || user.role
    user.profilePic = profilePicUrl
    user.profilePicPublicId = profilePicPublicId

    const updatedUser = await user.save()

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser
    })

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}