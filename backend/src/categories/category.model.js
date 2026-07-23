const mongoose = require('mongoose');
const { generateSlug } = require('../core/stringUtils');

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

// Indexes tối ưu truy vấn theo data-schema.md
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parentId: 1 });
categorySchema.index({ level: 1, priority: 1 });
categorySchema.index({ isDeleted: 1, isActive: 1 });
// Theo Business Rules, tên danh mục cấp 1 không trùng nhau (chỉ kiểm tra tương đối qua unique index nếu parentId = null)
// Ở đây dùng compound index để không cho phép trùng tên trong cùng một cấp/parentId
categorySchema.index({ parentId: 1, name: 1 }, { unique: true, collation: { locale: 'vi', strength: 2 } });

// Pre-validate hook để tự động sinh slug và validate logic phụ
categorySchema.pre('validate', function(next) {
    // 1. Tự sinh slug từ name
    if (this.name && !this.slug) {
        this.slug = generateSlug(this.name) + '-' + Date.now().toString().slice(-4);
    }

    // 2. Business Rule (BR-CATE-06): isFeatured chỉ bật khi isActive = true
    if (this.isFeatured && !this.isActive) {
        this.isFeatured = false;
    }

    // 3. Đảm bảo level đúng với parentId (BR-CATE-01)
    if (this.parentId) {
        this.level = 2;
    } else {
        this.level = 1;
    }

    next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
