const mongoose = require('mongoose');
const { Schema } = mongoose;

const KENYA_COUNTIES = [
  'Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu',
  'Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho',
  'Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale',
  'Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit',
  'Meru','Migori','Mombasa',"Murang'a",'Nairobi','Nakuru','Nandi',
  'Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya',
  'Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia',
  'Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot',
];

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      minlength: 8,
      // null when user signs up via Google OAuth
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['buyer', 'supplier', 'inspector', 'admin'],
      default: 'buyer',
    },
    county: {
      type: String,
      enum: KENYA_COUNTIES,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-()]{7,15}$/, 'Please enter a valid phone number'],
    },
    // suppliers can associate a company name
    companyName: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // token for email verification / password reset
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpiry: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// virtual: full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// never return password or tokens in JSON responses
userSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret.password;
    delete ret.googleId;
    delete ret.verificationToken;
    delete ret.verificationTokenExpiry;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
