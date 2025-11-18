module.exports = {
    up: async (queryInterface, Sequelize) => {
        const rows = [
            { Name_Brand: "L'Oréal Paris", Description: 'Global beauty brand from LOréal Group.' },
            { Name_Brand: 'Maybelline', Description: 'Mass-market makeup brand, part of LOréal Group.' },
            { Name_Brand: 'MAC', Description: 'Professional makeup brand by Estée Lauder Companies.' },
            { Name_Brand: 'Estée Lauder', Description: 'Prestige skincare and makeup house.' },
            { Name_Brand: 'Clinique', Description: 'Dermatologist-developed skincare and makeup.' },
            { Name_Brand: 'Lancôme', Description: 'Luxury beauty brand by LOréal.' },
            { Name_Brand: 'NARS', Description: 'Makeup artistry brand by Shiseido group.' },
            { Name_Brand: 'Benefit', Description: 'Brand famous for brow products.' },
            { Name_Brand: 'Urban Decay', Description: 'Known for Naked palettes.' },
            { Name_Brand: 'NYX', Description: 'Affordable pro-inspired makeup under LOréal.' },
            { Name_Brand: 'The Ordinary', Description: 'Clinical formulations by DECIEM.' },
            { Name_Brand: 'CeraVe', Description: 'Derm skincare developed with dermatologists.' },
            { Name_Brand: 'La Roche-Posay', Description: 'French pharmacy brand recommended by dermatologists.' },
            { Name_Brand: 'Neutrogena', Description: 'Skincare brand by Kenvue (J&J).' },
            { Name_Brand: 'Olay', Description: 'Mass skincare brand by Procter & Gamble.' },
            { Name_Brand: 'Dove', Description: 'Personal care brand by Unilever.' },
            { Name_Brand: 'Garnier', Description: 'LOréal mass-market hair and skincare.' },
            { Name_Brand: 'Huda Beauty', Description: 'Makeup brand founded by Huda Kattan.' },
            { Name_Brand: 'Fenty Beauty', Description: 'Rihannas inclusive makeup brand (Kendo/LVMH).' },
            { Name_Brand: 'Charlotte Tilbury', Description: 'British makeup and skincare brand.' },
            { Name_Brand: 'Tatcha', Description: 'Japanese-inspired luxury skincare (Unilever).' },
            { Name_Brand: 'Kiehls', Description: 'Apothecary skincare brand under LOréal.' },
            { Name_Brand: 'Aesop', Description: 'Premium skin, body and fragrance brand.' },
            { Name_Brand: 'Kose', Description: 'Japanese cosmetics company.' },
            { Name_Brand: 'Shiseido', Description: 'One of the worlds oldest cosmetics companies.' },
            { Name_Brand: 'SK-II', Description: 'Prestige skincare brand by P&G.' },
            { Name_Brand: 'Innisfree', Description: 'K-beauty brand by Amorepacific.' },
            { Name_Brand: 'Etude House', Description: 'K-beauty makeup/skincare by Amorepacific.' },
            { Name_Brand: 'Sulwhasoo', Description: 'Heritage luxury skincare by Amorepacific.' },
            { Name_Brand: 'Laneige', Description: 'Hydration-focused brand by Amorepacific.' },
        ];
        return queryInterface.bulkInsert('Brands', rows, {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Brands', {
            Name_Brand: [
                "L'Oréal Paris", "Maybelline", "MAC", "Estée Lauder", "Clinique", "Lancôme", "NARS", "Benefit", "Urban Decay", "NYX",
                "The Ordinary", "CeraVe", "La Roche-Posay", "Neutrogena", "Olay", "Dove", "Garnier", "Huda Beauty", "Fenty Beauty", "Charlotte Tilbury",
                "Tatcha", "Kiehl’s", "Aesop", "Kose", "Shiseido", "SK-II", "Innisfree", "Etude House", "Sulwhasoo", "Laneige"
            ]
        }, {});
    }
};