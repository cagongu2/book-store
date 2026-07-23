const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const addressSchema = new mongoose.Schema({
    label: { type: String },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String },
    addressDetail: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

const customerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    displayName: {
        type: String
    },
    photoURL: {
        type: String
    },
    phone: {
        type: String
    },
    addresses: {
        type: [addressSchema],
        default: [],
        validate: [arrayLimit, 'Số lượng địa chỉ không vượt quá 5']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    lastOrderAt: {
        type: Date
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length <= 5;
}

customerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
