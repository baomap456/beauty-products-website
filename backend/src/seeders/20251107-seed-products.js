module.exports = {
    up: async (queryInterface, Sequelize) => {
        const [brandRows] = await queryInterface.sequelize.query(`SELECT ID_Brand, Name_Brand FROM Brands`);
        const [catRows] = await queryInterface.sequelize.query(`SELECT ID_Category, Name_Category FROM Categories`);

        // chuẩn hóa tên: lowerCase + bỏ dấu + bỏ khoảng trống/ký tự đặc biệt + quy về '
        const normalize = (s) =>
            String(s || '')
                .toLowerCase()
                .normalize('NFKD')
                .replace(/[\u0300-\u036f]/g, '')           // remove diacritics
                .replace(/[\u2019\u2018]/g, "'")           // curly quotes -> '
                .replace(/[^a-z0-9]+/g, '');               // strip non-alnum

        const brandIdByName = new Map(brandRows.map(b => [normalize(b.Name_Brand), b.ID_Brand]));
        const catIdByName = new Map(catRows.map(c => [normalize(c.Name_Category), c.ID_Category]));

        const list = [
            { name: 'Anthelios Melt-in Milk Sunscreen SPF 60', brand: 'La Roche-Posay', cat: 'Sunscreen', price: 19.99, stock: 120, desc: 'Broad-spectrum SPF 60 sunscreen for face and body.' },
            { name: 'Hydrating Facial Cleanser', brand: 'CeraVe', cat: 'Cleanser', price: 13.99, stock: 200, desc: 'Gentle non-foaming cleanser with ceramides and hyaluronic acid.' },
            { name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', cat: 'Serum', price: 6.50, stock: 250, desc: 'High-strength vitamin and mineral blemish formula.' },
            { name: 'Hydro Boost Water Gel', brand: 'Neutrogena', cat: 'Moisturizer', price: 18.99, stock: 180, desc: 'Oil-free gel moisturizer with hyaluronic acid.' },
            { name: 'Regenerist Micro-Sculpting Cream', brand: 'Olay', cat: 'Moisturizer', price: 24.99, stock: 160, desc: 'Anti-aging moisturizer with peptides and niacinamide.' },
            { name: 'Ultra Facial Cream', brand: 'Kiehl’s', cat: 'Moisturizer', price: 34.00, stock: 140, desc: 'Daily lightweight hydrating face cream.' },
            { name: 'Facial Treatment Essence', brand: 'SK-II', cat: 'Serum', price: 99.00, stock: 80, desc: 'Iconic essence with Pitera for smoother, radiant skin.' },
            { name: 'The Water Cream', brand: 'Tatcha', cat: 'Moisturizer', price: 69.00, stock: 90, desc: 'Oil-free, nutrient-rich water cream.' },
            { name: 'Ultimune Power Infusing Concentrate', brand: 'Shiseido', cat: 'Serum', price: 75.00, stock: 85, desc: 'Strengthening pre-serum concentrate.' },
            { name: 'Voluminous Lash Paradise Mascara', brand: "L'Oréal Paris", cat: 'Mascara', price: 10.99, stock: 220, desc: 'Volumizing, lengthening mascara.' },
            { name: 'Fit Me Matte + Poreless Foundation', brand: 'Maybelline', cat: 'Foundation', price: 7.99, stock: 230, desc: 'Matte foundation for normal to oily skin.' },
            { name: 'Pro Filt’r Soft Matte Longwear Foundation', brand: 'Fenty Beauty', cat: 'Foundation', price: 39.00, stock: 110, desc: 'Longwear matte foundation with extensive shade range.' },
            { name: 'Radiant Creamy Concealer', brand: 'NARS', cat: 'Concealer', price: 31.00, stock: 150, desc: 'Multi-action concealer with luminous finish.' },
            { name: 'Naked3 Eyeshadow Palette', brand: 'Urban Decay', cat: 'Eyeshadow', price: 54.00, stock: 70, desc: 'Twelve rose-hued neutral eyeshadows.' },
            { name: 'Easy Bake Loose Baking & Setting Powder', brand: 'Huda Beauty', cat: 'Setting Powder', price: 38.00, stock: 95, desc: 'Loose setting powder for an airbrushed finish.' },
            { name: 'Matte Revolution Lipstick — Pillow Talk', brand: 'Charlotte Tilbury', cat: 'Lipstick', price: 35.00, stock: 130, desc: 'Iconic nude-pink matte lipstick.' },
            { name: 'Retro Matte Lipstick — Ruby Woo', brand: 'MAC', cat: 'Lipstick', price: 23.00, stock: 140, desc: 'Classic vivid blue-red matte lipstick.' },
            { name: 'Hoola Matte Bronzer', brand: 'Benefit', cat: 'Bronzer', price: 35.00, stock: 120, desc: 'Award-winning matte bronzer for natural-looking tan.' },
            { name: 'Dramatically Different Moisturizing Lotion+', brand: 'Clinique', cat: 'Moisturizer', price: 32.00, stock: 150, desc: 'Dermatologist-developed everyday moisturizer.' },
            { name: 'Advanced Génifique Serum', brand: 'Lancôme', cat: 'Serum', price: 78.00, stock: 90, desc: 'Youth-activating serum for radiance and smoothness.' },
            { name: 'Resurrection Aromatique Hand Balm', brand: 'Aesop', cat: 'Hand Cream', price: 33.00, stock: 100, desc: 'A rich hand balm with aromatic botanicals.' },
            { name: 'Micellar Cleansing Water (Pink)', brand: 'Garnier', cat: 'Makeup Remover', price: 9.99, stock: 210, desc: 'All-in-1 micellar cleansing water for sensitive skin.' },
            { name: 'Deep Moisture Body Wash', brand: 'Dove', cat: 'Body Wash', price: 7.49, stock: 260, desc: 'Body wash with moisture renew blend.' },
            { name: 'Soft Matte Lip Cream', brand: 'NYX', cat: 'Lip Gloss', price: 6.50, stock: 180, desc: 'Velvety, lightweight lip color with soft-matte finish.' },
            { name: 'Green Tea Seed Serum', brand: 'Innisfree', cat: 'Serum', price: 27.00, stock: 130, desc: 'Hydrating serum with green tea seed and hyaluronic acid.' },
            { name: 'Lip Sleeping Mask', brand: 'Laneige', cat: 'Lip Balm', price: 24.00, stock: 160, desc: 'Overnight lip mask for smoother, supple lips.' },
            { name: 'Sekkisei Emulsion', brand: 'Kose', cat: 'Moisturizer', price: 42.00, stock: 80, desc: 'Brightening emulsion inspired by Japanese herbs.' },
            { name: 'Water Sleeping Mask', brand: 'Laneige', cat: 'Face Mask', price: 29.00, stock: 140, desc: 'Overnight mask for intensive hydration.' },
            { name: 'First Care Activating Serum', brand: 'Sulwhasoo', cat: 'Serum', price: 89.00, stock: 75, desc: 'Herbal activating serum to boost routine efficacy.' },
            { name: 'SoonJung pH 6.5 Whip Cleanser', brand: 'Etude House', cat: 'Cleanser', price: 12.00, stock: 160, desc: 'Gentle low‑irritant foaming cleanser for sensitive skin.' },
        ];

        const now = new Date();
        const rows = list.map(p => {
            const Brand_ID = brandIdByName.get(normalize(p.brand));
            const Category_ID = catIdByName.get(normalize(p.cat));
            if (!Brand_ID || !Category_ID) {
                throw new Error(`Missing FK for product "${p.name}" (brand="${p.brand}", category="${p.cat}")`);
            }
            return {
                Name_Product: p.name,
                Price: p.price,
                Stock: p.stock,
                Description: p.desc,
                Category_ID,
                Brand_ID,
                createdAt: now,
                updatedAt: now
            };
        });

        return queryInterface.bulkInsert('Products', rows, {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Products', {
            Name_Product: [
                'Anthelios Melt-in Milk Sunscreen SPF 60', 'Hydrating Facial Cleanser', 'Niacinamide 10% + Zinc 1%', 'Hydro Boost Water Gel',
                'Regenerist Micro-Sculpting Cream', 'Ultra Facial Cream', 'Facial Treatment Essence', 'The Water Cream',
                'Ultimune Power Infusing Concentrate', "Voluminous Lash Paradise Mascara", 'Fit Me Matte + Poreless Foundation',
                'Pro Filt’r Soft Matte Longwear Foundation', 'Radiant Creamy Concealer', 'Naked3 Eyeshadow Palette',
                'Easy Bake Loose Baking & Setting Powder', 'Matte Revolution Lipstick — Pillow Talk', 'Retro Matte Lipstick — Ruby Woo',
                'Hoola Matte Bronzer', 'Dramatically Different Moisturizing Lotion+', 'Advanced Génifique Serum',
                'Resurrection Aromatique Hand Balm', 'Micellar Cleansing Water (Pink)', 'Deep Moisture Body Wash',
                'Soft Matte Lip Cream', 'Green Tea Seed Serum', 'Lip Sleeping Mask', 'Sekkisei Emulsion', 'Water Sleeping Mask',
                'First Care Activating Serum', 'SoonJung pH 6.5 Whip Cleanser'
            ]
        }, {});
    }
};