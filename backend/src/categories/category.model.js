const mongoose = require('mongoose');
const { generateSlug } = require('../utils/stringUtils');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 50, trim: true },
    slug: { type: String, unique: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    level: { type: Number, required: true, default: 1, enum: [1, 2] },
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, required: true, default: true },
    isFeatured: { type: Boolean, default: false },
    productCount: { type: Number, default: 0 },
    description: { type: String },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
});

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parentId: 1 });
categorySchema.index({ level: 1, priority: 1 });
categorySchema.index({ isDeleted: 1, isActive: 1 });
categorySchema.index(
    { parentId: 1, name: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false }, collation: { locale: 'vi', strength: 2 } }
);
categorySchema.index(
    { parentId: 1, priority: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } }
);

categorySchema.pre('validate', function (next) {
    if (this.name && !this.slug) {
        this.slug = generateSlug(this.name) + '-' + Date.now().toString().slice(-4);
    }
    if (this.isFeatured && !this.isActive) {
        this.isFeatured = false;
    }
    if (this.parentId) {
        this.level = 2;
    } else {
        this.level = 1;
    }

    next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
