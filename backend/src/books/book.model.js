const mongoose = require('mongoose');

const { generateSlug } = require('../core/stringUtils');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 200 },
    slug: { type: String, unique: true },
    sku: { type: String, unique: true, maxlength: 20 },
    description: { type: String, required: true },
    author: { type: String },
    publisher: { type: String },
    isbn: { type: String },
    pageCount: { type: Number },
    language: { type: String, default: "vi" },
    publishedYear: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: [] }],
    coverImage: { type: String, required: true },
    images: { type: [String], default: [] },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    stockQuantity: { type: Number, required: true, default: 0 },
    stockThreshold: { type: Number, default: 5 },
    trending: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'active', 'inactive'], required: true, default: 'draft' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, {
    timestamps: true,
});

// Indexes
bookSchema.index({ slug: 1 }, { unique: true });
bookSchema.index({ sku: 1 }, { unique: true });
bookSchema.index({ category: 1, status: 1 });
bookSchema.index({ title: "text", author: "text", description: "text" });
bookSchema.index({ isDeleted: 1, status: 1 });

// Pre-save / Pre-validate hooks để tự sinh slug và sku
bookSchema.pre('validate', function (next) {
    if (this.title && !this.slug) {
        // Sinh slug từ title, cộng thêm timestamp nhỏ để giảm thiểu khả năng trùng lặp
        this.slug = generateSlug(this.title) + '-' + Date.now().toString().slice(-4);
    }

    if (!this.sku) {
        // Sinh mã SKU dạng: BS + 6 số cuối timestamp + 3 số ngẫu nhiên
        this.sku = 'BS' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }
    next();
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;