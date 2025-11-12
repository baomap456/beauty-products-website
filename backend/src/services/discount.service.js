const db = require('../models');
const discount = db.Discount;

async function createDiscount(data) {
    return discount.create(data);
}

async function getAllDiscounts() {
    return discount.findAll();
}

async function getDiscountById(id) {
    return discount.findByPk(id);
}

async function getDiscountByCode(code) {
    return discount.findOne({ where: { Code: code } });
}

async function updateDiscount(id, data) {
    const [updated] = await discount.update(data, { where: { ID_Discount: id } });
    if (updated) return discount.findByPk(id);
    throw new Error('Discount not found');
}

async function deleteDiscount(id) {
    const deleted = await discount.destroy({ where: { ID_Discount: id } });
    if (deleted) return true;
    throw new Error('Discount not found');
}

async function checkDiscountValidity(code) {
    const found = await getDiscountByCode(code);
    if (!found) throw new Error('Discount not found');
    const now = new Date();
    if (found.StartDate && new Date(found.StartDate) > now) throw new Error('Discount not yet valid');
    if (found.EndDate && new Date(found.EndDate) < now) throw new Error('Discount expired');
    if (typeof found.Value !== 'number' || found.Value <= 0) throw new Error('Invalid discount value');
    return found;
}

async function applyDiscountToOrder(code, orderTotal) {
    // validate and get discount record
    const found = await checkDiscountValidity(code);
    let discountedTotal = orderTotal;
    if (found.Type === 'Percent') {
        discountedTotal = orderTotal - (orderTotal * (found.Value / 100));
    } else if (found.Type === 'Fixed') {
        discountedTotal = orderTotal - found.Value;
    }
    // return numeric value (do not return string), ensure non-negative
    const result = Math.max(discountedTotal, 0);
    // if it's an integer, return integer; otherwise round to one decimal to be stable
    return Number.isInteger(result) ? result : Number(parseFloat(result).toFixed(1));
}

async function getActiveDiscounts() {
    const now = new Date();
    return discount.findAll({
        where: {
            [db.Sequelize.Op.and]: [
                { StartDate: { [db.Sequelize.Op.lte]: now } },
                { EndDate: { [db.Sequelize.Op.gte]: now } }
            ]
        }
    });
}

async function getExpiredDiscounts() {
    const now = new Date();
    return discount.findAll({
        where: { EndDate: { [db.Sequelize.Op.lt]: now } }
    });
}

module.exports = {
    createDiscount,
    getAllDiscounts,
    getDiscountById,
    getDiscountByCode,
    updateDiscount,
    deleteDiscount,
    checkDiscountValidity,
    applyDiscountToOrder,
    getActiveDiscounts,
    getExpiredDiscounts
};
