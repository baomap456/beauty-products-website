module.exports = {
    up: async (queryInterface, Sequelize) => {
        const rows = [
            { Name_Category: 'Cleanser', Description: 'Facial cleansers to remove dirt and makeup.' },
            { Name_Category: 'Toner', Description: 'Liquid toners to rebalance skin after cleansing.' },
            { Name_Category: 'Serum', Description: 'Concentrated actives for targeted concerns.' },
            { Name_Category: 'Moisturizer', Description: 'Face creams and gels to hydrate skin.' },
            { Name_Category: 'Sunscreen', Description: 'UV protection for daily use.' },
            { Name_Category: 'Eye Cream', Description: 'Eye-area treatments.' },
            { Name_Category: 'Face Mask', Description: 'Wash-off and overnight masks.' },
            { Name_Category: 'Exfoliator', Description: 'Chemical or physical exfoliants.' },
            { Name_Category: 'Lip Balm', Description: 'Lip care and sleeping masks.' },
            { Name_Category: 'Makeup Remover', Description: 'Cleansing oils and micellar waters.' },
            { Name_Category: 'Shampoo', Description: 'Hair cleansing products.' },
            { Name_Category: 'Conditioner', Description: 'Hair conditioning products.' },
            { Name_Category: 'Hair Mask', Description: 'Intensive hair treatments.' },
            { Name_Category: 'Body Wash', Description: 'Shower gels and washes.' },
            { Name_Category: 'Body Lotion', Description: 'Body moisturizers.' },
            { Name_Category: 'Hand Cream', Description: 'Hand moisturizers and treatments.' },
            { Name_Category: 'Deodorant', Description: 'Underarm deodorants and antiperspirants.' },
            { Name_Category: 'Fragrance', Description: 'Perfumes and colognes.' },
            { Name_Category: 'Foundation', Description: 'Base makeup for complexion.' },
            { Name_Category: 'Concealer', Description: 'Spot and under-eye concealers.' },
            { Name_Category: 'Setting Powder', Description: 'Loose/pressed powders to set makeup.' },
            { Name_Category: 'Blush', Description: 'Cheek color products.' },
            { Name_Category: 'Highlighter', Description: 'Glow-enhancing powders/creams.' },
            { Name_Category: 'Bronzer', Description: 'Warmth/contour powders.' },
            { Name_Category: 'Mascara', Description: 'Lash volumizing/lengthening.' },
            { Name_Category: 'Eyeliner', Description: 'Pencil, liquid, and gel eyeliners.' },
            { Name_Category: 'Eyeshadow', Description: 'Single and palette shadows.' },
            { Name_Category: 'Lipstick', Description: 'Bullet and liquid lipsticks.' },
            { Name_Category: 'Lip Gloss', Description: 'Glossy lip finishes.' },
            { Name_Category: 'Nail Polish', Description: 'Nail enamels and care.' },
        ];
        return queryInterface.bulkInsert('Categories', rows, {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete(
            'Categories',
            {
                Name_Category: [
                    'Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen', 'Eye Cream', 'Face Mask', 'Exfoliator', 'Lip Balm', 'Makeup Remover',
                    'Shampoo', 'Conditioner', 'Hair Mask', 'Body Wash', 'Body Lotion', 'Hand Cream', 'Deodorant', 'Fragrance', 'Foundation', 'Concealer',
                    'Setting Powder', 'Blush', 'Highlighter', 'Bronzer', 'Mascara', 'Eyeliner', 'Eyeshadow', 'Lipstick', 'Lip Gloss', 'Nail Polish'
                ]
            },
            {}
        );
    }
};